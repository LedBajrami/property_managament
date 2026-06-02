// ─── Public Property Types ────────────────────────────────────────────────

export interface PublicUnit {
    id: number;
    property_id: number;
    unit_number: string;
    bedrooms: number;
    bathrooms: number;
    size_sqm: number | null;
    monthly_rent: number;
    status: 'available' | 'occupied' | 'maintenance';
    property?: PublicProperty;
}

export interface PublicProperty {
    id: number;
    company_id: number;
    name: string;
    address: string;
    description: string | null;
    property_type: string | null;
    year_built: number | null;
    parking_spaces: number | null;
    amenities: string[] | null;
    size: number | null;
    monthly_bill?: number | null;
    // Computed by backend
    total_units?: number;
    available_units?: number;
    min_rent?: number | null;
    max_rent?: number | null;
    units?: PublicUnit[];
}

// ─── Filter Types ─────────────────────────────────────────────────────────

export interface PropertyFilters {
    location?: string;
    property_type?: string;
    min_rent?: number;
    max_rent?: number;
    bedrooms?: number;
}

// ─── Application Types ────────────────────────────────────────────────────

export type EmploymentStatus =
    | 'employed'
    | 'self-employed'
    | 'unemployed'
    | 'student'
    | 'retired';

export interface ApplicationReference {
    name: string;
    phone: string;
    relationship?: string;
}

export interface SubmitApplicationParams {
    unit_id: number;
    annual_income: number;
    employment_status: EmploymentStatus;
    employer_name?: string;
    current_address: string;
    references?: ApplicationReference[];
}

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface RentalApplication {
    id: number;
    user_id: number;
    unit_id: number;
    company_id: number;
    annual_income: number;
    employment_status: EmploymentStatus;
    employer_name: string | null;
    current_address: string;
    references: ApplicationReference[] | null;
    status: ApplicationStatus;
    rejection_reason: string | null;
    reviewed_at: string | null;
    unit?: PublicUnit;
    created_at: string;
}