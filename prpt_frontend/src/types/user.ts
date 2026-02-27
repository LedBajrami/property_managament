import {APIResponse} from "@/types/API.ts";

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
}

export interface CreateUserParams {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
}

export interface UpdateUserParams {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
}

export type CreateUserResponse = APIResponse<User>
export type UpdateUserResponse = APIResponse<User>;

