import { apiFetch } from "@/lib/api/fetcher";
import type {
  CreateProductPayload,
  DownloadProductResponse,
  ProductSummary,
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

export async function getMyProducts() {
  return apiFetch<SellerProduct[]>("/products/mine");
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
  return apiFetch<{ success: boolean; message: string }>(
    `/products/${productId}`,
    {
      method: "DELETE",
    },
  );
}

export async function getPurchasedProductDownload(productId: number) {
  return apiFetch<DownloadProductResponse>(
    `/products/purchases/file/${productId}`,
  );
}
