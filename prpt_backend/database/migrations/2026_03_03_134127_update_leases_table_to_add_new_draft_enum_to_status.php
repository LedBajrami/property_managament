<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('leases', function (Blueprint $table) {
            $table->enum('status', ['draft', 'active', 'expired', 'terminated'])
                ->default('draft')
                ->change();
        });
    }

    public function down(): void
    {
        Schema::table('leases', function (Blueprint $table) {
            $table->enum('status', ['active', 'expired', 'terminated'])
                ->default('active')
                ->change();
        });
    }
};
