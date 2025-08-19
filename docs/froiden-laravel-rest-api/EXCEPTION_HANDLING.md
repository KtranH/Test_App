# Xử lý Lỗi và Exceptions

## Tổng quan

Thư viện `froiden/laravel-rest-api` cung cấp một hệ thống xử lý lỗi toàn diện và nhất quán cho tất cả các API endpoints. Hệ thống này bao gồm custom exception classes, exception handler, và response format chuẩn để đảm bảo trải nghiệm người dùng nhất quán.

## Exception Classes

### 1. ApiException (Base Exception)

Lớp cơ sở cho tất cả các API exceptions.

```php
use Froiden\RestAPI\Exceptions\ApiException;

class CustomApiException extends ApiException
{
    protected $statusCode = 400;
    protected $errorCode = 'CUSTOM_ERROR';
    
    public function __construct($message = 'Custom error occurred', $statusCode = null)
    {
        parent::__construct($message, $statusCode);
    }
}
```

### 2. ResourceNotFoundException

Được throw khi không tìm thấy resource.

```php
use Froiden\RestAPI\Exceptions\ResourceNotFoundException;

// Trong controller
if (!$user) {
    throw new ResourceNotFoundException('User not found');
}

// Hoặc sử dụng helper method
$this->findOrFail($id);
```

### 3. UnauthorizedException

Được throw khi user không có quyền truy cập.

```php
use Froiden\RestAPI\Exceptions\UnauthorizedException;

// Kiểm tra quyền
if (!$this->canAccess($resource)) {
    throw new UnauthorizedException('Access denied');
}

// Hoặc sử dụng với policy
$this->authorize('view', $user);
```

### 4. ValidationException

Được throw khi validation thất bại.

```php
use Froiden\RestAPI\Exceptions\ValidationException;

// Trong controller
protected function validate($data, $rules)
{
    $validator = Validator::make($data, $rules);
    
    if ($validator->fails()) {
        throw new ValidationException($validator->errors());
    }
    
    return $data;
}
```

### 5. ThrottleException

Được throw khi rate limit bị vượt quá.

```php
use Froiden\RestAPI\Exceptions\ThrottleException;

// Kiểm tra rate limit
if ($this->isRateLimited($user)) {
    throw new ThrottleException('Too many requests');
}
```

## Exception Handler

### ApiExceptionHandler

Thư viện cung cấp `ApiExceptionHandler` để xử lý tất cả các exceptions một cách nhất quán.

```php
// app/Exceptions/Handler.php
use Froiden\RestAPI\Handlers\ApiExceptionHandler;

class Handler extends ExceptionHandler
{
    public function register()
    {
        $this->renderable(function (Throwable $e, $request) {
            if ($request->expectsJson()) {
                return app(ApiExceptionHandler::class)->handle($e, $request);
            }
        });
    }
}
```

### Custom Exception Handler

Bạn có thể tạo custom exception handler để xử lý các trường hợp đặc biệt:

```php
class CustomApiExceptionHandler extends ApiExceptionHandler
{
    public function handle($exception, $request)
    {
        // Xử lý custom exceptions
        if ($exception instanceof CustomBusinessException) {
            return $this->handleCustomException($exception);
        }
        
        // Xử lý database exceptions
        if ($exception instanceof QueryException) {
            return $this->handleDatabaseException($exception);
        }
        
        // Gọi parent handler cho các exceptions khác
        return parent::handle($exception, $request);
    }
    
    protected function handleCustomException($exception)
    {
        return ApiResponse::exception($exception, [
            'error_code' => $exception->getErrorCode(),
            'details' => $exception->getDetails()
        ]);
    }
    
    protected function handleDatabaseException($exception)
    {
        Log::error('Database error', [
            'message' => $exception->getMessage(),
            'sql' => $exception->getSql(),
            'bindings' => $exception->getBindings()
        ]);
        
        return ApiResponse::exception(new ApiException(
            'Database operation failed',
            500
        ));
    }
}
```

## Response Format

### Error Response Structure

Tất cả các error responses đều tuân theo format chuẩn:

```json
{
    "success": false,
    "message": "Error message",
    "error_code": "ERROR_CODE",
    "status_code": 400,
    "timestamp": "2024-01-15T10:30:00Z",
    "details": {
        "field": "Additional error details"
    },
    "trace": null
}
```

### Custom Error Response

Bạn có thể tùy chỉnh error response format:

