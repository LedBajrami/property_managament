<?php

namespace App\Http\Resources\Payment;

use Illuminate\Http\Resources\Json\JsonResource;

class PaymentScheduleResource extends JsonResource
{
    public function toArray($request): array
    {
        $lease = $this->whenLoaded('lease');
        $unit = $lease?->unit;
        $property = $unit?->property;
        $latestTransaction = $this->relationLoaded('transactions')
            ? $this->transactions->sortByDesc('id')->first()
            : null;

        return [
            'id' => $this->id,
            'lease_id' => $this->lease_id,
            'due_date' => $this->due_date?->format('Y-m-d'),
            'amount' => $this->amount,
            'status' => $this->status,
            'late_fee' => $this->late_fee,
            'total_due' => (float) $this->amount + (float) ($this->late_fee ?? 0),
            'resident' => $lease?->resident ? [
                'id' => $lease->resident->id,
                'first_name' => $lease->resident->first_name,
                'last_name' => $lease->resident->last_name,
                'email' => $lease->resident->email,
            ] : null,
            'unit' => $unit ? [
                'id' => $unit->id,
                'unit_number' => $unit->unit_number,
                'property' => $property ? [
                    'id' => $property->id,
                    'name' => $property->name,
                    'address' => $property->address,
                ] : null,
            ] : null,
            'latest_transaction' => $latestTransaction ? [
                'id' => $latestTransaction->id,
                'amount_paid' => $latestTransaction->amount_paid,
                'payment_date' => $latestTransaction->payment_date,
                'payment_method' => $latestTransaction->payment_method,
                'receipt_document_id' => $latestTransaction->receipt_document_id,
                'receipt' => $latestTransaction->receipt ? [
                    'id' => $latestTransaction->receipt->id,
                    'original_name' => $latestTransaction->receipt->original_name,
                ] : null,
            ] : null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
