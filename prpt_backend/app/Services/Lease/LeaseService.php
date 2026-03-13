<?php

namespace App\Services\Lease;

use App\Http\Resources\Lease\LeaseResource;
use App\Models\Lease;
use App\Models\PaymentSchedule;
use App\Notifications\Lease\SendLeaseActivatedNotification;
use App\Traits\ApiTrait;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LeaseService implements LeaseServiceInterface
{
    use ApiTrait;
    public function getLeases(Request $request)
    {
        try {
            $unitId = $request->input('unit_id');
            $results = Lease::with('resident')->where('unit_id', $unitId)->get();

            $leases = $results->isEmpty()
                ? []
                : LeaseResource::collection($results);

            return $this->success(LeaseResource::collection($leases));
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    public function getLease($lease)
    {
        try {
            return $this->success(new LeaseResource($lease));
        } catch (\Throwable $th) {
            return $this->error($th);
        }
    }

    public function createLease($request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();

            // Check if unit already has active lease
            $leaseExists = Lease::where('unit_id', $data['unit_id'])
                ->where('status', 'active')
                ->exists();

            if ($leaseExists) {
                return $this->error("Unit already has an active lease");
            }

            $lease = Lease::create($data);

            DB::commit();

            return $this->success(
                new LeaseResource($lease->load('paymentSchedules')),
                'Lease created successfully'
            );
        } catch (\Throwable $th) {
            DB::rollBack();
            return $this->error($th->getMessage());
        }
    }

    public function editLease($lease, $request)
    {
        try {
            $data = $request->validated();

            if ($lease->status === 'terminated') {
                return $this->error("This lease has already been terminated");
            }

            // Only update fields that are actually present in the request
            $updateData = array_filter($data, function($value) {
                return $value !== null;
            });

            $lease->update($updateData);

            // Auto-activate if move_in_date is set and status is draft
            if (isset($updateData['move_in_date']) && $lease->status === 'draft') {
                $this->activateLease($lease);
            }

            return $this->success(
                new LeaseResource($lease->fresh()),
                'Lease updated successfully'
            );
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    public function terminateLease($lease)
    {
        try {
            DB::beginTransaction();

            $lease->paymentSchedules()->delete();

            $lease->update([
                'status' => "terminated",
                "terminated_at" => Carbon::now()
            ]);

            $lease->unit->update(['status' => "maintenance"]);

            DB::commit();


            return $this->success($lease->id, 'Lease terminated successfully');
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    public function deleteLease($lease)
    {
        try {
            $lease->delete();

            return $this->success($lease->id, 'Lease deleted successfully');
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }


    private function activateLease(Lease $lease)
    {
        // Update lease status
        $lease->update(['status' => 'active']);

        // Update unit status
        $lease->unit->update(['status' => 'occupied']);

        // Generate payment schedules
        $this->generatePaymentSchedules($lease);

        // Send notification
        $lease->resident->notify(new SendLeaseActivatedNotification($lease));
    }

    private function generatePaymentSchedules(Lease $lease)
    {
        $schedules = [];

        if ($lease->lease_type === 'fixed') {
            // Fixed-term lease: Generate all payments upfront
            $startDate = Carbon::parse($lease->start_date);
            $endDate = Carbon::parse($lease->end_date);

            $currentDate = $startDate->copy()->day($lease->rent_due_day);

            // If start date is after rent due day, start next month
            if ($startDate->day > $lease->rent_due_day) {
                $currentDate->addMonth();
            }

            while ($currentDate->lte($endDate)) {
                $schedules[] = [
                    'lease_id' => $lease->id,
                    'due_date' => $currentDate->format('Y-m-d'),
                    'amount' => $lease->monthly_rent,
                    'status' => 'pending',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                $currentDate->addMonth();
            }

        } elseif ($lease->lease_type === 'month-to-month') {
            // Month-to-month: Generate only next 3 months
            // More will be generated automatically each month
            $startDate = Carbon::parse($lease->start_date);

            for ($i = 0; $i < 3; $i++) {
                $dueDate = $startDate->copy()->addMonths($i)->day($lease->rent_due_day);

                $schedules[] = [
                    'lease_id' => $lease->id,
                    'due_date' => $dueDate->format('Y-m-d'),
                    'amount' => $lease->monthly_rent,
                    'status' => 'pending',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        // Bulk insert all payment schedules
        PaymentSchedule::insert($schedules);

        \Log::info("Generated " . count($schedules) . " payment schedules for lease #{$lease->id}");
    }

    public function renewLease($leaseId, $request)
    {
        DB::beginTransaction();
        try {
            $currentLease = Lease::findOrFail($leaseId);
            $data = $request->validated();

            // ✅ Only allow renewal of fixed-term leases
            if ($currentLease->lease_type !== 'fixed') {
                return $this->error("Only fixed-term leases can be renewed. Month-to-month leases continue automatically.");
            }

            // Create new lease based on current one
            $newLease = Lease::create([
                'company_id' => $currentLease->company_id,
                'resident_id' => $currentLease->resident_id,
                'unit_id' => $currentLease->unit_id,
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'],
                'monthly_rent' => $data['monthly_rent'] ?? $currentLease->monthly_rent,
                'deposit_amount' => $currentLease->deposit_amount,
                'rent_due_day' => $currentLease->rent_due_day,
                'late_fee_amount' => $currentLease->late_fee_amount,
                'late_fee_grace_days' => $currentLease->late_fee_grace_days,
                'lease_type' => 'fixed',
                'status' => 'draft',
                'parent_lease_id' => $currentLease->id,
            ]);

            // Payments generate when lease is activated (move-in)

            DB::commit();

            return $this->success(
                new LeaseResource($newLease),
                'Lease renewed successfully'
            );

        } catch (\Throwable $th) {
            DB::rollBack();
            return $this->error($th->getMessage());
        }
    }}
