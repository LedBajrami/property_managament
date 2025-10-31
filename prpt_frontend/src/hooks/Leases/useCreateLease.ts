import { useMutation } from '@tanstack/react-query';
import {createLease} from '@/library/http/backendHelpers.ts';
import { CreateLeaseParams, CreateLeaseResponse } from "@/types/lease.ts";

export const useCreateLease = () => {
    return useMutation<CreateLeaseResponse, Error, CreateLeaseParams>({
        mutationFn: createLease,
    });
};