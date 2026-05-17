# Frontend Integration

## Setup

```bash
cp .env.example .env
docker compose up -d
cd backend && mvn spring-boot:run
npm run dev
```

`vite.config.ts` proxies `/api` → `http://localhost:8080`.

## API client

- `src/lib/api/client.ts` — `fetch` with `credentials: "include"`, CSRF header
- `src/lib/api/auth.ts`, `cart.ts`, `orders.ts`, `products.ts`
- `src/contexts/AuthContext.tsx` — session via `/api/v1/auth/me`

## Example: add to cart

```ts
import { cartApi } from "@/lib/api/cart";
await cartApi.add(productId, 1);
```

## New routes

`/login`, `/register`, `/cart`, `/orders`

## Floating support

`src/components/FloatingSupportButton.tsx` — mounted in `__root.tsx`
