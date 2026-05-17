import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/lib/api/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resending, setResending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowResend(false);
    try {
      await login(email, password);
      toast.success("Đăng nhập thành công");
      navigate({ to: "/" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Đăng nhập thất bại";
      toast.error(msg);
      // Backend trả thông báo này khi user chưa xác minh email
      if (/not verified/i.test(msg) || /chưa xác minh/i.test(msg)) {
        setShowResend(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    if (!email) {
      toast.error("Vui lòng nhập email trước khi gửi lại");
      return;
    }
    setResending(true);
    try {
      await authApi.resendVerification(email);
      toast.success("Đã gửi lại email xác minh. Vui lòng kiểm tra hộp thư.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không gửi được email");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <h1 className="text-2xl font-bold">Đăng nhập</h1>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="password">Mật khẩu</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </Button>
      </form>

      {showResend && (
        <div className="mt-6 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm">
          <p className="font-medium text-amber-900">Email chưa được xác minh</p>
          <p className="mt-1 text-amber-800">
            Bạn cần xác minh email trước khi đăng nhập. Không nhận được email?
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={onResend}
            disabled={resending}
          >
            {resending ? "Đang gửi..." : "Gửi lại email xác minh"}
          </Button>
        </div>
      )}

      <p className="mt-4 text-sm text-muted-foreground">
        Chưa có tài khoản?{" "}
        <Link to="/register" className="text-primary hover:underline">
          Đăng ký
        </Link>
      </p>
    </div>
  );
}
