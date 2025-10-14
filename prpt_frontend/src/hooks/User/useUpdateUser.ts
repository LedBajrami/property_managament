import { useMutation } from '@tanstack/react-query';
import {editUser} from '@/library/http/backendHelpers.ts';
import  {UpdateUserParams, UpdateUserResponse} from "@/types/user.ts";

export const useUpdateUser = () => {
    return useMutation<UpdateUserResponse, Error, UpdateUserParams>({
        mutationFn: editUser,
    });
};