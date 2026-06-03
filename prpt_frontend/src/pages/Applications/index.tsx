import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/layouts/admin-layout";
import { useGetApplications } from "@/hooks/Applications/useGetApplications";
import { useApproveApplication } from "@/hooks/Applications/useApproveApplication";
import { useRejectApplication } from "@/hooks/Applications/useRejectApplication";
import { ApproveApplicationParams, RentalApplicationReview, RentalApplicationStatus } from "@/types/application";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { CheckCircle2, ClipboardList, Eye, XCircle } from "lucide-react";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
};

const emptyApprove = (application?: RentalApplicationReview): ApproveApplicationParams => ({
    start_date: "",
    end_date: "",
    monthly_rent: application?.unit?.monthly_rent ? Number(application.unit.monthly_rent) : undefined,
    deposit_amount: application?.unit?.monthly_rent ? Number(application.unit.monthly_rent) : 0,
    rent_due_day: 1,
    late_fee_amount: 0,
    late_fee_grace_days: 5,
    lease_type: "fixed",
    parking_included: false,
    pets_allowed: false,
});

const applicantName = (application: RentalApplicationReview) =>
    application.applicant
        ? `${application.applicant.first_name} ${application.applicant.last_name}`
        : "—";

export default function ApplicationsPage() {
    const queryClient = useQueryClient();
    const [status, setStatus] = useState<RentalApplicationStatus | "all">("pending");
    const [search, setSearch] = useState("");
    const [viewing, setViewing] = useState<RentalApplicationReview | null>(null);
    const [approving, setApproving] = useState<RentalApplicationReview | null>(null);
    const [rejecting, setRejecting] = useState<RentalApplicationReview | null>(null);
    const [approveForm, setApproveForm] = useState<ApproveApplicationParams>(emptyApprove());
    const [rejectionReason, setRejectionReason] = useState("");

    const { data, isLoading } = useGetApplications({ status });
    const { mutate: approve, isPending: isApproving } = useApproveApplication();
    const { mutate: reject, isPending: isRejecting } = useRejectApplication();

    const applications = useMemo(() => {
        const q = search.trim().toLowerCase();
        return (data?.data ?? []).filter((application) => {
            if (!q) return true;
            const unit = application.unit?.unit_number?.toLowerCase() ?? "";
            const property = application.unit?.property?.name?.toLowerCase() ?? "";
            const applicant = applicantName(application).toLowerCase();
            return unit.includes(q) || property.includes(q) || applicant.includes(q);
        });
    }, [data?.data, search]);

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ["applications"] });

    const openApprove = (application: RentalApplicationReview) => {
        setApproving(application);
        setApproveForm(emptyApprove(application));
    };

    const submitApprove = () => {
        if (!approving) return;
        approve(
            { applicationId: approving.id, data: approveForm },
            {
                onSuccess: () => {
                    toast.success("Application approved");
                    invalidate();
                    setApproving(null);
                },
            }
        );
    };

    const submitReject = () => {
        if (!rejecting) return;
        reject(
            { applicationId: rejecting.id, data: { rejection_reason: rejectionReason } },
            {
                onSuccess: () => {
                    toast.success("Application rejected");
                    invalidate();
                    setRejecting(null);
                    setRejectionReason("");
                },
            }
        );
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Applications</h1>
                    <p className="text-muted-foreground text-sm">
                        Review rental applications and create draft leases
                    </p>
                </div>

                <div className="flex gap-3 items-center">
                    <Select value={status} onValueChange={(v) => setStatus(v as RentalApplicationStatus | "all")}>
                        <SelectTrigger className="w-44">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="all">All</SelectItem>
                        </SelectContent>
                    </Select>

                    <Input
                        placeholder="Search applicant, unit or property..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-80"
                    />
                </div>

                {isLoading ? (
                    <p className="text-muted-foreground text-sm">Loading applications...</p>
                ) : applications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                        <ClipboardList className="w-10 h-10 mb-3 opacity-30" />
                        <p className="font-medium">No applications found</p>
                    </div>
                ) : (
                    <div className="rounded-lg border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>Applicant</TableHead>
                                    <TableHead>Unit</TableHead>
                                    <TableHead>Property</TableHead>
                                    <TableHead>Income</TableHead>
                                    <TableHead>Employment</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {applications.map((application) => (
                                    <TableRow key={application.id}>
                                        <TableCell>
                                            <div className="font-medium">{applicantName(application)}</div>
                                            <div className="text-xs text-muted-foreground">{application.applicant?.email}</div>
                                        </TableCell>
                                        <TableCell>{application.unit?.unit_number ?? "—"}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {application.unit?.property?.name ?? "—"}
                                        </TableCell>
                                        <TableCell>${Number(application.annual_income).toLocaleString()}</TableCell>
                                        <TableCell className="capitalize">{application.employment_status}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`capitalize ${STATUS_COLORS[application.status] ?? ""}`}>
                                                {application.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="ghost" onClick={() => setViewing(application)}>
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    View
                                                </Button>
                                                {application.status === "pending" && (
                                                    <>
                                                        <Button size="sm" variant="outline" onClick={() => openApprove(application)}>
                                                            <CheckCircle2 className="w-4 h-4 mr-1" />
                                                            Approve
                                                        </Button>
                                                        <Button size="sm" variant="outline" onClick={() => setRejecting(application)}>
                                                            <XCircle className="w-4 h-4 mr-1" />
                                                            Reject
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            <ApplicationDetails application={viewing} onOpenChange={(open) => !open && setViewing(null)} />

            <ApproveDialog
                application={approving}
                form={approveForm}
                setForm={setApproveForm}
                isPending={isApproving}
                onSubmit={submitApprove}
                onOpenChange={(open) => !open && setApproving(null)}
            />

            <Dialog open={!!rejecting} onOpenChange={(open) => !open && setRejecting(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Reject Application</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label>Reason</Label>
                            <Textarea
                                rows={4}
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Explain why this application was rejected"
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button
                                onClick={submitReject}
                                disabled={isRejecting || !rejectionReason.trim()}
                            >
                                {isRejecting ? "Rejecting..." : "Reject Application"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}

const ApplicationDetails = ({
    application,
    onOpenChange,
}: {
    application: RentalApplicationReview | null;
    onOpenChange: (open: boolean) => void;
}) => (
    <Dialog open={!!application} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>Application Details</DialogTitle>
            </DialogHeader>
            {application && (
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <Info label="Applicant" value={applicantName(application)} />
                    <Info label="Email" value={application.applicant?.email} />
                    <Info label="Phone" value={application.applicant?.phone} />
                    <Info label="Current Address" value={application.current_address} />
                    <Info label="Annual Income" value={`$${Number(application.annual_income).toLocaleString()}`} />
                    <Info label="Employment" value={application.employment_status} />
                    <Info label="Employer" value={application.employer_name} />
                    <Info label="Unit" value={`Unit ${application.unit?.unit_number ?? "—"}`} />
                    <div className="md:col-span-2">
                        <p className="text-xs text-muted-foreground mb-2">References</p>
                        {application.references?.length ? (
                            <div className="rounded-lg border divide-y">
                                {application.references.map((reference, index) => (
                                    <div key={`${reference.phone}-${index}`} className="p-3">
                                        <p className="font-medium">{reference.name}</p>
                                        <p className="text-muted-foreground">{reference.phone}</p>
                                        {reference.relationship && (
                                            <p className="text-muted-foreground">{reference.relationship}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">No references provided</p>
                        )}
                    </div>
                    {application.rejection_reason && (
                        <Info label="Rejection Reason" value={application.rejection_reason} className="md:col-span-2" />
                    )}
                </div>
            )}
        </DialogContent>
    </Dialog>
);

const ApproveDialog = ({
    application,
    form,
    setForm,
    isPending,
    onSubmit,
    onOpenChange,
}: {
    application: RentalApplicationReview | null;
    form: ApproveApplicationParams;
    setForm: (form: ApproveApplicationParams) => void;
    isPending: boolean;
    onSubmit: () => void;
    onOpenChange: (open: boolean) => void;
}) => {
    const set = (key: keyof ApproveApplicationParams, value: string | number | boolean) =>
        setForm({ ...form, [key]: value });

    return (
        <Dialog open={!!application} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Approve Application</DialogTitle>
                </DialogHeader>
                <div className="grid md:grid-cols-2 gap-4">
                    <Field label="Start Date">
                        <Input type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} />
                    </Field>
                    <Field label="End Date">
                        <Input type="date" value={form.end_date} onChange={(e) => set("end_date", e.target.value)} />
                    </Field>
                    <Field label="Monthly Rent">
                        <Input type="number" value={form.monthly_rent ?? ""} onChange={(e) => set("monthly_rent", Number(e.target.value))} />
                    </Field>
                    <Field label="Deposit Amount">
                        <Input type="number" value={form.deposit_amount} onChange={(e) => set("deposit_amount", Number(e.target.value))} />
                    </Field>
                    <Field label="Rent Due Day">
                        <Input type="number" min={1} max={31} value={form.rent_due_day ?? 1} onChange={(e) => set("rent_due_day", Number(e.target.value))} />
                    </Field>
                    <Field label="Lease Type">
                        <Select value={form.lease_type ?? "fixed"} onValueChange={(v) => set("lease_type", v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="fixed">Fixed</SelectItem>
                                <SelectItem value="month-to-month">Month-to-Month</SelectItem>
                                <SelectItem value="renewal">Renewal</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field label="Late Fee">
                        <Input type="number" value={form.late_fee_amount ?? 0} onChange={(e) => set("late_fee_amount", Number(e.target.value))} />
                    </Field>
                    <Field label="Grace Days">
                        <Input type="number" value={form.late_fee_grace_days ?? 5} onChange={(e) => set("late_fee_grace_days", Number(e.target.value))} />
                    </Field>
                    <div className="md:col-span-2 space-y-1.5">
                        <Label>Special Terms</Label>
                        <Textarea value={form.special_terms ?? ""} onChange={(e) => set("special_terms", e.target.value)} />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                        <Button
                            onClick={onSubmit}
                            disabled={isPending || !form.start_date || !form.end_date || !form.deposit_amount}
                        >
                            {isPending ? "Approving..." : "Approve and Create Draft Lease"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const Info = ({ label, value, className }: { label: string; value?: React.ReactNode; className?: string }) => (
    <div className={className}>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value || "—"}</p>
    </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="space-y-1.5">
        <Label>{label}</Label>
        {children}
    </div>
);
