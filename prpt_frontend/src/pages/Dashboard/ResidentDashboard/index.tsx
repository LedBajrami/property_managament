import AdminLayout from "@/components/layouts/admin-layout.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetMyPaymentSchedules } from "@/hooks/Payment/useGetMyPaymentSchedules.ts";
import { useDownloadReceipt } from "@/hooks/Payment/useDownloadReceipt.ts";
import { PaymentSchedulesTable } from "@/components/payments/payment-schedules-table.tsx";
import { toast } from "sonner";

export default function ResidentDashboard() {
    const { data: pendingData, isLoading: pendingLoading } = useGetMyPaymentSchedules({ status: "pending" });
    const { data: paidData, isLoading: paidLoading } = useGetMyPaymentSchedules({ status: "paid" });
    const { data: overdueData, isLoading: overdueLoading } = useGetMyPaymentSchedules({ status: "overdue" });

    const { mutate: downloadReceipt, isPending: isDownloading } = useDownloadReceipt();

    const pending = pendingData?.data ?? [];
    const paid = paidData?.data ?? [];
    const overdue = overdueData?.data ?? [];

    const handleDownloadReceipt = (documentId: number, filename: string) => {
        downloadReceipt(
            { documentId, filename },
            {
                onError: () => toast.error("Failed to download receipt"),
            }
        );
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">My Payments</h1>
                    <p className="text-muted-foreground text-sm">
                        View upcoming rent, payment history, and overdue balances
                    </p>
                </div>

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
