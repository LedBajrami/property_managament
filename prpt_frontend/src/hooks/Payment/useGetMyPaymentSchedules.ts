import { useQuery } from "@tanstack/react-query";
import { getMyPaymentSchedules } from "@/library/http/backendHelpers.ts";
import { APIResponse } from "@/types/API.ts";
import { PaymentSchedule, PaymentScheduleFilters } from "@/types/payment.ts";

export const useGetMyPaymentSchedules = (filters?: PaymentScheduleFilters) => {
    return useQuery<APIResponse<PaymentSchedule[]>>({
        queryKey: ['myPaymentSchedules', filters],
        queryFn: () => getMyPaymentSchedules(filters),
    });
};
