import { useMutation } from '@tanstack/react-query';
import { terminateLease } from '@/library/http/backendHelpers.ts';
import {TerminateLeaseParams, UpdateLeaseResponse} from "@/types/lease.ts";

export const useTerminateLease = (leaseId?: number) => {
    return useMutation<UpdateLeaseResponse, Error, TerminateLeaseParams>({
        mutationFn: () => terminateLease(leaseId),
    });
};