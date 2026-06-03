import AdminLayout from "@/components/layouts/admin-layout";
import { useDashboardOverview } from "@/hooks/Dashboard/useDashboardOverview";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const money = (value?: number) => `$${Number(value ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

export default function ReportsPage() {
    const { data, isLoading } = useDashboardOverview();
    const reports = data?.data?.reports;

    const rows = [
        ["Total billed", money(reports?.total_billed)],
        ["Collected", money(reports?.collected)],
        ["Outstanding", money(reports?.outstanding)],
        ["Collection rate", `${reports?.collection_rate ?? 0}%`],
        ["Occupancy rate", `${reports?.occupancy_rate ?? 0}%`],
        ["Properties", reports?.properties ?? 0],
        ["Units", `${reports?.occupied_units ?? 0}/${reports?.total_units ?? 0}`],
        ["Active leases", reports?.active_leases ?? 0],
        ["Draft leases", reports?.draft_leases ?? 0],
        ["Pending applications", reports?.pending_applications ?? 0],
        ["Overdue payments", reports?.overdue_payments ?? 0],
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Reports</h1>
                    <p className="text-muted-foreground text-sm">Company portfolio, leasing, and payment summary.</p>
                </div>

                {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading reports...</p>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Operational Summary</CardTitle>
                            <CardDescription>Live values from leases, units, applications, and payments.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {rows.map(([label, value]) => (
                                <div key={String(label)} className="rounded-lg border p-4">
                                    <p className="text-xs text-muted-foreground">{label}</p>
                                    <p className="text-xl font-semibold mt-1">{value}</p>
                                </div>
                            ))}
                            <div className="rounded-lg border p-4">
                                <p className="text-xs text-muted-foreground">Health</p>
                                <Badge variant="outline" className="mt-2">
                                    {(reports?.overdue_payments ?? 0) > 0 ? "Needs attention" : "On track"}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}
