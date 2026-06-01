import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import AdminLayout from "@/components/layouts/admin-layout.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { useGetPaymentSchedules } from "@/hooks/Payment/useGetPaymentSchedules.ts";
import { useRecordPayment } from "@/hooks/Payment/useRecordPayment.ts";
import { useDownloadReceipt } from "@/hooks/Payment/useDownloadReceipt.ts";
import { RecordPaymentModal } from "@/components/modals/Payment/record-payment-modal.tsx";
import { PaymentSchedulesTable } from "@/components/payments/payment-schedules-table.tsx";
import { PaymentSchedule, PaymentStatus, RecordPaymentParams } from "@/types/payment.ts";
import { toast } from "sonner";
import { useAuth } from "@/hooks/Auth/useAuth.ts";
import {LayoutDashboard} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {useNavigate} from "react-router-dom";

const canRecordPayments = (role?: string) =>
    role === "company-admin" || role === "property-manager" || role === "super-admin";

export default function PaymentsPage() {
    const { user } = useAuth();
    const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">("pending");
    const [selectedSchedule, setSelectedSchedule] = useState<PaymentSchedule | null>(null);
    const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
    const [lastReceiptId, setLastReceiptId] = useState<number | null>(null);
    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const { mutate: recordPayment, isPending: isRecording } = useRecordPayment();
    const { mutate: downloadReceipt, isPending: isDownloading } = useDownloadReceipt();

    const [search, setSearch] = useState("");

    const filters = {
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(search.trim() && { search: search.trim() }),
    };

    const { data, isLoading } = useGetPaymentSchedules(filters);

    // client-side filter across resident name, unit number, property name
    const schedules = (data?.data ?? []).filter((s) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        const residentName = `${s?.resident?.first_name} ${s?.resident?.last_name}`.toLowerCase();
        const unit = s.unit?.unit_number.toLowerCase();
        const property = s.unit?.property?.name.toLowerCase();
        return residentName.includes(q) || unit?.includes(q) || property?.includes(q);
    });

    const invalidateQueries = () => {
        queryClient.invalidateQueries({ queryKey: ['paymentSchedules'] });
    };

    const openRecordModal = (schedule: PaymentSchedule) => {
        setSelectedSchedule(schedule);
        setIsRecordModalOpen(true);
    };

    const handleRecordPayment = (formData: RecordPaymentParams) => {
        if (!selectedSchedule) return;

        recordPayment(
            { scheduleId: selectedSchedule.id, data: formData },
            {
                onSuccess: (res) => {
                    invalidateQueries();
                    setIsRecordModalOpen(false);
                    setSelectedSchedule(null);
                    const receiptId = res.data?.receipt?.id;
                    if (receiptId) setLastReceiptId(receiptId);
                    toast.success(res.message || "Payment recorded successfully", {
                        description: receiptId
                            ? "Receipt is ready to download."
                            : undefined,
                    });
                },
            }
        );
    };

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
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Payments</h1>
                        <p className="text-muted-foreground text-sm">
                            Manage rent payment schedules and record payments
                        </p>
                    </div>
                    {lastReceiptId && (
                        <Button
                            variant="outline"
                            onClick={() =>
                                handleDownloadReceipt(lastReceiptId, `Receipt-${lastReceiptId}.pdf`)
                            }
                        >
                            Download Last Receipt
                        </Button>
                    )}
                </div>

                <div className="flex gap-3 items-center">
                    <Select
                        value={statusFilter}
                        onValueChange={(v) => setStatusFilter(v as PaymentStatus | "all")}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="all">All</SelectItem>
                        </SelectContent>
                    </Select>

                    <Input
                        placeholder="Search resident, unit or property..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-72"
                    />

                    <Button
                        variant="outline"
                        className="ml-auto"
                        onClick={() => navigate("/payments/overview")}
                    >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Overview
                    </Button>
                </div>

                {isLoading ? (
                    <p className="text-muted-foreground">Loading payments...</p>
                ) : (
                    <PaymentSchedulesTable
                        schedules={schedules}
                        showRecordButton={canRecordPayments(user?.role)}
                        onRecordPayment={openRecordModal}
                        onDownloadReceipt={handleDownloadReceipt}
                        isDownloading={isDownloading}
                    />
                )}

                <RecordPaymentModal
                    open={isRecordModalOpen}
                    onOpenChange={setIsRecordModalOpen}
                    onSubmit={handleRecordPayment}
                    isPending={isRecording}
                    paymentSchedule={selectedSchedule}
                />
            </div>
        </AdminLayout>
    );
}
