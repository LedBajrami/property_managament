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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    Search,
    Plus,
    MapPin,
    Building2,
    Edit,
    ArrowLeft,
    Home,
    Bed,
    Bath,
    Maximize,
    DollarSign,
    Calendar,
    ParkingCircle,
    Wrench, Eye, EditIcon, TrashIcon,
} from "lucide-react";
import AdminLayout from "@/components/layouts/admin-layout.tsx";
import { useNavigate } from "react-router-dom";
import {useQueryClient} from "@tanstack/react-query";
// import {useGetUnits} from "@/hooks/Unit/useGetUnits.ts";
import {useCreateUnit} from "@/hooks/Unit/useCreateUnit.ts";
import {useUpdateUnit} from "@/hooks/Unit/useUpdateUnit.ts";
import {useDeleteUnit} from "@/hooks/Unit/useDeleteUnit.ts";
import {CreateUnitParams, UpdateUnitParams} from "@/types/unit.ts";
import {AddUnitModal} from "@/components/modals/Unit/add-unit-modal.tsx";
import {EditUnitModal} from "@/components/modals/Unit/edit-unit-modal.tsx";
import {useGetUnits} from "@/hooks/Unit/useGetUnits.ts";
import {useParams} from "react-router";
import {useGetProperty} from "@/hooks/Property/useGetProperty.ts";
import {EditPropertyModal} from "@/components/modals/Property/edit-property-modal.tsx";
import {useUpdateProperty} from "@/hooks/Property/useUpdateProperty.ts";
import {UpdatePropertyParams} from "@/types/property.ts";

