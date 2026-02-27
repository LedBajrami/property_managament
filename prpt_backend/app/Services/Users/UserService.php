<?php

namespace App\Services\Users;

use App\Http\Resources\User\UserResource;
use App\Models\Company;
use App\Models\CompanyUser;
use App\Models\User;
use App\Notifications\SetUserPasswordNotification;
use App\Traits\ApiTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;


class UserService implements UserServiceInterface
{
    use ApiTrait;
    public function getUsers()
    {
        try {
            $results = User::orderBy('id', 'desc')->get();
            $users = UserResource::collection($results);
            return $this->success($users);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    public function getResidents(Request $request)
    {
        try {
            $companyId = $request->header('X-Company-ID');

            $results = User::with('companies')
                ->whereHas('companies', function ($query) use ($companyId) {
                    $query
                        ->where('company_id', $companyId)
                        ->where('role_name', 'resident');
                })
                ->get();


            $users = UserResource::collection($results);
            return $this->success($users);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }


    public function getTeamMembers(Request $request)
    {
        try {
            $companyId = $request->header('X-Company-ID');

            $results = User::with('companies')
                ->whereHas('companies', function ($query) use ($companyId) {
                    $query
                        ->where('company_id', $companyId)
                        ->where('role_name', '!=', 'resident');
                })
                ->get();


            $users = UserResource::collection($results);
            return $this->success($users);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }


    public function getUser($user)
    {
        try {
            return $this->success(new UserResource($user));
        } catch (\Throwable $th) {
            return $this->error($th);
        }
    }

    public function createUser($request)
    {
        try {
            $data = $request->validated();
            $company_id = $request->header('X-Company-ID');
            $role = $data['role'] ?? 'resident';

            // Validate company_id exists and user has permission
            $company = Company::findOrFail($company_id);

            // Check if user exists globally
            $userExists = User::where('email', $data['email'])->first();

            // If user exists, check if they're already in this company
            if ($userExists) {
                $userExistsInCompany = CompanyUser::where('user_id', $userExists->id)
                    ->where('company_id', $company_id)
                    ->first();

                if ($userExistsInCompany) {
                    return $this->error("User already exists in this company");
                }

                // Add existing user to this company
                CompanyUser::create([
                    'user_id' => $userExists->id,
                    'company_id' => $company_id,
                    'role_name' => $role,
                ]);

                return $this->success(
                    new UserResource($userExists),
                    'User added to company successfully'
                );
            }

            // User doesn't exist globally, create new user
            $user = User::create($data);

            // Add user to company
            CompanyUser::create([
                'user_id' => $user->id,
                'company_id' => $company_id,
                'role_name' => $role,
            ]);

            // Assign role
            $user->assignRole($role);

            // Send notification to set password
            $user->notify(new SetUserPasswordNotification());

            return $this->success(
                new UserResource($user),
                'User created successfully'
            );
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    public function editUser($user, $request)
    {
        try {
            $data = $request->validated();
            $role = $data['role'] ?? 'resident';

            unset($data['role']);

            $user->update($data);

            if ($role) {
                $user->syncRoles([$role]);
            }

            return $this->success(new UserResource($user), 'User updated successfully');
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    public function deleteUser($user)
    {
        try {
            $user->update([
                'email' => $user->email . '_deleted_' . now()->timestamp
            ]);
            $user->delete();

            return $this->success($user->id, 'User deleted successfully');
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    public function changePassword($request) {
        try {
            $user = auth()->user();
            $data = $request->validated();

            if (!Hash::check($data['old_password'], $user->password)) {
                return $this->error('Old password does not match', 409);
            }

            $user->update([
                'password' => Hash::make($data['new_password'])
            ]);

            return $this->success(null, 'Password successfully changed');
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }


    public function user_state()
    {
        try {
            $user = Auth::user();
            return $this->success(['user' => new UserResource($user)]);
        } catch (\Throwable $th) {
            return $this->error($th);
        }
    }
}
