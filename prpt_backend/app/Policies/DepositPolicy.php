<?php

namespace App\Policies;

use App\Models\Lease;
use App\Models\User;

class DepositPolicy
{
    public function view(User $user, Lease $lease): bool
    {
        if ($user->hasRole('resident')) {
            return $lease->resident_id === $user->id;
        }
        return $lease->unit->property->company_id == app('current_company')->id;
    }

    public function manage(User $user, Lease $lease): bool
    {
        // Only admins can record or return deposits
        return $user->hasAnyRole(['company-admin', 'property-manager', 'super-admin'])
            && $lease->unit->property->company_id == app('current_company')->id;
    }
}
