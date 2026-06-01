export type PaymentStatus = 'pending' | 'paid' | 'overdue';
export type PaymentMethod = 'card' | 'bank_transfer' | 'cash';

export interface PaymentReceipt {
    id: number;
    original_name: string;
}

export interface PaymentTransactionSummary {
    id: number;
    amount_paid: number;
    payment_date: string;
    payment_method: PaymentMethod;
    receipt_document_id?: number;
    receipt?: PaymentReceipt | null;
}

export interface PaymentSchedule {
    id: number;
    lease_id: number;
    due_date: string;
    amount: number;
    status: PaymentStatus;
    late_fee?: number;
    total_due: number;
    resident?: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
    };
    unit?: {
        id: number;
        unit_number: string;
        property?: {
            id: number;
            name: string;
            address: string;
        };
    };
    latest_transaction?: PaymentTransactionSummary | null;
    created_at: string;
    updated_at: string;
}

export interface PaymentScheduleFilters {
    status?: PaymentStatus;
    unit_id?: number;
    lease_id?: number;
}

export interface RecordPaymentParams {
    amount_paid: number;
    payment_date?: string;
    payment_method: PaymentMethod;
    transaction_id?: string;
    notes?: string;
}

export interface RecordPaymentResponse {
    error: boolean;
    message: string;
    code: number;
    data: {
        transaction: {
            id: number;
            receipt_document_id?: number;
            receipt?: PaymentReceipt;
        };
        receipt: PaymentReceipt;
    };
}
