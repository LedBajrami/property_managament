<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Company extends Model
{
    use HasFactory, softDeletes;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
    ];


    // Relationships
    public function users()
    {
        return $this->belongsToMany(User::class, 'company_users')
            ->withPivot('role_name')
            ->withTimestamps();
    }

    public function properties()
    {
        return $this->hasMany(Property::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Helper Methods
    public function owners()
    {
        return $this->users()->wherePivot('role_name', 'owner');
    }

    public function managers()
    {
        return $this->users()->wherePivot('role_name', 'manager');
    }

    public function tenants()
    {
        return $this->users()->wherePivot('role_name', 'tenant');
    }

    public function maintenanceStaff()
    {
        return $this->users()->wherePivot('role_name', 'maintenance_staff');
    }

    public function getSubdomainUrl()
    {
        return 'https://' . $this->slug . '.' . config('app.domain', 'example.com');
    }
}
