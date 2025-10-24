import { useMutation } from '@tanstack/react-query';
import { createProperty } from '@/library/http/backendHelpers.ts';
import { CreatePropertyParams, CreatePropertyResponse } from "@/types/property.ts";

export const useCreateProperty = () => {
    return useMutation<CreatePropertyResponse, Error, CreatePropertyParams>({
        mutationFn: createProperty,
    });
};