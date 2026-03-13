<?php

namespace App\Http\Requests\Lease;

use Illuminate\Foundation\Http\FormRequest;

class RenewLeaseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    // RenewLeaseRequest.php
    public function rules()
    {
        return [
            'start_date' => 'required|date|after:now',
            'end_date' => 'required|date|after:start_date',
            'monthly_rent' => 'nullable|numeric|min:0',
        ];
    }
}
