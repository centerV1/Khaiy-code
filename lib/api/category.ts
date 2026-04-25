import { apiFetch } from "@/lib/api/fetcher";
import type { Category, CreateCategoryPayload } from "@/lib/types/store";

type GetCategoriesOptions = {
  fresh?: boolean;
};

export async function getCategories(options: GetCategoriesOptions = {}) {
  return apiFetch<Category[]>("/category", {
    cache: options.fresh ? "no-store" : undefined,
    next: options.fresh
      ? undefined
      : {
          revalidate: 300,
          tags: ["categories"],
        },
  });
}

export async function createCategory(payload: CreateCategoryPayload) {
  return apiFetch<Category>("/category", {
    method: "POST",
    body: payload,
  });
}

export async function deleteCategory(categoryId: number) {
  return apiFetch<Category>(`/category/${categoryId}`, {
    method: "DELETE",
  });
}
