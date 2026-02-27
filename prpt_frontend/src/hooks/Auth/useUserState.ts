import {useQuery} from "@tanstack/react-query";
import {APIResponse} from "@/types/API.ts";
import {User} from "@/types/user.ts";
import {getUserState} from "@/library/http/backendHelpers.ts";

export const useUserState = () => {
    return useQuery<APIResponse<User>>({
        queryKey: ['auth', 'user'],
        queryFn: getUserState,
        retry: false,
        staleTime: Infinity
    })
}