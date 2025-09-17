import { useMutation } from '@tanstack/react-query';
import { registerCompany} from '../library/http/backendHelpers';

interface RegisterData {
    name: string;
    email: string;
}


export const useRegisterCompany = () => {

    return useMutation<void, Error, RegisterData>({
        mutationFn: registerCompany,
    });
};