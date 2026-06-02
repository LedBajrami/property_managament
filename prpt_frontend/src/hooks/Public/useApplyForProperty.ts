import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitApplication } from '@/library/http/backendHelpers';
import { SubmitApplicationParams, RentalApplication } from '@/types/publicProperty';
import { APIResponse } from '@/types/API';
import { toast } from 'sonner';

export const useApplyForProperty = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation<APIResponse<RentalApplication>, Error, SubmitApplicationParams>({
        mutationFn: submitApplication,
        onSuccess: () => {
            toast.success('Application submitted successfully!');
            queryClient.invalidateQueries({ queryKey: ['public', 'applications', 'mine'] });
            onSuccess?.();
        },
        onError: (error: any) => {
            toast.error('Failed to submit application', {
                description: error?.message || 'Please try again.',
            });
        },
    });
};
