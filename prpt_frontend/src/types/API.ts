export interface APIResponse<T> {
    message: string;
    error: boolean;
    code: number;
    data: T;
}