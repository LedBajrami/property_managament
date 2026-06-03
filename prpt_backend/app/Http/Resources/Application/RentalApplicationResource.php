<?php

namespace App\Http\Resources\Application;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RentalApplicationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'unit_id' => $this->unit_id,
            'company_id' => $this->company_id,
            'annual_income' => $this->annual_income,
            'employment_status' => $this->employment_status,
            'employer_name' => $this->employer_name,
            'current_address' => $this->current_address,
            'references' => $this->references,
            'status' => $this->status,
            'rejection_reason' => $this->rejection_reason,
            'reviewed_at' => $this->reviewed_at,
            'reviewed_by' => $this->reviewed_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'applicant' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'first_name' => $this->user->first_name,
                'last_name' => $this->user->last_name,
                'email' => $this->user->email,
                'phone' => $this->user->phone,
            ]),
            'reviewer' => $this->whenLoaded('reviewer', fn () => [
                'id' => $this->reviewer->id,
                'first_name' => $this->reviewer->first_name,
                'last_name' => $this->reviewer->last_name,
            ]),
            'unit' => $this->whenLoaded('unit', fn () => [
                'id' => $this->unit->id,
                'unit_number' => $this->unit->unit_number,
                'bedrooms' => $this->unit->bedrooms,
                'bathrooms' => $this->unit->bathrooms,
                'monthly_rent' => $this->unit->monthly_rent,
                'status' => $this->unit->status,
                'property' => $this->unit->relationLoaded('property') && $this->unit->property ? [
                    'id' => $this->unit->property->id,
                    'name' => $this->unit->property->name,
                    'address' => $this->unit->property->address,
                ] : null,
            ]),
            'lease' => $this->whenLoaded('lease', fn () => $this->lease),
        ];
    }
}
