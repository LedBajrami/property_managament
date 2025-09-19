import {useMutation} from "@tanstack/react-query";
import { resetPassword} from "@/library/http/backendHelpers.ts";
import {useNavigate} from "react-router-dom";

export const useSetPassword = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: resetPassword,
        onSuccess: () => {
            navigate('/login')
        }
    })
}