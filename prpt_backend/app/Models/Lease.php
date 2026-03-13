<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Lease extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'parent_lease_id',
        'resident_id',
        'unit_id',
        'start_date',
        'end_date',
        'monthly_rent',
        'deposit_amount',
        'status',
        'signed_date',
        'move_in_date',
        'rent_due_day',
        'late_fee_amount',
        'late_fee_grace_days',
        'lease_type',
        'auto_renew',
        'utilities_included',
        'parking_included',
        'pets_allowed',
        'special_terms',
        'terminated_at'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'monthly_rent' => 'decimal:2',
        'deposit_amount' => 'decimal:2',
        'utilities_included' => 'array',
    ];

    public function resident(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resident_id');
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    public function paymentSchedules(): HasMany
    {
        return $this->hasMany(PaymentSchedule::class);
    }

    public function documents(): MorphMany
    {
        return $this->morphMany(Document::class, 'documentable');
    }
}
