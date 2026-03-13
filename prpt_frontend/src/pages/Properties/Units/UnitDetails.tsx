import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    Home,
    Bed,
    Bath,
    Maximize,
    DollarSign,
    Calendar,
    User,
    Edit,
    Plus,
    XCircle,
    CheckCircle,
    Building2,
    MapPin, FileText, RefreshCw,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

import AdminLayout from "@/components/layouts/admin-layout.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useGetUnit } from "@/hooks/Unit/useGetUnit.ts";
import { useUpdateUnit } from "@/hooks/Unit/useUpdateUnit.ts";
import { UpdateUnitParams } from "@/types/unit.ts";
import { EditUnitModal } from "@/components/modals/Unit/edit-unit-modal.tsx";
import { AddLeaseModal } from "@/components/modals/Lease/add-lease-modal.tsx";
import { EditLeaseModal } from "@/components/modals/Lease/edit-lease-modal.tsx";
import {CreateLeaseParams, Lease, RenewLeaseParams, UpdateLeaseParams} from "@/types/lease.ts";
import {useGetLeases} from "@/hooks/Leases/useGetLeases.ts";
import {useCreateLease} from "@/hooks/Leases/useCreateLease.ts";
import {useUpdateLease} from "@/hooks/Leases/useUpdateLease.ts";
import {useTerminateLease} from "@/hooks/Leases/useTerminateLease.ts";
import {useRenewLease} from "@/hooks/Leases/useRenewLease.ts";
import {RenewLeaseModal} from "@/components/modals/Lease/renew-lease-modal.tsx";


