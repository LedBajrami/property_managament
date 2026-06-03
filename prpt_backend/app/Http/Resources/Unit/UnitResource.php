<?php
namespace App\Http\Resources\Unit;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UnitResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $photos = $this->relationLoaded('documents')
            ? $this->documents->where('document_type', 'unit_photo')->values()
            : collect();
        $thumbnail = $photos->first();

        return [
            'id' => $this->id,
            'property_id' => $this->property_id,
            'unit_number' => $this->unit_number,
            'bedrooms' => $this->bedrooms,
            'bathrooms' => $this->bathrooms,
            'size_sqm' => $this->size_sqm,
            'monthly_rent' => $this->monthly_rent,
            'status' => $this->status,
            'thumbnail_url' => $thumbnail ? url('/api/public/documents/' . $thumbnail->id . '/view') : null,
            'gallery' => $photos->map(fn ($photo) => [
                'id' => $photo->id,
                'url' => url('/api/public/documents/' . $photo->id . '/view'),
                'original_name' => $photo->original_name,
            ]),
            'property' => $this->whenLoaded('property', function() {
                return [
                    'id' => $this->property->id,
                    'name' => $this->property->name,
                    'address' => $this->property->address,
                    'property_type' => $this->property->property_type,
                    'amenities' => $this->property->amenities,
                    'parking_spaces' => $this->property->parking_spaces,
                ];
            }),
            'current_lease' => $this->whenLoaded('leases', function() {
                $lease = $this->leases()
                    ->where('status', 'active')
                    ->with('resident')
                    ->first();

                return $lease ? [
                    'id' => $lease->id,
                    'start_date' => $lease->start_date,
                    'end_date' => $lease->end_date,
                    'monthly_rent' => $lease->monthly_rent,
                    'resident' => $lease->resident,
                ] : null;
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
