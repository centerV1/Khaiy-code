"use server";

import { HomePage } from "@/components/marketplace/home-page";
import { getMarketplaceBootstrap } from "@/lib/api/marketplace";

export default async function Home({
  params,
}: {
  params: Promise<{ local: string }>;
}) {
  const { local } = await params;
  const bootstrap = await getMarketplaceBootstrap();

  return <HomePage {...bootstrap} locale={local} />;
}
