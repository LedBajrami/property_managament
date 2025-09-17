<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    protected $guard_name = 'api';
    // Relationships
    public function companies()
    {
        return $this->belongsToMany(Company::class, 'company_users')
            ->withPivot('role_name')
            ->withTimestamps();
    }

    public function leases()
    {
        return $this->hasMany(Lease::class, 'tenant_id');
    }

    public function maintenanceRequests()
    {
        return $this->hasMany(MaintenanceRequest::class, 'tenant_id');
    }

    public function assignedMaintenanceRequests()
    {
        return $this->hasMany(MaintenanceRequest::class, 'assigned_to');
    }

    public function documents()
    {
        return $this->morphMany(Document::class, 'documentable');
    }

    // Accessors
    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    // Helper Methods
    public function hasRole($role, $companyId = null)
    {
        $query = $this->companies()->wherePivot('role_name', $role);

        if ($companyId) {
            $query->where('company_id', $companyId);
        }

        return $query->exists();
    }

    public function isOwner($companyId = null)
    {
        return $this->hasRole('owner', $companyId);
    }

    public function isManager($companyId = null)
    {
        return $this->hasRole('manager', $companyId);
    }

    public function isTenant($companyId = null)
    {
        return $this->hasRole('tenant', $companyId);
    }

    public function getCompanyRole($companyId)
    {
        $company = $this->companies()->where('company_id', $companyId)->first();
        return $company ? $company->pivot->role_name : null;
    }
}
