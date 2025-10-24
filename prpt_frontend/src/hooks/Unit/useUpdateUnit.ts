import { useMutation } from '@tanstack/react-query';
import { editUnit } from '@/library/http/backendHelpers.ts';
import { UpdateUnitParams, UpdateUnitResponse } from "@/types/unit.ts";

export const useUpdateUnit = () => {
    return useMutation<UpdateUnitResponse, Error, UpdateUnitParams>({
        mutationFn: editUnit,
    });
};