import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/layouts/admin-layout.tsx";
import { useGetLease } from "@/hooks/Leases/useGetLease.ts";
import { useAuth } from "@/hooks/Auth/useAuth.ts";
import { useDownloadDocument } from "@/hooks/Document/useDownloadDocument.ts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DepositTab } from "@/components/deposits/DepositTab.tsx";
import { format } from "date-fns";
import {
    ArrowLeft,
    Building2,
    Calendar,
    Download,
    DollarSign,
    Home,
    History,
    User,
} from "lucide-react";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
    active:     "bg-emerald-100 text-emerald-700 border-emerald-200",
    expired:    "bg-zinc-100 text-zinc-600 border-zinc-200",
    terminated: "bg-red-100 text-red-700 border-red-200",
    draft:      "bg-yellow-100 text-yellow-700 border-yellow-200",
};

const canManageDeposits = (role?: string) =>
    role === "company-admin" || role === "property-manager" || role === "super-admin";

const canManageLeases = canManageDeposits;

const fmt = (d?: string) => (d ? format(new Date(d), "MMM d, yyyy") : "—");

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex justify-between py-2.5 border-b last:border-0">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-medium text-right">{value ?? "—"}</span>
    </div>
);

export const LeaseDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate  = useNavigate();
    const { user }  = useAuth();
    const leaseId   = id ? parseInt(id) : undefined;

    const { data, isLoading } = useGetLease(leaseId);
    const { mutate: downloadDocument, isPending: isDownloadingDocument } = useDownloadDocument();
    const lease = data?.data;

    if (isLoading) {
        return (
            <AdminLayout>
                <p className="text-muted-foreground text-sm">Loading lease...</p>
            </AdminLayout>
        );
    }

    if (!lease) {
        return (
            <AdminLayout>
                <div className="text-center py-20 text-muted-foreground">
                    <p className="font-medium">Lease not found</p>
                    <Button variant="ghost" className="mt-3" onClick={() => navigate("/leases")}>
                        Back to Leases
                    </Button>
                </div>
            </AdminLayout>
        );
    }

    const residentName = lease.resident
        ? `${lease.resident.first_name} ${lease.resident.last_name}`
        : "—";
    const leaseDocument = lease.documents?.find((document) => document.document_type === "lease_agreement")
        ?? lease.documents?.[0];

    const handleDownloadLeaseDocument = () => {
        if (!leaseDocument) return;

        downloadDocument(
            {
                documentId: leaseDocument.id,
                filename: leaseDocument.original_name ?? `Lease-${lease.id}.pdf`,
            },
            {
                onError: () => toast.error("Failed to download lease document"),
            }
        );
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Back + header */}
                <div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="mb-3 -ml-2 text-muted-foreground"
                        onClick={() => navigate("/leases")}
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Leases
                    </Button>

                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">Lease #{lease.id}</h1>
                            <p className="text-muted-foreground text-sm mt-0.5">
                                {residentName} · {lease.unit?.property?.name ?? "—"} · Unit {lease.unit?.unit_number ?? "—"}
                            </p>
                        </div>
                        <Badge
                            variant="outline"
                            className={`capitalize text-sm ${STATUS_COLORS[lease.status] ?? ""}`}
                        >
                            {lease.status}
                        </Badge>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-4">
                        {leaseDocument && (
                            <Button
                                variant="outline"
                                onClick={handleDownloadLeaseDocument}
                                disabled={isDownloadingDocument}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download Lease
                            </Button>
                        )}
                        {canManageLeases(user?.role) && lease.unit_id && (
                            <Button
                                variant="outline"
                                onClick={() => navigate(`/unit/${lease.unit_id}/leases`)}
                            >
                                <History className="w-4 h-4 mr-2" />
                                Unit Lease History
                            </Button>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="overview">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="deposits">Deposits</TabsTrigger>
                    </TabsList>

                    {/* ── Overview ── */}
                    <TabsContent value="overview" className="mt-4">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Resident */}
                            <section className="rounded-lg border p-4 space-y-1">
                                <div className="flex items-center gap-2 mb-3 text-sm font-semibold">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    Resident
                                </div>
                                <InfoRow label="Name"  value={residentName} />
                                <InfoRow label="Email" value={lease.resident?.email} />
                                <InfoRow label="Phone" value={lease.resident?.phone} />
                            </section>

                            {/* Property */}
                            <section className="rounded-lg border p-4 space-y-1">
                                <div className="flex items-center gap-2 mb-3 text-sm font-semibold">
                                    <Building2 className="w-4 h-4 text-muted-foreground" />
                                    Property
                                </div>
                                <InfoRow label="Property" value={lease.unit?.property?.name} />
                                <InfoRow label="Address"  value={lease.unit?.property?.address} />
                                <InfoRow label="Unit"     value={lease.unit?.unit_number} />
                            </section>

                            {/* Lease Dates */}
                            <section className="rounded-lg border p-4 space-y-1">
                                <div className="flex items-center gap-2 mb-3 text-sm font-semibold">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    Dates
                                </div>
                                <InfoRow label="Start Date"    value={fmt(lease.start_date)} />
                                <InfoRow label="End Date"      value={fmt(lease.end_date)} />
                                <InfoRow label="Signed"        value={fmt(lease.signed_date)} />
                                <InfoRow label="Move-in"       value={fmt(lease.move_in_date)} />
                                <InfoRow label="Move-out"      value={fmt(lease.move_out_date)} />
                                {lease.terminated_at && (
                                    <InfoRow label="Terminated" value={fmt(lease.terminated_at)} />
                                )}
                            </section>

                            {/* Financials */}
                            <section className="rounded-lg border p-4 space-y-1">
                                <div className="flex items-center gap-2 mb-3 text-sm font-semibold">
                                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                                    Financials
                                </div>
                                <InfoRow label="Monthly Rent"     value={`$${Number(lease.monthly_rent).toLocaleString()}`} />
                                <InfoRow label="Deposit Amount"   value={`$${Number(lease.deposit_amount).toLocaleString()}`} />
                                <InfoRow label="Rent Due Day"     value={`Day ${lease.rent_due_day}`} />
                                <InfoRow label="Late Fee"         value={lease.late_fee_amount ? `$${Number(lease.late_fee_amount).toLocaleString()}` : "—"} />
                                <InfoRow label="Grace Period"     value={`${lease.late_fee_grace_days} days`} />
                            </section>

                            {/* Lease Terms */}
                            <section className="rounded-lg border p-4 space-y-1 md:col-span-2">
                                <div className="flex items-center gap-2 mb-3 text-sm font-semibold">
                                    <Home className="w-4 h-4 text-muted-foreground" />
                                    Lease Terms
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
                                    <InfoRow label="Lease Type"   value={lease.lease_type} />
                                    <InfoRow label="Auto Renew"   value={lease.auto_renew ? "Yes" : "No"} />
                                    <InfoRow label="Parking"      value={lease.parking_included ? "Included" : "Not included"} />
                                    <InfoRow label="Pets Allowed" value={lease.pets_allowed ? "Yes" : "No"} />
                                </div>
                                {lease.special_terms && (
                                    <div className="pt-2">
                                        <p className="text-xs text-muted-foreground mb-1">Special Terms</p>
                                        <p className="text-sm">{lease.special_terms}</p>
                                    </div>
                                )}
                            </section>
                        </div>
                    </TabsContent>

                    {/* ── Deposits ── */}
                    <TabsContent value="deposits" className="mt-4">
                        <DepositTab
                            leaseId={lease.id}
                            canManage={canManageDeposits(user?.role)}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
};
