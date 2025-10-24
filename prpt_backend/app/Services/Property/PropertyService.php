<?php

namespace App\Services\Property;

use App\Http\Resources\Property\PropertyResource;
use App\Models\Property;
use App\Traits\ApiTrait;
use Illuminate\Http\Request;

class PropertyService implements PropertyServiceInterface
{
    use ApiTrait;
    public function getProperties(Request $request)
    {
        try {
            $companyId = $request->header('X-Company-ID');

            $results = Property::where('company_id', $companyId)->get();

            $properties = $results->isEmpty()
                ? []
                : PropertyResource::collection($results);

            return $this->success(PropertyResource::collection($properties));
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    public function getProperty($property)
    {
        try {
            return $this->success(new PropertyResource($property));
        } catch (\Throwable $th) {
            return $this->error($th);
        }
    }

    public function createProperty($request)
    {
        try {
            $data = $request->validated();
            $company_id = $request->header('X-Company-ID');

            $property = Property::create(array_merge($data, ['company_id' => $company_id]));

            return $this->success(
                new PropertyResource($property),
                'Property created successfully'
            );
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    public function editProperty($property, $request)
    {
        try {
            $data = $request->validated();
            $property->update($data);

            return $this->success(new PropertyResource($property), 'Property updated successfully');
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    public function deleteProperty($property)
    {
        try {
            $property->update([
                'email' => $property->email . '_deleted_' . now()->timestamp
            ]);
            $property->delete();

            return $this->success($property->id, 'Property deleted successfully');
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }
}
