import { FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormModal } from "@/components/form-modal";
import { CreateLeaseParams } from "@/types/lease";
import {useGetUnits} from "@/hooks/Unit/useGetUnits.ts";
import {useGetResidents} from "@/hooks/User/useGetResidents.ts";

export function AddLeaseModal({ open, onOpenChange, onSubmit, isPending, paramIds }: any) {
    const { data: residents, isLoading: residentsLoading } = useGetResidents();
    const { data: units, isLoading: unitsLoading } = useGetUnits(5);

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const createLeaseData: CreateLeaseParams = {
            resident_id: Number(formData.get("resident_id")),
            unit_id: paramIds?.unit_id ? Number(paramIds.unit_id) : Number(formData.get("unit_id")),
            start_date: formData.get("start_date") as string,
            end_date: formData.get("end_date") as string,
            monthly_rent: Number(formData.get("monthly_rent")),
            deposit_amount: Number(formData.get("deposit_amount")),
            signed_date: formData.get("signed_date") as string || undefined,
            move_in_date: formData.get("move_in_date") as string || undefined,
            rent_due_day: formData.get("rent_due_day") ? Number(formData.get("rent_due_day")) : undefined,
            late_fee_amount: formData.get("late_fee_amount") ? Number(formData.get("late_fee_amount")) : undefined,
            late_fee_grace_days: formData.get("late_fee_grace_days") ? Number(formData.get("late_fee_grace_days")) : undefined,
            lease_type: formData.get("lease_type") as "fixed" | "month-to-month" | "renewal",
            auto_renew: formData.get("auto_renew") === "on",
            utilities_included: formData.get("utilities_included")
                ? (formData.get("utilities_included") as string)
                    .split(",")
                    .map((u) => u.trim())
                : [],
            parking_included: formData.get("parking_included") === "on",
            pets_allowed: formData.get("pets_allowed") === "on",
            special_terms: formData.get("special_terms") as string || undefined,
        };

        onSubmit(createLeaseData);
    };

    return (
        <FormModal
            open={open}
            onOpenChange={onOpenChange}
            title="Add New Lease"
            description="Fill out the lease details below"
            onSubmit={handleFormSubmit as any}
            submitText="Add Lease"
            size="lg"
            isSubmitting={isPending}
        >
            <div className="grid grid-cols-2 gap-4">
                {/* Resident Dropdown */}
                <div>
                    <Label htmlFor="resident_id">Resident</Label>
                    <select
                        name="resident_id"
                        id="resident_id"
                        required
                        className="mt-2 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        disabled={residentsLoading}
                    >
                        <option value="">Select Resident</option>
                        {residents?.data?.map((user: any) => (
                            <option key={user.id} value={user.id}>
                                {user.first_name} {user.last_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Unit Dropdown or Fixed */}
                <div>
                    <Label htmlFor="unit_id">Unit</Label>
                    {paramIds?.unit_id ? (
                        <Input
                            type="text"
                            value={`Unit #${paramIds.unit_number || paramIds.unit_id}`}
                            disabled
                            className="mt-2"
                        />
                    ) : (
                        <select
                            name="unit_id"
                            id="unit_id"
                            required
                            className="mt-2 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            disabled={unitsLoading}
                        >
                            <option value="">Select Unit</option>
                            {units?.data?.map((unit: any) => (
                                <option key={unit.id} value={unit.id}>
                                    {unit.unit_number} — {unit.property?.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Dates */}
                <div>
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input name="start_date" id="start_date" type="date" required />
                </div>
                <div>
                    <Label htmlFor="end_date">End Date</Label>
                    <Input name="end_date" id="end_date" type="date" required />
                </div>

                <div>
                    <Label htmlFor="signed_date">Signed Date</Label>
                    <Input name="signed_date" id="signed_date" type="date" />
                </div>
                <div>
                    <Label htmlFor="move_in_date">Move-In Date</Label>
                    <Input name="move_in_date" id="move_in_date" type="date" />
                </div>

                {/* Financials */}
                <div>
                    <Label htmlFor="monthly_rent">Monthly Rent ($)</Label>
                    <Input name="monthly_rent" id="monthly_rent" type="number" step="0.01" placeholder="1500.00" required />
                </div>
                <div>
                    <Label htmlFor="deposit_amount">Deposit ($)</Label>
                    <Input name="deposit_amount" id="deposit_amount" type="number" step="0.01" placeholder="500.00" required />
                </div>

                <div>
                    <Label htmlFor="rent_due_day">Rent Due Day</Label>
                    <Input name="rent_due_day" id="rent_due_day" type="number" min="1" max="31" placeholder="1" />
                </div>
                <div>
                    <Label htmlFor="late_fee_amount">Late Fee ($)</Label>
                    <Input name="late_fee_amount" id="late_fee_amount" type="number" step="0.01" placeholder="50.00" />
                </div>
                <div>
                    <Label htmlFor="late_fee_grace_days">Grace Period (days)</Label>
                    <Input name="late_fee_grace_days" id="late_fee_grace_days" type="number" placeholder="5" />
                </div>

                {/* Lease Type */}
                <div>
                    <Label htmlFor="lease_type">Lease Type</Label>
                    <select
                        name="lease_type"
                        id="lease_type"
                        required
                        className="mt-2 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        <option value="">Select Type</option>
                        <option value="fixed">Fixed</option>
                        <option value="month-to-month">Month-to-Month</option>
                        <option value="renewal">Renewal</option>
                    </select>
                </div>

                {/* Booleans */}
                <div className="flex items-center gap-2 mt-6">
                    <input type="checkbox" name="auto_renew" id="auto_renew" />
                    <Label htmlFor="auto_renew">Auto Renew</Label>
                </div>
                <div className="flex items-center gap-2 mt-6">
                    <input type="checkbox" name="parking_included" id="parking_included" />
                    <Label htmlFor="parking_included">Parking Included</Label>
                </div>
                <div className="flex items-center gap-2 mt-6">
                    <input type="checkbox" name="pets_allowed" id="pets_allowed" />
                    <Label htmlFor="pets_allowed">Pets Allowed</Label>
                </div>

                {/* Utilities */}
                <div className="col-span-2">
                    <Label htmlFor="utilities_included">Utilities Included (comma-separated)</Label>
                    <Input
                        name="utilities_included"
                        id="utilities_included"
                        placeholder="water, electricity, internet"
                    />
                </div>

                {/* Special Terms */}
                <div className="col-span-2">
                    <Label htmlFor="special_terms">Special Terms</Label>
                    <Textarea
                        name="special_terms"
                        id="special_terms"
                        placeholder="Any special agreements or conditions..."
                        rows={3}
                    />
                </div>
            </div>
        </FormModal>
    );
}
