import {APIResponse} from "@/types/API.ts";

export interface CreateUserParams {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
}

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
}

export type CreateUserResponse = APIResponse<User>
