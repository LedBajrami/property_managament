import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormModal } from "@/components/form-modal";
import { FormEvent } from "react";
import { RenewLeaseParams } from "@/types/lease";

export function RenewLeaseModal({ open, onOpenChange, onSubmit, isPending, leaseData }: any) {
    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const renewLeaseData: RenewLeaseParams = {
            lease_id: leaseData?.id,
            start_date: formData.get("start_date") as string,
            end_date: formData.get("end_date") as string,
            monthly_rent: Number(formData.get("monthly_rent")),
        };

        onSubmit(renewLeaseData);
    };

    return (
        <FormModal
            open={open}
            onOpenChange={onOpenChange}
            title="Renew Lease"
            description="Set the lease details below"
            onSubmit={handleFormSubmit as any}
            submitText="Submit"
            size="lg"
            isSubmitting={isPending}
        >
            <div className="grid grid-cols-2 gap-4">
                {/* Start Date */}
                <div>
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                        defaultValue={leaseData?.start_date || ""}
                        name="start_date"
                        id="start_date"
                        type="date"
                        className="mt-1"
                        required
                    />
                </div>


                {/* End Date */}
                <div>
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                        defaultValue={leaseData?.end_date || ""}
                        name="end_date"
                        id="end_date"
                        type="date"
                        className="mt-1"
                        required
                    />
                </div>

                {/* Monthly Rent */}
                <div>
                    <Label htmlFor="monthly_rent">Monthly Rent ($)</Label>
                    <Input
                        name="monthly_rent"
                        id="monthly_rent"
                        type="number"
                        step="0.01"
                        placeholder="1500.00"
                        required
                    />
                </div>
            </div>
        </FormModal>
    );
}
