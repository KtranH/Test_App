# Hướng dẫn sử dụng Phân trang với Load More

## Tổng quan
Hệ thống phân trang sử dụng phương pháp "Load More" (Tải thêm) thay vì phân trang truyền thống. Điều này tạo ra trải nghiệm người dùng tốt hơn và phù hợp với thiết kế API hiện tại.

## Cách hoạt động

### 1. API Response Structure
API trả về dữ liệu với cấu trúc:
```json
{
  "data": [...], // Danh sách users
  "meta": {
    "paging": {
      "links": {
        "next": "http://127.0.0.1:8000/api/v1/users?offset=10"
      },
      "total": 20
    }
  }
}
```

### 2. Logic Phân trang
- **Offset-based**: Sử dụng `offset` thay vì `page`
- **Load More**: Thêm dữ liệu mới vào danh sách hiện có
- **Auto-detect**: Tự động phát hiện có còn dữ liệu để tải không

### 3. Store State
```javascript
const users = ref([])           // Danh sách tất cả users đã tải
const offset = ref(0)           // Vị trí bắt đầu cho lần tải tiếp theo
const hasMore = ref(false)      // Có còn dữ liệu để tải không
const total = ref(0)            // Tổng số users trong database
const nextUrl = ref(null)       // URL cho lần tải tiếp theo
```

## Cách sử dụng

### 1. Tải dữ liệu ban đầu
```javascript
// Trong component
onMounted(async () => {
  await userStore.fetchUsers(true) // reset = true
})
```

### 2. Tải thêm dữ liệu
```javascript
// Khi user click nút "Tải thêm"
const loadMore = async () => {
  await userStore.loadMore()
}
```

### 3. Kiểm tra trạng thái
```javascript
// Kiểm tra có còn dữ liệu để tải không
if (userStore.hasMore) {
  // Hiển thị nút "Tải thêm"
}

// Kiểm tra đang tải
if (userStore.isFetching) {
  // Hiển thị loading state
}
```

## UI Components

### 1. Nút "Tải thêm"
- Chỉ hiển thị khi `hasMore = true`
- Hiển thị số lượng items sẽ được tải
- Có loading state khi đang tải

### 2. Progress Bar
- Hiển thị tiến độ đã tải
- Tính theo công thức: `(users.length / total) * 100`

### 3. Thông tin phân trang
- Số lượng items đang hiển thị
- Tổng số items đã tải
- Số lượng items còn lại

## API Endpoints

### GET /api/v1/users
**Parameters:**
- `limit`: Số lượng items mỗi lần tải (default: 10)
- `offset`: Vị trí bắt đầu (default: 0)

**Example:**
```
GET /api/v1/users?limit=10&offset=0
GET /api/v1/users?limit=20&offset=10
```

## Lợi ích

1. **UX tốt hơn**: Không cần chuyển trang, dữ liệu được thêm vào liên tục
2. **Performance**: Chỉ tải dữ liệu cần thiết
3. **Responsive**: Hoạt động tốt trên mobile
4. **SEO friendly**: Tất cả dữ liệu trong một URL

## Lưu ý

1. **Memory**: Dữ liệu được tích lũy trong store, cần xử lý khi có quá nhiều
2. **Search/Filter**: Cần reset phân trang khi thay đổi filter
3. **Error handling**: Xử lý lỗi khi tải thêm dữ liệu
4. **Loading states**: Hiển thị trạng thái loading rõ ràng

## Troubleshooting

### Vấn đề thường gặp:
1. **Không tải được dữ liệu**: Kiểm tra API response structure
2. **Nút "Tải thêm" không hiển thị**: Kiểm tra `hasMore` state
3. **Dữ liệu bị duplicate**: Kiểm tra logic trong `loadMore`

### Debug:
- Sử dụng debug info trong development mode
- Kiểm tra console logs
- Verify API response structure
