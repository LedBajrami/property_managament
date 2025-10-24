import { useMutation } from '@tanstack/react-query';
import { editProperty } from '@/library/http/backendHelpers.ts';
import { UpdatePropertyParams, UpdatePropertyResponse } from "@/types/property.ts";

export const useUpdateProperty = () => {
    return useMutation<UpdatePropertyResponse, Error, UpdatePropertyParams>({
        mutationFn: editProperty,
    });
};