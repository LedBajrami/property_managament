<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('company_users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->enum('role_name', ['owner', 'manager', 'tenant', 'maintenance'])->default('tenant');
            $table->json('assigned_properties')->nullable(); // only for property-managers
            $table->enum('status', ['active', 'inactive', 'pending'])->default('pending');
            $table->timestamp('invited_at')->nullable();
            $table->timestamp('accepted_at')->nullable();
            $table->timestamps();

            // Indexes
            $table->unique(['user_id', 'company_id']);
            $table->index(['company_id', 'role_name']);
            $table->index(['company_id', 'status']);
            $table->index('status');
        });
    }

    public function down()
    {
        Schema::dropIfExists('company_users');
    }
};
