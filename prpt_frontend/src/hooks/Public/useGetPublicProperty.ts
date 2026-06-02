import { useQuery } from '@tanstack/react-query';
import { getPublicProperty } from '@/library/http/backendHelpers';
import { PublicProperty } from '@/types/publicProperty';
import { APIResponse } from '@/types/API';

export const useGetPublicProperty = (id?: number) => {
    return useQuery<APIResponse<PublicProperty>>({
        queryKey: ['public', 'properties', id],
        queryFn: () => getPublicProperty(id!),
        enabled: !!id,
    });
};
