<?php

namespace App\Http\Requests\Payment;

use Illuminate\Foundation\Http\FormRequest;

class RecordPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('record-payments');
    }

    public function rules()
    {
        return [
            'amount_paid' => 'required|numeric|min:0',
            'payment_date' => 'nullable|date',
            'payment_method' => 'required|in:card,bank_transfer,cash',
            'transaction_id' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:500',
        ];
    }
}
