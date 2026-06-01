import { useQuery } from "@tanstack/react-query";
import { getLeases } from "@/library/http/backendHelpers.ts";
import { APIResponse } from "@/types/API.ts";
import { Lease } from "@/types/lease.ts";

export interface LeaseFilters {
    unit_id?: number;
    property_id?: number;
    status?: string;
    search?: string;
}

export const useGetLeases = (filters?: LeaseFilters) => {
    return useQuery<APIResponse<Lease[]>>({
        queryKey: ['leases', filters],
        queryFn: () => getLeases(filters),
    });
};