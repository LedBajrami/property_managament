<?php

namespace App\Console\Commands\Lease;

use App\Models\Lease;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class RepairActiveLeaseDuplicates extends Command
{
    protected $signature = 'leases:repair-active-duplicates {--apply : Mark duplicate active leases as draft}';

    protected $description = 'Find units with more than one active lease and optionally keep only the oldest active lease.';

    public function handle(): int
    {
        $duplicates = Lease::query()
            ->select('unit_id', DB::raw('COUNT(*) as active_count'))
            ->where('status', 'active')
            ->groupBy('unit_id')
            ->havingRaw('COUNT(*) > 1')
            ->get();

        if ($duplicates->isEmpty()) {
            $this->info('No units with duplicate active leases were found.');
            return self::SUCCESS;
        }

        foreach ($duplicates as $duplicate) {
            $leases = Lease::where('unit_id', $duplicate->unit_id)
                ->where('status', 'active')
                ->orderBy('start_date')
                ->orderBy('id')
                ->get();

            $keeper = $leases->first();
            $toDraft = $leases->skip(1);

            $this->warn("Unit {$duplicate->unit_id} has {$duplicate->active_count} active leases. Keeping lease {$keeper->id} active.");

            foreach ($toDraft as $lease) {
                $this->line(" - Duplicate lease {$lease->id}: {$lease->start_date} to {$lease->end_date}");

                if ($this->option('apply')) {
                    $lease->update(['status' => 'draft']);
                }
            }
        }

        if (! $this->option('apply')) {
            $this->comment('Dry run only. Re-run with --apply to mark duplicate active leases as draft.');
        }

        return self::SUCCESS;
    }
}
