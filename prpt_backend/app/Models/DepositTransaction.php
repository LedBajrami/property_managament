<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DepositTransaction extends Model
{
    protected $fillable = [
        'lease_id',
        'type',
        'amount',
        'transaction_date',
        'payment_method',
        'transaction_id',
        'notes',
        'processed_by',
    ];

    protected $casts = [
        'transaction_date' => 'date',
        'amount' => 'decimal:2',
    ];

    public function lease()
    {
        return $this->belongsTo(Lease::class);
    }

    public function processedBy()
    {
        return $this->belongsTo(User::class, 'processed_by');
    }
}
