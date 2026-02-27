<?php

namespace App\Policies;

use App\Models\Property;
use App\Models\User;

class PropertyPolicy
{
    public function view(User $user, Property $property): bool
    {
        return $property->company_id === app('current_company')->id;
    }

    public function update(User $user, Property $property): bool
    {
        return $property->company_id === app('current_company')->id;
    }

    public function delete(User $user, Property $property): bool
    {
        return $property->company_id === app('current_company')->id;
    }
}
