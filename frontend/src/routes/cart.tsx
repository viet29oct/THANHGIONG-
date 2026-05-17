import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { formatVND } from "@/data/products";
import { useAuth } from "@/contexts/AuthContext";
import { ordersApi } from "@/lib/api/orders";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const { user } = useAuth();
  const { data: cart, isLoading, remove } = useCart();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Vui lòng <Link to="/login" className="text-primary">đăng nhập</Link> để xem giỏ hàng.</p>
      </div>
    );
  }

  const checkout = async () => {
    try {
      const order = await ordersApi.checkout();
      if (order.paymentUrl) {
        window.location.href = order.paymentUrl;
      } else {
        toast.success(`Đơn hàng #${order.id} đã tạo`);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Lỗi thanh toán");
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-2xl font-bold">Giỏ hàng</h1>
      {isLoading && <p className="mt-6 text-muted-foreground">Đang tải...</p>}
      {!isLoading && !cart?.items.length && (
        <p className="mt-6 text-muted-foreground">Giỏ hàng trống. <Link to="/products" className="text-primary">Mua sắm</Link></p>
      )}
      <ul className="mt-6 space-y-4">
        {cart?.items.map((item) => (
          <li key={item.productId} className="flex justify-between items-center border border-border rounded-lg p-4">
            <div>
              <Link to="/products/$slug" params={{ slug: item.slug }} className="font-medium hover:text-primary">{item.productName}</Link>
              <p className="text-sm text-muted-foreground">SL: {item.quantity} × {formatVND(item.unitPrice)}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-primary">{formatVND(item.lineTotal)}</span>
              <Button variant="outline" size="sm" onClick={() => remove.mutate(item.productId)}>Xóa</Button>
            </div>
          </li>
        ))}
      </ul>
      {cart && cart.items.length > 0 && (
        <div className="mt-8 flex justify-between items-center border-t border-border pt-6">
          <span className="text-lg font-bold">Tổng: {formatVND(cart.total)}</span>
          <Button size="lg" onClick={checkout}>Thanh toán</Button>
        </div>
      )}
    </div>
  );
}
