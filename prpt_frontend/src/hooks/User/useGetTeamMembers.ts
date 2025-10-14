import {useQuery} from "@tanstack/react-query";
import {getTeamMembers} from "@/library/http/backendHelpers.ts";
import {APIResponse} from "@/types/API.ts";

export const useGetTeamMembers = () => {
    return useQuery<APIResponse<any>>({
        queryKey: ['teamMembers'],
        queryFn: getTeamMembers,
    })
}