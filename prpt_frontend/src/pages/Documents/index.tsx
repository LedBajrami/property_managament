import AdminLayout from "@/components/layouts/admin-layout";
import { useGetDocuments } from "@/hooks/Document/useGetDocuments";
import { useDownloadDocument } from "@/hooks/Document/useDownloadDocument";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";

const formatBytes = (bytes?: number) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function DocumentsPage() {
    const { data, isLoading } = useGetDocuments();
    const { mutate: downloadDocument, isPending } = useDownloadDocument();
    const documents = data?.data ?? [];

    const handleDownload = (documentId: number, filename: string) => {
        downloadDocument(
            { documentId, filename },
            { onError: () => toast.error("Failed to download document") }
        );
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Documents</h1>
                    <p className="text-muted-foreground text-sm">View and download company documents.</p>
                </div>

                {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading documents...</p>
                ) : documents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground rounded-lg border">
                        <FileText className="w-10 h-10 mb-3 opacity-30" />
                        <p className="font-medium">No documents found</p>
                    </div>
                ) : (
                    <div className="rounded-lg border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {documents.map((document) => (
                                    <TableRow key={document.id}>
                                        <TableCell className="font-medium">{document.original_name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{document.document_type}</Badge>
                                        </TableCell>
                                        <TableCell>{formatBytes(document.file_size)}</TableCell>
                                        <TableCell>{new Date(document.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                disabled={isPending}
                                                onClick={() => handleDownload(document.id, document.original_name)}
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                Download
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
