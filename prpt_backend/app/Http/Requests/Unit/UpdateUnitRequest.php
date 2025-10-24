<?php

namespace App\Http\Requests\Unit;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUnitRequest extends FormRequest
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
    public function rules(): array
    {
        return [
            'unit_number' => 'required',
            'bedrooms' => 'required|integer',
            'bathrooms' => 'required|integer',
            'size_sqm' => 'required|numeric',
            'monthly_rent' => 'required|numeric',
            'status' => 'required|string',
        ];
    }
}
