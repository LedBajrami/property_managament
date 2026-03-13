<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('leases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->foreignId('resident_id')->references('id')->on('users')->onDelete('restrict');
            $table->foreignId('unit_id')->constrained()->onDelete('restrict');

            // Core dates
            $table->date('start_date');
            $table->date('end_date');
            $table->date('signed_date')->nullable();
            $table->date('move_in_date')->nullable();
            $table->date('move_out_date')->nullable();
            $table->date('notice_date')->nullable();

            // Financial
            $table->decimal('monthly_rent', 10, 2);
            $table->decimal('deposit_amount', 10, 2);
            $table->integer('rent_due_day')->default(1);
            $table->decimal('late_fee_amount', 10, 2)->nullable();
            $table->integer('late_fee_grace_days')->default(5);

            // Deposit tracking
            $table->boolean('deposit_paid')->default(false);
            $table->date('deposit_paid_date')->nullable();
            $table->boolean('deposit_returned')->default(false);
            $table->date('deposit_returned_date')->nullable();
            $table->decimal('deposit_deductions', 10, 2)->default(0);
            $table->text('deposit_deduction_notes')->nullable();

            // Lease type & renewal
            $table->enum('lease_type', ['fixed', 'month-to-month', 'renewal'])->default('fixed');
            $table->foreignId('parent_lease_id')->nullable()->references('id')->on('leases')->onDelete('set null');
            $table->boolean('auto_renew')->default(false);

            // Status & termination
            $table->enum('status', ['draft', 'active', 'expired', 'terminated'])->default('draft');
            $table->text('termination_reason')->nullable();
            $table->enum('terminated_by', ['tenant', 'landlord', 'mutual'])->nullable();
            $table->timestamp('terminated_at')->nullable();

            // Additional terms
            $table->json('utilities_included')->nullable();
            $table->boolean('parking_included')->default(false);
            $table->boolean('pets_allowed')->default(false);
            $table->text('special_terms')->nullable();
            $table->foreignId('lease_document_id')->nullable()->references('id')->on('documents')->onDelete('set null');

            $table->timestamps();

            // Indexes
            $table->index('company_id');
            $table->index(['resident_id', 'status']);
            $table->index(['unit_id', 'status']);
            $table->index(['start_date', 'end_date']);
            $table->index(['move_in_date', 'move_out_date']);
            $table->index('parent_lease_id');

            // Prevent multiple active leases per unit
            $table->unique(['unit_id', 'status'], 'unique_active_lease')->where('status', 'active');
        });
    }

    public function down()
    {
        Schema::dropIfExists('leases');
    }
};
