<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'name',
        'address',
        'size',
        'monthly_bill',
        'description',
        'property_type',
        'year_built',
        'parking_spaces',
        'amenities',
    ];

    protected $casts = [
        'amenities' => 'array',
        'size' => 'decimal:2',
        'monthly_bill' => 'decimal:2',
        'parking_spaces' => 'integer',
        'year_built' => 'integer',
    ];

    // Relationships
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function units()
    {
        return $this->hasMany(Unit::class);
    }

    public function documents()
    {
        return $this->morphMany(Document::class, 'documentable');
    }

    // Scopes
    public function scopeByType($query, $type)
    {
        return $query->where('property_type', $type);
    }

    public function scopeApartments($query)
    {
        return $query->where('property_type', 'apartment');
    }

    public function scopeHouses($query)
    {
        return $query->where('property_type', 'house');
    }

    public function scopeOffices($query)
    {
        return $query->where('property_type', 'office');
    }

    // Accessors
    public function getAvailableUnitsAttribute()
    {
        return $this->units()->where('status', 'available')->get();
    }

    public function getOccupiedUnitsAttribute()
    {
        return $this->units()->where('status', 'occupied')->get();
    }

    public function getMaintenanceUnitsAttribute()
    {
        return $this->units()->where('status', 'maintenance')->get();
    }

    public function getOccupancyRateAttribute()
    {
        $totalUnits = $this->units()->count();
        if ($totalUnits == 0) return 0;

        $occupiedUnits = $this->units()->where('status', 'occupied')->count();
        return round(($occupiedUnits / $totalUnits) * 100, 2);
    }

    public function getTotalMonthlyRentAttribute()
    {
        return $this->units()
            ->where('status', 'occupied')
            ->sum('monthly_rent');
    }

    // Helper Methods
    public function hasAmenity($amenity)
    {
        return in_array($amenity, $this->amenities ?? []);
    }

    public function addAmenity($amenity)
    {
        $amenities = $this->amenities ?? [];
        if (!in_array($amenity, $amenities)) {
            $amenities[] = $amenity;
            $this->amenities = $amenities;
            $this->save();
        }
    }

    public function removeAmenity($amenity)
    {
        $amenities = $this->amenities ?? [];
        $this->amenities = array_values(array_diff($amenities, [$amenity]));
        $this->save();
    }
}
