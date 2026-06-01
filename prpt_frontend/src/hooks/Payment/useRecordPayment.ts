import { useMutation } from "@tanstack/react-query";
import { recordPayment } from "@/library/http/backendHelpers.ts";
import { RecordPaymentParams, RecordPaymentResponse } from "@/types/payment.ts";

interface RecordPaymentVariables {
    scheduleId: number;
    data: RecordPaymentParams;
}

export const useRecordPayment = () => {
    return useMutation<RecordPaymentResponse, Error, RecordPaymentVariables>({
        mutationFn: ({ scheduleId, data }) => recordPayment(scheduleId, data),
    });
};
