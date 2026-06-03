import { useNavigate, useParams } from "react-router-dom";
import { useGetPublicProperty } from "@/hooks/Public/useGetPublicProperty";
import { PublicUnit } from "@/types/publicProperty";
import { Badge } from "@/components/ui/badge";
import {
    Building2, MapPin, BedDouble, Bath, Ruler,
    ParkingSquare, Calendar, ArrowLeft, ArrowRight, CheckCircle2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
    available:   "bg-primary/10 text-primary border-primary/20",
    occupied:    "bg-muted text-muted-foreground border-border",
    maintenance: "bg-yellow-100 text-yellow-700 border-yellow-200",
};

type DetailItem = {
    icon: LucideIcon;
    label: string;
    value: React.ReactNode;
};

export const PropertyDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data, isLoading } = useGetPublicProperty(id ? Number(id) : undefined);
    const property = data?.data;

    if (isLoading) {
        return (
            <PageShell onBack={() => navigate("/browse")}>
                <div className="max-w-5xl mx-auto px-6 py-10 space-y-4 animate-pulse">
                    <div className="h-8 w-64 bg-muted rounded" />
                    <div className="h-4 w-40 bg-muted rounded" />
                    <div className="grid sm:grid-cols-3 gap-4 mt-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-44 bg-muted rounded-2xl" />
                        ))}
                    </div>
                </div>
            </PageShell>
        );
    }

    if (!property) {
        return (
            <PageShell onBack={() => navigate("/browse")}>
                <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                    <Building2 className="w-12 h-12 mb-4 opacity-25" />
                    <p className="font-semibold text-muted-foreground">Property not found</p>
                </div>
            </PageShell>
        );
    }

    const amenities: string[] = Array.isArray(property.amenities) ? property.amenities : [];
    const availableUnits = (property.units ?? []).filter((u) => u.status === "available");
    const otherUnits = (property.units ?? []).filter((u) => u.status !== "available");

    return (
        <PageShell onBack={() => navigate("/browse")}>
            <div className="max-w-5xl mx-auto px-6 py-10">
                <div className="mb-8 h-64 rounded-2xl border border-border bg-muted/30 overflow-hidden flex items-center justify-center">
                    {property.thumbnail_url ? (
                        <img
                            src={property.thumbnail_url}
                            alt={property.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <Building2 className="w-12 h-12 text-primary/40" />
                    )}
                </div>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground tracking-tight">{property.name}</h1>
                            <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-2">
                                <MapPin className="w-4 h-4 shrink-0" />
                                {property.address}
                            </div>
                        </div>
                        <Badge
                            variant="outline"
                            className={`text-sm px-3 py-1 ${availableUnits.length > 0 ? STATUS_COLORS.available : STATUS_COLORS.occupied}`}
                        >
                            {availableUnits.length > 0
                                ? `${availableUnits.length} unit${availableUnits.length !== 1 ? "s" : ""} available`
                                : "No units available"}
                        </Badge>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left col */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        {property.description && (
                            <section>
                                <h2 className="text-base font-semibold text-foreground mb-3">About this property</h2>
                                <p className="text-sm text-muted-foreground leading-relaxed">{property.description}</p>
                            </section>
                        )}

                        {/* Available units */}
                        <section>
                            <h2 className="text-base font-semibold text-foreground mb-4">
                                Available units
                                {availableUnits.length > 0 && (
                                    <span className="ml-2 text-xs font-normal text-primary">
                                        {availableUnits.length} open
                                    </span>
                                )}
                            </h2>
                            {availableUnits.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No units currently available.</p>
                            ) : (
                                <div className="space-y-3">
                                    {availableUnits.map((unit) => (
                                        <UnitRow
                                            key={unit.id}
                                            unit={unit}
                                            onClick={() => navigate(`/browse/${property.id}/units/${unit.id}`)}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Other units */}
                        {otherUnits.length > 0 && (
                            <section>
                                <h2 className="text-base font-semibold text-foreground mb-4 text-muted-foreground">
                                    Other units
                                </h2>
                                <div className="space-y-3 opacity-60">
                                    {otherUnits.map((unit) => (
                                        <UnitRow key={unit.id} unit={unit} disabled />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right col — property details */}
                    <div className="space-y-6">
                        {/* Quick stats */}
                        <div className="bg-muted/30 rounded-2xl border border-border p-5 space-y-4">
                            <h3 className="text-sm font-semibold text-foreground">Property details</h3>
                            {([
                                property.property_type && { icon: Building2, label: "Type", value: property.property_type },
                                property.year_built && { icon: Calendar, label: "Year built", value: property.year_built },
                                property.parking_spaces != null && { icon: ParkingSquare, label: "Parking", value: `${property.parking_spaces} space${property.parking_spaces !== 1 ? "s" : ""}` },
                                property.size && { icon: Ruler, label: "Size", value: `${property.size} m²` },
                                { icon: Building2, label: "Total units", value: property.total_units ?? property.units?.length ?? "—" },
                            ].filter(Boolean) as DetailItem[])
                                .map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="flex items-center gap-3 text-sm">
                                        <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                                        <span className="text-muted-foreground">{label}</span>
                                        <span className="ml-auto font-medium text-foreground capitalize">{value}</span>
                                    </div>
                                ))}
                        </div>

                        {/* Amenities */}
                        {amenities.length > 0 && (
                            <div className="bg-muted/30 rounded-2xl border border-border p-5">
                                <h3 className="text-sm font-semibold text-foreground mb-3">Amenities</h3>
                                <ul className="space-y-2">
                                    {amenities.map((a) => (
                                        <li key={a} className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                                            {a}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageShell>
    );
};

// ─── Sub-components ────────────────────────────────────────────────────────

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

const UnitRow = ({
                     unit,
                     onClick,
                     disabled,
                 }: {
    unit: PublicUnit;
    onClick?: () => void;
    disabled?: boolean;
}) => (
    <button
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all duration-150
            ${disabled
            ? "border-border bg-muted/30 cursor-default"
            : "border-border bg-background hover:border-primary hover:shadow-sm cursor-pointer"
        }`}
    >
        <div className="h-16 w-20 rounded-lg bg-muted/30 border border-border overflow-hidden shrink-0 flex items-center justify-center">
            {unit.thumbnail_url ? (
                <img
                    src={unit.thumbnail_url}
                    alt={`Unit ${unit.unit_number}`}
                    className="h-full w-full object-cover"
                />
            ) : (
                <Building2 className="w-5 h-5 text-primary/40" />
            )}
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-foreground text-sm">Unit {unit.unit_number}</span>
                <Badge
                    variant="outline"
                    className={`text-xs capitalize ${STATUS_COLORS[unit.status] ?? ""}`}
                >
                    {unit.status}
                </Badge>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1.5 flex-wrap">
                <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" /> {unit.bedrooms} bed{unit.bedrooms !== 1 ? "s" : ""}</span>
                <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {unit.bathrooms} bath{unit.bathrooms !== 1 ? "s" : ""}</span>
                {unit.size_sqm && <span className="flex items-center gap-1"><Ruler className="w-3.5 h-3.5" /> {unit.size_sqm} m²</span>}
            </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
            <span className="font-semibold text-foreground text-sm">
                ${Number(unit.monthly_rent).toLocaleString()}<span className="font-normal text-muted-foreground text-xs">/mo</span>
            </span>
            {!disabled && <ArrowRight className="w-4 h-4 text-primary" />}
        </div>
    </button>
);
