import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormModal } from "@/components/form-modal.tsx";
import { FormEvent } from "react";
import { CreateUnitParams } from "@/types/unit";

export function AddUnitModal({ open, onOpenChange, onSubmit, isPending, propertyId }: any) {
    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const createUnitData: CreateUnitParams = {
            property_id: propertyId,
            unit_number: formData.get("unit_number") as string,
            bedrooms: Number(formData.get("bedrooms")),
            bathrooms: Number(formData.get("bathrooms")),
            size_sqm: formData.get("size_sqm") ? Number(formData.get("size_sqm")) : undefined,
            monthly_rent: formData.get("monthly_rent") ? Number(formData.get("monthly_rent")) : undefined,
            status: formData.get("status") as string || "available",
        };

        onSubmit(createUnitData);
    };

    return (
        <FormModal
            open={open}
            onOpenChange={onOpenChange}
            title="Add New Unit"
            description="Create a new unit within a property."
            onSubmit={handleFormSubmit as any}
            submitText="Add Unit"
            size="md"
            isSubmitting={isPending}
        >
            {/* Unit Info */}
            <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                    <Label htmlFor="unit_number">Unit Number</Label>
                    <Input
                        className="mt-2"
                        name="unit_number"
                        id="unit_number"
                        placeholder="A-101"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="status">Status</Label>
                    <select
                        name="status"
                        id="status"
                        className="mt-2 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="maintenance">Maintenance</option>
                    </select>
                </div>
            </div>

            {/* Numeric Fields */}
            <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                        name="bedrooms"
                        id="bedrooms"
                        type="number"
                        min="0"
                        placeholder="2"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                        name="bathrooms"
                        id="bathrooms"
                        type="number"
                        min="0"
                        placeholder="1"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                    <Label htmlFor="size_sqm">Size (sqm)</Label>
                    <Input
                        name="size_sqm"
                        id="size_sqm"
                        type="number"
                        step="0.01"
                        placeholder="75.5"
                    />
                </div>

                <div>
                    <Label htmlFor="monthly_rent">Monthly Rent ($)</Label>
                    <Input
                        name="monthly_rent"
                        id="monthly_rent"
                        type="number"
                        step="0.01"
                        placeholder="1200.00"
                    />
                </div>
            </div>
        </FormModal>
    );
}
