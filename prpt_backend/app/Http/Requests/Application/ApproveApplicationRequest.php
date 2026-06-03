<?php

namespace App\Http\Requests\Application;

use Illuminate\Foundation\Http\FormRequest;

class ApproveApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create-leases') ?? false;
    }

    public function rules(): array
    {
        return [
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'monthly_rent' => ['nullable', 'numeric', 'min:0'],
            'deposit_amount' => ['required', 'numeric', 'min:0'],
            'signed_date' => ['nullable', 'date'],
            'move_in_date' => ['nullable', 'date'],
            'rent_due_day' => ['nullable', 'integer', 'min:1', 'max:31'],
            'late_fee_amount' => ['nullable', 'numeric', 'min:0'],
            'late_fee_grace_days' => ['nullable', 'integer', 'min:0'],
            'lease_type' => ['nullable', 'string', 'in:fixed,month-to-month,renewal'],
            'auto_renew' => ['boolean'],
            'utilities_included' => ['nullable', 'array'],
            'utilities_included.*' => ['string'],
            'parking_included' => ['boolean'],
            'pets_allowed' => ['boolean'],
            'special_terms' => ['nullable', 'string'],
        ];
    }
}
