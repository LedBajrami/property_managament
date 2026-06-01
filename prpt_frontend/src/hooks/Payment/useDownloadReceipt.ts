import { useMutation } from "@tanstack/react-query";
import { downloadReceipt } from "@/library/http/backendHelpers.ts";

interface DownloadReceiptVariables {
    documentId: number;
    filename: string;
}

export const useDownloadReceipt = () => {
    return useMutation<void, Error, DownloadReceiptVariables>({
        mutationFn: ({ documentId, filename }) => downloadReceipt(documentId, filename),
    });
};
