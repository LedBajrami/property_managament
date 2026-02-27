import { useMutation } from '@tanstack/react-query';
import { resendSetPasswordLink } from '@/library/http/backendHelpers';

export const useResendSetPasswordLink = () => {
    return useMutation({
        mutationFn: (id: string | undefined) => resendSetPasswordLink(id),
    });
};