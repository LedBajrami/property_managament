<?php

namespace App\Http\Requests\Unit;

use Illuminate\Foundation\Http\FormRequest;

class CreateUnitRequest extends FormRequest
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
            'property_id' => 'required|exists:properties,id',
            'unit_number' => 'required|unique:units,unit_number',
            'bedrooms' => 'required|integer',
            'bathrooms' => 'required|integer',
            'size_sqm' => 'required|numeric',
            'monthly_rent' => 'required|numeric',
            'status' => 'required|string',
        ];
    }
}
