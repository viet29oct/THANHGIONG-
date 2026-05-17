import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Check, MessageSquare, ShieldCheck, Zap, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactModal } from "@/components/ContactModal";
import { ProductCard } from "@/components/ProductCard";
import { formatVND } from "@/data/products";
import { useProductBySlug } from "@/hooks/useProducts";
import { AddToCartButton } from "@/components/AddToCartButton";
import { useProducts } from "@/hooks/useProducts";

export const Route = createFileRoute("/products/$slug")({
  component: ProductDetailPage,
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Không tìm thấy sản phẩm</h1>
      <Link to="/products" className="mt-4 inline-block text-primary hover:underline">← Quay lại danh mục</Link>
    </div>
  ),
});

function ProductDetailPage() {
  const { slug } = Route.useParams();
  const { data: product, isLoading } = useProductBySlug(slug);
  const { data: allProducts = [] } = useProducts();
  const [activeImg, setActiveImg] = useState("");

  if (isLoading) {
    return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Đang tải...</div>;
  }
  if (!product) throw notFound();

  const image = activeImg || product.image;
  const related = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const thumbs = [product.image, product.image, product.image];

  return (
    <div>
      <div className="bg-surface border-b border-border">
        <div className="container mx-auto px-4 py-4 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">Trang chủ</Link> /{" "}
          <Link to="/products" className="hover:text-primary">Sản phẩm</Link> /{" "}
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 grid lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <div className="aspect-square rounded-lg border border-border bg-surface overflow-hidden">
            <img src={image} alt={product.name} className="h-full w-full object-cover" />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {thumbs.map((t, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(t)}
                className={`aspect-square rounded-md border overflow-hidden ${
                  image === t ? "border-primary" : "border-border hover:border-primary/40"
                }`}
              >
                <img src={t} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="text-xs uppercase tracking-wider text-primary font-semibold">{product.category}</div>
          <h1 className="mt-2 text-2xl lg:text-3xl font-bold leading-tight">{product.name}</h1>
          <div className="mt-2 text-sm text-muted-foreground">{product.licenseType}</div>

          <div className="mt-5 inline-flex items-center gap-2 text-sm">
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
              product.inStock ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
            }`}>
              <Check className="h-3 w-3" /> {product.inStock ? "Còn hàng — sẵn key" : "Tạm hết"}
            </span>
            <span className="text-muted-foreground text-xs">Mã SP: {product.id.toUpperCase()}</span>
          </div>

          <div className="mt-6 rounded-lg border border-border bg-surface p-5">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">{formatVND(product.price)}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">{formatVND(product.originalPrice)}</span>
              )}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Giá đã bao gồm VAT. Có hóa đơn điện tử.</p>
          </div>

          <div className="mt-6 space-y-2">
            {product.specs.map((s: { label: string; value: string }) => (
              <div key={s.label} className="flex text-sm border-b border-border py-2">
                <div className="w-40 text-muted-foreground">{s.label}</div>
                <div className="font-medium">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <AddToCartButton productId={Number(product.id)} size="lg" className="gap-2" label="Mua ngay" />
            <ContactModal
              defaultProduct={product.name}
              trigger={<Button size="lg" variant="outline" className="gap-2"><MessageSquare className="h-4 w-4" /> Liên hệ tư vấn</Button>}
            />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
            {[
              { icon: ShieldCheck, t: "Chính hãng" },
              { icon: Zap, t: "Giao 30 phút" },
              { icon: Award, t: "Bảo hành Microsoft" },
            ].map((it) => (
              <div key={it.t} className="rounded-md border border-border p-3 flex items-center gap-2">
                <it.icon className="h-4 w-4 text-primary" /> {it.t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 pb-12">
        <Tabs defaultValue="desc" className="w-full">
          <TabsList className="w-full justify-start bg-surface border border-border rounded-md h-auto p-1">
            <TabsTrigger value="desc">Mô tả</TabsTrigger>
            <TabsTrigger value="activation">Hướng dẫn kích hoạt</TabsTrigger>
            <TabsTrigger value="warranty">Bảo hành</TabsTrigger>
            <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
          </TabsList>
          <TabsContent value="desc" className="mt-5 rounded-lg border border-border bg-background p-6 text-sm leading-relaxed text-foreground/80">
            {product.description}
          </TabsContent>
          <TabsContent value="activation" className="mt-5 rounded-lg border border-border bg-background p-6 text-sm leading-relaxed">
            <ol className="list-decimal pl-5 space-y-2 text-foreground/80">
              <li>Nhận key license qua email sau khi thanh toán.</li>
              <li>Mở Settings → System → Activation (hoặc tài khoản Microsoft tương ứng).</li>
              <li>Nhập product key và xác nhận kích hoạt online.</li>
              <li>Liên hệ kỹ thuật 24/7 nếu cần hỗ trợ remote miễn phí.</li>
            </ol>
          </TabsContent>
          <TabsContent value="warranty" className="mt-5 rounded-lg border border-border bg-background p-6 text-sm leading-relaxed text-foreground/80">
            License được bảo hành theo đúng vòng đời do Microsoft công bố. Trong trường hợp lỗi từ phía nhà cung cấp, Thánh Gióng cam kết đổi key mới trong vòng 24 giờ làm việc.
          </TabsContent>
          <TabsContent value="reviews" className="mt-5 rounded-lg border border-border bg-background p-6 text-sm text-muted-foreground">
            Chưa có đánh giá. Hãy là khách hàng đầu tiên đánh giá sản phẩm này.
          </TabsContent>
        </Tabs>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="container mx-auto px-4 pb-16">
          <h2 className="text-xl font-bold mb-5">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
