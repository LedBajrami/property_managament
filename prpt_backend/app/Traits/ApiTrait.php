<?php


namespace App\Traits;

use App\Http\Resources\User\UserResource;
use Illuminate\Support\Facades\Log;
trait ApiTrait
{
    /**
     * Core of response Success
     *
     * @param string $message
     * @param array|object $data
     * @param integer $statusCode
     * @param boolean $isSuccess
     * @return \Illuminate\Http\JsonResponse
     */
    public function responseToJsonSuccess($data = null, $message = "SUCCESS", $statusCode = 200)
    {
        if ($data) {
            return response()->json([
                'error' => false,
                'message' => $message,
                'code' => $statusCode,
                'data' => $data
            ], $statusCode);
        } else {
            return response()->json([
                'error' => false,
                'message' => $message,
                'code' => $statusCode
            ], $statusCode);
        }
    }

    /**
     * Core of response Error
     *
     * @param string $message
     * @param array|object $data
     * @param integer $statusCode
     * @param boolean $isSuccess
     * @return \Illuminate\Http\JsonResponse
     */
    public function responseToJsonError($message, $statusCode)
    {
        return response()->json([
            'error' => true,
            'code' => $statusCode,
            'message' => $message,
        ], $statusCode);
    }

    /**
     * Send any success response
     *
     * @param string $message
     * @param array|object $data
     * @param integer $statusCode
     * @return \Illuminate\Http\JsonResponse
     */
    public function success($data = [], $message = "SUCCESS", $statusCode = 200)
    {
        return $this->responseToJsonSuccess($data, $message, $statusCode);
    }



    public function successLoginResponse($user, $credentials)
    {
        $message = "Login Successful user: " . $user->email;
        Log::info($message);

        return response()->json([
            'error' => false,
            'message' => 'Login Successful',
            'code' => 200,
            'data' => [
                'user' => new UserResource($user),
                'token' => [
                    'access_token' => $credentials['access_token'], // still send access token in body
                ]
            ]
        ]);
    }


    public function unauthorized()
    {
        $message = "Trying to login with invalid credentials IP: " . $this->getIp();
        Log::info(trans($message));
        return response([
            'error' => true,
            'message' => 'Unauthorized, wrong credentials. Please try again.',
        ], 401);
    }


    /**
     * Send any error response
     *
     * @param string $message
     * @param integer $statusCode
     * @param \Exception $ex
     * @return \Illuminate\Http\JsonResponse
     */
    public function error($message = "ERROR", $statusCode = 500)
    {
        $messageToShow = $message;
        if ($message instanceof \Exception) {
            Log::error("message : " . $message->getMessage() . " StackTrace :  " . $message->getTraceAsString());
            $messageToShow = $message->getMessage();
        }
        return $this->responseToJsonError($messageToShow, $statusCode);
    }

    public function successResponseWithPaginatedData($data, $extra = null)
    {
        if (request()->has('no-pagination') && request()->get('no-pagination')) {
            if ($extra) {
                foreach (array_keys($extra) as $key) {
                    $data[$key] = $extra[$key];
                }
            }
            return $this->responseToJsonSuccess($data, 'SUCCESS');
        }
        $data = [
            'message' => "Success",
            'error' => false,
            'data' => $data,
            'meta' => [
                'current_page' => $data->currentPage(),
                'from' => $data->firstItem(),
                'last_page' => $data->lastPage(),
                'per_page' => $data->perPage(),
                'to' => $data->lastItem(),
                'total' => $data->total(),
            ],
        ];
        if ($extra) {
            foreach (array_keys($extra) as $key) {
                $data[$key] = $extra[$key];
            }
        }
        return response()->json($data, 200);
    }

    public function fetchResults($query, $shouldOrder = true)
    {
        $page = request()->get('page') ?? 1;
        $pageSize = request()->get('per_page') ?? 10;

        if (request()->filled('no-pagination') && (bool)request()->get('no-pagination')) {
            $results = $query->get();
        } else {
            if ($shouldOrder) {
                $query = $this->prepareSortingQuery($query);
            }
            $results = $query->paginate($pageSize);
        }

        return $results;
    }

    private function prepareSortingQuery($query, $order = '')
    {
        if ($order) {
            if (count(explode(',', $order)) > 1) {
                foreach (explode(',', $order) as $sort) {
                    $direction = (request()->filled('direction')) ? request()->get('direction') : 'asc';
                    $query->orderBy($sort, $direction);
                }
            } else {
                $direction = (request()->filled('direction')) ? request()->get('direction') : 'asc';
                $query->orderBy($order, $direction);
            }
            return $query;
        } else {
            if (request()->filled('orderby') && request()->get('orderby') !== 'null' && request()->get('orderby') !== '') {
                $sortBy = request()->get('orderby');
                if (count(explode(',', $sortBy)) > 1) {
                    foreach (explode(',', $sortBy) as $sort) {
                        $direction = (request()->filled('direction')) ? request()->get('direction') : 'asc';
                        $query->orderBy($sort, $direction);
                    }
                } else {
                    $direction = (request()->filled('direction')) ? request()->get('direction') : 'asc';
                    $query->orderBy($sortBy, $direction);
                }
            }
            return $query;
        }
    }

    private function getIp()
    {
        foreach (array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR') as $key) {
            if (array_key_exists($key, $_SERVER) === true) {
                foreach (explode(',', $_SERVER[$key]) as $ip) {
                    $ip = trim($ip); // just to be safe
                    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false) {
                        return $ip;
                    }
                }
            }
        }
        return request()->ip(); // it will return server ip when no client ip found
    }

}
