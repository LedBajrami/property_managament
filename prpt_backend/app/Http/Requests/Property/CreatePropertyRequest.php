<?php

namespace App\Http\Requests\Property;

use Illuminate\Foundation\Http\FormRequest;

class CreatePropertyRequest extends FormRequest
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
            'name' => 'required|string',
            'address' => 'required|string',
            'property_type' => 'required|string',
            'size' => 'required|numeric',
            'monthly_bill' => 'required|numeric',
            'parking_spaces' => 'nullable|integer',
            'year_built' => 'required|numeric',
            'description' => 'nullable|string',
        ];
    }
}
