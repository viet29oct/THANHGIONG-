import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type PaymentSearch = {
  vnp_ResponseCode?: string;
};

export const Route = createFileRoute("/payment-result")({
  validateSearch: (search: Record<string, unknown>): PaymentSearch => {
    return {
      vnp_ResponseCode: search.vnp_ResponseCode as string | undefined,
    };
  },
  component: PaymentResultPage,
});

function PaymentResultPage() {
  const { vnp_ResponseCode } = Route.useSearch();
  const isSuccess = vnp_ResponseCode === "00";

  return (
    <div className="container mx-auto px-4 py-20 text-center max-w-md">
      {isSuccess ? (
        <>
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <h1 className="mt-6 text-2xl font-bold">Thanh toán thành công!</h1>
          <p className="mt-4 text-muted-foreground">
            Cảm ơn bạn đã mua hàng. License key đã được gửi vào email của bạn.
            Bạn cũng có thể xem key trong chi tiết đơn hàng.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Button asChild>
              <Link to="/orders">Xem đơn hàng của tôi <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">Quay lại trang chủ</Link>
            </Button>
          </div>
        </>
      ) : (
        <>
          <XCircle className="h-16 w-16 text-red-500 mx-auto" />
          <h1 className="mt-6 text-2xl font-bold">Thanh toán thất bại</h1>
          <p className="mt-4 text-muted-foreground">
            Đã có lỗi xảy ra trong quá trình thanh toán hoặc giao dịch đã bị hủy.
            Vui lòng thử lại sau hoặc liên hệ hỗ trợ.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Button asChild>
              <Link to="/cart">Quay lại giỏ hàng</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">Quay lại trang chủ</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