export const UnitDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isEditUnitModalOpen, setIsEditUnitModalOpen] = useState(false);
    const [isAddLeaseModalOpen, setIsAddLeaseModalOpen] = useState(false);
    const [isEditLeaseModalOpen, setIsEditLeaseModalOpen] = useState(false);
    const [isRenewLeaseModalOpen, setIsRenewLeaseModalOpen] = useState(false);
    const [selectedLease, setSelectedLease] = useState<any>(null);
    const [dateInputDialog, setDateInputDialog] = useState<{
        open: boolean;
        type: 'signed' | 'move_in' | null;
        lease: any;
    }>({
        open: false,
        type: null,
        lease: null
    });

    const queryClient = useQueryClient();

    const unitId = id ? Number(id) : undefined;

    const { data: unit } = useGetUnit(unitId);
    const { data: leases } = useGetLeases(unitId);

    const { mutate: updateUnit, isPending: isUpdatingUnit, isSuccess: isUpdateUnitSuccess} = useUpdateUnit();
    const { mutate: createLease, isPending: isCreatingLease, isSuccess: isCreateLeaseSuccess } = useCreateLease();
    const { mutate: updateLease, isPending: isUpdatingLease, isSuccess: isUpdateLeaseSuccess } = useUpdateLease();
    const { mutate: terminateLease, isPending: isTerminating } = useTerminateLease();
    const { mutate: renewLease, isPending: isRenewingLease, isSuccess: isRenewLeaseSuccess } = useRenewLease();



    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800 border-green-200";
            case "expired":
                return "bg-gray-100 text-gray-800 border-gray-200";
            case "terminated":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getUnitStatusColor = (status: string) => {
        switch (status) {
            case "occupied":
                return "bg-green-100 text-green-800 border-green-200";
            case "available":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "maintenance":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const invalidateQueries = () => {
        queryClient.invalidateQueries({ queryKey: ['unit', Number(unitId)] });
        queryClient.invalidateQueries({ queryKey: ['leases', Number(unitId)] });
        queryClient.invalidateQueries({ queryKey: ['units'] });
        queryClient.invalidateQueries({ queryKey: ['property'] });
    };

    const handleEditUnit = (data: UpdateUnitParams) => {
        updateUnit(data, {
            onSuccess: () => {
                invalidateQueries();
                setIsEditUnitModalOpen(false);
            }
        });
    };

    const handleAddLease = (data: CreateLeaseParams) => {
        createLease(data, {
            onSuccess: () => {
                invalidateQueries();
                setIsAddLeaseModalOpen(false);
            }
        });
    };

    const handleEditLease = (data: UpdateLeaseParams) => {
        updateLease(data, {
            onSuccess: () => {
                invalidateQueries();
                setIsEditLeaseModalOpen(false);
                setSelectedLease(null);
            }
        });
    };

    const handleTerminateLease = (leaseId: number) => {
        if (confirm("Are you sure you want to terminate this lease? This action cannot be undone.")) {
            terminateLease(leaseId, {
                onSuccess: () => {
                    invalidateQueries();
                }
            });
        }
    };

    const handleRenewLease = (data: RenewLeaseParams) => {
        if (confirm("Are you sure you want to renew this lease?")) {
            renewLease(data, {
                onSuccess: () => {
                    invalidateQueries();
                    setIsRenewLeaseModalOpen(false);
                    setSelectedLease(null);
                }
            });
        }
    };

    const openDateInputDialog = (lease: Lease, type: 'signed' | 'move_in') => {
        setDateInputDialog({
            open: true,
            type,
            lease
        });
    };

    const handleDateSubmit = (date: string) => {
        if (!dateInputDialog.lease) return;

        const updateData: any = { lease_id: dateInputDialog.lease.id };

        if (dateInputDialog.type === 'signed') {
            updateData.signed_date = date;
        } else if (dateInputDialog.type === 'move_in') {
            updateData.move_in_date = date;
        }

        updateLease(updateData, {
            onSuccess: () => {
                invalidateQueries();
                setDateInputDialog({ open: false, type: null, lease: null });
            }
        });
    };

    const openEditLeaseModal = (lease: any) => {
        setSelectedLease(lease);
        setIsEditLeaseModalOpen(true);
    };

    const openRenewLeaseModal = (lease: any) => {
        setSelectedLease(lease);
        setIsRenewLeaseModalOpen(true);
    };

    const activeLease = leases?.data?.find((l: any) => l.status === "active");
    const isOccupied = unit?.data?.status === "occupied";

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Home className="h-6 w-6" />
                            Unit {unit?.data?.unit_number}
                        </h1>
                        <p className="text-muted-foreground flex items-center gap-2 mt-1">
                            <Building2 className="h-4 w-4" />
                            {unit?.data?.property?.name}
                            <span className="text-muted-foreground">•</span>
                            <MapPin className="h-4 w-4" />
                            {unit?.data?.property?.address}
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => setIsEditUnitModalOpen(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Unit
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative overflow-hidden rounded-xl border border-white/20 bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm p-6">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
                        <div className="relative">
                            <div className="text-sm text-muted-foreground mb-1">Monthly Rent</div>
                            <div className="text-3xl font-bold text-blue-600">${unit?.data?.monthly_rent}</div>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-xl border border-white/20 bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm p-6">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl"></div>
                        <div className="relative">
                            <div className="text-sm text-muted-foreground mb-1">Status</div>
                            <Badge variant="outline" className={getUnitStatusColor(unit?.data?.status)}>
                                {unit?.data?.status?.charAt(0).toUpperCase() + unit?.data?.status?.slice(1)}
                            </Badge>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-xl border border-white/20 bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm p-6">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
                        <div className="relative">
                            <div className="text-sm text-muted-foreground mb-1">Current Resident</div>
                            <div className="text-lg font-bold text-purple-600">
                                {isOccupied && activeLease ?
                                    `${activeLease.resident.first_name} ${activeLease.resident.last_name}` :
                                    "No resident - Unit is Available"
                                }
                            </div>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-xl border border-white/20 bg-gradient-to-br from-orange-500/10 to-orange-600/5 backdrop-blur-sm p-6">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl"></div>
                        <div className="relative">
                            <div className="text-sm text-muted-foreground mb-1">Lease Expires</div>
                            <div className="text-lg font-bold text-orange-600">
                                {activeLease ? new Date(activeLease.end_date).toLocaleDateString() : "N/A"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Unit Info and Current Resident */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Unit Information */}
                    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl p-6">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
                        <div className="relative">
                            <h2 className="text-lg font-semibold mb-4 text-white">Unit Information</h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-blue-500/10 backdrop-blur-sm border border-blue-500/20">
                                        <Bed className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400">Bedrooms</div>
                                        <div className="font-medium text-white">{unit?.data?.bedrooms}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-purple-500/10 backdrop-blur-sm border border-purple-500/20">
                                        <Bath className="h-5 w-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400">Bathrooms</div>
                                        <div className="font-medium text-white">{unit?.data?.bathrooms}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-green-500/10 backdrop-blur-sm border border-green-500/20">
                                        <Maximize className="h-5 w-5 text-green-400" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400">Size</div>
                                        <div className="font-medium text-white">{unit?.data?.size_sqm} sqm</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-orange-500/10 backdrop-blur-sm border border-orange-500/20">
                                        <DollarSign className="h-5 w-5 text-orange-400" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400">Monthly Rent</div>
                                        <div className="font-medium text-white">${unit?.data?.monthly_rent.toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Current Resident Info */}
                    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl p-6">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl"></div>
                        <div className="relative">
                            <h2 className="text-lg font-semibold mb-4 text-white">Current Resident</h2>
                            {isOccupied && activeLease ? (
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-blue-500/10 backdrop-blur-sm border border-blue-500/20">
                                            <User className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-400">Name</div>
                                            <div className="font-medium text-white">
                                                {activeLease.resident.first_name} {activeLease.resident.last_name}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-purple-500/10 backdrop-blur-sm border border-purple-500/20">
                                            <Calendar className="h-5 w-5 text-purple-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-400">Lease Period</div>
                                            <div className="font-medium text-white">
                                                {new Date(activeLease.start_date).toLocaleDateString()} - {new Date(activeLease.end_date).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-green-500/10 backdrop-blur-sm border border-green-500/20">
                                            <CheckCircle className="h-5 w-5 text-green-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-400">Deposit Status</div>
                                            <div className="font-medium text-white">
                                                {activeLease.deposit_paid ? "Paid" : "Pending"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-orange-500/10 backdrop-blur-sm border border-orange-500/20">
                                            <DollarSign className="h-5 w-5 text-orange-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-400">Deposit Amount</div>
                                            <div className="font-medium text-white">${activeLease.deposit_amount.toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="p-4 rounded-full bg-blue-500/10 mb-4">
                                        <Home className="h-8 w-8 text-blue-400" />
                                    </div>
                                    <p className="text-white font-medium mb-2">Unit Available</p>
                                    <p className="text-sm text-gray-400 mb-4">This unit is currently available for lease</p>
                                    <Button onClick={() => setIsAddLeaseModalOpen(true)} size="sm">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Lease
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Leases Section */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold">Lease History</h2>
                            <p className="text-sm text-muted-foreground">
                                All leases for this unit
                            </p>
                        </div>
                        <Button onClick={() => setIsAddLeaseModalOpen(true)} disabled={isOccupied}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Lease
                        </Button>
                    </div>

                    {/* Leases Table */}
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Resident</TableHead>
                                    <TableHead>Lease Period</TableHead>
                                    <TableHead>Monthly Rent</TableHead>
                                    <TableHead>Deposit</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leases?.data?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            No leases found for this unit
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    leases?.data?.map((lease: any) => (
                                        <TableRow key={lease.id}>
                                            <TableCell>
                                                <div className="font-medium">
                                                    {lease.resident.first_name} {lease.resident.last_name}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    {new Date(lease.start_date).toLocaleDateString()} - {new Date(lease.end_date).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium text-green-600">
                                                    ${lease.monthly_rent.toLocaleString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <div className="text-sm">${lease.deposit_amount.toLocaleString()}</div>
                                                    {lease.deposit_paid && (
                                                        <Badge variant="outline" className="w-fit text-xs bg-green-50 text-green-700">
                                                            Paid
                                                        </Badge>
                                                    )}
                                                    {lease.deposit_returned && (
                                                        <Badge variant="outline" className="w-fit text-xs bg-blue-50 text-blue-700">
                                                            Returned
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">
                                                    {lease.lease_type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={getStatusColor(lease.status)}>
                                                    {lease.status.charAt(0).toUpperCase() + lease.status.slice(1)}
                                                </Badge>
                                                {lease.status === 'terminated' &&
                                                    lease.terminated_at &&
                                                       <>
                                                           <p className="inline mx-1">at</p>
                                                           <Badge variant="outline" className={getStatusColor(lease.status)}>
                                                               {lease.terminated_at}
                                                           </Badge>
                                                       </>
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {/* Mark as Signed */}
                                                    {lease.status === "draft" && !lease.signed_date && (
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => openDateInputDialog(lease, 'signed')}
                                                            title="Mark as Signed"
                                                            disabled={isUpdatingLease}
                                                        >
                                                            <FileText className="h-4 w-4 text-blue-500" />
                                                        </Button>
                                                    )}

                                                    {/* Record Move-In */}
                                                    {lease.status === "draft" && lease.signed_date && !lease.move_in_date && (
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => openDateInputDialog(lease, 'move_in')}
                                                            title="Record Move-In & Activate"
                                                            disabled={isUpdatingLease}
                                                        >
                                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                                        </Button>
                                                    )}

                                                    {/* Edit */}
                                                    {lease.status === "active" && (
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => openEditLeaseModal(lease)}
                                                            title="Edit Lease"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    )}

                                                    {/* Terminate */}
                                                    {lease.status === "active" && (
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => handleTerminateLease(lease.id)}
                                                            title="Terminate Lease"
                                                            disabled={isTerminating}
                                                        >
                                                            <XCircle className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    )}

                                                    {/* Renew Lease */}
                                                    {lease.status === "terminated" && (
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => openRenewLeaseModal(lease)}
                                                            title="Renew Lease"
                                                        >
                                                            <RefreshCw className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>

                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Edit Unit Modal */}
                <EditUnitModal
                    open={isEditUnitModalOpen}
                    isPending={isUpdatingUnit}
                    isSuccess={isUpdateUnitSuccess}
                    onOpenChange={setIsEditUnitModalOpen}
                    onSubmit={handleEditUnit}
                    unitData={unit?.data}
                />

                {/* Add Lease Modal */}
                <AddLeaseModal
                    open={isAddLeaseModalOpen}
                    unitId={Number(unitId)}
                    unitNumber={unit?.data?.unit_number}
                    isPending={isCreatingLease}
                    isSuccess={isCreateLeaseSuccess}
                    onOpenChange={setIsAddLeaseModalOpen}
                    onSubmit={handleAddLease}
                />

                {/* Edit Lease Modal */}
                <EditLeaseModal
                    open={isEditLeaseModalOpen}
                    isPending={isUpdatingLease}
                    isSuccess={isUpdateLeaseSuccess}
                    onOpenChange={setIsEditLeaseModalOpen}
                    onSubmit={handleEditLease}
                    leaseData={selectedLease}
                />

                {/* Renew Lease Modal */}
                <RenewLeaseModal
                    open={isRenewLeaseModalOpen}
                    isPending={isRenewingLease}
                    isSuccess={isRenewLeaseSuccess}
                    onOpenChange={setIsRenewLeaseModalOpen}
                    onSubmit={handleRenewLease}
                    leaseData={selectedLease}
                />
            </div>
            {/* Date Input Dialog */}
            <Dialog
                open={dateInputDialog.open}
                onOpenChange={(open) =>
                    setDateInputDialog({ open, type: null, lease: null })
                }
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {dateInputDialog.type === "signed"
                                ? "Mark Lease as Signed"
                                : "Record Move-In Date"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>
                                {dateInputDialog.type === "signed"
                                    ? "Signed Date"
                                    : "Move-In Date"}
                            </Label>

                            <Input
                                type="date"
                                id="date-input"
                                defaultValue={new Date().toISOString().split("T")[0]}
                            />
                        </div>

                        {dateInputDialog.type === "move_in" && (
                            <div className="rounded-md border bg-muted p-3 text-sm">
                                ✅ This will activate the lease and mark the unit as occupied
                            </div>
                        )}
                    </div>

                    <DialogFooter className="gap-2 sm:justify-end">
                        <Button
                            onClick={() => {
                                const input = document.getElementById(
                                    "date-input"
                                ) as HTMLInputElement
                                handleDateSubmit(input.value)
                            }}
                            disabled={isUpdatingLease}
                        >
                            {isUpdatingLease ? "Saving..." : "Confirm"}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() =>
                                setDateInputDialog({ open: false, type: null, lease: null })
                            }
                            disabled={isUpdatingLease}
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};