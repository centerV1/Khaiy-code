import { SellWorkspace } from "@/components/sell/sell-workspace";
import { getCategories } from "@/lib/api/category";

export default async function SellPage({
  params,
}: {
  params: Promise<{ local: string }>;
}) {
  const { local } = await params;
  const categories = await getCategories().catch(() => []);

  return <SellWorkspace categories={categories} locale={local} />;
}
