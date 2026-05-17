import { Link } from "@tanstack/react-router";
import { Search, ShoppingCart, User, Menu, X, ShieldCheck, Phone, LogOut } from "lucide-react";
import { useState } from "react";
import { site } from "@/data/site";
import { Button } from "@/components/ui/button";
import { CartSheet } from "@/components/CartSheet";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/hooks/useCart";

const nav = [
  { to: "/", label: "Trang chủ" },
  { to: "/products", label: "Sản phẩm" },
  { to: "/about", label: "Giới thiệu" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Liên hệ" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { data: cart } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full bg-background">
      <div className="hidden md:block border-b border-border bg-surface">
        <div className="container mx-auto flex h-9 items-center justify-between px-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>Đối tác phân phối Microsoft chính hãng tại Việt Nam</span>
          </div>
          <div className="flex items-center gap-4">
            <a href={`tel:${site.phone}`} className="flex items-center gap-1.5 hover:text-foreground">
              <Phone className="h-3.5 w-3.5" /> {site.phone}
            </a>
            <span>{site.hours}</span>
          </div>
        </div>
      </div>

      <div className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center gap-6 px-4">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-brand-foreground font-bold">
              TG
            </div>
            <div className="leading-tight">
              <div className="text-[15px] font-semibold text-brand">Thánh Gióng</div>
              <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">
                Microsoft Licensing
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="px-3 py-2 text-sm font-medium text-foreground/80 rounded-md hover:text-primary hover:bg-accent transition-colors"
                activeProps={{ className: "px-3 py-2 text-sm font-medium text-primary rounded-md bg-accent" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto hidden md:flex items-center gap-2 flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Tìm license Windows, Office..."
                className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-1">
            {user ? (
              <>
                <Button variant="ghost" size="sm" className="hidden md:inline-flex gap-2" asChild>
                  <Link to="/orders"><User className="h-4 w-4" /> {user.name.split(" ")[0]}</Link>
                </Button>
                <Button variant="ghost" size="icon" className="hidden md:inline-flex" onClick={() => logout()} aria-label="Đăng xuất">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm" className="hidden md:inline-flex gap-2" asChild>
                <Link to="/login"><User className="h-4 w-4" /> Đăng nhập</Link>
              </Button>
            )}
            <CartSheet
              trigger={
                <Button variant="outline" size="sm" className="gap-2 relative">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline">Giỏ hàng</span>
                  {!!cart?.itemCount && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground px-1">
                      {cart.itemCount}
                    </span>
                  )}
                </Button>
              }
            />
            <button
              className="lg:hidden ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md border border-input"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-border bg-background">
            <nav className="container mx-auto flex flex-col px-4 py-2">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="py-2.5 text-sm font-medium border-b border-border last:border-0"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
