<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'unit_number',
        'bedrooms',
        'bathrooms',
        'size_sqm',
        'monthly_rent',
        'status',
    ];

    protected $casts = [
        'bedrooms' => 'integer',
        'bathrooms' => 'integer',
        'size_sqm' => 'decimal:2',
        'monthly_rent' => 'decimal:2',
    ];

    // Relationships
    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function leases()
    {
        return $this->hasMany(Lease::class);
    }

    public function activeLease()
    {
        return $this->hasOne(Lease::class)->where('status', 'active');
    }

    public function maintenanceRequests()
    {
        return $this->hasMany(MaintenanceRequest::class);
    }

    // Scopes
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    public function scopeOccupied($query)
    {
        return $query->where('status', 'occupied');
    }

    public function scopeUnderMaintenance($query)
    {
        return $query->where('status', 'maintenance');
    }

    public function scopeByBedrooms($query, $bedrooms)
    {
        return $query->where('bedrooms', $bedrooms);
    }

    public function scopeByRentRange($query, $min, $max)
    {
        return $query->whereBetween('monthly_rent', [$min, $max]);
    }

    // Accessors
    public function getCurrentTenantAttribute()
    {
        $activeLease = $this->activeLease;
        return $activeLease ? $activeLease->tenant : null;
    }

    public function getIsAvailableAttribute()
    {
        return $this->status === 'available';
    }

    public function getIsOccupiedAttribute()
    {
        return $this->status === 'occupied';
    }

    public function getFullAddressAttribute()
    {
        return $this->unit_number . ', ' . $this->property->address;
    }

    // Helper Methods
    public function markAsAvailable()
    {
        $this->status = 'available';
        $this->save();
    }

    public function markAsOccupied()
    {
        $this->status = 'occupied';
        $this->save();
    }

    public function markUnderMaintenance()
    {
        $this->status = 'maintenance';
        $this->save();
    }

    public function canBeLeased()
    {
        return $this->status === 'available';
    }

    public function getOpenMaintenanceRequests()
    {
        return $this->maintenanceRequests()
            ->whereIn('status', ['open', 'in_progress'])
            ->get();
    }
}
