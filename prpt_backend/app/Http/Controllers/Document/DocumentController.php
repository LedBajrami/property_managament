<?php

namespace App\Http\Controllers\Document;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\PaymentTransaction;
use App\Services\Document\DocumentService;

class DocumentController extends Controller
{
    public function __construct(protected DocumentService $documentService)
    {
    }

    public function download(Document $document)
    {
        return $this->documentService->download($document);
    }
}
