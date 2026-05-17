import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Zap, Headphones, Lock, Award, ArrowRight, Check, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { ContactModal } from "@/components/ContactModal";
import { useProducts } from "@/hooks/useProducts";
import { reviews, faqs } from "@/data/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Máy tính Thánh Gióng — License Microsoft chính hãng" },
      { name: "description", content: "Phân phối Windows, Office, Microsoft 365 và Windows Server bản quyền. Giao license trong 30 phút, hóa đơn VAT đầy đủ." },
    ],
  }),
  component: HomePage,
});

const reasons = [
  { icon: ShieldCheck, title: "License chính hãng 100%", desc: "Phân phối trực tiếp từ Microsoft và nhà phân phối ủy quyền." },
  { icon: Zap, title: "Giao license tức thì", desc: "Key điện tử gửi qua email trong vòng 5 – 30 phút." },
  { icon: Award, title: "Bảo hành trọn vòng đời", desc: "Hỗ trợ kích hoạt lại miễn phí theo chính sách Microsoft." },
  { icon: Headphones, title: "Hỗ trợ 24/7", desc: "Đội ngũ kỹ thuật chuyên trách cho khách hàng doanh nghiệp." },
  { icon: Lock, title: "Thanh toán an toàn", desc: "Hỗ trợ chuyển khoản, VNPay, công nợ doanh nghiệp." },
  { icon: Check, title: "Hóa đơn VAT đầy đủ", desc: "Xuất hóa đơn điện tử cho 100% đơn hàng doanh nghiệp." },
];

const stats = [
  { v: "12,500+", l: "Khách hàng doanh nghiệp" },
  { v: "85,000+", l: "License đã cung cấp" },
  { v: "99.6%", l: "Tỷ lệ hài lòng" },
  { v: "10+", l: "Năm kinh nghiệm" },
];

function HomePage() {
  const { data: products = [] } = useProducts();
  const featured = products.filter((p) => p.featured);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-surface">
        <div className="container mx-auto px-4 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Microsoft Authorized Reseller
            </div>
            <h1 className="mt-5 text-4xl lg:text-5xl font-bold leading-[1.1]">
              Giải pháp license Microsoft<br />cho doanh nghiệp hiện đại
            </h1>
            <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-xl">
              Cung cấp Windows, Office, Microsoft 365 và Windows Server bản quyền chính hãng.
              Giao license điện tử trong 30 phút, đầy đủ hóa đơn VAT, bảo hành theo Microsoft.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/products">Xem sản phẩm <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
              <ContactModal
                trigger={<Button size="lg" variant="outline">Yêu cầu báo giá</Button>}
              />
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-success" /> Hợp đồng doanh nghiệp</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-success" /> Hóa đơn VAT</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-success" /> Hỗ trợ kỹ thuật trọn đời</span>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-xl border border-border bg-background p-6 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)]">
              <div className="grid grid-cols-2 gap-3">
                {featured.slice(0, 4).map((p) => (
                  <Link
                    key={p.id}
                    to="/products/$slug"
                    params={{ slug: p.slug }}
                    className="rounded-lg border border-border p-4 hover:border-primary/40 hover:bg-surface transition"
                  >
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{p.category}</div>
                    <div className="mt-1 font-semibold text-sm leading-snug line-clamp-2">{p.name}</div>
                    <div className="mt-3 text-primary font-bold text-sm">
                      {p.price.toLocaleString("vi-VN")}₫
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-wider text-primary font-semibold">Sản phẩm nổi bật</div>
            <h2 className="mt-2 text-2xl lg:text-3xl font-bold">License Microsoft bán chạy</h2>
          </div>
          <Link to="/products" className="hidden sm:inline-flex items-center text-sm text-primary hover:underline">
            Xem tất cả <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {featured.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-surface border-y border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs uppercase tracking-wider text-primary font-semibold">Vì sao chọn chúng tôi</div>
            <h2 className="mt-2 text-2xl lg:text-3xl font-bold">Đối tác license đáng tin cậy</h2>
            <p className="mt-3 text-muted-foreground">
              Hơn 10 năm phục vụ doanh nghiệp tại Việt Nam với quy trình cung cấp license minh bạch và chuyên nghiệp.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reasons.map((r) => (
              <div key={r.title} className="rounded-lg border border-border bg-background p-6 hover:border-primary/40 transition">
                <div className="h-10 w-10 rounded-md bg-accent flex items-center justify-center text-primary">
                  <r.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-[15px]">{r.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.l} className="rounded-lg border border-border p-6 text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary">{s.v}</div>
              <div className="mt-2 text-sm text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-surface border-y border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-xs uppercase tracking-wider text-primary font-semibold">Khách hàng nói gì</div>
            <h2 className="mt-2 text-2xl lg:text-3xl font-bold">Được tin dùng bởi 12,500+ doanh nghiệp</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {reviews.map((r) => (
              <div key={r.name} className="rounded-lg border border-border bg-background p-6">
                <Quote className="h-6 w-6 text-primary/30" />
                <p className="mt-3 text-sm leading-relaxed text-foreground/80">"{r.content}"</p>
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="font-semibold text-sm">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ preview */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          <div>
            <div className="text-xs uppercase tracking-wider text-primary font-semibold">Hỗ trợ</div>
            <h2 className="mt-2 text-2xl lg:text-3xl font-bold">Câu hỏi thường gặp</h2>
            <p className="mt-3 text-muted-foreground text-sm">
              Một số thắc mắc phổ biến từ khách hàng khi mua license Microsoft.
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link to="/faq">Xem tất cả</Link>
            </Button>
          </div>
          <div className="lg:col-span-2 divide-y divide-border border border-border rounded-lg bg-background">
            {faqs.slice(0, 4).map((f) => (
              <div key={f.q} className="p-5">
                <h4 className="font-semibold text-[15px]">{f.q}</h4>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
