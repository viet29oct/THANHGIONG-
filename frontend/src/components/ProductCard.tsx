import { Link } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactModal } from "@/components/ContactModal";
import { AddToCartButton } from "@/components/AddToCartButton";
import { formatVND, type Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex flex-col rounded-lg border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)] transition-all">
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="block aspect-[4/3] overflow-hidden bg-surface"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {product.category}
        </div>
        <Link
          to="/products/$slug"
          params={{ slug: product.slug }}
          className="mt-1 font-semibold text-[15px] leading-snug line-clamp-2 hover:text-primary"
        >
          {product.name}
        </Link>
        <div className="mt-1 text-xs text-muted-foreground">{product.licenseType}</div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">{formatVND(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatVND(product.originalPrice)}
            </span>
          )}
        </div>

        <div className="mt-4 flex gap-2 pt-3 border-t border-border">
          <AddToCartButton productId={Number(product.id)} className="flex-1 gap-1.5" />
          <ContactModal
            defaultProduct={product.name}
            trigger={
              <Button size="sm" variant="outline" className="flex-1 gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" /> Liên hệ
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}
