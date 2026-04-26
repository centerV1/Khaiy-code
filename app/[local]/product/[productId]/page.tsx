"use server";

import { notFound } from "next/navigation";

import { ProductDetailPage } from "@/components/marketplace/product-detail-page";
import { getMarketplaceBootstrap } from "@/lib/api/marketplace";
import { getProduct } from "@/lib/api/products";

export default async function ProductDetailRoute({
  params,
}: {
  params: Promise<{ local: string; productId: string }>;
}) {
  const { local, productId } = await params;
  const product = await getProduct(Number(productId)).catch(() => null);

  if (!product) {
    notFound();
  }

  const bootstrap = await getMarketplaceBootstrap();
  const relatedProducts = bootstrap.products
    .filter((item) => item.id !== product.id)
    .slice(0, 3);

  return (
    <ProductDetailPage
      locale={local}
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
