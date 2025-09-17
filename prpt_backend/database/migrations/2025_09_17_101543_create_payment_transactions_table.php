<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('payment_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_schedule_id')->constrained()->onDelete('restrict');
            $table->decimal('amount_paid', 10, 2);
            $table->datetime('payment_date');
            $table->enum('payment_method', ['card', 'bank_transfer', 'cash'])->default('bank_transfer');
            $table->string('transaction_id')->nullable();
            $table->enum('status', ['success', 'failed'])->default('success');
            $table->timestamps();

            $table->index('payment_schedule_id');
            $table->index('transaction_id');
            $table->index(['status', 'payment_date']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('payment_transactions');
    }
};
