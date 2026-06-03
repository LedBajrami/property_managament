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

    public function index()
    {
        return $this->documentService->list();
    }

    public function download(Document $document)
    {
        return $this->documentService->download($document);
    }

    public function viewPublicPhoto(Document $document)
    {
        return $this->documentService->viewPublicPhoto($document);
    }
}
