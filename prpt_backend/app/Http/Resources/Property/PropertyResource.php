<?php

namespace App\Http\Resources\Property;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'company_id' => $this->company_id,
            'name' => $this->name,
            'address' => $this->address,
            'size' => $this->size,
            'monthly_bill' => $this->monthly_bill,
            'description' => $this->description,
            'property_type' => $this->property_type,
            'year_built' => $this->year_built,
            'parking_spaces' => $this->parking_spaces,
            'amenities' => $this->amenities,
            'total_units' => $this->units()->count() ?? 0,
            'occupied_units' => $this->units()->where('status', 'occupied')->count() ?? 0,
            'available_units' => $this->units()->where('status', 'available')->count() ?? 0,
            'maintenance_units' => $this->units()->where('status', 'maintenance')->count() ?? 0,
            'occupancy_rate' => $this->units()->count() > 0
                ? round(($this->units()->where('status', 'occupied')->count() / $this->units()->count()) * 100, 1)
                : 0,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
