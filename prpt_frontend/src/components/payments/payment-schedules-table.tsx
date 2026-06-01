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
import { Download, DollarSign } from "lucide-react";
import { PaymentSchedule } from "@/types/payment.ts";

interface PaymentSchedulesTableProps {
    schedules: PaymentSchedule[];
    showRecordButton?: boolean;
    onRecordPayment?: (schedule: PaymentSchedule) => void;
    onDownloadReceipt?: (documentId: number, filename: string) => void;
    isDownloading?: boolean;
}

const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    paid: "bg-green-100 text-green-800 border-green-200",
    overdue: "bg-red-100 text-red-800 border-red-200",
};

export function PaymentSchedulesTable({
    schedules,
    showRecordButton = false,
    onRecordPayment,
    onDownloadReceipt,
    isDownloading = false,
}: PaymentSchedulesTableProps) {
    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Unit</TableHead>
                        <TableHead>Resident</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Late Fee</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-32"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {schedules.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                No payments found
                            </TableCell>
                        </TableRow>
                    ) : (
                        schedules.map((schedule) => {
                            const receiptId =
                                schedule.latest_transaction?.receipt_document_id
                                ?? schedule.latest_transaction?.receipt?.id;
                            const receiptName =
                                schedule.latest_transaction?.receipt?.original_name
                                ?? `Receipt-${schedule.latest_transaction?.id}.pdf`;

                            return (
                                <TableRow key={schedule.id}>
                                    <TableCell>
                                        <div className="font-medium">
                                            {schedule.unit?.unit_number ?? "—"}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {schedule.unit?.property?.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {schedule.resident
                                            ? `${schedule.resident.first_name} ${schedule.resident.last_name}`
                                            : "—"}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(schedule.due_date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>${Number(schedule.amount).toFixed(2)}</TableCell>
                                    <TableCell>
                                        {schedule.late_fee
                                            ? `$${Number(schedule.late_fee).toFixed(2)}`
                                            : "—"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={statusColors[schedule.status] ?? ""}>
                                            {schedule.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            {showRecordButton && schedule.status !== "paid" && onRecordPayment && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => onRecordPayment(schedule)}
                                                >
                                                    <DollarSign className="h-4 w-4 mr-1" />
                                                    Record
                                                </Button>
                                            )}
                                            {schedule.status === "paid" && receiptId && onDownloadReceipt && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={isDownloading}
                                                    onClick={() => onDownloadReceipt(receiptId, receiptName)}
                                                >
                                                    <Download className="h-4 w-4 mr-1" />
                                                    Receipt
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
