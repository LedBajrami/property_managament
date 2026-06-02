import { useNavigate, useParams } from "react-router-dom";
import { useGetPublicProperty } from "@/hooks/Public/useGetPublicProperty";
import { PublicUnit } from "@/types/publicProperty";
import { Badge } from "@/components/ui/badge";
import {
    Building2, MapPin, BedDouble, Bath, Ruler,
    ParkingSquare, Calendar, ArrowLeft, ArrowRight, CheckCircle2,
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
    available:   "bg-emerald-100 text-emerald-700 border-emerald-200",
    occupied:    "bg-zinc-100 text-zinc-500 border-zinc-200",
    maintenance: "bg-yellow-100 text-yellow-700 border-yellow-200",
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
                    <div className="h-8 w-64 bg-zinc-200 rounded" />
                    <div className="h-4 w-40 bg-zinc-100 rounded" />
                    <div className="grid sm:grid-cols-3 gap-4 mt-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-44 bg-zinc-100 rounded-2xl" />
                        ))}
                    </div>
                </div>
            </PageShell>
        );
    }

    if (!property) {
        return (
            <PageShell onBack={() => navigate("/browse")}>
                <div className="flex flex-col items-center justify-center py-24 text-zinc-400">
                    <Building2 className="w-12 h-12 mb-4 opacity-25" />
                    <p className="font-semibold text-zinc-600">Property not found</p>
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
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">{property.name}</h1>
                            <div className="flex items-center gap-1.5 text-zinc-500 text-sm mt-2">
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
                                <h2 className="text-base font-semibold text-zinc-900 mb-3">About this property</h2>
                                <p className="text-sm text-zinc-600 leading-relaxed">{property.description}</p>
                            </section>
                        )}

                        {/* Available units */}
                        <section>
                            <h2 className="text-base font-semibold text-zinc-900 mb-4">
                                Available units
                                {availableUnits.length > 0 && (
                                    <span className="ml-2 text-xs font-normal text-emerald-600">
                                        {availableUnits.length} open
                                    </span>
                                )}
                            </h2>
                            {availableUnits.length === 0 ? (
                                <p className="text-sm text-zinc-400">No units currently available.</p>
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
                                <h2 className="text-base font-semibold text-zinc-900 mb-4 text-zinc-400">
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
                        <div className="bg-zinc-50 rounded-2xl border border-zinc-200 p-5 space-y-4">
                            <h3 className="text-sm font-semibold text-zinc-900">Property details</h3>
                            {[
                                property.property_type && { icon: Building2, label: "Type", value: property.property_type },
                                property.year_built && { icon: Calendar, label: "Year built", value: property.year_built },
                                property.parking_spaces != null && { icon: ParkingSquare, label: "Parking", value: `${property.parking_spaces} space${property.parking_spaces !== 1 ? "s" : ""}` },
                                property.size && { icon: Ruler, label: "Size", value: `${property.size} m²` },
                                { icon: Building2, label: "Total units", value: property.total_units ?? property.units?.length ?? "—" },
                            ]
                                .filter(Boolean)
                                .map(({ icon: Icon, label, value }: any) => (
                                    <div key={label} className="flex items-center gap-3 text-sm">
                                        <Icon className="w-4 h-4 text-zinc-400 shrink-0" />
                                        <span className="text-zinc-500">{label}</span>
                                        <span className="ml-auto font-medium text-zinc-800 capitalize">{value}</span>
                                    </div>
                                ))}
                        </div>

                        {/* Amenities */}
                        {amenities.length > 0 && (
                            <div className="bg-zinc-50 rounded-2xl border border-zinc-200 p-5">
                                <h3 className="text-sm font-semibold text-zinc-900 mb-3">Amenities</h3>
                                <ul className="space-y-2">
                                    {amenities.map((a) => (
                                        <li key={a} className="flex items-center gap-2 text-sm text-zinc-600">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
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
    <div className="min-h-screen bg-white">
        <nav className="sticky top-0 z-40 bg-white border-b border-zinc-100 px-6 py-4 flex items-center gap-4">
            <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back
            </button>
            <span className="text-xl font-bold tracking-tight text-zinc-900 ml-auto">Havenly</span>
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
            ? "border-zinc-100 bg-zinc-50 cursor-default"
            : "border-zinc-200 bg-white hover:border-emerald-300 hover:shadow-sm cursor-pointer"
        }`}
    >
        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-zinc-800 text-sm">Unit {unit.unit_number}</span>
                <Badge
                    variant="outline"
                    className={`text-xs capitalize ${STATUS_COLORS[unit.status] ?? ""}`}
                >
                    {unit.status}
                </Badge>
            </div>
            <div className="flex items-center gap-4 text-xs text-zinc-400 mt-1.5 flex-wrap">
                <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" /> {unit.bedrooms} bed{unit.bedrooms !== 1 ? "s" : ""}</span>
                <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {unit.bathrooms} bath{unit.bathrooms !== 1 ? "s" : ""}</span>
                {unit.size_sqm && <span className="flex items-center gap-1"><Ruler className="w-3.5 h-3.5" /> {unit.size_sqm} m²</span>}
            </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
            <span className="font-semibold text-zinc-900 text-sm">
                ${Number(unit.monthly_rent).toLocaleString()}<span className="font-normal text-zinc-400 text-xs">/mo</span>
            </span>
            {!disabled && <ArrowRight className="w-4 h-4 text-emerald-500" />}
        </div>
    </button>
);