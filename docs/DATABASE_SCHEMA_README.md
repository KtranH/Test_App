# Database Schema - Hệ thống Quản lý Quần áo

## Tổng quan
Hệ thống database được thiết kế để quản lý quần áo với các biến thể về màu sắc, kích cỡ và chất liệu. Database hỗ trợ đầy đủ các chức năng CRUD cho trang quản trị.

## Cấu trúc Database

### 1. Bảng `categories`
Quản lý danh mục quần áo với cấu trúc phân cấp.

**Các trường chính:**
- `id`: Khóa chính
- `name`: Tên danh mục
- `slug`: URL thân thiện
- `parent_id`: ID danh mục cha (hỗ trợ phân cấp)
- `sort_order`: Thứ tự sắp xếp
- `is_active`: Trạng thái hoạt động

**Ví dụ dữ liệu:**
- Áo Nam (parent)
  - Áo Thun (child)
  - Áo Sơ Mi (child)
- Quần Nam (parent)
  - Quần Jean (child)
  - Quần Short (child)

### 2. Bảng `products`
Lưu trữ thông tin cơ bản của sản phẩm quần áo.

**Các trường chính:**
- `name`: Tên sản phẩm
- `category_id`: Liên kết với danh mục
- `sku`: Mã sản phẩm duy nhất
- `base_price`: Giá cơ bản
- `sale_price`: Giá khuyến mãi
- `brand`: Thương hiệu
- `is_featured`: Sản phẩm nổi bật

### 3. Bảng `attributes`
Định nghĩa các thuộc tính của sản phẩm.

**Các thuộc tính chuẩn:**
- Màu sắc (color)
- Kích cỡ (size)
- Chất liệu (material)
- Kiểu dáng (style)

**Các trường:**
- `code`: Mã thuộc tính duy nhất
- `type`: Loại thuộc tính (select, text, number)
- `is_filterable`: Có thể dùng để lọc sản phẩm

### 4. Bảng `attribute_values`
Lưu các giá trị cụ thể của từng thuộc tính.

**Ví dụ:**
- Màu sắc: Đen, Trắng, Đỏ, Xanh dương...
- Kích cỡ: XS, S, M, L, XL, XXL...
- Chất liệu: Cotton, Polyester, Vải lanh...

**Các trường đặc biệt:**
- `color_code`: Mã màu hex (cho thuộc tính màu sắc)
- `image`: Hình ảnh minh họa (ví dụ: swatch màu)

### 5. Bảng `product_variants`
Quản lý các biến thể của sản phẩm (kết hợp các thuộc tính).

**Ví dụ biến thể:**
- Áo thun nam cơ bản - Đen - S
- Áo thun nam cơ bản - Trắng - M

**Các trường:**
- `sku`: Mã biến thể duy nhất
- `price`: Giá riêng (nếu khác giá gốc)
- `attribute_combination`: JSON lưu tổ hợp thuộc tính
- `weight`, `width`, `height`, `length`: Kích thước và trọng lượng

### 6. Bảng `product_variant_attributes`
Bảng trung gian liên kết biến thể với thuộc tính.

**Mục đích:**
- Tạo mối quan hệ many-to-many giữa biến thể và thuộc tính
- Hỗ trợ truy vấn và lọc hiệu quả

### 7. Bảng `product_images`
Quản lý hình ảnh cho sản phẩm và biến thể.

**Các loại hình ảnh:**
- Hình ảnh chung cho sản phẩm (`product_variant_id = NULL`)
- Hình ảnh riêng cho từng biến thể

**Các trường:**
- `is_primary`: Hình ảnh chính
- `sort_order`: Thứ tự hiển thị
- `alt_text`, `title`: SEO và accessibility

### 8. Bảng `inventory`
Quản lý kho hàng cho từng biến thể.

**Các trường:**
- `quantity`: Tổng số lượng
- `reserved_quantity`: Số lượng đã đặt hàng
- `available_quantity`: Số lượng có sẵn
- `low_stock_threshold`: Ngưỡng cảnh báo hết hàng
- `is_backorder_allowed`: Cho phép đặt hàng trước

## Mối quan hệ giữa các bảng

```
categories (1) ←→ (n) products
products (1) ←→ (n) product_variants
product_variants (n) ←→ (n) attributes (qua product_variant_attributes)
attributes (1) ←→ (n) attribute_values
product_variants (1) ←→ (1) inventory
products (1) ←→ (n) product_images
product_variants (1) ←→ (n) product_images
```

## Ưu điểm của thiết kế

1. **Linh hoạt**: Dễ dàng thêm thuộc tính mới (ví dụ: mùa, phong cách)
2. **Hiệu suất**: Indexing tối ưu cho các truy vấn phổ biến
3. **Mở rộng**: Hỗ trợ nhiều loại sản phẩm khác nhau
4. **Quản lý**: Dễ dàng quản lý kho hàng theo từng biến thể
5. **SEO**: Hỗ trợ URL thân thiện và meta data

## Cách sử dụng

### Chạy migration
```bash
php artisan migrate
```

### Chạy seeder
```bash
php artisan db:seed
```

### Chạy seeder cụ thể
```bash
php artisan db:seed --class=CategorySeeder
```

## Truy vấn mẫu

### Lấy tất cả biến thể của một sản phẩm
```sql
SELECT pv.*, p.name as product_name
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
WHERE p.id = 1;
```

### Lấy sản phẩm theo màu sắc
```sql
SELECT DISTINCT p.*
FROM products p
JOIN product_variants pv ON p.id = pv.product_id
JOIN product_variant_attributes pva ON pv.id = pva.product_variant_id
JOIN attribute_values av ON pva.attribute_value_id = av.id
WHERE av.value = 'Đen' AND av.attribute_id = 1;
```

### Kiểm tra tồn kho
```sql
SELECT pv.sku, pv.name, i.available_quantity
FROM product_variants pv
JOIN inventory i ON pv.id = i.product_variant_id
WHERE i.available_quantity > 0;
```
