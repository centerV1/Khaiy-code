import { apiFetch } from "@/lib/api/fetcher";
import type {
  Category,
  CreateCheckoutSessionResponse,
  CreateProductPayload,
  DownloadProductResponse,
  MarketplaceBootstrap,
  ProductSummary,
  PurchaseLibraryResponse,
  SellerProduct,
} from "@/lib/types/store";

export async function getProducts() {
  return apiFetch<ProductSummary[]>("/products", {
    next: {
      revalidate: 60,
      tags: ["products"],
    },
  });
}

export async function getProduct(productId: number) {
  return apiFetch<ProductSummary>(`/products/${productId}`, {
    next: {
      revalidate: 60,
      tags: [`product-${productId}`],
    },
  });
}

export async function getCategories() {
  return apiFetch<Category[]>("/category", {
    next: {
      revalidate: 300,
      tags: ["categories"],
    },
  });
}

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

export async function getMyProducts() {
  return apiFetch<SellerProduct[]>("/products/mine");
}

export async function getMyPurchases() {
  return apiFetch<PurchaseLibraryResponse>("/users/purchases");
}

export async function createProduct(payload: CreateProductPayload) {
  const createForm = new FormData();
  createForm.set("name_th", payload.name_th);
  createForm.set("name_en", payload.name_en);
  createForm.set("description_th", payload.description_th);
  createForm.set("description_en", payload.description_en);
  createForm.set("price", String(payload.price));
  createForm.set("categoryIds", payload.categoryIds.join(","));
  createForm.set("file", payload.file);

  const created = await apiFetch<ProductSummary>("/products", {
    method: "POST",
    body: createForm,
  });

  if (payload.images.length > 0) {
    const imageForm = new FormData();
    payload.images.forEach((image) => imageForm.append("images", image));

    await apiFetch(`/products/${created.id}/images`, {
      method: "POST",
      body: imageForm,
    });
  }

  return getProduct(created.id);
}

export async function deleteProduct(productId: number) {
  return apiFetch<{ success: boolean; message: string }>(`/products/${productId}`, {
    method: "DELETE",
  });
}

export async function createCheckoutSession(productIds: number[]) {
  return apiFetch<CreateCheckoutSessionResponse>("/payment/payment-session", {
    method: "POST",
    body: {
      items: productIds.map((productId) => ({ productId })),
    },
  });
}

export async function getPurchasedProductDownload(productId: number) {
  return apiFetch<DownloadProductResponse>(`/products/purchases/file/${productId}`);
}
