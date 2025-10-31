import { useQuery } from "@tanstack/react-query";
import { getLeases } from "@/library/http/backendHelpers.ts";
import { APIResponse } from "@/types/API.ts";

export const useGetLeases = (unitId?: number) => {
    return useQuery<APIResponse<any>>({
        queryKey: ['leases', unitId],
        queryFn: () => getLeases(unitId),
    });
};