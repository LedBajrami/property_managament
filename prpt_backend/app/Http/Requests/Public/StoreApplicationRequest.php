<?php

namespace App\Http\Requests\Public;

use Illuminate\Foundation\Http\FormRequest;

class StoreApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'unit_id'                    => ['required', 'integer', 'exists:units,id'],
            'annual_income'              => ['required', 'numeric', 'min:0'],
            'employment_status'          => ['required', 'string', 'in:employed,self-employed,unemployed,student,retired'],
            'employer_name'              => ['nullable', 'string', 'max:255'],
            'current_address'            => ['required', 'string', 'max:500'],
            'references'                 => ['nullable', 'array', 'max:5'],
            'references.*.name'          => ['required_with:references', 'string', 'max:255'],
            'references.*.phone'         => ['required_with:references', 'string', 'max:50'],
            'references.*.relationship'  => ['nullable', 'string', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'unit_id.exists'            => 'The selected unit does not exist.',
            'employment_status.in'      => 'Employment status must be one of: employed, self-employed, unemployed, student, retired.',
            'references.*.name.required_with'  => 'Each reference must have a name.',
            'references.*.phone.required_with' => 'Each reference must have a phone number.',
        ];
    }
}
