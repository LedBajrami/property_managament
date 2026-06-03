import { useMutation } from "@tanstack/react-query";
import { downloadDocument } from "@/library/http/backendHelpers";

export const useDownloadDocument = () => {
    return useMutation({
        mutationFn: ({ documentId, filename }: { documentId: number; filename: string }) =>
            downloadDocument(documentId, filename),
    });
};
