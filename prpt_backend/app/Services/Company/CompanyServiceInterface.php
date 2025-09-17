<?php

namespace App\Services\Company;

use App\Http\Requests\Company\CreateCompanyRequest;
use App\Models\Company;

interface CompanyServiceInterface
{
    public function getCompanies();

    public function getCompany(Company $company);

    public function createCompany(CreateCompanyRequest $request);
}
