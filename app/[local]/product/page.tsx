import { ProductsPage } from "@/components/marketplace/products-page";
import { getMarketplaceBootstrap } from "@/lib/api/store";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ local: string }>;
}) {
  const { local } = await params;
  const bootstrap = await getMarketplaceBootstrap();

  return <ProductsPage {...bootstrap} locale={local} />;
}
