<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\Lease;
use App\Models\PaymentSchedule;
use App\Models\PaymentTransaction;
use App\Models\Property;
use App\Models\RentalApplication;
use App\Models\Unit;
use App\Traits\ApiTrait;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    use ApiTrait;

    public function overview(Request $request)
    {
        try {
            $company = app('current_company');
            $companyId = $company->id;

            $properties = Property::where('company_id', $companyId)->count();
            $unitsQuery = Unit::whereHas('property', fn ($query) => $query->where('company_id', $companyId));
            $totalUnits = (clone $unitsQuery)->count();
            $occupiedUnits = (clone $unitsQuery)->where('status', 'occupied')->count();
            $availableUnits = (clone $unitsQuery)->where('status', 'available')->count();

            $activeLeases = Lease::where('company_id', $companyId)->where('status', 'active')->count();
            $draftLeases = Lease::where('company_id', $companyId)->where('status', 'draft')->count();
            $pendingApplications = RentalApplication::where('company_id', $companyId)->where('status', 'pending')->count();

            $scheduleQuery = PaymentSchedule::whereHas('lease', fn ($query) => $query->where('company_id', $companyId));
            $totalBilled = (clone $scheduleQuery)->sum('amount');
            $outstanding = (clone $scheduleQuery)
                ->whereIn('status', ['pending', 'overdue'])
                ->sum(DB::raw('amount + COALESCE(late_fee, 0)'));
            $overdueCount = (clone $scheduleQuery)->where('status', 'overdue')->count();

            $collected = PaymentTransaction::where('status', 'success')
                ->whereHas('paymentSchedule.lease', fn ($query) => $query->where('company_id', $companyId))
                ->sum('amount_paid');

            $occupancyRate = $totalUnits > 0 ? round(($occupiedUnits / $totalUnits) * 100, 1) : 0;
            $collectionRate = $totalBilled > 0 ? round(($collected / $totalBilled) * 100, 1) : 0;

            return $this->success([
                'cards' => [
                    [
                        'label' => 'Total Revenue',
                        'value' => '$' . number_format((float) $collected, 2),
                        'trend' => $collectionRate . '%',
                        'trend_direction' => $collectionRate >= 80 ? 'up' : 'down',
                        'title' => $collectionRate >= 80 ? 'Collections on track' : 'Collections need attention',
                        'description' => 'Collected from successful payments',
                    ],
                    [
                        'label' => 'Occupied Units',
                        'value' => number_format($occupiedUnits) . '/' . number_format($totalUnits),
                        'trend' => $occupancyRate . '%',
                        'trend_direction' => $occupancyRate >= 80 ? 'up' : 'down',
                        'title' => $availableUnits . ' available unit' . ($availableUnits === 1 ? '' : 's'),
                        'description' => 'Current occupancy rate',
                    ],
                    [
                        'label' => 'Active Leases',
                        'value' => number_format($activeLeases),
                        'trend' => '+' . number_format($draftLeases),
                        'trend_direction' => 'up',
                        'title' => $draftLeases . ' draft lease' . ($draftLeases === 1 ? '' : 's'),
                        'description' => 'Ready for signature or move-in',
                    ],
                    [
                        'label' => 'Outstanding Rent',
                        'value' => '$' . number_format((float) $outstanding, 2),
                        'trend' => number_format($overdueCount),
                        'trend_direction' => $overdueCount > 0 ? 'down' : 'up',
                        'title' => $overdueCount > 0 ? 'Overdue payments exist' : 'No overdue payments',
                        'description' => $pendingApplications . ' pending application' . ($pendingApplications === 1 ? '' : 's'),
                    ],
                ],
                'chart' => $this->monthlyPaymentChart($companyId),
                'table' => [
                    [
                        'id' => 1,
                        'header' => 'Properties',
                        'type' => 'Portfolio',
                        'status' => $properties > 0 ? 'Done' : 'In Process',
                        'target' => (string) $properties,
                        'limit' => (string) $totalUnits,
                        'reviewer' => $company->name,
                    ],
                    [
                        'id' => 2,
                        'header' => 'Occupancy',
                        'type' => 'Units',
                        'status' => $occupancyRate >= 80 ? 'Done' : 'In Process',
                        'target' => (string) $occupiedUnits,
                        'limit' => (string) $totalUnits,
                        'reviewer' => $occupancyRate . '%',
                    ],
                    [
                        'id' => 3,
                        'header' => 'Rent Collection',
                        'type' => 'Payments',
                        'status' => $collectionRate >= 80 ? 'Done' : 'In Process',
                        'target' => '$' . number_format((float) $collected, 0),
                        'limit' => '$' . number_format((float) $totalBilled, 0),
                        'reviewer' => $collectionRate . '%',
                    ],
                    [
                        'id' => 4,
                        'header' => 'Applications',
                        'type' => 'Leasing',
                        'status' => $pendingApplications === 0 ? 'Done' : 'In Process',
                        'target' => (string) $pendingApplications,
                        'limit' => (string) RentalApplication::where('company_id', $companyId)->count(),
                        'reviewer' => 'Review queue',
                    ],
                    [
                        'id' => 5,
                        'header' => 'Documents',
                        'type' => 'Records',
                        'status' => 'Done',
                        'target' => (string) Document::where('company_id', $companyId)->count(),
                        'limit' => (string) Lease::where('company_id', $companyId)->count(),
                        'reviewer' => 'Company files',
                    ],
                ],
                'reports' => [
                    'total_billed' => (float) $totalBilled,
                    'collected' => (float) $collected,
                    'outstanding' => (float) $outstanding,
                    'collection_rate' => $collectionRate,
                    'occupancy_rate' => $occupancyRate,
                    'properties' => $properties,
                    'total_units' => $totalUnits,
                    'occupied_units' => $occupiedUnits,
                    'available_units' => $availableUnits,
                    'active_leases' => $activeLeases,
                    'draft_leases' => $draftLeases,
                    'pending_applications' => $pendingApplications,
                    'overdue_payments' => $overdueCount,
                ],
            ]);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    private function monthlyPaymentChart(int $companyId): array
    {
        $start = now()->subMonths(5)->startOfMonth();
        $months = collect(range(0, 5))->map(fn ($index) => $start->copy()->addMonths($index));

        return $months->map(function (Carbon $month) use ($companyId) {
            $billed = PaymentSchedule::whereHas('lease', fn ($query) => $query->where('company_id', $companyId))
                ->whereBetween('due_date', [$month->copy()->startOfMonth(), $month->copy()->endOfMonth()])
                ->sum('amount');

            $collected = PaymentTransaction::where('status', 'success')
                ->whereHas('paymentSchedule.lease', fn ($query) => $query->where('company_id', $companyId))
                ->whereBetween('payment_date', [$month->copy()->startOfMonth(), $month->copy()->endOfMonth()])
                ->sum('amount_paid');

            return [
                'date' => $month->format('Y-m-d'),
                'desktop' => (float) $billed,
                'mobile' => (float) $collected,
            ];
        })->values()->all();
    }
}
