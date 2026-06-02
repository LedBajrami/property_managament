import { useQuery } from '@tanstack/react-query';
import { getMyApplications } from '@/library/http/backendHelpers';
import { RentalApplication } from '@/types/publicProperty';
import { APIResponse } from '@/types/API';

export const useGetMyApplications = () => {
    return useQuery<APIResponse<RentalApplication[]>>({
        queryKey: ['public', 'applications', 'mine'],
        queryFn: getMyApplications,
    });
};
