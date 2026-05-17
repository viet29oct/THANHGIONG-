import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";
import { z } from "zod";
import { site } from "@/data/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Liên hệ — Máy tính Thánh Gióng" },
      { name: "description", content: "Liên hệ Máy tính Thánh Gióng để được tư vấn license Microsoft chính hãng cho doanh nghiệp và cá nhân." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^[0-9+\-\s()]{8,15}$/),
  email: z.string().trim().email().max(255),
  product: z.string().trim().max(150).optional().or(z.literal("")),
  message: z.string().trim().min(5).max(1000),
});

function ContactPage() {
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
      parsed.error.issues.forEach((i) => { errs[String(i.path[0])] = "Trường này không hợp lệ"; });
      setErrors(errs);
      return;
    }
    setErrors({});
    e.currentTarget.reset();
    toast.success("Đã gửi liên hệ", { description: "Chúng tôi sẽ phản hồi trong 30 phút." });
  };

  return (
    <div>
      <section className="bg-surface border-b border-border">
        <div className="container mx-auto px-4 py-14 max-w-4xl">
          <nav className="text-xs text-muted-foreground">Trang chủ / <span className="text-foreground">Liên hệ</span></nav>
          <h1 className="mt-4 text-3xl lg:text-4xl font-bold">Liên hệ tư vấn</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            Đội ngũ kinh doanh và kỹ thuật của {site.name} sẵn sàng tư vấn giải pháp license Microsoft phù hợp với quy mô doanh nghiệp của bạn.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 grid lg:grid-cols-[1fr_360px] gap-8">
        <form onSubmit={onSubmit} className="rounded-lg border border-border bg-background p-6 lg:p-8 space-y-5">
          <h2 className="text-xl font-bold">Gửi yêu cầu</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="name">Họ và tên *</Label>
              <Input id="name" name="name" />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="phone">Số điện thoại *</Label>
              <Input id="phone" name="phone" />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="product">Sản phẩm quan tâm</Label>
              <Input id="product" name="product" placeholder="VD: Microsoft 365 Business" />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="message">Nội dung *</Label>
            <Textarea id="message" name="message" rows={5} />
            {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
          </div>
          <Button type="submit" size="lg">Gửi liên hệ</Button>
        </form>

        <aside className="space-y-4">
          <div className="rounded-lg border border-border bg-background p-6">
            <h3 className="font-semibold mb-4">Thông tin liên hệ</h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span>{site.address}</span>
              </li>
              <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" /> {site.phone}</li>
              <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" /> {site.email}</li>
              <li className="flex items-center gap-3"><Clock className="h-4 w-4 text-primary" /> {site.hours}</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-surface p-6">
            <h3 className="font-semibold">Khách hàng doanh nghiệp</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Ký hợp đồng cung cấp license dài hạn, hỗ trợ công nợ và triển khai theo dự án.
            </p>
            <a href={`tel:${site.phone}`} className="mt-3 inline-block text-sm text-primary font-medium hover:underline">
              Gọi ngay {site.phone} →
            </a>
          </div>
        </aside>
      </section>
    </div>
  );
}
