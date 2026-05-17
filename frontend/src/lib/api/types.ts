export type ApiUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
};

export type ApiProduct = {
  id: number;
  slug: string;
  name: string;
  version: string | null;
  category: string;
  licenseType: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  price: number;
  originalPrice: number | null;
  stock: number;
  featured: boolean;
  inStock: boolean;
};

export type CartItem = {
  productId: number;
  productName: string;
  slug: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type Cart = {
  items: CartItem[];
  total: number;
  itemCount: number;
};

export type Order = {
  id: number;
  status: string;
  totalPrice: number;
  createdAt: string;
  items: { productId: number; productName: string; quantity: number; unitPrice: number }[];
  paymentUrl?: string;
};
