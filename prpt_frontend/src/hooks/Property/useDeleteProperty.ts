import { useMutation } from '@tanstack/react-query';
import { deleteProperty } from '@/library/http/backendHelpers.ts';

export const useDeleteProperty = () => {
    return useMutation<any, Error, number>({
        mutationFn: deleteProperty,
    });
};