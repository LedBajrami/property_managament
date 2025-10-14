import {useQuery} from "@tanstack/react-query";
import {getResidents} from "@/library/http/backendHelpers.ts";
import {APIResponse} from "@/types/API.ts";

export const useGetResidents = () => {
    return useQuery<APIResponse<any>>({
        queryKey: ['residents'],
        queryFn: getResidents,
    })
}