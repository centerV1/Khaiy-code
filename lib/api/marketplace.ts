import { getCategories } from "@/lib/api/category";
import { getProducts } from "@/lib/api/products";
import type { MarketplaceBootstrap } from "@/lib/types/store";

export async function getMarketplaceBootstrap(): Promise<MarketplaceBootstrap> {
  const [productsResult, categoriesResult] = await Promise.allSettled([
    getProducts(),
    getCategories(),
  ]);

  return {
    products:
      productsResult.status === "fulfilled" ? productsResult.value : [],
    categories:
      categoriesResult.status === "fulfilled" ? categoriesResult.value : [],
    hasBackendError:
      productsResult.status === "rejected" ||
      categoriesResult.status === "rejected",
  };
}
