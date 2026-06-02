<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rental_applications', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('unit_id')->constrained('units')->cascadeOnDelete();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();

            $table->decimal('annual_income', 12, 2);
            $table->string('employment_status'); // employed, self-employed, unemployed, student, retired
            $table->string('employer_name')->nullable();
            $table->string('current_address', 500);
            $table->json('references')->nullable(); // [{name, phone, relationship}]

            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->text('rejection_reason')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();

            // Prevent duplicate pending applications per user/unit
            $table->index(['user_id', 'unit_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rental_applications');
    }
};
