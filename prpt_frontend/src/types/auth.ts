// Login
export interface LoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    data: {
        token: {
            access_token: string;
        };
        user: {
            id: string;
            name: string;
            email: string;
            companies: Array<any>;
            role: string;
        };
    }
}

// Applicant Registration
export interface RegisterApplicantData {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
}

export interface RegisterApplicantResponse {
    data: {
        user_id: number;
        email: string;
    },
    message: string;
}

// User State
export interface AuthResponse {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    companies: Array<any>;
    role: string;
}


// Password
export interface PasswordData {
    password: string;
    password_confirm: string;
}

export interface ResetPasswordParams {
    url: string;
    data: PasswordData;
}