import { useMutation } from '@tanstack/react-query';
import { deleteUnit } from '@/library/http/backendHelpers.ts';

export const useDeleteUnit = () => {
    return useMutation<any, Error, number>({
        mutationFn: deleteUnit,
    });
};