import { useMutation } from '@tanstack/react-query';
import { editLease } from '@/library/http/backendHelpers.ts';
import { UpdateLeaseParams, UpdateLeaseResponse } from "@/types/lease.ts";

export const useUpdateLease = () => {
    return useMutation<UpdateLeaseResponse, Error, UpdateLeaseParams>({
        mutationFn: editLease,
    });
};