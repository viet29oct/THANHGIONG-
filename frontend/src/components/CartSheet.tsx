import { Link } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { formatVND } from "@/data/products";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { ordersApi } from "@/lib/api/orders";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function CartSheet({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { data: cart, isLoading, remove } = useCart();
  const qc = useQueryClient();

  const checkout = async () => {
    try {
      const order = await ordersApi.checkout();
      if (order.paymentUrl) {
        window.location.href = order.paymentUrl;
      } else {
        toast.success(`Đơn hàng #${order.id} đã tạo — chờ thanh toán`);
        setOpen(false);
        qc.invalidateQueries({ queryKey: ["cart"] });
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Checkout failed");
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Giỏ hàng ({cart?.itemCount ?? 0})</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {isLoading && <p className="text-sm text-muted-foreground">Đang tải...</p>}
          {!isLoading && !cart?.items.length && (
            <p className="text-sm text-muted-foreground">Giỏ hàng trống.</p>
          )}
          {cart?.items.map((item) => (
            <div key={item.productId} className="flex gap-3 border-b border-border pb-4">
              <img src={item.imageUrl} alt="" className="h-16 w-16 rounded object-cover" />
              <div className="flex-1 min-w-0">
                <Link to="/products/$slug" params={{ slug: item.slug }} className="text-sm font-medium line-clamp-2 hover:text-primary">
                  {item.productName}
                </Link>
                <p className="text-sm text-primary font-semibold mt-1">{formatVND(item.lineTotal)}</p>
                <p className="text-xs text-muted-foreground">SL: {item.quantity}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => remove.mutate(item.productId)} aria-label="Xóa">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        {cart && cart.items.length > 0 && (
          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex justify-between text-sm font-semibold">
              <span>Tổng</span>
              <span className="text-primary">{formatVND(cart.total)}</span>
            </div>
            <Button className="w-full" onClick={checkout}>Thanh toán</Button>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/cart" onClick={() => setOpen(false)}>Xem chi tiết</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
