import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetPublicUnit } from "@/hooks/Public/useGetPublicUnit";
import { useApplyForProperty } from "@/hooks/Public/useApplyForProperty";
import { SubmitApplicationParams, EmploymentStatus, ApplicationReference } from "@/types/publicProperty";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    BedDouble, Bath, Ruler, MapPin, Building2,
    ArrowLeft, CheckCircle2, Plus, Trash2, ParkingSquare,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
    available:   "bg-primary/10 text-primary border-primary/20",
    occupied:    "bg-muted text-muted-foreground border-border",
    maintenance: "bg-yellow-100 text-yellow-700 border-yellow-200",
};

const EMPLOYMENT_OPTIONS: { value: EmploymentStatus; label: string }[] = [
    { value: "employed",      label: "Employed" },
    { value: "self-employed", label: "Self-employed" },
    { value: "unemployed",    label: "Unemployed" },
    { value: "student",       label: "Student" },
    { value: "retired",       label: "Retired" },
];

const emptyRef = (): ApplicationReference => ({ name: "", phone: "", relationship: "" });

type DetailItem = {
    icon: LucideIcon;
    label: string;
    value: React.ReactNode;
};

export const UnitDetailPage = () => {
    const { id, unitId } = useParams<{ id: string; unitId: string }>();
    const navigate = useNavigate();

    const { data, isLoading } = useGetPublicUnit(
        id ? Number(id) : undefined,
        unitId ? Number(unitId) : undefined
    );
    const unit = data?.data;

    const [open, setOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSuccess = () => {
        setOpen(false);
        setSubmitted(true);
    };

    if (isLoading) {
        return (
            <PageShell onBack={() => navigate(`/browse/${id}`)}>
                <div className="max-w-3xl mx-auto px-6 py-10 animate-pulse space-y-4">
                    <div className="h-8 w-48 bg-muted rounded" />
                    <div className="h-4 w-64 bg-muted rounded" />
                    <div className="h-56 bg-muted rounded-2xl mt-6" />
                </div>
            </PageShell>
        );
    }

    if (!unit) {
        return (
            <PageShell onBack={() => navigate(`/browse/${id}`)}>
                <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                    <Building2 className="w-12 h-12 mb-4 opacity-25" />
                    <p className="font-semibold text-muted-foreground">Unit not found</p>
                </div>
            </PageShell>
        );
    }

    const amenities: string[] = Array.isArray(unit.property?.amenities) ? unit.property!.amenities! : [];
    const galleryPhotos = unit.gallery?.length
        ? unit.gallery
        : unit.thumbnail_url
            ? [{ id: unit.id, url: unit.thumbnail_url, original_name: `Unit ${unit.unit_number} thumbnail` }]
            : [];

    return (
        <PageShell onBack={() => navigate(`/browse/${id}`)}>
            <div className="max-w-3xl mx-auto px-6 py-10">
                {galleryPhotos.length > 0 && (
                    <section className="mb-8">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-base font-semibold text-foreground">Unit photos</h2>
                            <span className="text-xs text-muted-foreground">
                                {galleryPhotos.length} photo{galleryPhotos.length !== 1 ? "s" : ""}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {galleryPhotos.map((photo, index) => (
                                <div
                                    key={photo.id}
                                    className={`${index === 0 ? "col-span-2 md:row-span-2 h-72" : "h-36"} rounded-2xl border border-border bg-muted/30 overflow-hidden`}
                                >
                                    <img
                                        src={photo.url}
                                        alt={photo.original_name ?? `Unit ${unit.unit_number} photo`}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                                <Building2 className="w-3.5 h-3.5" />
                                {unit.property?.name}
                            </p>
                            <h1 className="text-3xl font-bold text-foreground tracking-tight">
                                Unit {unit.unit_number}
                            </h1>
                            {unit.property?.address && (
                                <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-2">
                                    <MapPin className="w-4 h-4 shrink-0" />
                                    {unit.property.address}
                                </div>
                            )}
                        </div>
                        <Badge
                            variant="outline"
                            className={`text-sm px-3 py-1 capitalize ${STATUS_COLORS[unit.status] ?? ""}`}
                        >
                            {unit.status}
                        </Badge>
                    </div>
                </div>

                {/* Rent callout */}
                <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 mb-8 flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <p className="text-sm text-primary font-medium">Monthly rent</p>
                        <p className="text-4xl font-bold text-primary mt-1">
                            ${Number(unit.monthly_rent).toLocaleString()}
                            <span className="text-base font-normal text-primary">/mo</span>
                        </p>
                    </div>

                    {submitted ? (
                        <div className="flex items-center gap-2 text-primary bg-primary/10 px-4 py-2 rounded-xl text-sm font-medium">
                            <CheckCircle2 className="w-4 h-4" />
                            Application submitted!
                        </div>
                    ) : unit.status === "available" ? (
                        <Button
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            onClick={() => setOpen(true)}
                        >
                            Apply now
                        </Button>
                    ) : (
                        <span className="text-sm text-muted-foreground">Not available for applications</span>
                    )}
                </div>

                {/* Unit specs */}
                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                    {([
                        { icon: BedDouble, label: "Bedrooms", value: unit.bedrooms === 0 ? "Studio" : `${unit.bedrooms} bed${unit.bedrooms !== 1 ? "s" : ""}` },
                        { icon: Bath,      label: "Bathrooms", value: `${unit.bathrooms} bath${unit.bathrooms !== 1 ? "s" : ""}` },
                        unit.size_sqm && { icon: Ruler, label: "Size", value: `${unit.size_sqm} m²` },
                    ].filter(Boolean) as DetailItem[])
                        .map(({ icon: Icon, label, value }) => (
                            <div key={label} className="bg-muted/30 border border-border rounded-xl p-4 flex items-center gap-3">
                                <Icon className="w-5 h-5 text-primary shrink-0" />
                                <div>
                                    <p className="text-xs text-muted-foreground">{label}</p>
                                    <p className="font-semibold text-foreground text-sm">{value}</p>
                                </div>
                            </div>
                        ))}
                </div>

                {/* Property amenities */}
                {amenities.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-base font-semibold text-foreground mb-3">Building amenities</h2>
                        <div className="flex flex-wrap gap-2">
                            {amenities.map((a) => (
                                <span key={a} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/30 border border-border text-xs text-muted-foreground">
                                    <CheckCircle2 className="w-3 h-3 text-primary" />
                                    {a}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Property details */}
                {unit.property && (
                    <section>
                        <h2 className="text-base font-semibold text-foreground mb-3">Property info</h2>
                        <div className="grid sm:grid-cols-2 gap-3">
                            {([
                                unit.property.property_type && { icon: Building2, label: "Type", value: unit.property.property_type },
                                unit.property.parking_spaces != null && { icon: ParkingSquare, label: "Parking", value: `${unit.property.parking_spaces} space${unit.property.parking_spaces !== 1 ? "s" : ""}` },
                            ].filter(Boolean) as DetailItem[])
                                .map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="flex items-center gap-3 text-sm p-3 rounded-xl bg-muted/30 border border-border">
                                        <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                                        <span className="text-muted-foreground">{label}</span>
                                        <span className="ml-auto font-medium text-foreground capitalize">{value}</span>
                                    </div>
                                ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Application modal */}
            <ApplicationModal
                open={open}
                onOpenChange={setOpen}
                unitId={unit.id}
                unitLabel={`Unit ${unit.unit_number}${unit.property ? ` — ${unit.property.name}` : ""}`}
                onSuccess={handleSuccess}
            />
        </PageShell>
    );
};

// ─── Application Modal ─────────────────────────────────────────────────────

type FormState = {
    annual_income: string;
    employment_status: EmploymentStatus | "";
    employer_name: string;
    current_address: string;
    references: ApplicationReference[];
};

const ApplicationModal = ({
                              open,
                              onOpenChange,
                              unitId,
                              unitLabel,
                              onSuccess,
                          }: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    unitId: number;
    unitLabel: string;
    onSuccess: () => void;
}) => {
    const { mutate: apply, isPending } = useApplyForProperty(onSuccess);

    const [form, setForm] = useState<FormState>({
        annual_income: "",
        employment_status: "",
        employer_name: "",
        current_address: "",
        references: [],
    });
    const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

    const set = (key: keyof FormState, value: FormState[keyof FormState]) => {
        setForm((f) => ({ ...f, [key]: value }));
        setErrors((e) => ({ ...e, [key]: undefined }));
    };

    const updateRef = (index: number, key: keyof ApplicationReference, value: string) => {
        const refs = [...form.references];
        refs[index] = { ...refs[index], [key]: value };
        set("references", refs);
    };

    const addRef = () => set("references", [...form.references, emptyRef()]);
    const removeRef = (i: number) => set("references", form.references.filter((_, idx) => idx !== i));

    const validate = (): boolean => {
        const errs: Partial<Record<string, string>> = {};
        if (!form.annual_income || isNaN(Number(form.annual_income)))
            errs.annual_income = "Please enter a valid annual income.";
        if (!form.employment_status)
            errs.employment_status = "Please select your employment status.";
        if (!form.current_address.trim())
            errs.current_address = "Please enter your current address.";
        form.references.forEach((ref, i) => {
            if (!ref.name.trim()) errs[`ref_name_${i}`] = "Name required";
            if (!ref.phone.trim()) errs[`ref_phone_${i}`] = "Phone required";
        });
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        const payload: SubmitApplicationParams = {
            unit_id: unitId,
            annual_income: Number(form.annual_income),
            employment_status: form.employment_status as EmploymentStatus,
            employer_name: form.employer_name.trim() || undefined,
            current_address: form.current_address.trim(),
            references: form.references.length > 0
                ? form.references.map((r) => ({ name: r.name, phone: r.phone, relationship: r.relationship || undefined }))
                : undefined,
        };
        apply(payload);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Apply for {unitLabel}</DialogTitle>
                    <DialogDescription>
                        Fill in your details below. Your application will be reviewed by the property manager.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 mt-2">
                    {/* Annual income */}
                    <Field label="Annual income ($)" error={errors.annual_income}>
                        <Input
                            type="number"
                            placeholder="e.g. 48000"
                            value={form.annual_income}
                            onChange={(e) => set("annual_income", e.target.value)}
                        />
                    </Field>

                    {/* Employment status */}
                    <Field label="Employment status" error={errors.employment_status}>
                        <Select
                            value={form.employment_status}
                            onValueChange={(v) => set("employment_status", v as EmploymentStatus)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status..." />
                            </SelectTrigger>
                            <SelectContent>
                                {EMPLOYMENT_OPTIONS.map((o) => (
                                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    {/* Employer name (optional) */}
                    <Field label="Employer name (optional)">
                        <Input
                            placeholder="Company or employer name"
                            value={form.employer_name}
                            onChange={(e) => set("employer_name", e.target.value)}
                        />
                    </Field>

                    {/* Current address */}
                    <Field label="Current address" error={errors.current_address}>
                        <Input
                            placeholder="Your current home address"
                            value={form.current_address}
                            onChange={(e) => set("current_address", e.target.value)}
                        />
                    </Field>

                    {/* References */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-medium text-foreground">
                                References <span className="text-muted-foreground font-normal">(optional)</span>
                            </label>
                            {form.references.length < 5 && (
                                <button
                                    type="button"
                                    onClick={addRef}
                                    className="flex items-center gap-1 text-xs text-primary hover:text-primary font-medium"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Add reference
                                </button>
                            )}
                        </div>
                        {form.references.map((ref, i) => (
                            <div key={i} className="border border-border rounded-xl p-4 mb-3 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-muted-foreground">Reference {i + 1}</span>
                                    <button type="button" onClick={() => removeRef(i)} className="text-muted-foreground hover:text-red-400 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <Field label="Name" error={errors[`ref_name_${i}`]}>
                                    <Input placeholder="Full name" value={ref.name} onChange={(e) => updateRef(i, "name", e.target.value)} />
                                </Field>
                                <Field label="Phone" error={errors[`ref_phone_${i}`]}>
                                    <Input placeholder="+1 555 0000" value={ref.phone} onChange={(e) => updateRef(i, "phone", e.target.value)} />
                                </Field>
                                <Field label="Relationship (optional)">
                                    <Input placeholder="e.g. Previous landlord" value={ref.relationship ?? ""} onChange={(e) => updateRef(i, "relationship", e.target.value)} />
                                </Field>
                            </div>
                        ))}
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isPending}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            {isPending ? "Submitting..." : "Submit application"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

// ─── Helpers ───────────────────────────────────────────────────────────────

const PageShell = ({ children, onBack }: { children: React.ReactNode; onBack: () => void }) => (
    <div className="min-h-screen bg-background">
        <nav className="sticky top-0 z-40 bg-background border-b border-border px-6 py-4 flex items-center gap-4">
            <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back
            </button>
            <span className="text-xl font-bold tracking-tight text-foreground ml-auto">Havenly</span>
        </nav>
        {children}
    </div>
);

const Field = ({
                   label,
                   error,
                   children,
               }: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) => (
    <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
        {children}
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
);
