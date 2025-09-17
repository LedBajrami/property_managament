<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('address');
            $table->decimal('size', 10, 2)->nullable()->comment('Size in square meters');
            $table->decimal('monthly_bill', 10, 2)->nullable();
            $table->text('description')->nullable();
            $table->enum('property_type', ['apartment', 'house', 'office'])->default('apartment');
            $table->year('year_built')->nullable();
            $table->integer('parking_spaces')->default(0);
            $table->json('amenities')->nullable();
            $table->timestamps();

            $table->index('company_id');
            $table->index('property_type');
        });
    }

    public function down()
    {
        Schema::dropIfExists('properties');
    }
};
