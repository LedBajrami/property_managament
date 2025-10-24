export interface Lease {
    id: number;
    resident_id: number;
    unit_id: number;
    start_date: string;
    end_date: string;
    monthly_rent: number;
    deposit_amount: number;
    status: "active" | "expired" | "terminated";
    unit?: {
        id: number;
        unit_number: string;
        property_id: number;
    };
    resident?: {
        id: number;
        name?: string;
        email?: string;
    };
    created_at: string;
    updated_at: string;
}

export interface CreateLeaseParams {
    resident_id: number;
    unit_id: number;
    start_date: string;
    end_date: string;
    monthly_rent: number;
    deposit_amount: number;
    status?: "active" | "expired" | "terminated";
}

export interface UpdateLeaseParams {
    lease_id: number;
    resident_id?: number;
    unit_id?: number;
    start_date?: string;
    end_date?: string;
    monthly_rent?: number;
    deposit_amount?: number;
    status?: "active" | "expired" | "terminated";
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
