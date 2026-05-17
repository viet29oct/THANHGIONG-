import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/lib/api/cart";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useCart() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.get,
    enabled: !!user,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["cart"] });

  const add = useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity?: number }) =>
      cartApi.add(productId, quantity ?? 1),
    onSuccess: () => { invalidate(); toast.success("Đã thêm vào giỏ hàng"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      cartApi.update(productId, quantity),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (productId: number) => cartApi.remove(productId),
    onSuccess: invalidate,
  });

  return { ...query, add, update, remove };
}
