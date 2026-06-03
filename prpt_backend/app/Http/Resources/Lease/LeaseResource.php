<?php

namespace App\Http\Resources\Lease;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class LeaseResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'resident' => $this->resident,
            'unit' => $this->whenLoaded('unit', fn () => [
                'id' => $this->unit->id,
                'unit_number' => $this->unit->unit_number,
                'property' => $this->unit->relationLoaded('property') && $this->unit->property ? [
                    'id' => $this->unit->property->id,
                    'name' => $this->unit->property->name,
                    'address' => $this->unit->property->address,
                ] : null,
            ]),
            'unit_id' => $this->unit_id,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'monthly_rent' => $this->monthly_rent,
            'deposit_amount' => $this->deposit_amount,
            'signed_date' => $this->signed_date,
            'move_in_date' => $this->move_in_date,
            'rent_due_day' => $this->rent_due_day,
            'late_fee_amount' => $this->late_fee_amount,
            'late_fee_grace_days' => $this->late_fee_grace_days,
            'lease_type' => $this->lease_type,
            'auto_renew' => $this->auto_renew,
            'utilities_included' => $this->utilities_included,
            'parking_included' => $this->parking_included,
            'pets_allowed' => $this->pets_allowed,
            'special_terms' => $this->special_terms,
            'status' => $this->status,
            'terminated_at' => $this->terminated_at,
            'documents' => $this->whenLoaded('documents', fn () => $this->documents->map(fn ($document) => [
                'id' => $document->id,
                'document_type' => $document->document_type,
                'original_name' => $document->original_name,
                'mime_type' => $document->mime_type,
            ])),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
