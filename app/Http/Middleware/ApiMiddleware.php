<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ApiMiddleware
{
    /**
     * Xử lý yêu cầu đến với Double Protection logging
     * @param Request $request Yêu cầu
     * @param Closure $next Hàm tiếp theo
     * @return Response Phản hồi
     */
    public function handle(Request $request, Closure $next)
    {
        // Log double protection status
        $this->logDoubleProtectionStatus($request);
        
        $request->headers->set('Accept', 'application/json');
        
        $response = $next($request);
        
        // Thêm các headers cần thiết cho API
        if ($response instanceof Response) {
            $response->headers->set('Content-Type', 'application/json');
            $response->headers->set('Access-Control-Allow-Origin', '*');
            $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            
            // COMMENT: Tạm thời comment lại để test SPA không cần CSRF
            // Thêm header để client biết double protection status
            // $response->headers->set('X-Double-Protection', 'CSRF+Sanctum');
        }
        
        return $response;
    }
    
    /**
     * Log double protection status cho debugging
     */
    private function logDoubleProtectionStatus(Request $request): void
    {
        $method = $request->method();
        $uri = $request->getRequestUri();
        // COMMENT: Tạm thời comment lại để test SPA không cần CSRF
        // $hasCSRF = $request->hasHeader('X-XSRF-TOKEN');
        $hasSanctum = $request->bearerToken() !== null;
        $isProtectedEndpoint = $this->isProtectedEndpoint($uri);
        
        $protectionStatus = [];
        // if ($hasCSRF) $protectionStatus[] = 'CSRF';
        if ($hasSanctum) $protectionStatus[] = 'Sanctum';
        
        $protectionString = empty($protectionStatus) ? 'None' : implode('+', $protectionStatus);    
    }
    
    /**
     * Kiểm tra xem endpoint có cần protection không
     */
    private function isProtectedEndpoint(string $uri): bool
    {
        $protectedPatterns = [
            'api/v1/users'
        ];
        
        foreach ($protectedPatterns as $pattern) {
            if (str_contains($uri, $pattern)) {
                return true;
            }
        }
        
        return false;
    }
}
