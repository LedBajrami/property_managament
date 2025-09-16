<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
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
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'company_id' => ['nullable', 'integer'],
            'employee_id' => ['nullable', 'string'],
            'badge_id' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:255'],
            'emergency_contact_name' => ['nullable', 'string', 'max:255'],
            'emergency_contact_phone' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'date_of_birth' => ['nullable', 'date'],
            'national_id' => ['nullable', 'string', 'max:255'],
            'hire_date' => ['nullable', 'date'],
            'contract_end_date' => ['nullable', 'date'],
            'department_id' => ['nullable', 'integer', 'exists:departments,department_id'],
            'position_id' => ['nullable', 'integer', 'exists:positions,position_id'],
            'work_type_id' => ['nullable', 'integer', 'exists:work_types,work_type_id'],
            'direct_manager_id' => ['nullable', 'integer', 'max:255'],
            'employment_status' => ['nullable', 'string', 'max:255', Rule::in(['active', 'probation', 'notice_period', 'terminated', 'resigned'])],
            'salary' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'year_2023_annual_days' => ['nullable', 'numeric'],
            'year_2024_annual_days' => ['nullable', 'numeric'],
            'year_2025_annual_days' => ['nullable', 'numeric'],
            'role' => ['required', Rule::in(['hr-head', 'company-head', 'department-head', 'employee'])],
        ];
    }
}
