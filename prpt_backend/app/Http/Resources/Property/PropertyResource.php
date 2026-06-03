<?php

namespace App\Http\Resources\Property;

use App\Http\Resources\Unit\UnitResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $photos = $this->relationLoaded('documents')
            ? $this->documents->where('document_type', 'property_photo')->values()
            : collect();
        $thumbnail = $photos->first();

        return [
            'id' => $this->id,
            'company_id' => $this->company_id,
            'name' => $this->name,
            'address' => $this->address,
            'description' => $this->description,
            'property_type' => $this->property_type,
            'year_built' => $this->year_built,
            'parking_spaces' => $this->parking_spaces,
            'amenities' => $this->amenities,
            'size' => $this->size,
            'monthly_bill' => $this->monthly_bill,
            'thumbnail_url' => $thumbnail ? url('/api/public/documents/' . $thumbnail->id . '/view') : null,

            // Units stats (computed from eager-loaded relation)
            'units' => UnitResource::collection($this->whenLoaded('units')),            'total_units' => $this->units->count(),
            'available_units' => $this->units->where('status', 'available')->count(),
            'occupied_units' => $this->units->where('status', 'occupied')->count(),
            'maintenance_units' => $this->units->where('status', 'maintenance')->count(),

            // Rent stats
            'min_rent' => $this->units->min('monthly_rent'),
            'max_rent' => $this->units->max('monthly_rent'),

            // Occupancy
            'occupancy_rate' => $this->units->count() > 0
                ? round(
                    ($this->units->where('status', 'occupied')->count() / $this->units->count()) * 100,
                    1
                )
                : 0,

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
