import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authApi } from "@/lib/api/auth";

type Search = { token?: string };
type Status = "loading" | "success" | "error";

export const Route = createFileRoute("/verify-email")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    token: search.token as string | undefined,
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const { token } = Route.useSearch();
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Thiếu mã xác minh. Vui lòng dùng đúng link trong email.");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        await authApi.verifyEmail(token);
        if (!cancelled) {
          setStatus("success");
          setMessage("Email đã được xác minh thành công. Bạn có thể đăng nhập ngay.");
        }
      } catch (err) {
        if (!cancelled) {
          setStatus("error");
          setMessage(
            err instanceof Error
              ? err.message
              : "Mã xác minh không hợp lệ hoặc đã hết hạn.",
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="container mx-auto px-4 py-20 text-center max-w-md">
      {status === "loading" && (
        <>
          <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin" />
          <h1 className="mt-6 text-2xl font-bold">Đang xác minh...</h1>
          <p className="mt-2 text-muted-foreground">
            Vui lòng đợi trong giây lát.
          </p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
          <h1 className="mt-6 text-2xl font-bold">Xác minh thành công!</h1>
          <p className="mt-4 text-muted-foreground">{message}</p>
          <div className="mt-8 flex flex-col gap-3">
            <Button asChild>
              <Link to="/login">Đăng nhập</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">Về trang chủ</Link>
            </Button>
          </div>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="h-16 w-16 text-red-500 mx-auto" />
          <h1 className="mt-6 text-2xl font-bold">Xác minh thất bại</h1>
          <p className="mt-4 text-muted-foreground">{message}</p>
          <div className="mt-8 flex flex-col gap-3">
            <Button asChild>
              <Link to="/login">Đi tới trang đăng nhập</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/register">Đăng ký lại</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
