export interface DashboardCard {
    label: string;
    value: string;
    trend: string;
    trend_direction: "up" | "down";
    title: string;
    description: string;
}

export interface DashboardChartPoint {
    date: string;
    desktop: number;
    mobile: number;
}

export interface DashboardTableRow {
    id: number;
    header: string;
    type: string;
    status: string;
    target: string;
    limit: string;
    reviewer: string;
}

export interface DashboardReports {
    total_billed: number;
    collected: number;
    outstanding: number;
    collection_rate: number;
    occupancy_rate: number;
    properties: number;
    total_units: number;
    occupied_units: number;
    available_units: number;
    active_leases: number;
    draft_leases: number;
    pending_applications: number;
    overdue_payments: number;
}

export interface DashboardOverview {
    cards: DashboardCard[];
    chart: DashboardChartPoint[];
    table: DashboardTableRow[];
    reports: DashboardReports;
}

export interface CompanyDocument {
    id: number;
    document_type: string;
    original_name: string;
    mime_type?: string;
    file_size?: number;
    created_at: string;
}
