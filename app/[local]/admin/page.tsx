import { AdminWorkspace } from "@/components/admin/admin-workspace";
import { getCategories } from "@/lib/api/category";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ local: string }>;
}) {
  const { local } = await params;
  const categories = await getCategories().catch(() => []);

  return <AdminWorkspace initialCategories={categories} locale={local} />;
}
