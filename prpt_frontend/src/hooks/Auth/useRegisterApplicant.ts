import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { registerApplicant } from '../../library/http/backendHelpers.ts';
import { toast } from 'sonner';
import { RegisterApplicantData, RegisterApplicantResponse } from "@/types/auth.ts";

export const useRegisterApplicant = () => {
    const navigate = useNavigate();

    return useMutation<RegisterApplicantResponse, Error, RegisterApplicantData>({
        mutationFn: registerApplicant,
        onSuccess: () => {
            toast.success('Registration successful!', {
                description: 'Check your email to set your password and complete registration.',
            });

            // Redirect to login after a short delay
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        },
        onError: (error: any) => {
            toast.error('Registration failed', {
                description: error?.message || 'Please try again with valid information.',
            });
        },
    });
};