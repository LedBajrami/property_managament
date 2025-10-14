<?php

namespace App\Services\Company;

use App\Http\Requests\Company\CreateCompanyRequest;
use App\Http\Resources\Company\CompanyResource;
use App\Models\Company;
use App\Models\CompanyUser;
use App\Models\User;
use App\Traits\ApiTrait;

class CompanyService implements CompanyServiceInterface
{
    use ApiTrait;
    public function getCompanies() {
        try {
            $companies = Company::all();
            return $this->success(CompanyResource::collection($companies));
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    public function getCompany(Company $company) {
        try {
            return $this->success(new CompanyResource($company));
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }    }

    public function createCompany(CreateCompanyRequest $request) {
        try {
            $data = $request->validated();
            $company = Company::create($data);

            $adminData = [
                'first_name' => $data['adminName'],
                'last_name' => $data['adminLastName'],
                'email' => $data['adminEmail'],
            ];
            $adminUser = User::create($adminData);

            CompanyUser::create([
                'user_id' => $adminUser->id,
                'company_id' => $company->id,
                'role_name' => 'company-admin',
            ]);

            // $adminUser->notify(new ChangePasswordNotification);
            $adminUser->assignRole('company-admin');

            return $this->success(new CompanyResource($company), 'Company created successfully.');
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }    }
}
