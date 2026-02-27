<?php

namespace App\Policies;

use App\Models\Lease;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class LeasePolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Lease $lease): bool
    {
        return $lease->unit->property->company_id == app('current_company')->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Lease $lease): bool
    {
        return $lease->unit->property->company_id == app('current_company')->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Lease $lease): bool
    {
        return $lease->unit->property->company_id == app('current_company')->id;
    }
}
