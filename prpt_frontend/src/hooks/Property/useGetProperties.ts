import { useQuery } from "@tanstack/react-query";
import { getProperties } from "@/library/http/backendHelpers.ts";
import { APIResponse } from "@/types/API.ts";

export const useGetProperties = () => {
    return useQuery<APIResponse<any>>({
        queryKey: ['properties'],
        queryFn: getProperties,
    });
};