export interface DepositTransaction {
    id: number;
    lease_id: number;
    type: 'paid' | 'returned';
    amount: string;
    transaction_date: string;
    payment_method: 'card' | 'bank_transfer' | 'cash' | 'check';
    transaction_id?: string;
    notes?: string;
    processed_by: {
        id: number;
        first_name: string;
        last_name: string;
    };
    created_at: string;
}

export interface DepositSummary {
    deposit_amount: string;
    total_paid: string;
    total_returned: string;
    balance: string;
    is_paid: boolean;
    is_returned: boolean;
    transactions: DepositTransaction[];
}

export interface RecordDepositPaidParams {
    amount: number;
    transaction_date: string;
    payment_method: 'card' | 'bank_transfer' | 'cash' | 'check';
    transaction_id?: string;
    notes?: string;
}

export interface RecordDepositReturnParams {
    amount: number;
    transaction_date: string;
    payment_method: 'card' | 'bank_transfer' | 'cash' | 'check';
    transaction_id?: string;
    notes?: string;
}

export interface DepositTransactionResponse {
    id: number;
    lease_id: number;
    type: 'paid' | 'returned';
    amount: string;
    transaction_date: string;
    payment_method: string;
    transaction_id?: string;
    notes?: string;
    processed_by: {
        id: number;
        first_name: string;
        last_name: string;
    };
    created_at: string;
}