import { useQuery } from "@tanstack/react-query";
import { getProperty} from "@/library/http/backendHelpers.ts";
import { APIResponse } from "@/types/API.ts";
import {Property} from "@/types/property.ts";

export const useGetProperty = (propertyId?: number) => {
    return useQuery<APIResponse<Property>>({
        queryKey: ['property', propertyId],
        queryFn: () => getProperty(propertyId),
    });
};