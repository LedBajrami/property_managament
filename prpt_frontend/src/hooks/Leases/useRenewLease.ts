import { useMutation } from '@tanstack/react-query';
import { renewLease } from '@/library/http/backendHelpers.ts';
import {RenewLeaseParams, UpdateLeaseResponse} from "@/types/lease.ts";

export const useRenewLease = () => {
    return useMutation<UpdateLeaseResponse, Error, RenewLeaseParams>({
        mutationFn: renewLease,
    });
};