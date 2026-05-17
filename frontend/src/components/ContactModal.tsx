import { useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2, "Vui lòng nhập họ tên").max(100),
  phone: z.string().trim().regex(/^[0-9+\-\s()]{8,15}$/, "Số điện thoại không hợp lệ"),
  email: z.string().trim().email("Email không hợp lệ").max(255),
  product: z.string().trim().max(150).optional().or(z.literal("")),
  message: z.string().trim().min(5, "Nội dung quá ngắn").max(1000),
});

type Props = {
  trigger: ReactNode;
  defaultProduct?: string;
};

export function ContactModal({ trigger, defaultProduct }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") || ""),
      phone: String(fd.get("phone") || ""),
      email: String(fd.get("email") || ""),
      product: String(fd.get("product") || ""),
      message: String(fd.get("message") || ""),
    };
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        errs[String(i.path[0])] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
      toast.success("Đã gửi yêu cầu liên hệ", {
        description: "Bộ phận tư vấn sẽ phản hồi trong vòng 30 phút làm việc.",
      });
    }, 700);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Yêu cầu tư vấn license</DialogTitle>
          <DialogDescription>
            Để lại thông tin, đội ngũ Thánh Gióng sẽ liên hệ tư vấn giải pháp phù hợp.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Họ và tên *</Label>
            <Input id="name" name="name" placeholder="Nguyễn Văn A" />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="phone">Số điện thoại *</Label>
              <Input id="phone" name="phone" placeholder="09xx xxx xxx" />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" placeholder="email@congty.vn" />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="product">Sản phẩm quan tâm</Label>
            <Input id="product" name="product" defaultValue={defaultProduct} placeholder="VD: Microsoft 365 Business" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="message">Nội dung *</Label>
            <Textarea id="message" name="message" rows={4} placeholder="Mô tả nhu cầu, số lượng license, thời gian triển khai..." />
            {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Hủy</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi yêu cầu"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
