import type { AppLocale, CartProductSnapshot, ProductSummary } from "@/lib/types/store";

const STORE_CURRENCY = process.env.NEXT_PUBLIC_STORE_CURRENCY ?? "USD";

export function normalizeLocale(locale: string): AppLocale {
  return locale === "th" ? "th" : "en";
}

export function withLocale(locale: string, pathname = "/") {
  const safePath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `/${normalizeLocale(locale)}${safePath === "/" ? "" : safePath}`;
}

export function getPrimaryImage(product: ProductSummary) {
  return (
    product.images.find((image) => image.isPrimary)?.imageUrl ??
    product.images[0]?.imageUrl ??
    null
  );
}

export function toCartSnapshot(args: {
  product: ProductSummary;
  name: string;
  description: string;
  categories: string[];
}): CartProductSnapshot {
  const { product, name, description, categories } = args;

  return {
    productId: product.id,
    name,
    description,
    price: product.price,
    imageUrl: getPrimaryImage(product),
    sellerEmail: product.user.email,
    categories,
  };
}

export function formatPrice(value: number, locale: string) {
  return new Intl.NumberFormat(locale === "th" ? "th-TH" : "en-US", {
    style: "currency",
    currency: STORE_CURRENCY,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "th" ? "th-TH" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function getInitials(email: string) {
  return email.slice(0, 2).toUpperCase();
}
