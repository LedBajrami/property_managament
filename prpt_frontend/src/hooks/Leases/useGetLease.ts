import { useQuery } from "@tanstack/react-query";
import { getLease} from "@/library/http/backendHelpers.ts";
import { APIResponse } from "@/types/API.ts";
import {Lease} from "@/types/lease.ts";

export const useGetLease = (leaseId?: number) => {
    return useQuery<APIResponse<Lease>>({
        queryKey: ['lease', leaseId],
        queryFn: () => getLease(leaseId),
    });
};