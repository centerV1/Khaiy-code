"use server";

import { AdminWorkspace } from "@/components/admin/admin-workspace";
import { getCategories } from "@/lib/api/category";
import { getProducts } from "@/lib/api/products";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ local: string }>;
}) {
  const { local } = await params;
  const [categories, products] = await Promise.all([
    getCategories().catch(() => []),
    getProducts({ fresh: true }).catch(() => []),
  ]);

  return (
    <AdminWorkspace
      initialCategories={categories}
      initialProducts={products}
      locale={local}
    />
  );
}
