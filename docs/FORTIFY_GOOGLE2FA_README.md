## Tích hợp Fortify + Google2FA cho Vue 3 + Laravel (kèm Sanctum)

Tài liệu này hướng dẫn thiết lập xác thực hai lớp (2FA) bằng Google Authenticator trên nền Laravel (Fortify hoặc custom API dùng Sanctum) và front-end Vue 3. Nội dung bám sát triển khai hiện tại trong dự án, đồng thời chỉ ra cách áp dụng tương tự nếu bạn dùng Fortify thuần.

### 1) Tổng quan kiến trúc
- Backend Laravel 11: dùng Sanctum phát hành token, 2FA với `pragmarx/google2fa-laravel`.
- Frontend Vue 3 (Vite): hiển thị QR từ `otpauth://...` qua `qrcode.vue`, luồng login có bước thử thách 2FA.
- Lưu tạm secret/challenge ở tầng cache (khuyến nghị Redis). Nếu `CACHE_DRIVER=redis`, các lệnh `Cache::put/get/forget` đã sử dụng Redis.

### 2) Cài đặt package
Backend:
```bash
composer require pragmarx/google2fa-laravel

# (Tùy chọn) Nếu dùng Fortify thay vì custom Auth:
composer require laravel/fortify
php artisan vendor:publish --provider="Laravel\\Fortify\\FortifyServiceProvider"
```

Frontend:
```bash
npm i qrcode.vue --save
```

### 3) Cấu hình Google2FA
Publish config (nếu chưa):
```bash
php artisan vendor:publish --provider="PragmaRX\\Google2FALaravel\\ServiceProvider"
```

Các khóa quan trọng trong `config/google2fa.php`:
```php
return [
    'enabled' => env('OTP_ENABLED', true),
    'lifetime' => env('OTP_LIFETIME', 0),
    'keep_alive' => env('OTP_KEEP_ALIVE', true),
    'session_var' => 'google2fa',
    'otp_input' => 'one_time_password',
    'window' => 1,
    'otp_secret_column' => 'google2fa_secret',
    'qrcode_image_backend' => \PragmaRX\Google2FALaravel\Support\Constants::QRCODE_IMAGE_BACKEND_SVG,
];
```

ENV khuyến nghị:
```env
OTP_ENABLED=true
OTP_LIFETIME=0
OTP_KEEP_ALIVE=true
CACHE_DRIVER=redis  # nếu dùng Redis
QUEUE_CONNECTION=redis  # tùy chọn
```

### 4) Migration & Model
Thêm cột secret cho 2FA (dự án đã có):
```php
Schema::table('users', function (Blueprint $table) {
    $table->string('google2fa_secret')->nullable();
});
```

Ẩn/mã hóa field trên model `User`:
```php
// app/Models/User.php
protected $fillable = [ 'name', 'email', 'password', 'role', 'status', 'google2fa_secret' ];
protected $hidden = [ 'remember_token', 'google2fa_secret' ];
protected function casts(): array {
    return [
        'password' => 'hashed',
        // Bật nếu muốn mã hóa ở DB (Laravel 11):
        // 'google2fa_secret' => 'encrypted',
    ];
}
```

### 5) Luồng API backend (đã có sẵn trong dự án)
Controller: `app/Http/Controllers/TwoFactorController.php`

- Lấy trạng thái 2FA:
```
GET /api/2fa/status  (auth)
=> { enabled: boolean }
```

- Bật 2FA – Bước 1: khởi tạo secret (cache 10 phút) + trả `otpauth_url`:
```
POST /api/2fa/init-enable  (auth)
=> { secret, otpauth_url }
```

- Bật 2FA – Bước 2: xác nhận bằng OTP để lưu secret vào DB:
```
POST /api/2fa/confirm-enable  (auth)
Body: { otp }
=> { enabled: true }
```

- Tắt 2FA:
```
POST /api/2fa/disable  (auth)
Body: { otp }
=> { enabled: false }
```

- Xác thực 2FA cho đăng nhập (sau khi nhận `challenge_id` từ login):
```
POST /api/2fa/verify-login  (public)
Body: { challenge_id, otp }
=> { token, user, expires_at }
```

Login có 2 nhánh trong `AuthController@login`:
```php
// Nếu user đã bật 2FA -> trả về challenge, chưa cấp token
return $this->success('Yêu cầu xác thực 2FA', [
    'requires_2fa' => true,
    'challenge_id' => $challengeId,
]);

// Nếu user chưa bật 2FA -> cấp token bình thường
[$token, $user, $expiresAt] = $this->authService->login($user, $remember);
```

