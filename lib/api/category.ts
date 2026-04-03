import { apiFetch } from "@/lib/api/fetcher";
import type { Category } from "@/lib/types/store";

export async function getCategories() {
  return apiFetch<Category[]>("/category", {
    next: {
      revalidate: 300,
      tags: ["categories"],
    },
  });
}
