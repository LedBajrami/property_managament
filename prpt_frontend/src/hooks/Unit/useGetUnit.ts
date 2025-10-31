import { useQuery } from "@tanstack/react-query";
import { getUnit} from "@/library/http/backendHelpers.ts";
import { APIResponse } from "@/types/API.ts";
import {Unit} from "@/types/unit.ts";

export const useGetUnit = (unitId?: number) => {
    return useQuery<APIResponse<Unit>>({
        queryKey: ['unit', unitId],
        queryFn: () => getUnit(unitId),
    });
};