Cache store cho secret/challenge (Redis nếu `CACHE_DRIVER=redis`):
```php
Cache::put('2fa:setup:'.$userId, $secret, now()->addMinutes(10));
Cache::put('2fa:login:'.$challengeId, [ 'user_id' => $userId, 'remember' => $remember ], now()->addMinutes(5));
// Ép dùng Redis cụ thể: Cache::store('redis')->put(...)
```

Routes: `routes/api.php`
```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/2fa/status', [TwoFactorController::class, 'status']);
    Route::post('/2fa/init-enable', [TwoFactorController::class, 'initEnable']);
    Route::post('/2fa/confirm-enable', [TwoFactorController::class, 'confirmEnable']);
    Route::post('/2fa/disable', [TwoFactorController::class, 'disable']);
});
Route::post('/2fa/verify-login', [TwoFactorController::class, 'verifyLogin']);
```

#### Nếu dùng Laravel Fortify
- Đăng ký `FortifyServiceProvider`, cấu hình Fortify cho login.
- Trong callback xử lý login thành công của Fortify, nếu phát hiện `google2fa_secret` tồn tại thì trả về `requires_2fa + challenge_id` giống như trên thay vì tạo token ngay.
- Tạo endpoint `POST /2fa/verify-login` (không cần token) để nhận OTP và hoàn tất đăng nhập (tạo token Sanctum hoặc tạo session nếu thuần Fortify/session).

### 6) Frontend Vue 3
Install lib QR:
```bash
npm i qrcode.vue --save
```

API client: `resources/js/api/auth.js`
```js
export const AuthApi = {
  twoFAStatus: () => apiClient.get('/2fa/status'),
  twoFAInitEnable: () => apiClient.post('/2fa/init-enable'),
  twoFAConfirmEnable: (data) => apiClient.post('/2fa/confirm-enable', data),
  twoFADisable: (data) => apiClient.post('/2fa/disable', data),
  twoFAVerifyLogin: (data) => apiClient.post('/2fa/verify-login', data),
}
```

Store đăng nhập xử lý yêu cầu 2FA: `resources/js/stores/authStore.js`
```js
const response = await AuthApi.login(loginData)
if (response.data?.data?.requires_2fa) {
  return { success: false, requires2FA: true, challengeId: response.data.data.challenge_id }
}
// ... nhận token như bình thường nếu không cần 2FA
```

Trang nhập OTP đăng nhập: `resources/js/views/Auth/TwoFactorVerify.vue`
```vue
<qrcode-vue :value="otpauthUrl" :size="140" />
```

Trang cài đặt bật/tắt 2FA: `resources/js/views/Dashboard/TwoFactorSettings.vue`
```vue
<qrcode-vue :value="otpauthUrl" :size="140" />
```

Router:
```js
{ path: '/2fa/verify', name: 'TwoFactorVerify', component: TwoFactorVerify, meta: { requiresGuest: true }},
{ path: '/settings/2fa', name: 'TwoFactorSettings', component: TwoFactorSettings, meta: { requiresAuth: true }},
```

### 7) Kiểm thử nhanh
1) Bật 2FA:
   - Đăng nhập, mở `/settings/2fa`, bấm “Bật 2FA”.
   - Quét QR bằng Google Authenticator, nhập OTP để xác nhận bật.
2) Đăng nhập khi 2FA đã bật:
   - Sau khi nhập email/mật khẩu, backend trả `requires_2fa + challenge_id`.
   - Điều hướng tới `/2fa/verify`, nhập OTP, nhận token và chuyển về Dashboard.
3) Tắt 2FA:
   - Ở `/settings/2fa`, nhập OTP hiện tại và xác nhận tắt.

### 8) Best practices & bảo mật
- Ưu tiên `CACHE_DRIVER=redis` để lưu challenge/secret tạm thời.
- Mã hóa `google2fa_secret` ở DB nếu cần (`encrypted` cast).
- Không log secret/OTP. Hạn chế thời gian sống của challenge (5 phút) và secret tạm (10 phút).
- Có thể thêm giới hạn tốc độ (rate limit) cho các endpoint 2FA.
- Bật HTTPS ở production.

### 9) Gợi ý mở rộng
- Backup codes: phát hành một bộ mã dự phòng khi user bật 2FA.
- Trusted devices: đánh dấu thiết bị tin cậy, bỏ qua 2FA trong một khoảng thời gian.
- Admin override: cơ chế khôi phục 2FA cho người dùng bị mất thiết bị.

### 10) Lệnh tiện ích
```bash
# DB & cache
php artisan migrate
php artisan optimize:clear

# Dev server
npm run dev
```

---
Tài liệu này mô tả cả luồng dùng Fortify (session) và luồng hiện tại dùng Sanctum (token). Bạn có thể tái sử dụng cùng các endpoint 2FA ở trên cho cả hai mô hình bằng cách thay thế bước cấp token/session tương ứng.


