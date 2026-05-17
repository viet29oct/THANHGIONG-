# Microsoft Licensing Solutions Project

Dự án phân phối License Microsoft chính hãng.

## Cấu trúc thư mục (Production Layout)

Dự án được phân chia rõ ràng giữa Backend và Frontend để dễ dàng quản lý và triển khai:

- **`/backend`**: Mã nguồn phía máy chủ (Spring Boot 3.3.5, Java 21, PostgreSQL).
  - Quản lý xác thực, giỏ hàng, đơn hàng, license keys và tích hợp VNPay.
- **`/frontend`**: Mã nguồn phía giao diện người dùng (TanStack Start, React, Tailwind CSS).
  - Giao diện hiện đại, tích hợp giỏ hàng và thanh toán VNPay.
- **`docker-compose.yml`**: Cấu hình chạy các dịch vụ (PostgreSQL, v.v.) qua Docker.
- **`.env.example`**: Các biến môi trường mẫu cần thiết cho dự án.

## Hướng dẫn khởi chạy

### 1. Backend
```bash
cd backend
mvn spring-boot:run
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

## Tính năng chính
- Đăng ký/Đăng nhập (có xác minh email).
- Quản lý giỏ hàng.
- Thanh toán VNPay (Sandbox).
- Tự động bàn giao License Key qua Email sau khi thanh toán thành công.
