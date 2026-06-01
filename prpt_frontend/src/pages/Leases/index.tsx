import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/layouts/admin-layout.tsx";
import { useGetLeases } from "@/hooks/Leases/useGetLeases";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Lease } from "@/types/lease.ts";
import { format } from "date-fns";
import { Eye, FileText } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
    active:     "bg-emerald-100 text-emerald-700 border-emerald-200",
    expired:    "bg-zinc-100 text-zinc-600 border-zinc-200",
    terminated: "bg-red-100 text-red-700 border-red-200",
    draft:      "bg-yellow-100 text-yellow-700 border-yellow-200",
};

const TYPE_LABELS: Record<string, string> = {
    fixed:          "Fixed",
    "month-to-month": "Month-to-Month",
    renewal:        "Renewal",
};

const fmt = (d?: string) => (d ? format(new Date(d), "MMM d, yyyy") : "—");

export const Leases = () => {
    const navigate = useNavigate();
    const [search, setSearch]   = useState("");
    const [status, setStatus]   = useState<string>("all");

    const { data, isLoading } = useGetLeases({
        ...(status !== "all" && { status }),
    });

    const leases: Lease[] = (data?.data ?? []).filter((l) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        const resident = `${l.resident?.first_name ?? ""} ${l.resident?.last_name ?? ""}`.toLowerCase();
        const unit     = l.unit?.unit_number?.toLowerCase() ?? "";
        const property = l.unit?.property?.name?.toLowerCase() ?? "";
        return resident.includes(q) || unit.includes(q) || property.includes(q);
    });

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold">Leases</h1>
                    <p className="text-muted-foreground text-sm">
                        View and manage all lease agreements
                    </p>
                </div>

                {/* Filters */}
                <div className="flex gap-3 items-center">
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-44">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                            <SelectItem value="terminated">Terminated</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                        </SelectContent>
                    </Select>

                    <Input
                        placeholder="Search resident, unit or property..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-72"
                    />
                </div>

                {/* Table */}
                {isLoading ? (
                    <p className="text-muted-foreground text-sm">Loading leases...</p>
                ) : leases.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                        <FileText className="w-10 h-10 mb-3 opacity-30" />
                        <p className="font-medium">No leases found</p>
                        <p className="text-sm">Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="rounded-lg border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>Resident</TableHead>
                                    <TableHead>Unit</TableHead>
                                    <TableHead>Property</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Start</TableHead>
                                    <TableHead>End</TableHead>
                                    <TableHead>Rent</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leases.map((lease) => (
                                    <TableRow key={lease.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell className="font-medium">
                                            {lease.resident
                                                ? `${lease.resident.first_name} ${lease.resident.last_name}`
                                                : "—"}
                                        </TableCell>
                                        <TableCell>
                                            {lease.unit?.unit_number ?? "—"}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {lease.unit?.property?.name ?? "—"}
                                        </TableCell>
                                        <TableCell>
                                            {TYPE_LABELS[lease.lease_type] ?? lease.lease_type}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {fmt(lease.start_date)}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {fmt(lease.end_date)}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            ${Number(lease.monthly_rent).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`capitalize text-xs ${STATUS_COLORS[lease.status] ?? ""}`}
                                            >
                                                {lease.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => navigate(`/leases/${lease.id}`)}
                                            >
                                                <Eye className="w-4 h-4 mr-1" />
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};