<?php

namespace App\Http\Requests\Lease;

use Illuminate\Foundation\Http\FormRequest;

class CreateLeaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'resident_id' => 'required|integer|exists:users,id',
            'unit_id' => 'required|integer|exists:units,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'monthly_rent' => 'required|numeric|min:0',
            'deposit_amount' => 'required|numeric|min:0',
            'signed_date' => 'nullable|date',
            'move_in_date' => 'nullable|date',
            'rent_due_day' => 'nullable|integer|min:1|max:31',
            'late_fee_amount' => 'nullable|numeric|min:0',
            'late_fee_grace_days' => 'nullable|integer|min:0',
            'lease_type' => 'nullable|string|in:fixed,month-to-month,renewal',
            'auto_renew' => 'boolean',
            'utilities_included' => 'nullable|array',
            'utilities_included.*' => 'string',
            'parking_included' => 'boolean',
            'pets_allowed' => 'boolean',
            'special_terms' => 'nullable|string',
        ];
    }
}
