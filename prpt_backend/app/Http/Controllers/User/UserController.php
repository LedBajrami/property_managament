<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\PasswordUpdateRequest;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Models\User;
use App\Services\Users\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    protected $userService;
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function getUsers() {
        return $this->userService->getUsers();
    }

    public function getResidents(Request $request)
    {
        return $this->userService->getResidents($request);
    }


    public function getTeamMembers(Request $request)
    {
        return $this->userService->getTeamMembers($request);
    }
    public function getUser(User $user) {
        return $this->userService->getUser($user);
    }

    public function createUser(StoreUserRequest $request) {
        return $this->userService->createUser($request);
    }

    public function editUser(StoreUserRequest $request, User $user) {
        return $this->userService->editUser($user, $request);
    }

    public function deleteUser(User $user) {
        return $this->userService->deleteUser($user);
    }

    public function changePassword(PasswordUpdateRequest $request) {
        return $this->userService->changePassword($request);
    }

    public function formOptions() {
        return $this->userService->formOptions();
    }

    public function user_state() {
      return $this->userService->user_state();
    }
}
