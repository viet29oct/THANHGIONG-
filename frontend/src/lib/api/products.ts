import type { Product } from "@/data/products";
import type { ApiProduct } from "./types";
import { api } from "./client";

export function mapApiProduct(p: ApiProduct): Product {
  return {
    id: String(p.id),
    slug: p.slug,
    name: p.name,
    category: (p.category ?? "Windows") as Product["category"],
    licenseType: p.licenseType ?? "",
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
    image: p.imageUrl,
    shortDescription: p.shortDescription ?? "",
    description: p.description ?? "",
    specs: [
      { label: "Phiên bản", value: p.version ?? "—" },
      { label: "Loại license", value: p.licenseType ?? "—" },
    ],
    inStock: p.inStock,
    featured: p.featured,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const list = await api<ApiProduct[]>("/api/v1/products");
  return list.map(mapApiProduct);
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const p = await api<ApiProduct>(`/api/v1/products/slug/${slug}`);
    return mapApiProduct(p);
  } catch {
    return null;
  }
}
