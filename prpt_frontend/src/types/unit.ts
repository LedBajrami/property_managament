import {Lease} from "@/types/lease.ts";

export interface Unit {
    id: number;
    property_id: number;
    unit_number: string;
    bedrooms: number;
    bathrooms: number;
    size_sqm?: number;
    monthly_rent?: number;
    status?: string;
    property?: {
        id: number;
        name: string;
        address: string;
    };
    current_lease?: Lease;
    created_at: string;
    updated_at: string;
}

export interface CreateUnitParams {
    property_id: number;
    unit_number: string;
    bedrooms: number;
    bathrooms: number;
    size_sqm?: number;
    monthly_rent?: number;
    status?: string;
}


export interface UpdateUnitParams {
    unit_id: number;
    unit_number?: string;
    bedrooms?: number;
    bathrooms?: number;
    size_sqm?: number;
    monthly_rent?: number;
    status?: string | any;
}

export interface CreateUnitResponse {
    success: boolean;
    message: string;
    data: Unit;
}

export interface UpdateUnitResponse {
    success: boolean;
    message: string;
    data: Unit;
}