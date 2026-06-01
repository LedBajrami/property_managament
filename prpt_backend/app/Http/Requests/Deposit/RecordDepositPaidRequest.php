<?php

namespace App\Http\Requests\Deposit;

use Illuminate\Foundation\Http\FormRequest;

class RecordDepositPaidRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'amount'           => 'required|numeric|min:0',
            'transaction_date' => 'required|date',
            'payment_method'   => 'required|in:card,bank_transfer,cash,check',
            'transaction_id'   => 'nullable|string|max:255',
            'notes'            => 'nullable|string',
        ];
    }
}
