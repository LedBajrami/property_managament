import { useMutation } from '@tanstack/react-query';
import {deleteUser} from '@/library/http/backendHelpers.ts';

export const useDeleteUser = () => {
    return useMutation<unknown, Error, number>({
        mutationFn: deleteUser,
    });
};