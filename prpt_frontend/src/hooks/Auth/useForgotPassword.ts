import { useMutation } from '@tanstack/react-query';
import { forgotPasswordEmail } from '@/library/http/backendHelpers';

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: (data: { email: string }) => forgotPasswordEmail(data),
    });
};