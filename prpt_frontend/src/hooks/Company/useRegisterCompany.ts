import { useMutation } from '@tanstack/react-query';
import { registerCompany} from '@/library/http/backendHelpers.ts';

interface RegisterCompanyData {
    name: string;
    email: string;
    address: string;
    phone: string;
    adminName: string;
    adminLastName: string;
    adminEmail: string;
}

interface RegisterCompanyResponse {
   error: boolean;
   message: string;
   code: number;
    data: {
       name: string;
       email: string;
       phone: string;
       address: string;
   }
}


export const useRegisterCompany = () => {
    return useMutation<RegisterCompanyResponse, Error, RegisterCompanyData>({
        mutationFn: registerCompany,
    });
};