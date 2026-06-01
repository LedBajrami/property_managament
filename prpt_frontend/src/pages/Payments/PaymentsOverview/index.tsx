import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/layouts/admin-layout.tsx";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useGetPaymentSchedules } from "@/hooks/Payment/useGetPaymentSchedules.ts";
import { PaymentOverview } from "@/components/payments/payment-overview.tsx";

export default function PaymentOverviewPage() {
    const navigate = useNavigate();
    const { data, isLoading } = useGetPaymentSchedules();

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/payments")}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Payment Overview</h1>
                        <p className="text-muted-foreground text-sm">
                            Collection summary by property and unit
                        </p>
                    </div>
                </div>

                {isLoading ? (
                    <p className="text-muted-foreground">Loading...</p>
                ) : (
                    <PaymentOverview schedules={data?.data ?? []} />
                )}
            </div>
        </AdminLayout>
    );
}