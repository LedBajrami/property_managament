<?php

namespace App\Services\Application;

use App\Http\Requests\Application\ApproveApplicationRequest;
use App\Http\Requests\Application\RejectApplicationRequest;
use App\Http\Resources\Application\RentalApplicationResource;
use App\Http\Resources\Lease\LeaseResource;
use App\Jobs\Notifications\SendApplicationApprovedNotification;
use App\Jobs\Notifications\SendApplicationRejectedNotification;
use App\Models\CompanyUser;
use App\Models\Lease;
use App\Models\RentalApplication;
use App\Traits\ApiTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ApplicationService implements ApplicationServiceInterface
{
    use ApiTrait;

    public function getApplications(Request $request): JsonResponse
    {
        try {
            $company = app('current_company');

            $query = RentalApplication::with([
                'user',
                'reviewer',
                'unit.property',
            ])
                ->where('company_id', $company->id)
                ->latest();

            if ($request->filled('status')) {
                $query->where('status', $request->input('status'));
            }

            return $this->success(RentalApplicationResource::collection($query->get()));
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    public function getApplication(RentalApplication $application): JsonResponse
    {
        try {
            $this->ensureApplicationInCompany($application);

            return $this->success(new RentalApplicationResource(
                $application->load(['user', 'reviewer', 'unit.property'])
            ));
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    public function approve(RentalApplication $application, ApproveApplicationRequest $request): JsonResponse
    {
        DB::beginTransaction();

        try {
            $this->ensureApplicationInCompany($application);

            if ($application->status !== 'pending') {
                DB::rollBack();
                return $this->error('Only pending applications can be approved', 422);
            }

            $application->loadMissing(['user', 'unit.property']);
            $data = $request->validated();

            $leaseExists = Lease::where('unit_id', $application->unit_id)
                ->whereIn('status', ['draft', 'active'])
                ->exists();

            if ($leaseExists) {
                DB::rollBack();
                return $this->error('This unit already has a draft or active lease', 422);
            }

            CompanyUser::updateOrCreate(
                [
                    'user_id' => $application->user_id,
                    'company_id' => $application->company_id,
                ],
                [
                    'role_name' => 'resident',
                    'status' => 'active',
                    'accepted_at' => now(),
                ]
            );

            if ($application->user->hasRole('applicant')) {
                $application->user->syncRoles(['resident']);
            } elseif (! $application->user->hasRole('resident')) {
                $application->user->assignRole('resident');
            }

            $lease = Lease::create([
                'company_id' => $application->company_id,
                'resident_id' => $application->user_id,
                'unit_id' => $application->unit_id,
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'],
                'monthly_rent' => $data['monthly_rent'] ?? $application->unit->monthly_rent,
                'deposit_amount' => $data['deposit_amount'],
                'signed_date' => $data['signed_date'] ?? null,
                'move_in_date' => $data['move_in_date'] ?? null,
                'rent_due_day' => $data['rent_due_day'] ?? 1,
                'late_fee_amount' => $data['late_fee_amount'] ?? 0,
                'late_fee_grace_days' => $data['late_fee_grace_days'] ?? 5,
                'lease_type' => $data['lease_type'] ?? 'fixed',
                'auto_renew' => $data['auto_renew'] ?? false,
                'utilities_included' => $data['utilities_included'] ?? [],
                'parking_included' => $data['parking_included'] ?? false,
                'pets_allowed' => $data['pets_allowed'] ?? false,
                'special_terms' => $data['special_terms'] ?? null,
                'status' => 'draft',
            ]);

            $application->update([
                'status' => 'approved',
                'reviewed_at' => now(),
                'reviewed_by' => Auth::id(),
                'rejection_reason' => null,
            ]);

            dispatch(new SendApplicationApprovedNotification($application, $lease))->afterCommit();

            DB::commit();

            return $this->success([
                'application' => new RentalApplicationResource($application->fresh()->load(['user', 'reviewer', 'unit.property'])),
                'lease' => new LeaseResource($lease->load(['resident', 'unit.property'])),
            ], 'Application approved and draft lease created');
        } catch (\Throwable $th) {
            DB::rollBack();
            return $this->error($th->getMessage());
        }
    }

    public function reject(RentalApplication $application, RejectApplicationRequest $request): JsonResponse
    {
        DB::beginTransaction();

        try {
            $this->ensureApplicationInCompany($application);

            if ($application->status !== 'pending') {
                DB::rollBack();
                return $this->error('Only pending applications can be rejected', 422);
            }

            $application->update([
                'status' => 'rejected',
                'rejection_reason' => $request->validated()['rejection_reason'],
                'reviewed_at' => now(),
                'reviewed_by' => Auth::id(),
            ]);

            dispatch(new SendApplicationRejectedNotification($application))->afterCommit();

            DB::commit();

            return $this->success(
                new RentalApplicationResource($application->fresh()->load(['user', 'reviewer', 'unit.property'])),
                'Application rejected'
            );
        } catch (\Throwable $th) {
            DB::rollBack();
            return $this->error($th->getMessage());
        }
    }

    private function ensureApplicationInCompany(RentalApplication $application): void
    {
        $company = app('current_company');

        if ($application->company_id !== $company->id) {
            abort(403, 'Application does not belong to this company');
        }
    }
}