```php
class CustomApiResponse extends ApiResponse
{
    public static function exception($exception, $additional = [])
    {
        $response = [
            'success' => false,
            'message' => $exception->getMessage(),
            'error_code' => $exception->getErrorCode() ?? 'UNKNOWN_ERROR',
            'status_code' => $exception->getStatusCode() ?? 500,
            'timestamp' => now()->toISOString(),
            'request_id' => request()->id() ?? uniqid(),
        ];
        
        // Thêm details nếu có
        if (method_exists($exception, 'getDetails')) {
            $response['details'] = $exception->getDetails();
        }
        
        // Merge additional data
        $response = array_merge($response, $additional);
        
        // Thêm trace trong development
        if (config('app.debug')) {
            $response['trace'] = $exception->getTraceAsString();
        }
        
        return response()->json($response, $response['status_code']);
    }
}
```

## Exception Handling trong Controllers

### 1. Basic Exception Handling

```php
class UserController extends ApiController
{
    protected $model = User::class;
    
    public function show($id)
    {
        try {
            $user = $this->model::findOrFail($id);
            
            // Kiểm tra quyền
            $this->authorize('view', $user);
            
            return $this->getResults($user);
            
        } catch (ModelNotFoundException $e) {
            throw new ResourceNotFoundException('User not found');
        } catch (AuthorizationException $e) {
            throw new UnauthorizedException('Access denied');
        } catch (Exception $e) {
            Log::error('Error in UserController::show', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            throw new ApiException('Internal server error', 500);
        }
    }
}
```

### 2. Advanced Exception Handling với Hooks

```php
class ProductController extends ApiController
{
    protected $model = Product::class;
    
    protected function storing($data)
    {
        try {
            // Validate business rules
            $this->validateBusinessRules($data);
            
            // Check stock availability
            $this->checkStockAvailability($data);
            
            return $data;
            
        } catch (BusinessRuleException $e) {
            throw new ValidationException($e->getMessage());
        } catch (StockException $e) {
            throw new ApiException('Insufficient stock', 422);
        }
    }
    
    protected function updating($data, $product)
    {
        try {
            // Check if product can be updated
            if ($product->is_locked) {
                throw new ApiException('Product is locked and cannot be updated', 423);
            }
            
            return $data;
            
        } catch (ApiException $e) {
            throw $e;
        } catch (Exception $e) {
            Log::error('Error updating product', [
                'product_id' => $product->id,
                'error' => $e->getMessage()
            ]);
            
            throw new ApiException('Failed to update product', 500);
        }
    }
}
```

### 3. Exception Handling với Middleware

```php
class ApiExceptionMiddleware
{
    public function handle($request, Closure $next)
    {
        try {
            $response = $next($request);
            
            return $response;
            
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        } catch (AuthenticationException $e) {
            return $this->handleAuthenticationException($e);
        } catch (AuthorizationException $e) {
            return $this->handleAuthorizationException($e);
        } catch (Exception $e) {
            return $this->handleGenericException($e);
        }
    }
    
    protected function handleValidationException($e)
    {
        return response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $e->errors(),
            'status_code' => 422
        ], 422);
    }
    
    protected function handleAuthenticationException($e)
    {
        return response()->json([
            'success' => false,
            'message' => 'Authentication required',
            'status_code' => 401
        ], 401);
    }
    
    protected function handleAuthorizationException($e)
    {
        return response()->json([
            'success' => false,
            'message' => 'Access denied',
            'status_code' => 403
        ], 403);
    }
    
    protected function handleGenericException($e)
    {
        Log::error('Unhandled exception', [
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString()
        ]);
        
        return response()->json([
            'success' => false,
            'message' => 'Internal server error',
            'status_code' => 500
        ], 500);
    }
}
```

## Custom Exceptions

### 1. Business Logic Exceptions

```php
class InsufficientStockException extends ApiException
{
    protected $statusCode = 422;
    protected $errorCode = 'INSUFFICIENT_STOCK';
    
    public function __construct($productId, $requested, $available)
    {
        $message = "Insufficient stock for product {$productId}. Requested: {$requested}, Available: {$available}";
        parent::__construct($message, $this->statusCode);
        
        $this->details = [
            'product_id' => $productId,
            'requested_quantity' => $requested,
            'available_quantity' => $available
        ];
    }
    
    public function getDetails()
    {
        return $this->details;
    }
}
```

### 2. Domain-Specific Exceptions

```php
class OrderProcessingException extends ApiException
{
    protected $statusCode = 422;
    protected $errorCode = 'ORDER_PROCESSING_FAILED';
    
    public function __construct($orderId, $reason, $details = [])
    {
        $message = "Failed to process order {$orderId}: {$reason}";
        parent::__construct($message, $this->statusCode);
        
        $this->details = array_merge([
            'order_id' => $orderId,
            'reason' => $reason
        ], $details);
    }
}
```

### 3. External Service Exceptions

```php
class ExternalServiceException extends ApiException
{
    protected $statusCode = 502;
    protected $errorCode = 'EXTERNAL_SERVICE_ERROR';
    
    public function __construct($service, $operation, $originalError = null)
    {
        $message = "External service '{$service}' failed during '{$operation}' operation";
        parent::__construct($message, $this->statusCode);
        
        $this->details = [
            'service' => $service,
            'operation' => $operation,
            'original_error' => $originalError
        ];
    }
}
```

