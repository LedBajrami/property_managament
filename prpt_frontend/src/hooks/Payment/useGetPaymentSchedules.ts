import { useQuery } from "@tanstack/react-query";
import { getPaymentSchedules } from "@/library/http/backendHelpers.ts";
import { APIResponse } from "@/types/API.ts";
import { PaymentSchedule, PaymentScheduleFilters } from "@/types/payment.ts";

export const useGetPaymentSchedules = (filters?: PaymentScheduleFilters) => {
    return useQuery<APIResponse<PaymentSchedule[]>>({
        queryKey: ['paymentSchedules', filters],
        queryFn: () => getPaymentSchedules(filters),
    });
};
