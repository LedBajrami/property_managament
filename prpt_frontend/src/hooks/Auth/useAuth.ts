import { useQuery } from '@tanstack/react-query';
import { getUserState } from '../../library/http/backendHelpers.ts';
import {AuthResponse} from "@/types/auth.ts";

export const useAuth = () => {
    const token = localStorage.getItem('token');

    const { data, isLoading, error } = useQuery<AuthResponse>({
        queryKey: ['auth', 'user'],
        queryFn: getUserState,
        enabled: !!token,
        retry: false,
    });

    return {
        user: data?.user,
        isAuthenticated: !!data && !!token,
        isLoading,
        error,
    };
};