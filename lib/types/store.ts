export type AppLocale = "en" | "th";

export type AuthStatus = "loading" | "authenticated" | "guest";

export type UserRole = "USER" | "ADMIN" | "SELLER";
export type AuthProviderName = "LOCAL" | "GOOGLE" | "FACEBOOK";

export interface Category {
  id: number;
  name_th: string;
  name_en: string;
  _count?: {
    products: number;
  };
}

export interface CreateCategoryPayload {
  name_th: string;
  name_en: string;
}

export interface ProductImage {
  id: number;
  imageUrl: string | null;
  isPrimary: boolean;
  order: number;
}

export interface ProductSeller {
  id: number;
  email: string;
}

export interface ProductSummary {
  id: number;
  name_th: string;
  name_en: string;
  description_th: string;
  description_en: string;
  detail_th: string | null;
  detail_en: string | null;
  price: number;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  user: ProductSeller;
  category: Category[];
}

export interface SessionUser {
  id: number;
  email: string;
  avatarUrl?: string | null;
  role: UserRole;
  provider: AuthProviderName;
  createdAt: string;
  productCount: number;
  purchaseCount: number;
}

export interface AuthResponse {
  user: SessionUser;
}

export interface PurchaseItem {
  orderId: number;
  purchasedAt: string;
  unitPrice: number;
  product: ProductSummary;
}

export interface PurchaseLibraryResponse {
  products: PurchaseItem[];
}

export interface SellerProduct extends ProductSummary {
  canManage: boolean;
}

export interface CartProductSnapshot {
  productId: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  sellerEmail: string;
  categories: string[];
}

export interface CartItem {
  productId: number;
  quantity: 1;
  addedAt: string;
  snapshot: CartProductSnapshot;
}

export interface CreateProductPayload {
  name_th: string;
  name_en: string;
  description_th: string;
  description_en: string;
  detail_th: string;
  detail_en: string;
  price: number;
  categoryIds: number[];
  file: File;
  images: File[];
}

export interface UpdateProductPayload {
  name_th: string;
  name_en: string;
  description_th: string;
  description_en: string;
  detail_th: string;
  detail_en: string;
  price: number;
  categoryIds: number[];
  file?: File;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export type SignupPayload = LoginPayload;

export interface CreateCheckoutSessionResponse {
  orderId: number;
  sessionId: string;
  checkoutUrl: string;
}

export interface DownloadProductResponse {
  productId: number;
  url: string;
  expiresInSeconds: number;
}

export interface MarketplaceBootstrap {
  products: ProductSummary[];
  categories: Category[];
  hasBackendError: boolean;
}
