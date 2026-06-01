import { useMutation } from "@tanstack/react-query";
import { recordDepositReturn } from "@/library/http/backendHelpers.ts";
import { RecordDepositReturnParams, DepositTransactionResponse } from "@/types/deposit.ts";
import { APIResponse } from "@/types/API.ts";

export const useRecordDepositReturn = () => {
    return useMutation<APIResponse<DepositTransactionResponse>, Error, { leaseId: number; data: RecordDepositReturnParams }>({
        mutationFn: ({ leaseId, data }) => recordDepositReturn(leaseId, data),
    });
};