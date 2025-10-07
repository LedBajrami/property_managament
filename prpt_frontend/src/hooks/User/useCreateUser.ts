import { useMutation } from '@tanstack/react-query';
import {createUser} from '@/library/http/backendHelpers.ts';
import {CreateUserParams, CreateUserResponse} from "@/types/user.ts";

export const useCreateUser = () => {
    return useMutation<CreateUserResponse, Error, CreateUserParams>({
        mutationFn: createUser,
    });
};