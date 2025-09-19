// src/pages/team.tsx
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
import { Search, Plus, MoreHorizontal, Mail, Phone } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddUserModal } from "@/components/modals/add-user-modal";
import AdminLayout from "@/components/layouts/admin-layout.tsx";

// Mock data - replace with your API call
const mockTeamMembers = [
    {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        phone: "+1234567890",
        role: "property-manager",
        assigned_properties: [1, 3], // property IDs
        created_at: "2024-01-15"
    },
    {
        id: 2,
        first_name: "Jane",
        last_name: "Smith",
        email: "jane@example.com",
        phone: "+1234567891",
        role: "maintenance",
        assigned_properties: [],
        created_at: "2024-02-20"
    },
    {
        id: 3,
        first_name: "Mike",
        last_name: "Wilson",
        email: "mike@example.com",
        phone: "+1234567892",
        role: "property-manager",
        assigned_properties: [2],
        created_at: "2024-03-10"
    }
];

interface TeamMember {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
    assigned_properties: number[];
    created_at: string;
}

interface UserFormData {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
}

export default function TeamPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);

    // Filter team members
    const filteredMembers = teamMembers.filter(member => {
        const matchesSearch =
            member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter === "all" || member.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    const handleAddUser = async (userData: UserFormData) => {
        // Your API call here
        console.log("Adding user:", userData);

        // Mock API response
        const newMember: TeamMember = {
            id: Date.now(),
            ...userData,
            assigned_properties: [],
            created_at: new Date().toISOString(),
        };

        setTeamMembers(prev => [...prev, newMember]);

        // In real app, you'd make API call and refetch data
        // await createUser(userData);
        // queryClient.invalidateQueries(['team']);
    };

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case "company-admin":
                return "default";
            case "property-manager":
                return "secondary";
            case "maintenance":
                return "outline";
            default:
                return "outline";
        }
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
                            {filteredMembers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No team members found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredMembers.map((member) => (
                                    <TableRow key={member.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {member.first_name} {member.last_name}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Mail className="h-3 w-3" />
                                                    {member.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Phone className="h-3 w-3" />
                                                    {member.phone}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getRoleBadgeVariant(member.role)}>
                                                {formatRole(member.role)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {member.assigned_properties.length > 0 ? (
                                                <div className="flex gap-1">
                                                    {member.assigned_properties.map(propId => (
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
                                            {new Date(member.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>Edit User</DropdownMenuItem>
                                                    <DropdownMenuItem>Assign Properties</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600">
                                                        Remove User
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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
                    onOpenChange={setIsAddModalOpen}
                    onSubmit={handleAddUser}
                />
            </div>
        </AdminLayout>
    );
}