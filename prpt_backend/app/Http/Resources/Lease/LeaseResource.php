<?php

namespace App\Http\Resources\Lease;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class LeaseResource extends JsonResource
{
    public function toArray($request): array
    {
        $status = 'active';
        if ($this->terminated_at) {
            $status = 'terminated';
        } elseif ($this->end_date && Carbon::now()->gt(Carbon::parse($this->end_date))) {
            $status = 'expired';
        } elseif (!$this->signed_date) {
            $status = 'pending';
        }

        return [
            'id' => $this->id,
            'resident' => $this->resident,
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
            'status' => $status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
