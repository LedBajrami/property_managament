import { useQuery } from "@tanstack/react-query";
import { getDocuments } from "@/library/http/backendHelpers";
import { APIResponse } from "@/types/API";
import { CompanyDocument } from "@/types/dashboard";

export const useGetDocuments = () => {
    return useQuery<APIResponse<CompanyDocument[]>>({
        queryKey: ["documents"],
        queryFn: getDocuments,
    });
};
