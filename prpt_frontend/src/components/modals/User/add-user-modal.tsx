import {type FormEvent} from "react";
import { FormModal } from "@/components/form-modal.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {CreateUserParams} from "@/types/user.ts";

export function AddUserModal({ open, onOpenChange, onSubmit, isPending, isTeamMember }: any) {
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const createUserData: CreateUserParams = {
            first_name: formData.get("first_name") as string,
            last_name: formData.get("last_name") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
            role: formData.get("role") as string,
        };

        onSubmit(createUserData);
    };

    return (
        <FormModal
            open={open}
            onOpenChange={onOpenChange}
            title="Add New User"
            description="Add a new member to your company."
            onSubmit={handleSubmit as any}
            submitText="Add User"
            size="md"
            isSubmitting={isPending}
        >
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                        className="mt-2"
                        name="first_name"
                        id="first_name"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                        className="mt-2"
                        name="last_name"
                        id="last_name"
                        required
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    className="mt-2"
                    id="email"
                    name="email"
                    type="email"
                    required
                />
            </div>

            <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                    className="mt-2"
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                />
            </div>
            {
                isTeamMember &&
                <div>
                    <Label htmlFor="role">Role</Label>
                    <select
                        name="role"
                        id="role"
                        className="mt-2 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        required
                    >
                        <option value="">Select a role</option>
                        <option value="company-admin">Company Admin</option>
                        <option value="property-manager">Property Manager</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="resident">Resident</option>
                    </select>
                </div>
            }
        </FormModal>
    );
}