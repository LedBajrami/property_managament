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
import { Search, Plus, MapPin, Building2, EditIcon, TrashIcon, Eye } from "lucide-react";
import { AddPropertyModal } from "@/components/modals/Property/add-property-modal";
import { EditPropertyModal } from "@/components/modals/Property/edit-property-modal";
import AdminLayout from "@/components/layouts/admin-layout.tsx";
import { useCreateProperty } from "@/hooks/Property/useCreateProperty.ts";
import { useUpdateProperty } from "@/hooks/Property/useUpdateProperty.ts";
import { useDeleteProperty } from "@/hooks/Property/useDeleteProperty.ts";
import { CreatePropertyParams, UpdatePropertyParams } from "@/types/property.ts";
import { useQueryClient } from "@tanstack/react-query";
import { useGetProperties } from "@/hooks/Property/useGetProperties.ts";
import {useNavigate} from "react-router-dom";

export const Properties = () => {
    const navigate = useNavigate();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");

    const { data: properties } = useGetProperties();
    const queryClient = useQueryClient();

    const {
        mutate: createProperty,
        isPending: isCreating,
        isSuccess: isCreateSuccess
    } = useCreateProperty();

    const {
        mutate: updateProperty,
        isPending: isUpdating,
        isSuccess: isUpdateSuccess
    } = useUpdateProperty();

    const {
        mutate: deleteProperty,
    } = useDeleteProperty();

    // Filter properties
    const filteredProperties = properties?.data?.filter((property: any) => {
        const matchesSearch =
            property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.address.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = typeFilter === "all" || property.property_type === typeFilter;

        return matchesSearch && matchesType;
    });

    const invalidateQueries = () => {
        queryClient.invalidateQueries({ queryKey: ['properties'] });
    };

    const handleAddProperty = (data: CreatePropertyParams) => {
        createProperty(data, {
            onSuccess: () => {
                invalidateQueries();
                setIsAddModalOpen(false);
            }
        });
    };

    const handleEditProperty = (data: UpdatePropertyParams) => {
        updateProperty(data, {
            onSuccess: () => {
                invalidateQueries();
                setIsEditModalOpen(false);
                setSelectedProperty(null);
            }
        });
    };

    const handleDeleteProperty = (propertyId: number) => {
        if (confirm("Are you sure you want to delete this property? This will also delete all associated units.")) {
            deleteProperty(propertyId, {
                onSuccess: () => {
                    invalidateQueries();
                }
            });
        }
    };

    const openEditModal = (property: any) => {
        setSelectedProperty(property);
        setIsEditModalOpen(true);
    };

    const formatPropertyType = (type: string) => {
        return type.charAt(0).toUpperCase() + type.slice(1);
    };

    const getOccupancyColor = (rate: number) => {
        if (rate >= 90) return "text-green-600";
        if (rate >= 70) return "text-blue-600";
        if (rate >= 50) return "text-yellow-600";
        return "text-red-600";
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Properties</h1>
                        <p className="text-muted-foreground">
                            Manage your company's properties and units
                        </p>
                    </div>
                    <Button onClick={() => setIsAddModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Property
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="border rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Total Properties</div>
                        <div className="text-2xl font-bold">{properties?.data?.length || 0}</div>
                    </div>
                    <div className="border rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Total Units</div>
                        <div className="text-2xl font-bold">
                            {properties?.data?.reduce((sum: number, p: any) => sum + (p.total_units || 0), 0) || 0}
                        </div>
                    </div>
                    <div className="border rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Occupied Units</div>
                        <div className="text-2xl font-bold text-green-600">
                            {properties?.data?.reduce((sum: number, p: any) => sum + (p.occupied_units || 0), 0) || 0}
                        </div>
                    </div>
                    <div className="border rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Available Units</div>
                        <div className="text-2xl font-bold text-blue-600">
                            {properties?.data?.reduce((sum: number, p: any) => sum + (p.available_units || 0), 0) || 0}
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Search properties..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="house">House</SelectItem>
                            <SelectItem value="office">Office</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Properties Table */}
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Property</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Units</TableHead>
                                <TableHead>Occupancy</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProperties?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        No properties found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredProperties?.map((property: any) => (
                                    <TableRow key={property?.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium flex items-center gap-2">
                                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                                    {property?.name}
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {property?.address}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {formatPropertyType(property?.property_type)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="text-sm font-medium">
                                                    {property?.total_units || 0} Total
                                                </div>
                                                <div className="flex gap-2 text-xs">
                                                    <span className="text-green-600">
                                                        {property?.occupied_units || 0} Occupied
                                                    </span>
                                                    <span className="text-blue-600">
                                                        {property?.available_units || 0} Available
                                                    </span>
                                                    {property?.maintenance_units > 0 && (
                                                        <span className="text-yellow-600">
                                                            {property?.maintenance_units} Maintenance
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="w-full bg-gray-200 rounded-full h-2 max-w-[100px]">
                                                    <div
                                                        className="bg-green-600 h-2 rounded-full"
                                                        style={{ width: `${property?.occupancy_rate || 0}%` }}
                                                    />
                                                </div>
                                                <span className={`text-sm font-medium ${getOccupancyColor(property?.occupancy_rate || 0)}`}>
                                                    {property?.occupancy_rate || 0}%
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1 text-sm">
                                                {property?.size && (
                                                    <div>
                                                        <span className="text-muted-foreground">Size: </span>
                                                        {property?.size} sqm
                                                    </div>
                                                )}
                                                {property?.parking_spaces > 0 && (
                                                    <div>
                                                        <span className="text-muted-foreground">Parking: </span>
                                                        {property?.parking_spaces} spaces
                                                    </div>
                                                )}
                                                {property?.year_built && (
                                                    <div>
                                                        <span className="text-muted-foreground">Built: </span>
                                                        {property?.year_built}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(property?.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => navigate(`/properties/${property?.id}`)}
                                                    title="View Details & Units"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => openEditModal(property)}
                                                    title="Edit Property"
                                                >
                                                    <EditIcon className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handleDeleteProperty(property.id)}
                                                    title="Delete Property"
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

                {/* Add Property Modal */}
                <AddPropertyModal
                    open={isAddModalOpen}
                    isPending={isCreating}
                    isSuccess={isCreateSuccess}
                    onOpenChange={setIsAddModalOpen}
                    onSubmit={handleAddProperty}
                />

                {/* Edit Property Modal */}
                <EditPropertyModal
                    open={isEditModalOpen}
                    isPending={isUpdating}
                    isSuccess={isUpdateSuccess}
                    onOpenChange={setIsEditModalOpen}
                    onSubmit={handleEditProperty}
                    propertyData={selectedProperty}
                />
            </div>
        </AdminLayout>
    );
}