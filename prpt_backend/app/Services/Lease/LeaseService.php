<?php

namespace App\Services\Lease;

use App\Http\Resources\Lease\LeaseResource;
use App\Models\Lease;
use App\Traits\ApiTrait;
use Illuminate\Http\Request;

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
        try {
            $data = $request->validated();

            $lease = Lease::create($data);

            return $this->success(
                new LeaseResource($lease),
                'Lease created successfully'
            );
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    public function editLease($lease, $request)
    {
        try {
            $data = $request->validated();
            $lease->update($data);

            return $this->success(new LeaseResource($lease), 'Lease updated successfully');
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    public function deleteLease($lease)
    {
        try {
            $lease->update([
                'email' => $lease->email . '_deleted_' . now()->timestamp
            ]);
            $lease->delete();

            return $this->success($lease->id, 'Lease deleted successfully');
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }
}
