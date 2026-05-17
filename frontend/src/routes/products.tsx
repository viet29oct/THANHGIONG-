import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Sản phẩm — License Microsoft chính hãng | Thánh Gióng" },
      { name: "description", content: "Danh mục license Windows, Office, Microsoft 365, Windows Server chính hãng với giá tốt nhất." },
    ],
  }),
  component: ProductsPage,
});

const categories = ["Tất cả", "Windows", "Office", "Windows Server"] as const;
const sorts = [
  { v: "default", l: "Mặc định" },
  { v: "price-asc", l: "Giá tăng dần" },
  { v: "price-desc", l: "Giá giảm dần" },
  { v: "name", l: "Tên A→Z" },
] as const;

function ProductsPage() {
  const { data: products = [], isLoading } = useProducts();
  const [cat, setCat] = useState<(typeof categories)[number]>("Tất cả");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<(typeof sorts)[number]["v"]>("default");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = useMemo(() => {
    let list = products.slice();
    if (cat !== "Tất cả") list = list.filter((p) => p.category === cat);
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(s));
    }
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, cat, q, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="bg-surface border-b border-border">
      <div className="container mx-auto px-4 py-8">
        <nav className="text-xs text-muted-foreground">Trang chủ / <span className="text-foreground">Sản phẩm</span></nav>
        <h1 className="mt-3 text-3xl font-bold">License Microsoft</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          {filtered.length} sản phẩm — license chính hãng, giao trong 30 phút.
        </p>
      </div>
      <div className="container mx-auto px-4 pb-16 grid lg:grid-cols-[260px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="rounded-lg border border-border bg-background p-5 h-fit lg:sticky lg:top-28">
          <div>
            <h3 className="font-semibold text-sm mb-3">Tìm kiếm</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => { setQ(e.target.value); setPage(1); }}
                placeholder="Tên sản phẩm..."
                className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>
          <div className="mt-6">
            <h3 className="font-semibold text-sm mb-3">Danh mục</h3>
            <ul className="space-y-1">
              {categories.map((c) => (
                <li key={c}>
                  <button
                    onClick={() => { setCat(c); setPage(1); }}
                    className={`w-full text-left px-2.5 py-2 rounded-md text-sm transition ${
                      cat === c ? "bg-accent text-primary font-medium" : "text-foreground/80 hover:bg-accent"
                    }`}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6">
            <h3 className="font-semibold text-sm mb-3">Khoảng giá</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>Dưới 1 triệu</li>
              <li>1 – 3 triệu</li>
              <li>3 – 10 triệu</li>
              <li>Trên 10 triệu</li>
            </ul>
          </div>
        </aside>

        {/* Main */}
        <div>
          <div className="flex items-center justify-between mb-4 rounded-lg border border-border bg-background px-4 py-3">
            <div className="text-sm text-muted-foreground">
              Hiển thị {current.length} / {filtered.length} sản phẩm
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Sắp xếp:</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="h-9 rounded-md border border-input bg-background px-2 text-sm outline-none focus:border-primary"
              >
                {sorts.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-lg border border-border bg-background p-12 text-center text-muted-foreground">Đang tải sản phẩm...</div>
          ) : current.length === 0 ? (
            <div className="rounded-lg border border-border bg-background p-12 text-center text-muted-foreground">
              Không tìm thấy sản phẩm phù hợp.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {current.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-9 min-w-9 px-3 rounded-md border text-sm transition ${
                    page === p ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/40"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
