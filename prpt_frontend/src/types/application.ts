import { EmploymentStatus, ApplicationReference, PublicUnit } from "@/types/publicProperty";

export type RentalApplicationStatus = "pending" | "approved" | "rejected";

export interface RentalApplicationReview {
    id: number;
    user_id: number;
    unit_id: number;
    company_id: number;
    annual_income: number;
    employment_status: EmploymentStatus;
    employer_name: string | null;
    current_address: string;
    references: ApplicationReference[] | null;
    status: RentalApplicationStatus;
    rejection_reason: string | null;
    reviewed_at: string | null;
    reviewed_by: number | null;
    created_at: string;
    applicant?: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        phone?: string | null;
    };
    reviewer?: {
        id: number;
        first_name: string;
        last_name: string;
    } | null;
    unit?: PublicUnit;
}

export interface ApplicationFilters {
    status?: RentalApplicationStatus | "all";
}

export interface ApproveApplicationParams {
    start_date: string;
    end_date: string;
    monthly_rent?: number;
    deposit_amount: number;
    signed_date?: string;
    move_in_date?: string;
    rent_due_day?: number;
    late_fee_amount?: number;
    late_fee_grace_days?: number;
    lease_type?: "fixed" | "month-to-month" | "renewal";
    auto_renew?: boolean;
    utilities_included?: string[];
    parking_included?: boolean;
    pets_allowed?: boolean;
    special_terms?: string;
}

export interface RejectApplicationParams {
    rejection_reason: string;
}
