import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetDepositSummary } from "@/hooks/Deposit/useGetDepositSummary.ts";
import { useRecordDepositPaid } from "@/hooks/Deposit/useRecordDepositPaid.ts";
import { useRecordDepositReturn } from "@/hooks/Deposit/useRecordDepositReturn.ts";
import { RecordDepositPaidParams, RecordDepositReturnParams } from "@/types/deposit.ts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import {
    ArrowDownLeft,
    ArrowUpRight,
    CheckCircle2,
    CircleDollarSign,
    Clock,
} from "lucide-react";
import { toast } from "sonner";

interface DepositTabProps {
    leaseId: number;
    canManage: boolean; // admin or property-manager
}

type ModalType = "paid" | "return" | null;

const PAYMENT_METHODS = [
    { value: "cash",          label: "Cash" },
    { value: "card",          label: "Card" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "check",         label: "Check" },
];

const fmt = (d: string) => format(new Date(d), "MMM d, yyyy");

const emptyPaid  = (): RecordDepositPaidParams   => ({ amount: 0, transaction_date: "", payment_method: "cash" });
const emptyReturn = (): RecordDepositReturnParams => ({ amount: 0, transaction_date: "", payment_method: "cash" });

export const DepositTab = ({ leaseId, canManage }: DepositTabProps) => {
    const queryClient = useQueryClient();
    const { data, isLoading } = useGetDepositSummary(leaseId);
    const { mutate: recordPaid,   isPending: isPaying }    = useRecordDepositPaid();
    const { mutate: recordReturn, isPending: isReturning } = useRecordDepositReturn();

    const [modal, setModal]         = useState<ModalType>(null);
    const [paidForm, setPaidForm]   = useState<RecordDepositPaidParams>(emptyPaid());
    const [returnForm, setReturnForm] = useState<RecordDepositReturnParams>(emptyReturn());

    const summary = data?.data;

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ["deposit", leaseId] });

    const handleRecordPaid = () => {
        recordPaid(
            { leaseId, data: paidForm },
            {
                onSuccess: (res) => {
                    toast.success(res.message || "Deposit payment recorded");
                    invalidate();
                    setModal(null);
                    setPaidForm(emptyPaid());
                },
                onError: (err) => toast.error(err.message || "Failed to record deposit payment"),
            }
        );
    };

    const handleRecordReturn = () => {
        recordReturn(
            { leaseId, data: returnForm },
            {
                onSuccess: (res) => {
                    toast.success(res.message || "Deposit return recorded");
                    invalidate();
                    setModal(null);
                    setReturnForm(emptyReturn());
                },
                onError: (err) => toast.error(err.message || "Failed to record deposit return"),
            }
        );
    };

    if (isLoading) return <p className="text-muted-foreground text-sm py-6">Loading deposit info...</p>;
    if (!summary)  return <p className="text-muted-foreground text-sm py-6">No deposit data available.</p>;

    const depositAmount  = Number(summary.deposit_amount);
    const totalPaid      = Number(summary.total_paid);
    const totalReturned  = Number(summary.total_returned);
    const balance        = Number(summary.balance);
    const paidPercent    = depositAmount > 0 ? Math.min((totalPaid / depositAmount) * 100, 100) : 0;

    return (
        <div className="space-y-6">
            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SummaryCard
                    label="Deposit Required"
                    value={`$${depositAmount.toLocaleString()}`}
                    icon={<CircleDollarSign className="w-4 h-4" />}
                    color="text-zinc-700"
                />
                <SummaryCard
                    label="Total Paid"
                    value={`$${totalPaid.toLocaleString()}`}
                    icon={<ArrowDownLeft className="w-4 h-4" />}
                    color="text-emerald-600"
                    badge={summary.is_paid
                        ? <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">Fully Paid</Badge>
                        : <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">Partial</Badge>
                    }
                />
                <SummaryCard
                    label="Total Returned"
                    value={`$${totalReturned.toLocaleString()}`}
                    icon={<ArrowUpRight className="w-4 h-4" />}
                    color="text-blue-600"
                    badge={summary.is_returned
                        ? <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">Fully Returned</Badge>
                        : null
                    }
                />
                <SummaryCard
                    label="Balance Held"
                    value={`$${balance.toLocaleString()}`}
                    icon={<Clock className="w-4 h-4" />}
                    color="text-zinc-600"
                />
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Deposit collection progress</span>
                    <span>{paidPercent.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${paidPercent}%` }}
                    />
                </div>
            </div>

            {/* Action buttons */}
            {canManage && (
                <div className="flex gap-3">
                    {!summary.is_paid && (
                        <Button size="sm" onClick={() => setModal("paid")}>
                            <ArrowDownLeft className="w-4 h-4 mr-1" />
                            Record Payment
                        </Button>
                    )}
                    {summary.is_paid && !summary.is_returned && balance > 0 && (
                        <Button size="sm" variant="outline" onClick={() => setModal("return")}>
                            <ArrowUpRight className="w-4 h-4 mr-1" />
                            Record Return
                        </Button>
                    )}
                    {summary.is_paid && summary.is_returned && (
                        <div className="flex items-center gap-2 text-sm text-emerald-600">
                            <CheckCircle2 className="w-4 h-4" />
                            Deposit fully paid and returned
                        </div>
                    )}
                </div>
            )}

            {/* Transaction history */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Transaction History
                </h3>

                {summary.transactions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No transactions recorded yet.</p>
                ) : (
                    <div className="rounded-lg border divide-y">
                        {summary.transactions.map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        tx.type === "paid"
                                            ? "bg-emerald-100 text-emerald-600"
                                            : "bg-blue-100 text-blue-600"
                                    }`}>
                                        {tx.type === "paid"
                                            ? <ArrowDownLeft className="w-4 h-4" />
                                            : <ArrowUpRight className="w-4 h-4" />
                                        }
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium capitalize">
                                            {tx.type === "paid" ? "Deposit Payment" : "Deposit Return"}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {fmt(tx.transaction_date)} · {tx.payment_method.replace("_", " ")}
                                            {tx.transaction_id && ` · Ref: ${tx.transaction_id}`}
                                        </p>
                                        {tx.notes && (
                                            <p className="text-xs text-muted-foreground italic">{tx.notes}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-semibold ${tx.type === "paid" ? "text-emerald-600" : "text-blue-600"}`}>
                                        {tx.type === "paid" ? "+" : "-"}${Number(tx.amount).toLocaleString()}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        by {tx.processed_by.first_name} {tx.processed_by.last_name}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Record Paid Modal */}
            <Dialog open={modal === "paid"} onOpenChange={(o) => !o && setModal(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Record Deposit Payment</DialogTitle>
                    </DialogHeader>
                    <DepositForm
                        form={paidForm}
                        onChange={(f) => setPaidForm(f as RecordDepositPaidParams)}
                        onSubmit={handleRecordPaid}
                        isPending={isPaying}
                        submitLabel="Record Payment"
                        maxAmount={depositAmount - totalPaid}
                    />
                </DialogContent>
            </Dialog>

            {/* Record Return Modal */}
            <Dialog open={modal === "return"} onOpenChange={(o) => !o && setModal(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Record Deposit Return</DialogTitle>
                    </DialogHeader>
                    <DepositForm
                        form={returnForm}
                        onChange={(f) => setReturnForm(f as RecordDepositReturnParams)}
                        onSubmit={handleRecordReturn}
                        isPending={isReturning}
                        submitLabel="Record Return"
                        maxAmount={balance}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
};

// ── Sub-components ────────────────────────────────────────────────────────────

interface SummaryCardProps {
    label: string;
    value: string;
    icon: React.ReactNode;
    color: string;
    badge?: React.ReactNode;
}

const SummaryCard = ({ label, value, icon, color, badge }: SummaryCardProps) => (
    <div className="rounded-lg border p-4 space-y-2">
        <div className={`flex items-center gap-2 text-xs text-muted-foreground`}>
            <span className={color}>{icon}</span>
            {label}
        </div>
        <p className={`text-xl font-bold ${color}`}>{value}</p>
        {badge}
    </div>
);

interface DepositFormProps {
    form: RecordDepositPaidParams | RecordDepositReturnParams;
    onChange: (f: RecordDepositPaidParams | RecordDepositReturnParams) => void;
    onSubmit: () => void;
    isPending: boolean;
    submitLabel: string;
    maxAmount: number;
}

const DepositForm = ({ form, onChange, onSubmit, isPending, submitLabel, maxAmount }: DepositFormProps) => {
    const set = (key: string, value: string | number) => onChange({ ...form, [key]: value });

    return (
        <div className="space-y-4">
            <div className="space-y-1.5">
                <Label>Amount <span className="text-muted-foreground text-xs">(max ${maxAmount.toLocaleString()})</span></Label>
                <Input
                    type="number"
                    min={0.01}
                    max={maxAmount}
                    step={0.01}
                    value={form.amount || ""}
                    onChange={(e) => set("amount", parseFloat(e.target.value))}
                    placeholder="0.00"
                />
            </div>

            <div className="space-y-1.5">
                <Label>Transaction Date</Label>
                <Input
                    type="date"
                    value={form.transaction_date}
                    onChange={(e) => set("transaction_date", e.target.value)}
                />
            </div>

            <div className="space-y-1.5">
                <Label>Payment Method</Label>
                <Select
                    value={form.payment_method}
                    onValueChange={(v) => set("payment_method", v)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {PAYMENT_METHODS.map((m) => (
                            <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-1.5">
                <Label>Reference / Transaction ID <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Input
                    value={form.transaction_id ?? ""}
                    onChange={(e) => set("transaction_id", e.target.value)}
                    placeholder="e.g. TXN-12345"
                />
            </div>

            <div className="space-y-1.5">
                <Label>Notes <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Textarea
                    value={form.notes ?? ""}
                    onChange={(e) => set("notes", e.target.value)}
                    placeholder="Any notes..."
                    rows={3}
                />
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <Button
                    onClick={onSubmit}
                    disabled={isPending || !form.amount || !form.transaction_date}
                >
                    {isPending ? "Saving..." : submitLabel}
                </Button>
            </div>
        </div>
    );
};