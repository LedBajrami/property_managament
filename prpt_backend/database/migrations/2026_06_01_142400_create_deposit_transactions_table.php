<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('deposit_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lease_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['paid', 'returned']);
            $table->decimal('amount', 10, 2);
            $table->date('transaction_date');
            $table->enum('payment_method', ['card', 'bank_transfer', 'cash', 'check'])->nullable();
            $table->string('transaction_id')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('processed_by')->constrained('users');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('deposit_transactions');
    }
};
