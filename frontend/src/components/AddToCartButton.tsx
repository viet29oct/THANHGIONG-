import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/hooks/useCart";
import { Link } from "@tanstack/react-router";
type Props = {
  productId: number;
  size?: "default" | "sm" | "lg";
  className?: string;
  label?: string;
};

export function AddToCartButton({ productId, size = "sm", className, label = "Mua ngay" }: Props) {
  const { user } = useAuth();
  const { add } = useCart();

  if (!user) {
    return (
      <Button size={size} className={className} asChild>
        <Link to="/login">{label}</Link>
      </Button>
    );
  }

  return (
    <Button
      size={size}
      className={className}
      disabled={add.isPending}
      onClick={() => {
        add.mutate({ productId });
      }}
    >
      <ShoppingCart className="h-3.5 w-3.5" /> {label}
    </Button>
  );
}
