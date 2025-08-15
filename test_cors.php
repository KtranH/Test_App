<?php
/**
 * Test CORS Configuration
 * 
 * Sử dụng file này để test CORS headers
 * Chạy: php test_cors.php
 */

// Cấu hình
$baseUrl = 'http://localhost:8000/api/v1';

echo "=== Testing CORS Configuration ===\n\n";

// Test 1: Preflight request (OPTIONS)
echo "1. Testing Preflight Request (OPTIONS)...\n";
$response = makeRequest($baseUrl . '/auth/login', 'OPTIONS', [], null, [
    'Origin: http://localhost:3000',
    'Access-Control-Request-Method: POST',
    'Access-Control-Request-Headers: Content-Type,Authorization'
]);

echo "Status: " . $response['status'] . "\n";
echo "CORS Headers:\n";
foreach ($response['headers'] as $header => $value) {
    if (strpos(strtolower($header), 'access-control') !== false) {
        echo "  $header: $value\n";
    }
}
echo "\n";

// Test 2: Actual request với Origin header
echo "2. Testing Actual Request with Origin Header...\n";
$response = makeRequest($baseUrl . '/auth/login', 'POST', [
    'email' => 'test@example.com',
    'password' => 'password123'
], null, [
    'Origin: http://localhost:3000'
]);

echo "Status: " . $response['status'] . "\n";
echo "CORS Headers:\n";
foreach ($response['headers'] as $header => $value) {
    if (strpos(strtolower($header), 'access-control') !== false) {
        echo "  $header: $value\n";
    }
}
echo "\n";

// Test 3: Request không có Origin header
echo "3. Testing Request without Origin Header...\n";
$response = makeRequest($baseUrl . '/auth/login', 'POST', [
    'email' => 'test@example.com',
    'password' => 'password123'
]);

echo "Status: " . $response['status'] . "\n";
echo "CORS Headers:\n";
foreach ($response['headers'] as $header => $value) {
    if (strpos(strtolower($header), 'access-control') !== false) {
        echo "  $header: $value\n";
    }
}
echo "\n";

echo "=== CORS Test Complete ===\n";

/**
 * Helper function để gửi HTTP requests và lấy headers
 */
function makeRequest($url, $method, $data = [], $token = null, $additionalHeaders = []) {
    $ch = curl_init();
    
    $headers = [
        'Content-Type: application/json',
        'Accept: application/json'
    ];
    
    if ($token) {
        $headers[] = 'Authorization: Bearer ' . $token;
    }
    
    // Thêm additional headers
    foreach ($additionalHeaders as $header) {
        $headers[] = $header;
    }
    
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_VERBOSE, false);
    
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        if (!empty($data)) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }
    } elseif ($method === 'OPTIONS') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'OPTIONS');
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    // Parse headers và body
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $headerText = substr($response, 0, $headerSize);
    $body = substr($response, $headerSize);
    
    // Parse headers
    $headers = [];
    $headerLines = explode("\n", $headerText);
    foreach ($headerLines as $line) {
        $line = trim($line);
        if (empty($line)) continue;
        
        if (strpos($line, ':') !== false) {
            list($name, $value) = explode(':', $line, 2);
            $headers[trim($name)] = trim($value);
        }
    }
    
    $responseData = json_decode($body, true);
    
    return [
        'status' => $httpCode,
        'data' => $responseData ?: $body,
        'headers' => $headers
    ];
}
