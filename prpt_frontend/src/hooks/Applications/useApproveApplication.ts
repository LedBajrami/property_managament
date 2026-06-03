import { useMutation } from "@tanstack/react-query";
import { approveApplication } from "@/library/http/backendHelpers";
import { ApproveApplicationParams } from "@/types/application";

export const useApproveApplication = () => {
    return useMutation({
        mutationFn: ({ applicationId, data }: { applicationId: number; data: ApproveApplicationParams }) =>
            approveApplication(applicationId, data),
    });
};
