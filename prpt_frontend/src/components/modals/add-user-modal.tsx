import { useState } from "react";
import { FormModal } from "@/components/form-modal.tsx";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface AddUserModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (userData: UserFormData) => Promise<void>;
}

interface UserFormData {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
}

export function AddUserModal({ open, onOpenChange, onSubmit }: AddUserModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<UserFormData>({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        role: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onSubmit(formData);
            // Reset form and close modal on success
            setFormData({
                first_name: "",
                last_name: "",
                email: "",
                phone: "",
                role: "",
            });
            onOpenChange(false);
        } catch (error) {
            console.error("Error adding user:", error);
            // Handle error (show toast, etc.)
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: keyof UserFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <FormModal
            open={open}
            onOpenChange={onOpenChange}
            title="Add New User"
            description="Add a new team member to your company."
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitText="Add User"
            size="md"
        >
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                        className="mt-2"
                        id="first_name"
                        value={formData.first_name}
                        onChange={(e) => handleInputChange("first_name", e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                        className="mt-2"
                        id="last_name"
                        value={formData.last_name}
                        onChange={(e) => handleInputChange("last_name", e.target.value)}
                        required
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    className="mt-2"
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                />
            </div>

            <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                    className="mt-2"
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                />
            </div>

            <div>
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                    <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="property-manager">Property Manager</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="resident">Resident</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </FormModal>
    );
}