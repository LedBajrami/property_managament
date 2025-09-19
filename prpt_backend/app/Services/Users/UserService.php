<?php

namespace App\Services\Users;

use App\Http\Resources\User\UserResource;
use App\Models\User;
use App\Notifications\ChangeUserPasswordNotification;
use App\Traits\ApiTrait;
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

    public function getUser($user)
    {
        try {
            return $this->success(new UserResource($user));
        } catch (\Throwable $th) {
            return $this->error($th);
        }
    }

    public function createUser(array $data)
    {
        try {
            $role = $data['role'] ?? 'resident';

            $user = User::create($data);
            $user->assignRole($role);
            $user->notify(new ChangeUserPasswordNotification());

            return $this->success(new UserResource($user), 'User created successfully');
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    public function editUser($user, array $data)
    {
        try {
            $role = $data['role'] ?? null;

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
            return response()->json([
                'user' => new UserResource($user),
            ]);
        } catch (\Throwable $th) {
            return $this->error($th);
        }
    }
}
