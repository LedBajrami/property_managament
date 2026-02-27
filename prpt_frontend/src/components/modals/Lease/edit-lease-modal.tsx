import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormModal } from "@/components/form-modal";
import { FormEvent } from "react";
import { UpdateLeaseParams } from "@/types/lease";

export function EditLeaseModal({ open, onOpenChange, onSubmit, isPending, leaseData }: any) {
    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const updateLeaseData: UpdateLeaseParams = {
            lease_id: leaseData?.id,
            end_date: formData.get("end_date") as string || undefined,
            monthly_rent: formData.get("monthly_rent") ? Number(formData.get("monthly_rent")) : undefined,
            deposit_amount: formData.get("deposit_amount") ? Number(formData.get("deposit_amount")) : undefined,
            move_in_date: formData.get("move_in_date") as string || undefined,
            move_out_date: formData.get("move_out_date") as string || undefined,
            notice_date: formData.get("notice_date") as string || undefined,
            rent_due_day: formData.get("rent_due_day") ? Number(formData.get("rent_due_day")) : undefined,
            late_fee_amount: formData.get("late_fee_amount") ? Number(formData.get("late_fee_amount")) : undefined,
            late_fee_grace_days: formData.get("late_fee_grace_days") ? Number(formData.get("late_fee_grace_days")) : undefined,
            deposit_paid: formData.get("deposit_paid") === "on",
            deposit_paid_date: formData.get("deposit_paid_date") as string || undefined,
            auto_renew: formData.get("auto_renew") === "on",
            utilities_included: formData.get("utilities_included")
                ? (formData.get("utilities_included") as string)
                    .split(",")
                    .map((u) => u.trim())
                : undefined,
            parking_included: formData.get("parking_included") === "on",
            pets_allowed: formData.get("pets_allowed") === "on",
            special_terms: formData.get("special_terms") as string || undefined,
        };

        onSubmit(updateLeaseData);
    };

    return (
        <FormModal
            open={open}
            onOpenChange={onOpenChange}
            title="Edit Lease"
            description="Modify the lease details below"
            onSubmit={handleFormSubmit as any}
            submitText="Save Changes"
            size="lg"
            isSubmitting={isPending}
        >
            <div className="grid grid-cols-2 gap-4">
                {/* End Date */}
                <div>
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                        defaultValue={leaseData?.end_date || ""}
                        name="end_date"
                        id="end_date"
                        type="date"
                        className="mt-1"
                    />
                </div>

                {/* Move In / Out */}
                <div>
                    <Label htmlFor="move_in_date">Move-In Date</Label>
                    <Input
                        defaultValue={leaseData?.move_in_date || ""}
                        name="move_in_date"
                        id="move_in_date"
                        type="date"
                    />
                </div>
                <div>
                    <Label htmlFor="move_out_date">Move-Out Date</Label>
                    <Input
                        defaultValue={leaseData?.move_out_date || ""}
                        name="move_out_date"
                        id="move_out_date"
                        type="date"
                    />
                </div>

                <div>
                    <Label htmlFor="notice_date">Notice Date</Label>
                    <Input
                        defaultValue={leaseData?.notice_date || ""}
                        name="notice_date"
                        id="notice_date"
                        type="date"
                    />
                </div>

                {/* Financials */}
                <div>
                    <Label htmlFor="monthly_rent">Monthly Rent ($)</Label>
                    <Input
                        defaultValue={leaseData?.monthly_rent}
                        name="monthly_rent"
                        id="monthly_rent"
                        type="number"
                        step="0.01"
                        placeholder="1500.00"
                    />
                </div>
                <div>
                    <Label htmlFor="deposit_amount">Deposit Amount ($)</Label>
                    <Input
                        defaultValue={leaseData?.deposit_amount}
                        name="deposit_amount"
                        id="deposit_amount"
                        type="number"
                        step="0.01"
                        placeholder="500.00"
                    />
                </div>

                <div>
                    <Label htmlFor="rent_due_day">Rent Due Day</Label>
                    <Input
                        defaultValue={leaseData?.rent_due_day}
                        name="rent_due_day"
                        id="rent_due_day"
                        type="number"
                        min="1"
                        max="31"
                        placeholder="1"
                    />
                </div>
                <div>
                    <Label htmlFor="late_fee_amount">Late Fee ($)</Label>
                    <Input
                        defaultValue={leaseData?.late_fee_amount}
                        name="late_fee_amount"
                        id="late_fee_amount"
                        type="number"
                        step="0.01"
                        placeholder="50.00"
                    />
                </div>
                <div>
                    <Label htmlFor="late_fee_grace_days">Grace Days</Label>
                    <Input
                        defaultValue={leaseData?.late_fee_grace_days}
                        name="late_fee_grace_days"
                        id="late_fee_grace_days"
                        type="number"
                        placeholder="5"
                    />
                </div>

                {/* Deposit Paid */}
                <div className="flex items-center gap-2 mt-6">
                    <input
                        type="checkbox"
                        name="deposit_paid"
                        id="deposit_paid"
                        defaultChecked={leaseData?.deposit_paid}
                    />
                    <Label htmlFor="deposit_paid">Deposit Paid</Label>
                </div>
                <div>
                    <Label htmlFor="deposit_paid_date">Deposit Paid Date</Label>
                    <Input
                        defaultValue={leaseData?.deposit_paid_date || ""}
                        name="deposit_paid_date"
                        id="deposit_paid_date"
                        type="date"
                    />
                </div>

                {/* Booleans */}
                <div className="flex items-center gap-2 mt-6">
                    <input
                        type="checkbox"
                        name="auto_renew"
                        id="auto_renew"
                        defaultChecked={leaseData?.auto_renew}
                    />
                    <Label htmlFor="auto_renew">Auto Renew</Label>
                </div>
                <div className="flex items-center gap-2 mt-6">
                    <input
                        type="checkbox"
                        name="parking_included"
                        id="parking_included"
                        defaultChecked={leaseData?.parking_included}
                    />
                    <Label htmlFor="parking_included">Parking Included</Label>
                </div>
                <div className="flex items-center gap-2 mt-6">
                    <input
                        type="checkbox"
                        name="pets_allowed"
                        id="pets_allowed"
                        defaultChecked={leaseData?.pets_allowed}
                    />
                    <Label htmlFor="pets_allowed">Pets Allowed</Label>
                </div>

                {/* Utilities */}
                <div className="col-span-2">
                    <Label htmlFor="utilities_included">Utilities Included (comma-separated)</Label>
                    <Input
                        defaultValue={leaseData?.utilities_included?.join(", ") || ""}
                        name="utilities_included"
                        id="utilities_included"
                        placeholder="water, electricity, internet"
                    />
                </div>

                {/* Special Terms */}
                <div className="col-span-2">
                    <Label htmlFor="special_terms">Special Terms</Label>
                    <Textarea
                        defaultValue={leaseData?.special_terms || ""}
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
