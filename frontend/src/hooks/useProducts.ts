import { useQuery } from "@tanstack/react-query";
import { products as staticProducts } from "@/data/products";
import { fetchProducts, fetchProductBySlug } from "@/lib/api/products";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        return await fetchProducts();
      } catch {
        return staticProducts;
      }
    },
    staleTime: 5 * 60_000,
  });
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: ["products", slug],
    queryFn: async () => {
      try {
        const p = await fetchProductBySlug(slug);
        if (p) return p;
      } catch { /* fallback */ }
      return staticProducts.find((x) => x.slug === slug) ?? null;
    },
  });
}
