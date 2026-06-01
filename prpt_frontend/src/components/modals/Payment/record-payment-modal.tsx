import { FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormModal } from "@/components/form-modal";
import { PaymentSchedule, RecordPaymentParams } from "@/types/payment.ts";

interface RecordPaymentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: RecordPaymentParams) => void;
    isPending?: boolean;
    paymentSchedule: PaymentSchedule | null;
}

export function RecordPaymentModal({
    open,
    onOpenChange,
    onSubmit,
    isPending,
    paymentSchedule,
}: RecordPaymentModalProps) {
    const totalDue = paymentSchedule?.total_due ?? paymentSchedule?.amount ?? 0;

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        onSubmit({
            amount_paid: Number(formData.get("amount_paid")),
            payment_date: (formData.get("payment_date") as string) || undefined,
            payment_method: formData.get("payment_method") as RecordPaymentParams["payment_method"],
            transaction_id: (formData.get("transaction_id") as string) || undefined,
        });
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <FormModal
            open={open}
            onOpenChange={onOpenChange}
            title="Record Payment"
            description={
                paymentSchedule
                    ? `Unit ${paymentSchedule.unit?.unit_number} — Due ${new Date(paymentSchedule.due_date).toLocaleDateString()}`
                    : undefined
            }
            onSubmit={handleFormSubmit as any}
            submitText="Record Payment"
            size="md"
            isSubmitting={isPending}
        >
            <div className="grid gap-4">
                <div className="rounded-md bg-muted p-3 text-sm">
                    <p>
                        <strong>Amount due:</strong> ${Number(totalDue).toFixed(2)}
                        {paymentSchedule?.late_fee ? (
                            <span className="text-muted-foreground">
                                {" "}(includes ${Number(paymentSchedule.late_fee).toFixed(2)} late fee)
                            </span>
                        ) : null}
                    </p>
                </div>

                <div>
                    <Label htmlFor="amount_paid">Amount Paid</Label>
                    <Input
                        id="amount_paid"
                        name="amount_paid"
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        defaultValue={totalDue}
                        className="mt-2"
                    />
                </div>

                <div>
                    <Label htmlFor="payment_date">Payment Date</Label>
                    <Input
                        id="payment_date"
                        name="payment_date"
                        type="date"
                        defaultValue={today}
                        className="mt-2"
                    />
                </div>

                <div>
                    <Label htmlFor="payment_method">Payment Method</Label>
                    <select
                        name="payment_method"
                        id="payment_method"
                        required
                        className="mt-2 flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm"
                        defaultValue="bank_transfer"
                    >
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="card">Card</option>
                        <option value="cash">Cash</option>
                    </select>
                </div>

                <div>
                    <Label htmlFor="transaction_id">Transaction ID (optional)</Label>
                    <Input
                        id="transaction_id"
                        name="transaction_id"
                        type="text"
                        className="mt-2"
                        placeholder="Reference number"
                    />
                </div>
            </div>
        </FormModal>
    );
}
