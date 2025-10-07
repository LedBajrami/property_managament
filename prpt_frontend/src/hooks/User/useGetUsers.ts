import {useQuery} from "@tanstack/react-query";
import {getUsers} from "@/library/http/backendHelpers.ts";
import {APIResponse} from "@/types/API.ts";

export const useGetUsers = () => {
    return useQuery<APIResponse<any>>({
        queryKey: ['users'],
        queryFn: getUsers,
    })
}