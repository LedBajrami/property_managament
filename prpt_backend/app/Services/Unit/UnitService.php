<?php

namespace App\Services\Unit;

use App\Http\Resources\Unit\UnitResource;
use App\Models\Unit;
use App\Traits\ApiTrait;
use Illuminate\Http\Request;

class UnitService implements UnitServiceInterface
{
    use ApiTrait;
    public function getUnits(Request $request)
    {
        try {
            $propertyId = $request->input('property_id');
            $results = Unit::where('property_id', $propertyId)->get();

            $units = $results->isEmpty()
                ? []
                : UnitResource::collection($results);

            return $this->success(UnitResource::collection($units));
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    public function getUnit($unit)
    {
        try {
            $unit->load('leases');
            return $this->success(new UnitResource($unit));
        } catch (\Throwable $th) {
            return $this->error($th);
        }
    }

    public function createUnit($request)
    {
        try {
            $data = $request->validated();

            $unit = Unit::create($data);

            return $this->success(
                new UnitResource($unit),
                'Unit created successfully'
            );
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    public function editUnit($unit, $request)
    {
        try {
            $data = $request->validated();
            $unit->update($data);

            return $this->success(new UnitResource($unit), 'Unit updated successfully');
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    public function deleteUnit($unit)
    {
        try {
            $unit->update([
                'email' => $unit->email . '_deleted_' . now()->timestamp
            ]);
            $unit->delete();

            return $this->success($unit->id, 'Unit deleted successfully');
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }
}
