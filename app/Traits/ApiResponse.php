<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    /**
     * Response thành công
     */
    protected function success($message = 'Success', $data = null, int $statusCode = 200): JsonResponse
    {
        $response = ['success' => true, 'message' => $message];
        if ($data !== null) $response['data'] = $data;
        return response()->json($response, $statusCode);
    }

    /**
     * Response lỗi
     */
    protected function error($message = 'Error', $data = null, int $statusCode = 400): JsonResponse
    {
        $response = ['success' => false, 'message' => $message];
        if ($data !== null) $response['data'] = $data;
        return response()->json($response, $statusCode);
    }
}
