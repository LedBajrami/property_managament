import { useMutation } from '@tanstack/react-query';
import { deleteLease } from '@/library/http/backendHelpers.ts';

export const useDeleteLease = () => {
    return useMutation<any, Error, number>({
        mutationFn: deleteLease,
    });
};