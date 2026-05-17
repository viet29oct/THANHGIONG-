import type { Cart } from "./types";
import { api } from "./client";

export const cartApi = {
  get: () => api<Cart>("/api/v1/cart"),
  add: (productId: number, quantity = 1) =>
    api<Cart>("/api/v1/cart/add", { method: "POST", body: JSON.stringify({ productId, quantity }) }),
  update: (productId: number, quantity: number) =>
    api<Cart>("/api/v1/cart/update", { method: "PUT", body: JSON.stringify({ productId, quantity }) }),
  remove: (productId: number) =>
    api<Cart>(`/api/v1/cart/remove?productId=${productId}`, { method: "DELETE" }),
};
