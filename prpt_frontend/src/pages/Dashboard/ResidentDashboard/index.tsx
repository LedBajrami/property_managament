import AdminLayout from "@/components/layouts/admin-layout.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useGetMyPaymentSchedules } from "@/hooks/Payment/useGetMyPaymentSchedules.ts";
import { useDownloadReceipt } from "@/hooks/Payment/useDownloadReceipt.ts";
import { useDownloadDocument } from "@/hooks/Document/useDownloadDocument.ts";
import { useGetLeases } from "@/hooks/Leases/useGetLeases.ts";
import { PaymentSchedulesTable } from "@/components/payments/payment-schedules-table.tsx";
import { toast } from "sonner";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ResidentDashboard() {
    const navigate = useNavigate();
    const { data: pendingData, isLoading: pendingLoading } = useGetMyPaymentSchedules({ status: "pending" });
    const { data: paidData, isLoading: paidLoading } = useGetMyPaymentSchedules({ status: "paid" });
    const { data: overdueData, isLoading: overdueLoading } = useGetMyPaymentSchedules({ status: "overdue" });
    const { data: leasesData, isLoading: leasesLoading } = useGetLeases();

    const { mutate: downloadReceipt, isPending: isDownloading } = useDownloadReceipt();
    const { mutate: downloadDocument, isPending: isDownloadingDocument } = useDownloadDocument();

    const pending = pendingData?.data ?? [];
    const paid = paidData?.data ?? [];
    const overdue = overdueData?.data ?? [];
    const currentLease = (leasesData?.data ?? []).find((lease) => lease.status === "active")
        ?? (leasesData?.data ?? []).find((lease) => lease.status === "draft");
    const leaseDocument = currentLease?.documents?.find((document) => document.document_type === "lease_agreement")
        ?? currentLease?.documents?.[0];

    const handleDownloadReceipt = (documentId: number, filename: string) => {
        downloadReceipt(
            { documentId, filename },
            {
                onError: () => toast.error("Failed to download receipt"),
            }
        );
    };

    const handleDownloadLeaseDocument = () => {
        if (!leaseDocument) return;

        downloadDocument(
            {
                documentId: leaseDocument.id,
                filename: leaseDocument.original_name ?? `Lease-${currentLease?.id}.pdf`,
            },
            {
                onError: () => toast.error("Failed to download lease document"),
            }
        );
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">Resident Dashboard</h1>
                            <p className="text-muted-foreground text-sm">
                                View lease details, upcoming rent, payment history, and overdue balances
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => navigate("/my-applications")}>
                                My Applications
                            </Button>
                            <Button onClick={() => navigate("/browse")}>
                                Browse Properties
                            </Button>
                        </div>
                    </div>
                </div>

                <section className="rounded-lg border p-4">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                                Current Lease
                            </div>
                            {leasesLoading ? (
                                <p className="text-sm text-muted-foreground">Loading lease...</p>
                            ) : currentLease ? (
                                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                    <LeaseInfo label="Property" value={currentLease.unit?.property?.name} />
                                    <LeaseInfo label="Unit" value={currentLease.unit?.unit_number} />
                                    <LeaseInfo label="Monthly Rent" value={`$${Number(currentLease.monthly_rent).toLocaleString()}`} />
                                    <LeaseInfo label="Status" value={currentLease.status} />
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No current lease found.</p>
                            )}
                        </div>

                        {leaseDocument && (
                            <Button
                                variant="outline"
                                onClick={handleDownloadLeaseDocument}
                                disabled={isDownloadingDocument}
                            >
                                Download Lease
                            </Button>
                        )}
                    </div>
                </section>

                <Tabs defaultValue="upcoming" className="w-full">
                    <TabsList>
                        <TabsTrigger value="upcoming">
                            Upcoming ({pending.length})
                        </TabsTrigger>
                        <TabsTrigger value="overdue">
                            Overdue ({overdue.length})
                        </TabsTrigger>
                        <TabsTrigger value="history">
                            History ({paid.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upcoming" className="mt-4">
                        {pendingLoading ? (
                            <p className="text-muted-foreground">Loading...</p>
                        ) : (
                            <PaymentSchedulesTable schedules={pending} />
                        )}
                    </TabsContent>

                    <TabsContent value="overdue" className="mt-4">
                        {overdueLoading ? (
                            <p className="text-muted-foreground">Loading...</p>
                        ) : (
                            <PaymentSchedulesTable schedules={overdue} />
                        )}
                    </TabsContent>

                    <TabsContent value="history" className="mt-4">
                        {paidLoading ? (
                            <p className="text-muted-foreground">Loading...</p>
                        ) : (
                            <PaymentSchedulesTable
                                schedules={paid}
                                onDownloadReceipt={handleDownloadReceipt}
                                isDownloading={isDownloading}
                            />
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
}

const LeaseInfo = ({ label, value }: { label: string; value?: string | number }) => (
    <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium capitalize">{value ?? "—"}</p>
    </div>
);
