import { useNavigate } from "react-router-dom";
import { useGetMyApplications } from "@/hooks/Public/useGetMyApplications";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Building2, ClipboardList, Search } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    approved: "bg-primary/10 text-primary border-primary/20",
    rejected: "bg-red-100 text-red-700 border-red-200",
};

export default function MyApplicationsPage() {
    const navigate = useNavigate();
    const { data, isLoading } = useGetMyApplications();
    const applications = data?.data ?? [];

    return (
        <div className="min-h-screen bg-muted/30">
            <nav className="sticky top-0 z-40 bg-background border-b border-border px-6 py-4 flex items-center gap-4">
                <button
                    onClick={() => navigate("/browse")}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Browse
                </button>
                <span className="text-xl font-bold tracking-tight text-foreground ml-auto">Havenly</span>
            </nav>

            <main className="max-w-5xl mx-auto px-6 py-10 space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">My Applications</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Track submitted applications and review property decisions.
                        </p>
                    </div>
                    <Button onClick={() => navigate("/browse")}>
                        <Search className="w-4 h-4 mr-2" />
                        Browse Properties
                    </Button>
                </div>

                {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading applications...</p>
                ) : applications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground bg-background border border-border rounded-lg">
                        <ClipboardList className="w-10 h-10 mb-3 opacity-30" />
                        <p className="font-medium text-foreground">No applications yet</p>
                        <p className="text-sm mt-1">Apply for an available unit to see it here.</p>
                    </div>
                ) : (
                    <div className="rounded-lg border bg-background overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30">
                                    <TableHead>Property</TableHead>
                                    <TableHead>Unit</TableHead>
                                    <TableHead>Rent</TableHead>
                                    <TableHead>Employment</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Submitted</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {applications.map((application) => (
                                    <TableRow key={application.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2 font-medium">
                                                <Building2 className="w-4 h-4 text-muted-foreground" />
                                                {application.unit?.property?.name ?? "—"}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {application.unit?.property?.address ?? "—"}
                                            </p>
                                        </TableCell>
                                        <TableCell>{application.unit?.unit_number ?? "—"}</TableCell>
                                        <TableCell>
                                            {application.unit?.monthly_rent
                                                ? `$${Number(application.unit.monthly_rent).toLocaleString()}`
                                                : "—"}
                                        </TableCell>
                                        <TableCell className="capitalize">{application.employment_status}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`capitalize ${STATUS_COLORS[application.status] ?? ""}`}
                                            >
                                                {application.status}
                                            </Badge>
                                            {application.rejection_reason && (
                                                <p className="text-xs text-muted-foreground mt-2 max-w-xs">
                                                    {application.rejection_reason}
                                                </p>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {application.created_at
                                                ? new Date(application.created_at).toLocaleDateString()
                                                : "—"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </main>
        </div>
    );
}
