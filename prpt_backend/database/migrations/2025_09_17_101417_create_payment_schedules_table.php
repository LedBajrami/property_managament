<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('payment_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lease_id')->constrained()->onDelete('cascade');
            $table->date('due_date');
            $table->decimal('amount', 10, 2);
            $table->enum('status', ['pending', 'paid', 'overdue'])->default('pending');
            $table->decimal('late_fee', 10, 2)->nullable();
            $table->timestamps();

            $table->index(['lease_id', 'due_date']);
            $table->index('status');
        });
    }

    public function down()
    {
        Schema::dropIfExists('payment_schedules');
    }
};
