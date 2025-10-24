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
import { Search, Plus, Mail, Phone, EditIcon, TrashIcon } from "lucide-react";
import { AddUserModal } from "@/components/modals/User/add-user-modal.tsx";
import { EditUserModal } from "@/components/modals/User/edit-user-modal.tsx";
import AdminLayout from "@/components/layouts/admin-layout.tsx";
import { useCreateUser } from "@/hooks/User/useCreateUser.ts";
import { useUpdateUser } from "@/hooks/User/useUpdateUser.ts";
import {CreateUserParams, UpdateUserParams} from "@/types/user.ts";
import { useQueryClient } from "@tanstack/react-query";
import { useGetTeamMembers } from "@/hooks/User/useGetTeamMembers.ts";
import {useDeleteUser} from "@/hooks/User/useDeleteUser.ts";

export default function TeamPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const { data: teamMembers } = useGetTeamMembers();
    const queryClient = useQueryClient();

    // Separate hooks for create and update
    const {
        mutate: createUser,
        isPending: isCreating,
        isSuccess: isCreateSuccess
    } = useCreateUser();

    const {
        mutate: updateUser,
        isPending: isUpdating,
        isSuccess: isUpdateSuccess
    } = useUpdateUser();

    const {
        mutate: deleteUser,
    } = useDeleteUser();

    // Filter team members
    const filteredMembers = teamMembers?.data?.filter((member: any) => {
        const matchesSearch =
            member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter === "all" || member.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    // Invalidate both queries on success
    const invalidateQueries = () => {
        queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
        queryClient.invalidateQueries({ queryKey: ['residents'] });
    };

    const handleAddUser = (data: CreateUserParams) => {
        createUser(data, {
            onSuccess: () => {
                invalidateQueries();
                setIsAddModalOpen(false);
            }
        });
    };

    const handleEditUser = (data: UpdateUserParams) => {
        updateUser(data, {
            onSuccess: () => {
                invalidateQueries();
                setIsEditModalOpen(false);
                setSelectedUser(null);
            }
        });
    };

    const handleDeleteUser = (userId: number) => {
        deleteUser(userId, {
            onSuccess: () => {
                invalidateQueries();
            }
        });
    };

    const openEditModal = (user: any) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const formatRole = (role: string) => {
        return role.split("-").map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(" ");
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Team Members</h1>
                        <p className="text-muted-foreground">
                            Manage your company's team members and their roles
                        </p>
                    </div>
                    <Button onClick={() => setIsAddModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Team Member
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Search team members..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="company-admin">Company Admin</SelectItem>
                            <SelectItem value="property-manager">Property Manager</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Team Table */}
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Assigned Properties</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredMembers?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No team members found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredMembers?.map((member: any) => (
                                    <TableRow key={member?.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {member?.first_name} {member?.last_name}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Mail className="h-3 w-3" />
                                                    {member?.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Phone className="h-3 w-3" />
                                                    {member?.phone}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant='default'>
                                                {formatRole(member?.role)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {member?.assigned_properties?.length > 0 ? (
                                                <div className="flex gap-1">
                                                    {member?.assigned_properties.map((propId: any) => (
                                                        <Badge key={propId} variant="outline" className="text-xs">
                                                            Property {propId}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground text-sm">None assigned</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(member?.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => openEditModal(member)}
                                                >
                                                    <EditIcon className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handleDeleteUser(member.id)}
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

                {/* Add User Modal */}
                <AddUserModal
                    open={isAddModalOpen}
                    isPending={isCreating}
                    isSuccess={isCreateSuccess}
                    onOpenChange={setIsAddModalOpen}
                    onSubmit={handleAddUser}
                    isTeamMember={true}
                />

                {/* Edit User Modal */}
                <EditUserModal
                    open={isEditModalOpen}
                    isPending={isUpdating}
                    isSuccess={isUpdateSuccess}
                    onOpenChange={setIsEditModalOpen}
                    onSubmit={handleEditUser}
                    userData={selectedUser}
                    isTeamMember={true}
                />
            </div>
        </AdminLayout>
    );
}