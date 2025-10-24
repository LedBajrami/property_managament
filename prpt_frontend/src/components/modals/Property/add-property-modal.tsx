import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreatePropertyParams } from "@/types/property";
import { FormModal } from "@/components/form-modal.tsx";
import {FormEvent} from "react";

export function AddPropertyModal({ open, onOpenChange, onSubmit, isPending }: any) {

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const createPropertyData: CreatePropertyParams = {
            name: formData.get("name") as string,
            address: formData.get("address") as string,
            property_type: formData.get("property_type") as string,
            size: formData.get("size") ? Number(formData.get("size")) : undefined,
            monthly_bill: formData.get("monthly_bill") ? Number(formData.get("monthly_bill")) : undefined,
            year_built: formData.get("year_built") ? Number(formData.get("year_built")) : undefined,
            parking_spaces: formData.get("parking_spaces") ? Number(formData.get("parking_spaces")) : 0,
            description: formData.get("description") as string || undefined,
        };

        onSubmit(createPropertyData);
    };

    return (
        <FormModal
            open={open}
            onOpenChange={onOpenChange}
            title="Add New Property"
            description="Create a new property."
            onSubmit={handleFormSubmit as any}
            submitText="Add Property"
            size="md"
            isSubmitting={isPending}
        >
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                        className="mt-2"
                        name="name"
                        id="name"
                        placeholder="Sunset Apartments"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                        className="mt-2"
                        name="address"
                        id="address"
                        placeholder="123 Main Street, City, State, ZIP"
                        required
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="property_type">Property Type</Label>
                <select
                    name="property_type"
                    id="property_type"
                    className="mt-2 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    required
                >
                    <option value="">Select a type</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="office">Office</option>
                </select>
            </div>

            <div>
                <Label htmlFor="year_built">Year Built</Label>
                <Input
                    name="year_built"
                    id="year_built"
                    type="number"
                    placeholder="2020"
                    min="1800"
                    max={new Date().getFullYear()}
                />
            </div>

            <div>
                <Label htmlFor="size">Total Size (sqm)</Label>
                <Input
                    name="size"
                    id="size"
                    type="number"
                    step="0.01"
                    placeholder="5000.00"
                />
            </div>

            <div>
                <Label htmlFor="monthly_bill">Monthly Bill ($)</Label>
                <Input
                    name="monthly_bill"
                    id="monthly_bill"
                    type="number"
                    step="0.01"
                    placeholder="1500.00"
                />
            </div>

            <div className="col-span-2">
                <Label htmlFor="parking_spaces">Parking Spaces</Label>
                <Input
                    name="parking_spaces"
                    id="parking_spaces"
                    type="number"
                    placeholder="20"
                    min="0"
                />
            </div>

            <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    name="description"
                    id="description"
                    placeholder="Modern apartment complex with excellent amenities..."
                    rows={3}
                />
            </div>
        </FormModal>
    );
}