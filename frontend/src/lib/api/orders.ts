import type { Order } from "./types";
import { api } from "./client";

export const ordersApi = {
  checkout: () => api<Order>("/api/v1/orders", { method: "POST" }),
  myOrders: () => api<Order[]>("/api/v1/orders/my-orders"),
  get: (id: number) => api<Order>(`/api/v1/orders/${id}`),
};
