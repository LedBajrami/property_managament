<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserBelongsToCompany
{
    public function handle(Request $request, Closure $next)
    {
        $companyId = $request->header('X-Company-ID'); // client sends this in every request header

        if (!$companyId) {
            return response()->json(['message' => 'No company context provided'], 403);
        }

        $company = auth()->user()->companies()->find($companyId);

        if (!$company) {
            return response()->json(['message' => 'Unauthorized for this company'], 403);
        }

        // Bind to request so controllers can use it
        $request->merge(['current_company' => $company]);
        app()->instance('current_company', $company);

        return $next($request);
    }
}
