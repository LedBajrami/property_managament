import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../../library/http/backendHelpers.ts';
import { toast } from 'sonner';
import {LoginData, LoginResponse} from "@/types/auth.ts";

export const useLogin = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation<LoginResponse, Error, LoginData>({
        mutationFn: loginRequest,
        onSuccess: (response) => {
            // Store token and user in localStorage
            localStorage.setItem('token', response.data.token.access_token);

            // Update the auth query cache
            queryClient.setQueryData(['auth', 'user'], response.data.user);

            // Show success message
            toast.success('Login successful!');

            // Handle navigation based on company count
            if (response.data.user.companies.length > 1) {
                navigate('/select-company');
            } else if (response.data.user.companies.length === 1) {
                localStorage.setItem('current_company_id', response.data.user.companies[0].id.toString());
                navigate('/dashboard');
            } else {
                toast.error('No companies assigned to your account');
                navigate('/login');
            }
        },
        onError: (error: any) => {
            toast.error('Login failed', {
                description: error?.message || 'Please check your credentials',
            });
        },
    });
};