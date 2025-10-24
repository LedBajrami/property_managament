import { useMutation } from '@tanstack/react-query';
import { createUnit } from '@/library/http/backendHelpers.ts';
import { CreateUnitParams, CreateUnitResponse } from "@/types/unit.ts";

export const useCreateUnit = () => {
    return useMutation<CreateUnitResponse, Error, CreateUnitParams>({
        mutationFn: createUnit,
    });
};