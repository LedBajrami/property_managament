export interface Property {
    id: number;
    company_id: number;
    name: string;
    address: string;
    size?: number;
    monthly_bill: number;
    description?: string;
    property_type: string;
    year_built?: number;
    parking_spaces: number;
    amenities?: any;
    total_units?: number;
    occupied_units?: number;
    available_units?: number;
    maintenance_units?: number;
    occupancy_rate?: number;
    created_at: string;
    updated_at: string;
}

export interface CreatePropertyParams {
    name: string;
    address: string;
    property_type: string;
    size?: number;
    monthly_bill?: number;
    description?: string;
    year_built?: number;
    parking_spaces?: number;
    amenities?: string[] | any;
}

export interface UpdatePropertyParams {
    property_id: number;
    name?: string;
    address?: string;
    property_type?: string;
    size?: number;
    monthly_bill?: number;
    description?: string;
    year_built?: number;
    parking_spaces?: number;
    amenities?: string[] | any;
}

export interface CreatePropertyResponse {
    success: boolean;
    message: string;
    data: Property;
}

export interface UpdatePropertyResponse {
    success: boolean;
    message: string;
    data: Property;
}