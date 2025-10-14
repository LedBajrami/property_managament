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

// User State
export interface AuthResponse {
    user: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        companies: Array<any>;
        role: string;
    }
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