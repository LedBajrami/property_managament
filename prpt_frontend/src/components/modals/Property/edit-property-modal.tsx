import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UpdatePropertyParams} from "@/types/property";
import { FormModal } from "@/components/form-modal.tsx";
import {FormEvent} from "react";

export function EditPropertyModal({ open, onOpenChange, onSubmit, isPending, propertyData }: any) {

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const updatePropertyData: UpdatePropertyParams = {
            property_id: propertyData?.id,
            name: formData.get("name") as string,
            address: formData.get("address") as string,
            property_type: formData.get("property_type") as string,
            size: formData.get("size") ? Number(formData.get("size")) : undefined,
            monthly_bill: formData.get("monthly_bill") ? Number(formData.get("monthly_bill")) : undefined,
            year_built: formData.get("year_built") ? Number(formData.get("year_built")) : undefined,
            parking_spaces: formData.get("parking_spaces") ? Number(formData.get("parking_spaces")) : 0,
            description: formData.get("description") as string || undefined,
        };

        onSubmit(updatePropertyData);
    };
    console.log(propertyData)

    return (
        <FormModal
            open={open}
            onOpenChange={onOpenChange}
            title="Edit New Property"
            description="Edit the property."
            onSubmit={handleFormSubmit as any}
            submitText="Edit Property"
            size="md"
            isSubmitting={isPending}
        >
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                        defaultValue={propertyData?.name}
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
                        defaultValue={propertyData?.address}
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
                    defaultValue={propertyData?.property_type}
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
                    defaultValue={propertyData?.year_built}
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
                    defaultValue={propertyData?.size}
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
                    defaultValue={propertyData?.monthly_bill}
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
                    defaultValue={propertyData?.parking_spaces}
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
                    defaultValue={propertyData?.description}
                    name="description"
                    id="description"
                    placeholder="Modern apartment complex with excellent amenities..."
                    rows={3}
                />
            </div>
        </FormModal>
    );
}