import AdminLayout from "@/components/layouts/admin-layout.tsx";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { useDashboardOverview } from "@/hooks/Dashboard/useDashboardOverview";

export default function AdminDashboard() {
    const { data, isLoading } = useDashboardOverview();
    const overview = data?.data;

    return (
        <AdminLayout>
            {isLoading && <p className="px-4 lg:px-6 text-sm text-muted-foreground">Loading dashboard...</p>}
            <SectionCards cards={overview?.cards} />
            <ChartAreaInteractive data={overview?.chart} />
            <DataTable data={overview?.table ?? []} />
        </AdminLayout>
    );
}
