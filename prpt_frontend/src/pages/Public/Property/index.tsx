import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetPublicProperties } from "@/hooks/Public/useGetPublicProperties";
import { PropertyFilters, PublicProperty } from "@/types/publicProperty";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Building2, MapPin, BedDouble, ArrowRight, Search, SlidersHorizontal } from "lucide-react";

const PROPERTY_TYPES = [
    { value: "all", label: "All types" },
    { value: "apartment", label: "Apartment" },
    { value: "house", label: "House" },
    { value: "condo", label: "Condo" },
    { value: "townhouse", label: "Townhouse" },
    { value: "studio", label: "Studio" },
    { value: "commercial", label: "Commercial" },
];

const BEDROOMS = [
    { value: "all", label: "Any bedrooms" },
    { value: "0", label: "Studio" },
    { value: "1", label: "1 bed" },
    { value: "2", label: "2 beds" },
    { value: "3", label: "3 beds" },
    { value: "4", label: "4+ beds" },
];

const AVAILABILITY_COLORS: Record<string, string> = {
    available: "bg-emerald-100 text-emerald-700 border-emerald-200",
    occupied: "bg-zinc-100 text-zinc-500 border-zinc-200",
    maintenance: "bg-yellow-100 text-yellow-700 border-yellow-200",
};

export const PropertiesPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [filters, setFilters] = useState<PropertyFilters>({
        location: searchParams.get("location") ?? "",
    });
    const [locationInput, setLocationInput] = useState(searchParams.get("location") ?? "");

    const { data, isLoading } = useGetPublicProperties(filters);
    const properties: PublicProperty[] = data?.data ?? [];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setFilters((f) => ({ ...f, location: locationInput.trim() || undefined }));
    };

    const updateFilter = (key: keyof PropertyFilters, value: string) => {
        setFilters((f) => ({
            ...f,
            [key]: value === "all" || value === "" ? undefined : value,
        }));
    };

    return (
        <div className="min-h-screen bg-zinc-50">
            {/* Nav */}
            <nav className="sticky top-0 z-40 bg-white border-b border-zinc-100 px-6 py-4 flex items-center justify-between">
                <button onClick={() => navigate("/")} className="text-xl font-bold tracking-tight text-zinc-900">
                    Havenly
                </button>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>Sign in</Button>
                    <Button size="sm" onClick={() => navigate("/register")}>Get started</Button>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Page title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">All properties</h1>
                    <p className="text-zinc-500 text-sm mt-1">
                        {isLoading ? "Loading..." : `${properties.length} propert${properties.length !== 1 ? "ies" : "y"} found`}
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white border border-zinc-200 rounded-2xl p-5 mb-8 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 mb-4">
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                    </div>
                    <form onSubmit={handleSearch} className="flex flex-wrap gap-3 items-end">
                        {/* Location search */}
                        <div className="flex-1 min-w-[220px]">
                            <label className="block text-xs text-zinc-500 mb-1.5">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <Input
                                    className="pl-9"
                                    placeholder="City or address..."
                                    value={locationInput}
                                    onChange={(e) => setLocationInput(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Property type */}
                        <div className="w-40">
                            <label className="block text-xs text-zinc-500 mb-1.5">Type</label>
                            <Select
                                value={filters.property_type ?? "all"}
                                onValueChange={(v) => updateFilter("property_type", v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {PROPERTY_TYPES.map((t) => (
                                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Bedrooms */}
                        <div className="w-36">
                            <label className="block text-xs text-zinc-500 mb-1.5">Bedrooms</label>
                            <Select
                                value={filters.bedrooms?.toString() ?? "all"}
                                onValueChange={(v) => updateFilter("bedrooms", v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {BEDROOMS.map((b) => (
                                        <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Min rent */}
                        <div className="w-32">
                            <label className="block text-xs text-zinc-500 mb-1.5">Min rent</label>
                            <Input
                                type="number"
                                placeholder="$0"
                                value={filters.min_rent ?? ""}
                                onChange={(e) => updateFilter("min_rent", e.target.value)}
                            />
                        </div>

                        {/* Max rent */}
                        <div className="w-32">
                            <label className="block text-xs text-zinc-500 mb-1.5">Max rent</label>
                            <Input
                                type="number"
                                placeholder="Any"
                                value={filters.max_rent ?? ""}
                                onChange={(e) => updateFilter("max_rent", e.target.value)}
                            />
                        </div>

                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white h-10">
                            <Search className="w-4 h-4 mr-2" />
                            Search
                        </Button>
                    </form>
                </div>

                {/* Property grid */}
                {isLoading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-zinc-200 h-64 animate-pulse" />
                        ))}
                    </div>
                ) : properties.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center text-zinc-400">
                        <Building2 className="w-12 h-12 mb-4 opacity-25" />
                        <p className="font-semibold text-zinc-600">No properties found</p>
                        <p className="text-sm mt-1">Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {properties.map((property) => (
                            <PropertyCard
                                key={property.id}
                                property={property}
                                onClick={() => navigate(`/browse/${property.id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const PropertyCard = ({
                          property,
                          onClick,
                      }: {
    property: PublicProperty;
    onClick: () => void;
}) => {
    const availableCount = property.available_units ?? 0;

    return (
        <button
            onClick={onClick}
            className="group text-left bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:border-emerald-300 hover:shadow-md transition-all duration-200"
        >
            {/* Placeholder image area */}
            <div className="h-36 bg-gradient-to-br from-emerald-50 to-zinc-100 flex items-center justify-center">
                <Building2 className="w-10 h-10 text-emerald-200" />
            </div>

            <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-zinc-900 text-sm leading-snug group-hover:text-emerald-700 transition-colors">
                        {property.name}
                    </h3>
                    <Badge
                        variant="outline"
                        className={`shrink-0 text-xs capitalize ${availableCount > 0 ? AVAILABILITY_COLORS.available : AVAILABILITY_COLORS.occupied}`}
                    >
                        {availableCount > 0 ? `${availableCount} available` : "Full"}
                    </Badge>
                </div>

                <div className="flex items-center gap-1 text-zinc-400 text-xs mb-3">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{property.address}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-500">
                    <div className="flex items-center gap-1">
                        <BedDouble className="w-3.5 h-3.5" />
                        {property.total_units ?? 0} unit{property.total_units !== 1 ? "s" : ""}
                        {property.property_type && (
                            <span className="ml-2 capitalize text-zinc-400">· {property.property_type}</span>
                        )}
                    </div>
                    {(property.min_rent || property.max_rent) && (
                        <span className="font-semibold text-zinc-800">
                            ${Number(property.min_rent).toLocaleString()}
                            {property.max_rent && property.max_rent !== property.min_rent
                                ? ` – $${Number(property.max_rent).toLocaleString()}`
                                : ""}
                            <span className="font-normal text-zinc-400">/mo</span>
                        </span>
                    )}
                </div>

                <div className="mt-4 flex items-center gap-1 text-emerald-600 text-xs font-medium">
                    View details <ArrowRight className="w-3.5 h-3.5" />
                </div>
            </div>
        </button>
    );
};