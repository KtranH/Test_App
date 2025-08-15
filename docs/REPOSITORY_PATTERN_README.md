# Repository Pattern trong Laravel

## Tổng quan

Repository Pattern là một design pattern giúp tách biệt logic nghiệp vụ khỏi data access layer. Trong dự án này, chúng ta đã implement repository pattern với interface để tuân thủ nguyên tắc SOLID.

## Cấu trúc thư mục

```
app/
├── Repositories/
│   ├── Interfaces/
│   │   ├── BaseRepositoryInterface.php
│   │   └── UserRepositoryInterface.php
│   ├── BaseRepository.php
│   └── UserRepository.php
└── Providers/
    └── RepositoryServiceProvider.php
```

## Các thành phần chính

### 1. BaseRepositoryInterface

Interface cơ bản cho tất cả repositories:

```php
interface BaseRepositoryInterface
{
    public function all(): Collection;
    public function paginate(int $perPage = 15): LengthAwarePaginator;
    public function find(int $id): ?Model;
    public function create(array $data): Model;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
    public function exists(int $id): bool;
}
```

### 2. BaseRepository

Class abstract implement các method cơ bản:

```php
abstract class BaseRepository implements BaseRepositoryInterface
{
    protected Model $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    // Implement các method cơ bản
}
```

### 3. UserRepositoryInterface

Interface mở rộng từ BaseRepositoryInterface với các method đặc thù cho User:

```php
interface UserRepositoryInterface extends BaseRepositoryInterface
{
    public function findByEmail(string $email): ?User;
    public function findByRole(string $role): Collection;
    public function findByStatus(string $status): Collection;
    public function search(string $query): Collection;
}
```

### 4. UserRepository

Implementation của UserRepository:

```php
class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    // Implement các method đặc thù
    public function findByEmail(string $email): ?User
    {
        return $this->model->where('email', $email)->first();
    }
}
```

## Cách sử dụng

### 1. Trong Controller

```php
class AuthController extends Controller
{
    public function __construct(
        private UserRepositoryInterface $userRepository
    ) {}

    public function register(AuthRequest $request): JsonResponse
    {
        $user = $this->userRepository->create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'role' => $request->role ?? 'user',
            'status' => $request->status ?? 'active',
        ]);

        // Logic khác...
    }
}
```

### 2. Dependency Injection

Laravel sẽ tự động inject UserRepository khi bạn khai báo UserRepositoryInterface trong constructor.

### 3. Service Provider

RepositoryServiceProvider bind interface với implementation:

```php
class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
    }
}
```

## Lợi ích của Repository Pattern

### 1. **Tách biệt concerns**
- Controller chỉ xử lý HTTP request/response
- Repository xử lý data access logic
- Model chỉ định nghĩa cấu trúc dữ liệu

### 2. **Dễ dàng test**
- Có thể mock repository interface
- Test business logic độc lập với database
- Unit test nhanh hơn

### 3. **Tuân thủ SOLID principles**
- **Single Responsibility**: Mỗi class có một trách nhiệm
- **Open/Closed**: Mở rộng thông qua interface
- **Liskov Substitution**: Có thể thay thế implementation
- **Interface Segregation**: Interface nhỏ, chuyên biệt
- **Dependency Inversion**: Phụ thuộc vào abstraction

### 4. **Dễ dàng thay đổi implementation**
- Có thể thay đổi từ Eloquent sang Query Builder
- Dễ dàng thêm caching layer
- Có thể implement different data sources

### 5. **Code reusability**
- Repository có thể được sử dụng ở nhiều nơi
- Logic data access được tập trung
- Dễ dàng maintain và update

## Ví dụ mở rộng

### 1. Thêm Caching

```php
class CachedUserRepository implements UserRepositoryInterface
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private CacheInterface $cache
    ) {}

    public function find(int $id): ?User
    {
        $cacheKey = "user:{$id}";
        
        return $this->cache->remember($cacheKey, 3600, function () use ($id) {
            return $this->userRepository->find($id);
        });
    }
}
```

### 2. Thêm Logging

```php
class LoggedUserRepository implements UserRepositoryInterface
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private LoggerInterface $logger
    ) {}

    public function create(array $data): User
    {
        $this->logger->info('Creating user', $data);
        
        $user = $this->userRepository->create($data);
        
        $this->logger->info('User created', ['id' => $user->id]);
        
        return $user;
    }
}
```

## Testing

### Unit Test với Mock

```php
public function test_user_creation()
{
    $mockRepository = Mockery::mock(UserRepositoryInterface::class);
    $mockRepository->shouldReceive('create')
        ->once()
        ->with(['name' => 'Test User'])
        ->andReturn(new User(['name' => 'Test User']));

    $controller = new AuthController($mockRepository);
    
    // Test logic...
}
```

### Integration Test

```php
public function test_user_repository_integration()
{
    $repository = app(UserRepositoryInterface::class);
    
    $user = $repository->create([
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123'
    ]);
    
    $this->assertInstanceOf(User::class, $user);
    $this->assertEquals('Test User', $user->name);
}
```

## Kết luận

Repository Pattern với interface giúp code trở nên:
- **Clean và maintainable**
- **Testable**
- **Flexible và extensible**
- **Tuân thủ SOLID principles**

Việc implement này tạo nền tảng vững chắc cho việc phát triển ứng dụng Laravel với kiến trúc rõ ràng và dễ mở rộng.
