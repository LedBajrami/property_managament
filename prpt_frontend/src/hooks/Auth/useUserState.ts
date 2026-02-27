import {useQuery} from "@tanstack/react-query";
import {User} from "@/types/user.ts";
import {getUserState} from "@/library/http/backendHelpers.ts";

export const useUserState = () => {
    return useQuery<User>({
        queryKey: ['auth', 'user'],
        queryFn: getUserState,
        retry: false,
        staleTime: Infinity
    })
}