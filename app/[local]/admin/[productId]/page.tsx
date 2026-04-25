import { notFound } from "next/navigation";

import { AdminProductEditor } from "@/components/admin/admin-product-editor";
import { getCategories } from "@/lib/api/category";
import { getProduct } from "@/lib/api/products";

export default async function AdminProductPage({
  params,
}: {
  params: Promise<{ local: string; productId: string }>;
}) {
  const { local, productId } = await params;
  const numericProductId = Number(productId);

  if (!Number.isFinite(numericProductId)) {
    notFound();
  }

  const [categories, product] = await Promise.all([
    getCategories().catch(() => []),
    getProduct(numericProductId, { fresh: true }).catch(() => null),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <AdminProductEditor
      categories={categories}
      locale={local}
      product={product}
    />
  );
}