## Error Logging và Monitoring

### 1. Structured Logging

```php
class ApiLogger
{
    public static function logError($exception, $context = [])
    {
        $logData = [
            'exception_class' => get_class($exception),
            'message' => $exception->getMessage(),
            'file' => $exception->getFile(),
            'line' => $exception->getLine(),
            'trace' => $exception->getTraceAsString(),
            'request_url' => request()->fullUrl(),
            'request_method' => request()->method(),
            'user_id' => auth()->id(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'timestamp' => now()->toISOString(),
        ];
        
        // Merge additional context
        $logData = array_merge($logData, $context);
        
        // Log based on exception type
        if ($exception instanceof ValidationException) {
            Log::warning('API Validation Error', $logData);
        } elseif ($exception instanceof UnauthorizedException) {
            Log::info('API Authorization Error', $logData);
        } else {
            Log::error('API Error', $logData);
        }
        
        // Send to monitoring service in production
        if (config('app.env') === 'production') {
            $this->sendToMonitoring($logData);
        }
    }
    
    private function sendToMonitoring($data)
    {
        // Send to Sentry, Bugsnag, or other monitoring service
        // Sentry::captureException($exception, $data);
    }
}
```

### 2. Error Tracking trong Controllers

```php
class BaseApiController extends ApiController
{
    protected function logError($exception, $context = [])
    {
        $additionalContext = array_merge($context, [
            'controller' => get_class($this),
            'action' => request()->route()->getActionMethod(),
            'model' => $this->model ?? null,
        ]);
        
        ApiLogger::logError($exception, $additionalContext);
    }
    
    protected function handleException($exception, $context = [])
    {
        $this->logError($exception, $context);
        
        // Re-throw as ApiException if it's not already
        if (!$exception instanceof ApiException) {
            throw new ApiException($exception->getMessage(), 500);
        }
        
        throw $exception;
    }
}
```

## Testing Exceptions

### 1. Unit Testing

```php
class UserControllerTest extends TestCase
{
    public function test_show_throws_resource_not_found_exception()
    {
        $this->expectException(ResourceNotFoundException::class);
        
        $controller = new UserController();
        $controller->show(99999);
    }
    
    public function test_store_throws_validation_exception()
    {
        $this->expectException(ValidationException::class);
        
        $controller = new UserController();
        $controller->store([
            'email' => 'invalid-email',
            'password' => '123'
        ]);
    }
    
    public function test_update_throws_unauthorized_exception()
    {
        $this->expectException(UnauthorizedException::class);
        
        $user = User::factory()->create();
        $this->actingAs($user);
        
        $controller = new UserController();
        $controller->update($user->id, ['name' => 'New Name']);
    }
}
```

### 2. Integration Testing

```php
class UserApiTest extends TestCase
{
    public function test_api_returns_proper_error_format()
    {
        $response = $this->getJson('/api/users/99999');
        
        $response->assertStatus(404)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'error_code',
                    'status_code',
                    'timestamp'
                ])
                ->assertJson([
                    'success' => false,
                    'status_code' => 404
                ]);
    }
    
    public function test_api_handles_validation_errors()
    {
        $response = $this->postJson('/api/users', [
            'email' => 'invalid-email',
            'password' => '123'
        ]);
        
        $response->assertStatus(422)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'errors',
                    'status_code'
                ]);
    }
}
```

## Best Practices

### 1. Exception Hierarchy
- Tạo custom exceptions kế thừa từ `ApiException`
- Sử dụng error codes có ý nghĩa
- Cung cấp context và details hữu ích

### 2. Error Messages
- Sử dụng message rõ ràng và hữu ích
- Tránh expose thông tin nhạy cảm
- Localize error messages khi cần

### 3. Logging Strategy
- Log tất cả errors với context đầy đủ
- Sử dụng structured logging
- Implement log rotation và retention

### 4. Security Considerations
- Không expose internal errors trong production
- Sanitize error messages
- Implement rate limiting cho error endpoints

### 5. Performance
- Tránh heavy operations trong exception handlers
- Cache error responses khi có thể
- Monitor exception frequency và impact

## Kết luận

Hệ thống xử lý lỗi của `froiden/laravel-rest-api` cung cấp:

- **Consistency**: Tất cả errors đều có format response nhất quán
- **Flexibility**: Dễ dàng tùy chỉnh và extend
- **Security**: Bảo vệ thông tin nhạy cảm
- **Monitoring**: Logging và tracking đầy đủ
- **Testing**: Dễ dàng test các error scenarios

Bằng cách sử dụng hệ thống này một cách hợp lý, bạn có thể xây dựng API robust và user-friendly với error handling chuyên nghiệp.
