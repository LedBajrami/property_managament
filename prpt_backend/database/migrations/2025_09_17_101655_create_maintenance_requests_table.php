<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('maintenance_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('unit_id')->constrained()->onDelete('cascade');
            $table->foreignId('tenant_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->foreignId('assigned_to')->nullable()->references('id')->on('users')->onDelete('set null');
            $table->enum('status', ['open', 'in_progress', 'completed'])->default('open');
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->timestamps();

            $table->index(['unit_id', 'status']);
            $table->index(['tenant_id', 'status']);
            $table->index('assigned_to');
        });
    }

    public function down()
    {
        Schema::dropIfExists('maintenance_requests');
    }
};
