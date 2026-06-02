import { useQuery } from '@tanstack/react-query';
import { getPublicProperties } from '@/library/http/backendHelpers';
import { PropertyFilters, PublicProperty } from '@/types/publicProperty';
import { APIResponse } from '@/types/API';

export const useGetPublicProperties = (filters?: PropertyFilters) => {
    return useQuery<APIResponse<PublicProperty[]>>({
        queryKey: ['public', 'properties', filters],
        queryFn: () => getPublicProperties(filters),
    });
};
