<?php

namespace App\Services\Public\Resident\Properties;

use App\Http\Resources\Property\PropertyResource;
use App\Models\Property;
use App\Models\Unit;
use App\Traits\ApiTrait;
use Illuminate\Http\Request;

class PublicPropertiesService implements PublicPropertiesServiceInterface
{
    use ApiTrait;
    public function getPublicProperties(Request $request)
    {
        try {
            $query = Property::query()
                ->with([
                    'units:id,property_id,unit_number,bedrooms,bathrooms,size_sqm,monthly_rent,status',
                ]);

            // Filter: location
            if ($request->filled('location')) {
                $location = $request->input('location');
                $query->where(function ($q) use ($location) {
                    $q->where('address', 'ilike', "%{$location}%")
                        ->orWhere('name', 'ilike', "%{$location}%");
                });
            }

            // Filter: property_type
            if ($request->filled('property_type')) {
                $query->where('property_type', $request->input('property_type'));
            }

            // Filter: rent range (units)
            if ($request->filled('min_rent') || $request->filled('max_rent')) {
                $query->whereHas('units', function ($q) use ($request) {
                    if ($request->filled('min_rent')) {
                        $q->where('monthly_rent', '>=', $request->input('min_rent'));
                    }
                    if ($request->filled('max_rent')) {
                        $q->where('monthly_rent', '<=', $request->input('max_rent'));
                    }
                });
            }

            // Filter: bedrooms
            if ($request->filled('bedrooms')) {
                $query->whereHas('units', function ($q) use ($request) {
                    $q->where('bedrooms', $request->input('bedrooms'));
                });
            }

            $properties = $query
                ->select(
                    'id',
                    'company_id',
                    'name',
                    'address',
                    'description',
                    'property_type',
                    'year_built',
                    'parking_spaces',
                    'amenities',
                    'size',
                    'monthly_bill'
                )
                ->orderBy('name')
                ->get();

            return $this->success(
                PropertyResource::collection($properties)
            );

        } catch (\Exception $e) {
            return $this->error($e);
        }
    }
    public function getPublicProperty(int $id)
    {
        try {
            $property = Property::with([
                'units:id,property_id,unit_number,bedrooms,bathrooms,size_sqm,monthly_rent,status',
            ])
                ->select(
                    'id',
                    'company_id',
                    'name',
                    'address',
                    'description',
                    'property_type',
                    'year_built',
                    'parking_spaces',
                    'amenities',
                    'size',
                    'monthly_bill'
                )
                ->find($id);

            if (!$property) {
                return $this->error('Property not found', 404);
            }

            return $this->success(
                new PropertyResource($property)
            );

        } catch (\Exception $e) {
            return $this->error($e);
        }
    }
    public function getPublicPropertyUnit(int $propertyId, int $unitId)
    {
        try {
            $unit = Unit::with([
                'property' => fn($q) => $q->select('id', 'name', 'address', 'property_type', 'amenities', 'parking_spaces'),
            ])
                ->where('property_id', $propertyId)
                ->find($unitId);

            if (!$unit) {
                return $this->error('Unit not found', 404);
            }

            return $this->success($unit);
        } catch (\Exception $e) {
            return $this->error($e);
        }
    }
}
