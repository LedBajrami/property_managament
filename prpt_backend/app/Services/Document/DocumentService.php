<?php

namespace App\Services\Document;

use App\Models\Document;
use App\Models\Lease;
use App\Models\PaymentTransaction;
use App\Traits\ApiTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentService
{
    use ApiTrait;

    public function list(): JsonResponse
    {
        try {
            $company = app('current_company');
            $user = auth()->user();

            $query = Document::where('company_id', $company->id)
                ->whereNotIn('document_type', ['property_photo', 'unit_photo', 'maintenance_photo'])
                ->with('documentable')
                ->latest();

            if ($user->hasRole('resident')) {
                $query->where(function ($builder) use ($user) {
                    $leaseIds = Lease::where('resident_id', $user->id)->pluck('id');
                    $transactionIds = PaymentTransaction::whereHas('paymentSchedule.lease', fn ($leaseQuery) => $leaseQuery->where('resident_id', $user->id))
                        ->pluck('id');

                    $builder->where(function ($leaseBuilder) use ($leaseIds) {
                        $leaseBuilder->where('documentable_type', Lease::class)
                            ->whereIn('documentable_id', $leaseIds);
                    })->orWhere(function ($paymentBuilder) use ($transactionIds) {
                        $paymentBuilder->where('documentable_type', PaymentTransaction::class)
                            ->whereIn('documentable_id', $transactionIds);
                    });
                });
            }

            return $this->success($query->get()->map(fn (Document $document) => [
                'id' => $document->id,
                'document_type' => $document->document_type,
                'original_name' => $document->original_name,
                'mime_type' => $document->mime_type,
                'file_size' => $document->file_size,
                'created_at' => $document->created_at,
            ]));
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

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

    public function viewPublicPhoto(Document $document): StreamedResponse|\Illuminate\Http\JsonResponse
    {
        try {
            if (! in_array($document->document_type, ['property_photo', 'unit_photo'], true)) {
                return $this->error('File not found', 404);
            }

            if (! Storage::disk('documents')->exists($document->file_path)) {
                return $this->error('File not found', 404);
            }

            return Storage::disk('documents')->response($document->file_path, $document->original_name, [
                'Content-Type' => $document->mime_type ?? 'image/jpeg',
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
        if ($document->documentable_type === PaymentTransaction::class) {
            $transaction = PaymentTransaction::with('paymentSchedule.lease')->find($document->documentable_id);

            return $transaction
                && $transaction->paymentSchedule?->lease?->resident_id === $userId;
        }

        if ($document->documentable_type === Lease::class) {
            $lease = Lease::find($document->documentable_id);

            return $lease && $lease->resident_id === $userId;
        }

        return false;
    }
}
