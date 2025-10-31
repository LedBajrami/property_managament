export interface Lease {
    id: number;
    company_id: number;
    resident_id: number;
    unit_id: number;
    start_date: string;
    end_date: string;
    signed_date?: string;
    move_in_date?: string;
    move_out_date?: string;
    notice_date?: string;
    monthly_rent: number;
    deposit_amount: number;
    rent_due_day: number;
    late_fee_amount?: number;
    late_fee_grace_days: number;
    deposit_paid: boolean;
    deposit_paid_date?: string;
    deposit_returned: boolean;
    deposit_returned_date?: string;
    deposit_deductions: number;
    deposit_deduction_notes?: string;
    lease_type: 'fixed' | 'month-to-month' | 'renewal';
    parent_lease_id?: number;
    auto_renew: boolean;
    status: 'active' | 'expired' | 'terminated';
    termination_reason?: string;
    terminated_by?: 'tenant' | 'landlord' | 'mutual';
    terminated_at?: string;
    utilities_included?: string[];
    parking_included: boolean;
    pets_allowed: boolean;
    special_terms?: string;
    lease_document_id?: number;
    created_at: string;
    updated_at: string;
    resident?: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        phone?: string;
    };
    unit?: {
        id: number;
        unit_number: string;
        property: {
            id: number;
            name: string;
            address: string;
        };
    };
}

export interface CreateLeaseParams {
    resident_id: number;
    unit_id: number;
    start_date: string;
    end_date: string;
    monthly_rent: number;
    deposit_amount: number;
    signed_date?: string;
    move_in_date?: string;
    rent_due_day?: number;
    late_fee_amount?: number;
    late_fee_grace_days?: number;
    lease_type?: 'fixed' | 'month-to-month' | 'renewal';
    auto_renew?: boolean;
    utilities_included?: string[];
    parking_included?: boolean;
    pets_allowed?: boolean;
    special_terms?: string;
}

export interface UpdateLeaseParams {
    lease_id: number;
    end_date?: string;
    monthly_rent?: number;
    deposit_amount?: number;
    move_in_date?: string;
    move_out_date?: string;
    notice_date?: string;
    rent_due_day?: number;
    late_fee_amount?: number;
    late_fee_grace_days?: number;
    deposit_paid?: boolean;
    deposit_paid_date?: string;
    auto_renew?: boolean;
    utilities_included?: string[];
    parking_included?: boolean;
    pets_allowed?: boolean;
    special_terms?: string;
}

export interface TerminateLeaseParams {
    lease_id: number;
    termination_reason: string;
    terminated_by: 'tenant' | 'landlord' | 'mutual';
    move_out_date?: string;
}

export interface CreateLeaseResponse {
    success: boolean;
    message: string;
    data: Lease;
}

export interface UpdateLeaseResponse {
    success: boolean;
    message: string;
    data: Lease;
}