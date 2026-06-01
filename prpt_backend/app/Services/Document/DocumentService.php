<?php

namespace App\Services\Document;

use App\Models\Document;
use App\Models\PaymentTransaction;
use App\Traits\ApiTrait;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentService
{
    use ApiTrait;

    public function download(Document $document): StreamedResponse|\Illuminate\Http\JsonResponse
    {
        try {
            if (! $this->userCanAccessDocument($document)) {
                return $this->error('Unauthorized to access this document', 403);
            }

            if (! Storage::disk('documents')->exists($document->file_path)) {
                return $this->error('File not found', 404);
            }

            $filename = $document->original_name ?? basename($document->file_path);

            return Storage::disk('documents')->download($document->file_path, $filename, [
                'Content-Type' => $document->mime_type ?? 'application/octet-stream',
            ]);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    private function userCanAccessDocument(Document $document): bool
    {
        $user = auth()->user();
        $company = app('current_company');

        if (! $user || ! $company) {
            return false;
        }

        if ($document->company_id !== $company->id) {
            return false;
        }

        if ($user->hasRole('resident')) {
            return $this->residentOwnsDocument($document, $user->id);
        }

        return $user->can('view-documents');
    }

    private function residentOwnsDocument(Document $document, int $userId): bool
    {
        if ($document->documentable_type !== PaymentTransaction::class) {
            return false;
        }

        $transaction = PaymentTransaction::with('paymentSchedule.lease')->find($document->documentable_id);

        return $transaction
            && $transaction->paymentSchedule?->lease?->resident_id === $userId;
    }
}
