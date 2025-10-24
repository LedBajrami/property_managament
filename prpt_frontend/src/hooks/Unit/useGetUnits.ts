import { useQuery } from "@tanstack/react-query";
import { getUnits } from "@/library/http/backendHelpers.ts";
import { APIResponse } from "@/types/API.ts";

export const useGetUnits = (propertyId?: number) => {
    return useQuery<APIResponse<any>>({
        queryKey: ['units', propertyId],
        queryFn: () => getUnits(propertyId),
    });
};