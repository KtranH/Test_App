<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mã xác thực email</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e9ecef;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 10px;
        }
        .verification-code {
            background: linear-gradient(135deg, #007bff, #0056b3);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            margin: 30px 0;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 5px;
            box-shadow: 0 4px 15px rgba(0,123,255,0.3);
        }
        .info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #007bff;
            margin: 20px 0;
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 14px;
        }
        .btn {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">{{ $appName }}</div>
            <h2>Xác thực email của bạn</h2>
        </div>

        <p>Xin chào!</p>
        
        <p>Bạn đã yêu cầu xác thực email để hoàn tất quá trình đăng ký tài khoản.</p>

        <div class="verification-code">
            {{ $verificationCode }}
        </div>

        <div class="info">
            <strong>Hướng dẫn:</strong>
            <ul>
                <li>Nhập mã xác thực 6 chữ số trên vào form xác thực</li>
                <li>Mã có hiệu lực trong {{ $expiresIn }} phút</li>
                <li>Không chia sẻ mã này với bất kỳ ai</li>
            </ul>
        </div>

        <div class="warning">
            <strong>Lưu ý:</strong> Nếu bạn không yêu cầu mã xác thực này, vui lòng bỏ qua email này.
        </div>

        <p>Nếu bạn gặp vấn đề, vui lòng liên hệ với chúng tôi để được hỗ trợ.</p>

        <div class="footer">
            <p>&copy; {{ date('Y') }} {{ $appName }}. Tất cả quyền được bảo lưu.</p>
            <p>Email này được gửi tự động, vui lòng không trả lời.</p>
        </div>
    </div>
</body>
</html>
