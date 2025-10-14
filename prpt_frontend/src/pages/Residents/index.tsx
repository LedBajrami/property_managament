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
import {Search, Plus, Mail, Phone, EditIcon, TrashIcon} from "lucide-react";
import { AddUserModal } from "@/components/modals/add-user-modal";
import AdminLayout from "@/components/layouts/admin-layout.tsx";
import {useCreateUser} from "@/hooks/User/useCreateUser.ts";
import {CreateUserParams, UpdateUserParams} from "@/types/user.ts";
import {useQueryClient} from "@tanstack/react-query";
import {useGetResidents} from "@/hooks/User/useGetResidents.ts";
import {EditUserModal} from "@/components/modals/edit-user-modal.tsx";
import {useUpdateUser} from "@/hooks/User/useUpdateUser.ts";
import {useDeleteUser} from "@/hooks/User/useDeleteUser.ts";

export default function ResidentsPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const { data: teamMembers } = useGetResidents();
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


        return matchesSearch;
    });


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

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Residents</h1>
                    </div>
                    <Button onClick={() => setIsAddModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Resident
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Search residents..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                {/* Team Table */}
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredMembers?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No residents found
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
                    isTeamMember={false}
                />

                {/* Edit User Modal */}
                <EditUserModal
                    open={isEditModalOpen}
                    isPending={isUpdating}
                    isSuccess={isUpdateSuccess}
                    onOpenChange={setIsEditModalOpen}
                    onSubmit={handleEditUser}
                    userData={selectedUser}
                    isTeamMember={false}
                />
            </div>
        </AdminLayout>
    );
}