<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'role' => $this->getRoleNames()->first() ?? 'employee'
//            'company' => $this->company ? [
//                'id' => $this->company->company_id,
//                'name' => $this->company->company_name,
//            ] : null,
//            'employee_id' => $this->employee_id,
//            'badge_id' => $this->badge_id,
//            'phone' => $this->phone ?? null,
//            'address' => $this->address ?? null,
//            'date_of_birth' => $this->date_of_birth ?? null,
//            'national_id' => $this->national_id ?? null,
//            'hire_date' => $this->hire_date ?? null,
//            'probation_end_date' => $this->probation_end_date ?? null,
//            'contract_end_date' => $this->contract_end_date ?? null,
//
//            'department' => $this->department ? [
//                'id' => $this->department->department_id,
//                'name' => $this->department->department_name,
//            ] : null,
//
//            'position' => $this->position ? [
//                'id' => $this->position->position_id,
//                'name' => $this->position->position_name,
//            ] : null,
//
//            'work_type' => $this->workType ? [
//                'id' => $this->workType->work_type_id,
//                'name' => $this->workType->type_name,
//            ] : null,
//
//            'level' => $this->level ? [
//                'id' => $this->level->level_id,
//                'name' => $this->level->level_name,
//            ] : null,
//
//            'direct_manager' => $this->directManager ? [
//                'id' => $this->directManager->id ?? null,
//                'name' => $this->directManager->first_name . " " . $this->directManager->last_name?? null,
//            ] : null,
//
//            'documents' => $this->documents,
//
//            'employment_status' => $this->employment_status ?? null,
//            'annual_leave_days' => $this->annual_leave_days ?? null,
//            'last_login' => $this->last_login ?? null,
//            'isActive' => $this->is_active ?? null,
//            'emergency_contact_name' => $this->emergency_contact_name ?? null,
//            'emergency_contact_phone' => $this->emergency_contact_phone ?? null,
//            'annual_leave_by_year' => $this->annualLeaveAllocations->map(function($allocation) {
//                return [
//                    'year' => $allocation->year,
//                    'days' => $allocation->days ?? 0,
//                ];
//            })->sortBy('year')->values(),
//            'total_annual_days' => $this->annualLeaveAllocations?->sum('days') ?? 0,
//            'permissions' => $this->roles->flatMap->permissions->pluck('name')->unique()->values()
        ];
    }
}
