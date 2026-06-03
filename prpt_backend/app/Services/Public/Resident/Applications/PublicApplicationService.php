<?php

namespace App\Services\Public\Resident\Applications;

use App\Http\Requests\Public\StoreApplicationRequest;
use App\Jobs\Notifications\SendApplicationSubmittedNotification;
use App\Models\RentalApplication;
use App\Models\Unit;
use App\Traits\ApiTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class PublicApplicationService implements PublicApplicationServiceInterface
{
    use ApiTrait;

    public function store(StoreApplicationRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $user = Auth::user();

            $unit = Unit::with('property:id,company_id')->find($validated['unit_id']);

            if (!$unit) {
                return $this->error('Unit not found', 404);
            }

            if ($unit->status !== 'available') {
                return $this->error('This unit is not available for applications.', 422);
            }

            // Prevent duplicate pending applications for the same unit
            $alreadyApplied = RentalApplication::where('user_id', $user->id)
                ->where('unit_id', $validated['unit_id'])
                ->where('status', 'pending')
                ->exists();

            if ($alreadyApplied) {
                return $this->error('You already have a pending application for this unit.', 422);
            }

            $application = RentalApplication::create([
                'user_id'           => $user->id,
                'unit_id'           => $validated['unit_id'],
                'company_id'        => $unit->property->company_id,
                'annual_income'     => $validated['annual_income'],
                'employment_status' => $validated['employment_status'],
                'employer_name'     => $validated['employer_name'] ?? null,
                'current_address'   => $validated['current_address'],
                'references'        => $validated['references'] ?? [],
                'status'            => 'pending',
            ]);

            dispatch(new SendApplicationSubmittedNotification($application));

            return $this->success($application, 'Application submitted successfully!', 201);

        } catch (\Exception $e) {
            return $this->error($e);
        }
    }

    public function mine(): JsonResponse
    {
        try {
            $user = Auth::user();

            $applications = RentalApplication::with([
                'unit:id,property_id,unit_number,bedrooms,bathrooms,monthly_rent',
                'unit.property:id,name,address',
            ])
                ->where('user_id', $user->id)
                ->orderByDesc('created_at')
                ->get();

            return $this->success($applications);

        } catch (\Exception $e) {
            return $this->error($e);
        }
    }
}
