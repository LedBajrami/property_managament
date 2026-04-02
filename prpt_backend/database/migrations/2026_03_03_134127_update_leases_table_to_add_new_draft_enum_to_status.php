<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE leases ALTER COLUMN status TYPE varchar(255)");
        DB::statement("ALTER TABLE leases ADD CONSTRAINT status_check CHECK (status IN ('draft', 'active', 'expired', 'terminated'))");
        DB::statement("ALTER TABLE leases ALTER COLUMN status SET DEFAULT 'draft'");
        DB::statement("ALTER TABLE leases ALTER COLUMN status SET NOT NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE leases DROP CONSTRAINT IF EXISTS status_check");
        DB::statement("ALTER TABLE leases ALTER COLUMN status TYPE varchar(255)");
        DB::statement("ALTER TABLE leases ADD CONSTRAINT status_check CHECK (status IN ('active', 'expired', 'terminated'))");
        DB::statement("ALTER TABLE leases ALTER COLUMN status SET DEFAULT 'active'");
        DB::statement("ALTER TABLE leases ALTER COLUMN status SET NOT NULL");
    }
};
