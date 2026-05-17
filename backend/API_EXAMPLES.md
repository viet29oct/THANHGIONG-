# API Examples

Base URL: `http://localhost:8080`

## Auth

```bash
# Register
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Nguyen Van A","email":"a@example.com","password":"password123"}'

# Login (sets HttpOnly cookies)
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"a@example.com","password":"password123"}'

# Me
curl http://localhost:8080/api/v1/auth/me -b cookies.txt

# Refresh
curl -X POST http://localhost:8080/api/v1/auth/refresh -b cookies.txt -c cookies.txt
```

## Products

```bash
curl http://localhost:8080/api/v1/products
curl http://localhost:8080/api/v1/products/1
curl http://localhost:8080/api/v1/products/slug/windows-11-pro
```

## Cart (authenticated)

```bash
curl -X POST http://localhost:8080/api/v1/cart/add -b cookies.txt \
  -H "Content-Type: application/json" \
  -H "X-XSRF-TOKEN: <from cookie>" \
  -d '{"productId":1,"quantity":1}'

curl http://localhost:8080/api/v1/cart -b cookies.txt
```

## Orders

```bash
curl -X POST http://localhost:8080/api/v1/orders -b cookies.txt
curl http://localhost:8080/api/v1/orders/my-orders -b cookies.txt
```

## Payment webhook (PayOS / VietQR ready)

```bash
curl -X POST http://localhost:8080/api/v1/payments/webhook/PAYOS \
  -H "Content-Type: application/json" \
  -d '{"provider":"PAYOS","transactionId":"TX001","orderId":1,"amount":2890000,"rawPayload":"{}"}'
```
