import { useMutation } from "@tanstack/react-query";
import { recordDepositPaid } from "@/library/http/backendHelpers.ts";
import { RecordDepositPaidParams, DepositTransactionResponse } from "@/types/deposit.ts";
import { APIResponse } from "@/types/API.ts";

export const useRecordDepositPaid = () => {
    return useMutation<APIResponse<DepositTransactionResponse>, Error, { leaseId: number; data: RecordDepositPaidParams }>({
        mutationFn: ({ leaseId, data }) => recordDepositPaid(leaseId, data),
    });
};