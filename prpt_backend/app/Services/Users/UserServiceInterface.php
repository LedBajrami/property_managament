<?php

namespace App\Services\Users;

use App\Http\Requests\Auth\PasswordUpdateRequest;
use App\Models\User;
use Illuminate\Http\Request;

interface UserServiceInterface
{
  public function getUsers();

  public function getUser($user);

  public function createUser(array $data);

  public function editUser($user, array $data);

  public function deleteUser($user);

  public function changePassword(PasswordUpdateRequest $request);

  public function user_state();
}