export const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditUnitModalOpen, setIsEditUnitModalOpen] = useState(false);
    const [isEditPropertyModalOpen, setIsEditPropertyModalOpen] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const propertyId = id ? Number(id) : undefined;

    const { data: property } = useGetProperty(propertyId);
    const { data: units } = useGetUnits(propertyId);

    const queryClient = useQueryClient();

    const {
        mutate: createUnit,
        isPending: isCreating,
        isSuccess: isCreateSuccess
    } = useCreateUnit();

    const {
        mutate: updateUnit,
        isPending: isUpdating,
        isSuccess: isUpdateSuccess
    } = useUpdateUnit();

    const {
        mutate: updateProperty,
        isPending: isUpdatingProperty,
        isSuccess: isUpdateSuccessProperty
    } = useUpdateProperty();

    const {
        mutate: deleteUnit,
    } = useDeleteUnit();

    // Filter units
    const filteredUnits = units?.data.filter((unit: any) => {
        const matchesSearch =
            unit.unit_number.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || unit.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: any) => {
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

    const formatStatus = (status: any) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const invalidateQueries = () => {
        queryClient.invalidateQueries({ queryKey: ['units', propertyId] });
        queryClient.invalidateQueries({ queryKey: ['property', propertyId] });
    };

    const handleAddUnit = (data: CreateUnitParams) => {
        createUnit(data, {
            onSuccess: () => {
                invalidateQueries();
                setIsAddModalOpen(false);
            }
        });
    };

    const handleEditUnit = (data: UpdateUnitParams) => {
        updateUnit(data, {
            onSuccess: () => {
                invalidateQueries();
                setIsEditUnitModalOpen(false);
                setSelectedUnit(null);
            }
        });
    };

    const handleDeleteUnit = (propertyId: number) => {
        if (confirm("Are you sure you want to delete this unit? ")) {
            deleteUnit(propertyId, {
                onSuccess: () => {
                    invalidateQueries();
                }
            });
        }
    };

    const handleEditProperty = (data: UpdatePropertyParams) => {
        updateProperty(data, {
            onSuccess: () => {
                invalidateQueries();
                setIsEditPropertyModalOpen(false);
            }
        });
    };

    const openEditUnitModal = (unit: any) => {
        setSelectedUnit(unit);
        setIsEditUnitModalOpen(true);
    };

    const totalUnits = property?.data?.total_units ?? 1; // avoid division by 0
    const occupiedUnits = property?.data?.occupied_units ?? 0;
    const availableUnits = property?.data?.available_units ?? 0;
    const maintenanceUnits = property?.data?.maintenance_units ?? 0;
    const occupancyRate = property?.data?.occupancy_rate ?? 0;

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header with Back Button */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate("/properties")}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Building2 className="h-6 w-6" />
                            {property?.data.name}
                        </h1>
                        <p className="text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="h-4 w-4" />
                            {property?.data.address}
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => setIsEditPropertyModalOpen(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Property
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative overflow-hidden rounded-xl border border-white/20 bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm p-6">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
                        <div className="relative">
                            <div className="text-sm text-muted-foreground mb-1">Total Units</div>
                            <div className="text-3xl font-bold text-blue-600">{property?.data.total_units}</div>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-xl border border-white/20 bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm p-6">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl"></div>
                        <div className="relative">
                            <div className="text-sm text-muted-foreground mb-1">Occupied</div>
                            <div className="text-3xl font-bold text-green-600">{property?.data.occupied_units}</div>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-xl border border-white/20 bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm p-6">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
                        <div className="relative">
                            <div className="text-sm text-muted-foreground mb-1">Available</div>
                            <div className="text-3xl font-bold text-purple-600">{property?.data.available_units}</div>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-xl border border-white/20 bg-gradient-to-br from-orange-500/10 to-orange-600/5 backdrop-blur-sm p-6">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl"></div>
                        <div className="relative">
                            <div className="text-sm text-muted-foreground mb-1">Occupancy Rate</div>
                            <div className="text-3xl font-bold text-orange-600">{property?.data.occupancy_rate}%</div>
                        </div>
                    </div>
                </div>

                {/* Property Info and Visualization */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Property Information */}
                    <div className="lg:col-span-2 relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl p-6">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl"></div>
                        <div className="relative">
                            <h2 className="text-lg font-semibold mb-4 text-white">Property Information</h2>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-blue-500/10 backdrop-blur-sm border border-blue-500/20">
                                            <Home className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-400">Property Type</div>
                                            <div className="font-medium text-white capitalize">{property?.data.property_type}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-purple-500/10 backdrop-blur-sm border border-purple-500/20">
                                            <Maximize className="h-5 w-5 text-purple-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-400">Total Size</div>
                                            <div className="font-medium text-white">{property?.data.size} sqm</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-green-500/10 backdrop-blur-sm border border-green-500/20">
                                            <Calendar className="h-5 w-5 text-green-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-400">Year Built</div>
                                            <div className="font-medium text-white">{property?.data.year_built}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-orange-500/10 backdrop-blur-sm border border-orange-500/20">
                                            <ParkingCircle className="h-5 w-5 text-orange-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-400">Parking Spaces</div>
                                            <div className="font-medium text-white">{property?.data.parking_spaces} spaces</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-red-500/10 backdrop-blur-sm border border-red-500/20">
                                            <DollarSign className="h-5 w-5 text-red-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-400">Monthly Bill</div>
                                            <div className="font-medium text-white">${property?.data.monthly_bill.toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/20">
                                            <Wrench className="h-5 w-5 text-yellow-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-400">Maintenance Units</div>
                                            <div className="font-medium text-white">{property?.data.maintenance_units}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {property?.data.description && (
                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <div className="text-sm text-gray-400 mb-2">Description</div>
                                    <p className="text-sm text-gray-300">{property?.data.description}</p>
                                </div>
                            )}
                            {property?.data.amenities && property?.data.amenities.length > 0 && (
                                <div className="mt-4">
                                    <div className="text-sm text-gray-400 mb-2">Amenities</div>
                                    <div className="flex flex-wrap gap-2">
                                        {property?.data.amenities.map((amenity:any, index:number) => (
                                            <Badge key={index} variant="secondary" className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10">
                                                {amenity}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Unit Distribution Chart */}
                    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl p-6">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl"></div>
                        <div className="relative">
                            <h2 className="text-lg font-semibold mb-4 text-white">Unit Distribution</h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Occupied</span>
                                        <span className="font-medium text-white">{property?.data.occupied_units} units</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-3 backdrop-blur-sm border border-white/10">
                                        <div
                                            className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-500 shadow-lg shadow-green-500/20"
                                            style={{ width: `${(occupiedUnits / totalUnits) * 100}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Available</span>
                                        <span className="font-medium text-white">{property?.data.available_units} units</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-3 backdrop-blur-sm border border-white/10">
                                        <div
                                            className="bg-gradient-to-r from-purple-500 to-purple-400 h-3 rounded-full transition-all duration-500 shadow-lg shadow-purple-500/20"
                                            style={{ width: `${(availableUnits / totalUnits) * 100}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Maintenance</span>
                                        <span className="font-medium text-white">{property?.data.maintenance_units} units</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-3 backdrop-blur-sm border border-white/10">
                                        <div
                                            className="bg-gradient-to-r from-orange-500 to-orange-400 h-3 rounded-full transition-all duration-500 shadow-lg shadow-orange-500/20"
                                            style={{ width: `${(maintenanceUnits / totalUnits) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Circular Progress */}
                            <div className="mt-8 flex justify-center">
                                <div className="relative w-40 h-40">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="80"
                                            cy="80"
                                            r="70"
                                            stroke="currentColor"
                                            strokeWidth="12"
                                            fill="none"
                                            className="text-white/10"
                                        />
                                        <circle
                                            cx="80"
                                            cy="80"
                                            r="70"
                                            stroke="url(#gradient)"
                                            strokeWidth="12"
                                            fill="none"
                                            strokeDasharray={`${2 * Math.PI * 70}`}
                                            strokeDashoffset={`${2 * Math.PI * 70 * (1 - occupancyRate / 100)}`}
                                            className="transition-all duration-1000 drop-shadow-lg"
                                            strokeLinecap="round"
                                        />
                                        <defs>
                                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#10b981" />
                                                <stop offset="100%" stopColor="#34d399" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                                        <div className="text-3xl font-bold text-green-400">{property?.data.occupancy_rate}%</div>
                                        <div className="text-xs text-gray-400">Occupancy</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Units Section */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold">Units</h2>
                            <p className="text-sm text-muted-foreground">
                                Manage units in this property
                            </p>
                        </div>
                        <Button onClick={() => {setIsAddModalOpen(true)}}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Unit
                        </Button>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Search units..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="available">Available</SelectItem>
                                <SelectItem value="occupied">Occupied</SelectItem>
                                <SelectItem value="maintenance">Maintenance</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Units Table */}
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Unit Number</TableHead>
                                    <TableHead>Bedrooms</TableHead>
                                    <TableHead>Bathrooms</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead>Monthly Rent</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUnits?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            No units found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUnits?.map((unit: any) => (
                                        <TableRow key={unit.id}>
                                            <TableCell>
                                                <div className="font-medium flex items-center gap-2">
                                                    <Home className="h-4 w-4 text-muted-foreground" />
                                                    {unit.unit_number}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Bed className="h-4 w-4 text-muted-foreground" />
                                                    <span>{unit.bedrooms}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Bath className="h-4 w-4 text-muted-foreground" />
                                                    <span>{unit.bathrooms}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Maximize className="h-4 w-4 text-muted-foreground" />
                                                    <span>{unit.size_sqm} sqm</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium text-green-600">
                                                    ${unit.monthly_rent.toLocaleString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={getStatusColor(unit.status)}
                                                >
                                                    {formatStatus(unit.status)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => navigate(`/unit/${unit.id}/leases`)}
                                                        title="View Details & Units"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => openEditUnitModal(unit)}
                                                        title="Edit Unit"
                                                    >
                                                        <EditIcon className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleDeleteUnit(unit.id)}
                                                        title="Delete Unit"
                                                    >
                                                        <TrashIcon className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Add Unit Modal */}
                <AddUnitModal
                    open={isAddModalOpen}
                    propertyId={propertyId}
                    isPending={isCreating}
                    isSuccess={isCreateSuccess}
                    onOpenChange={setIsAddModalOpen}
                    onSubmit={handleAddUnit}
                />

                {/* Edit Unit Modal */}
                <EditUnitModal
                    open={isEditUnitModalOpen}
                    isPending={isUpdating}
                    isSuccess={isUpdateSuccess}
                    onOpenChange={setIsEditUnitModalOpen}
                    onSubmit={handleEditUnit}
                    unitData={selectedUnit}
                />

                {/* Edit Unit Modal */}
                <EditPropertyModal
                    open={isEditPropertyModalOpen}
                    isPending={isUpdatingProperty}
                    isSuccess={isUpdateSuccessProperty}
                    onOpenChange={setIsEditPropertyModalOpen}
                    onSubmit={handleEditProperty}
                    propertyData={property?.data}
                />

            </div>
        </AdminLayout>
    );
}