<?php

namespace App\Services\Users;

use App\Http\Requests\Auth\PasswordUpdateRequest;
use App\Models\User;
use Illuminate\Http\Request;

interface UserServiceInterface
{
  public function getUsers();

    public function getResidents(Request $request);

  public function getTeamMembers(Request $request);

  public function getUser($user);

  public function createUser($request);

  public function editUser($user, $request);

  public function deleteUser($user);

  public function changePassword(PasswordUpdateRequest $request);

  public function user_state();
}
