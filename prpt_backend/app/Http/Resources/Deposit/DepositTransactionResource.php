<?php

namespace App\Http\Resources\Deposit;

use Illuminate\Http\Resources\Json\JsonResource;

class DepositTransactionResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'               => $this->id,
            'lease_id'         => $this->lease_id,
            'type'             => $this->type,
            'amount'           => $this->amount,
            'transaction_date' => $this->transaction_date,
            'payment_method'   => $this->payment_method,
            'transaction_id'   => $this->transaction_id,
            'notes'            => $this->notes,
            'processed_by'     => [
                'id'         => $this->processedBy->id,
                'first_name' => $this->processedBy->first_name,
                'last_name'  => $this->processedBy->last_name,
            ],
            'created_at'       => $this->created_at,
        ];
    }
}
