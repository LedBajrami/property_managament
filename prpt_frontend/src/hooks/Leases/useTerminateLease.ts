import { useMutation } from '@tanstack/react-query';
import { terminateLease } from '@/library/http/backendHelpers.ts';
import {UpdateLeaseResponse} from "@/types/lease.ts";
// import {TerminateLeaseParams, UpdateLeaseResponse} from "@/types/lease.ts";

export const useTerminateLease = () => {
    return useMutation<UpdateLeaseResponse, Error, number>({
        mutationFn: (leaseId) => terminateLease(leaseId),
    });
};