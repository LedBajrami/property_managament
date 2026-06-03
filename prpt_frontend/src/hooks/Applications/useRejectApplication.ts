import { useMutation } from "@tanstack/react-query";
import { rejectApplication } from "@/library/http/backendHelpers";
import { RejectApplicationParams } from "@/types/application";

export const useRejectApplication = () => {
    return useMutation({
        mutationFn: ({ applicationId, data }: { applicationId: number; data: RejectApplicationParams }) =>
            rejectApplication(applicationId, data),
    });
};
