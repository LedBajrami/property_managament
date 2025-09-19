<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;


Route::get('/api/reset-password-email/{id}', function (Request $request, $id) {
    $queryString = $request->getQueryString();

    return redirect("http://localhost:5173/reset-password-email/{$id}?{$queryString}");
})->name('password.reset.redirect');
