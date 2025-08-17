# Hướng dẫn sử dụng chức năng Xác thực Email

## Tổng quan

Hệ thống xác thực email được thiết kế để đảm bảo tính bảo mật khi đăng ký tài khoản. Người dùng phải xác thực email trước khi có thể hoàn tất quá trình đăng ký.

## Tính năng chính

### 1. Gửi mã xác thực
- Tạo mã xác thực 6 chữ số ngẫu nhiên
- Gửi mã qua email với template HTML đẹp mắt
- Mã có hiệu lực trong 15 phút

### 2. Giới hạn gửi lại mã
- Chỉ được gửi lại mã tối đa 2 lần trong 10 phút
- Hiển thị countdown để người dùng biết khi nào có thể gửi lại
- Tự động reset sau 10 phút

### 3. Xác thực mã
- Kiểm tra mã 6 chữ số chính xác
- Xóa mã sau khi xác thực thành công
- Lưu trạng thái email đã xác thực vào Redis

### 4. Đăng ký sau xác thực
- Chỉ cho phép đăng ký với email đã xác thực
- Tự động điền email đã xác thực vào form đăng ký
- Xóa dữ liệu xác thực sau khi đăng ký thành công

## Cấu trúc Backend

### Services
- `EmailVerificationService`: Xử lý logic xác thực email
- `AuthService`: Quản lý quá trình đăng ký và xác thực

### Controllers
- `AuthController`: Xử lý các API endpoint xác thực

### Requests
- `EmailVerificationRequest`: Validation cho xác thực email

### Mail
- `VerificationCodeMail`: Template email gửi mã xác thực

## API Endpoints

### 1. Gửi mã xác thực
```
POST /api/send-verification-code
Body: { "email": "user@example.com" }
```

### 2. Xác thực mã
```
POST /api/verify-email
Body: { 
  "email": "user@example.com", 
  "verification_code": "123456" 
}
```

### 3. Đăng ký sau xác thực
```
POST /api/register-after-verification
Body: {
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

## Cấu trúc Frontend

### Components
- `EmailVerification.vue`: Trang xác thực email
- `Register.vue`: Form đăng ký (đã cập nhật)

### Stores
- `authStore.js`: Quản lý state xác thực và đăng ký

### API
- `auth.js`: Các API call cho xác thực email

## Luồng hoạt động

### 1. Người dùng truy cập trang đăng ký
- Hiển thị thông báo yêu cầu xác thực email
- Nút "Xác thực email ngay" để chuyển đến trang xác thực

### 2. Trang xác thực email
- Nhập email và gửi mã xác thực
- Nhập mã 6 chữ số và xác thực
- Hiển thị thông báo thành công/thất bại

### 3. Quay lại trang đăng ký
- Email đã xác thực được tự động điền
- Hiển thị dấu tích xác nhận email đã xác thực
- Form đăng ký được kích hoạt

### 4. Hoàn tất đăng ký
- Gọi API đăng ký sau xác thực
- Tạo tài khoản thành công
- Chuyển hướng đến trang đăng nhập

## Cấu hình Redis

### Keys được sử dụng
- `email_verification:{email}`: Lưu mã xác thực (15 phút)
- `resend_count:{email}`: Đếm số lần gửi lại (10 phút)
- `email_verified:{email}`: Trạng thái email đã xác thực (30 phút)
- `registration_data:{email}`: Dữ liệu đăng ký tạm thời (30 phút)

### Thời gian hết hạn
- Mã xác thực: 15 phút
- Giới hạn gửi lại: 10 phút
- Trạng thái xác thực: 30 phút
- Dữ liệu đăng ký: 30 phút

## Bảo mật

### 1. Giới hạn tần suất
- Chỉ được gửi mã tối đa 2 lần trong 10 phút
- Mã xác thực có thời gian hết hạn ngắn (15 phút)

### 2. Validation
- Kiểm tra email đã tồn tại trước khi gửi mã
- Validation chặt chẽ cho mã xác thực (6 chữ số)
- Kiểm tra email đã xác thực trước khi đăng ký

### 3. Xử lý lỗi
- Log đầy đủ các hoạt động xác thực
- Thông báo lỗi rõ ràng cho người dùng
- Rollback dữ liệu khi có lỗi

## Testing

### Test Cases cần kiểm tra
1. Gửi mã xác thực thành công
2. Gửi mã xác thực với email đã tồn tại
3. Gửi lại mã quá giới hạn (2 lần/10 phút)
4. Xác thực mã chính xác
5. Xác thực mã sai
6. Xác thực mã hết hạn
7. Đăng ký với email chưa xác thực
8. Đăng ký với email đã xác thực

### Tools testing
- Postman/Insomnia để test API
- Browser DevTools để kiểm tra frontend
- Redis CLI để kiểm tra dữ liệu

## Troubleshooting

### Lỗi thường gặp
1. **Email không được gửi**: Kiểm tra cấu hình SMTP
2. **Mã xác thực không đúng**: Kiểm tra Redis connection
3. **Frontend không hiển thị**: Kiểm tra console errors
4. **API trả về lỗi**: Kiểm tra Laravel logs

### Debug
- Bật debug mode trong Laravel
- Kiểm tra Redis keys và values
- Xem network requests trong browser
- Kiểm tra Laravel logs trong `storage/logs/`

## Tương lai

### Tính năng có thể mở rộng
1. SMS verification
2. 2FA authentication
3. Social login integration
4. Email templates đa ngôn ngữ
5. Analytics và reporting
6. Rate limiting nâng cao
