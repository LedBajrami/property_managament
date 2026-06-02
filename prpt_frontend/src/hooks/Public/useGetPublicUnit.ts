import { useQuery } from '@tanstack/react-query';
import { getPublicPropertyUnit } from '@/library/http/backendHelpers';
import { PublicUnit } from '@/types/publicProperty';
import { APIResponse } from '@/types/API';

export const useGetPublicUnit = (propertyId?: number, unitId?: number) => {
    return useQuery<APIResponse<PublicUnit>>({
        queryKey: ['public', 'properties', propertyId, 'units', unitId],
        queryFn: () => getPublicPropertyUnit(propertyId!, unitId!),
        enabled: !!propertyId && !!unitId,
    });
};
