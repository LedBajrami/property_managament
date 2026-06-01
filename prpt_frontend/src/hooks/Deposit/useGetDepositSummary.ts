import { useQuery } from "@tanstack/react-query";
import { getDepositSummary } from "@/library/http/backendHelpers.ts";
import { APIResponse } from "@/types/API.ts";
import { DepositSummary } from "@/types/deposit.ts";

export const useGetDepositSummary = (leaseId?: number) => {
    return useQuery<APIResponse<DepositSummary>>({
        queryKey: ['deposit', leaseId],
        queryFn: () => getDepositSummary(leaseId!),
        enabled: !!leaseId,
    });
};