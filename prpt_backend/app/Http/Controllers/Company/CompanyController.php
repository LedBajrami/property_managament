<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Http\Requests\Company\CreateCompanyRequest;
use App\Models\Company;
use App\Services\Company\CompanyServiceInterface;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    protected $companyService;

    public function __construct(CompanyServiceInterface $companyService) {
        $this->companyService = $companyService;
    }

    public function getCompanies() {
        return $this->companyService->getCompanies();
    }

    public function getCompany(Company $company) {
        return $this->companyService->getCompany($company);
    }

    public function createCompany(CreateCompanyRequest $request) {
        return $this->companyService->createCompany($request);
    }
}
