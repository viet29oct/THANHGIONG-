import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api/orders";
import { useAuth } from "@/contexts/AuthContext";
import { formatVND } from "@/data/products";

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
});

function OrdersPage() {
  const { user } = useAuth();
  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: ordersApi.myOrders,
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground"><Link to="/login" className="text-primary">Đăng nhập</Link> để xem đơn hàng.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-2xl font-bold">Đơn hàng của tôi</h1>
      {isLoading && <p className="mt-6 text-muted-foreground">Đang tải...</p>}
      {!isLoading && !orders?.length && <p className="mt-6 text-muted-foreground">Chưa có đơn hàng.</p>}
      <ul className="mt-6 space-y-4">
        {orders?.map((o) => (
          <li key={o.id} className="border border-border rounded-lg p-4">
            <div className="flex justify-between">
              <span className="font-medium">#{o.id}</span>
              <span className="text-sm text-muted-foreground">{new Date(o.createdAt).toLocaleString("vi-VN")}</span>
            </div>
            <p className="mt-2 text-primary font-semibold">{formatVND(o.totalPrice)}</p>
            <p className="text-sm text-muted-foreground">Trạng thái: {o.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
