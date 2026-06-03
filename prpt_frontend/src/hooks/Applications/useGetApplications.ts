import { useQuery } from "@tanstack/react-query";
import { getApplications } from "@/library/http/backendHelpers";
import { APIResponse } from "@/types/API";
import { ApplicationFilters, RentalApplicationReview } from "@/types/application";

export const useGetApplications = (filters?: ApplicationFilters) => {
    return useQuery<APIResponse<RentalApplicationReview[]>>({
        queryKey: ["applications", filters],
        queryFn: () => getApplications(filters),
    });
};
