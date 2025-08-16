<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\JsonResponse;

abstract class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    /**
     * API response nếu lỗi 422
     * @param Validator $validator
     * @param string $message
     * @return JsonResponse
     */
    public function response422($validator, $message = 'Validation failed'): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $validator->errors(),
        ], 422);
    }

    /**
     * API response nếu lỗi 401
     * @param string $message
     * @return JsonResponse
     */
    public function response401($message = 'Unauthorized'): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
        ], 401);
    }

    /**
     * API response nếu lỗi 404
     * @param string $message
     * @return JsonResponse
     */
    public function response404($message = 'Not found'): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
        ], 404);
    }

    /**
     * API response nếu lỗi 500
     * @param string $message
     * @return JsonResponse
     */
    public function response500($message = 'Internal server error'): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
        ], 500);
    }

    /**
     * API response nếu lỗi 403
     * @param string $message
     * @return JsonResponse
     */
    public function response403($message = 'Forbidden'): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
        ], 403);
    }

    /**
     * API response nếu lỗi 400
     * @param string $message
     * @return JsonResponse
     */
    public function response400($message = 'Bad Request'): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
        ], 400);
    }

    /**
     * API response nếu thành công 200
     * @param string $message
     * @param mixed $data
     * @return JsonResponse
     */
    public function response200($message = 'Success', $data = null): JsonResponse
    {
        $response = [
            'success' => true,
            'message' => $message,
        ];
        
        if ($data !== null) {
            $response['data'] = $data;
        }
        
        return response()->json($response, 200);
    }

    /**
     * API response nếu thành công 201
     * @param string $message
     * @param mixed $data
     * @return JsonResponse
     */
    public function response201($message = 'Created', $data = null): JsonResponse
    {
        $response = [
            'success' => true,
            'message' => $message,
        ];
        
        if ($data !== null) {
            $response['data'] = $data;
        }
        
        return response()->json($response, 201);
    }
}
