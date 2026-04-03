import { apiFetch } from "@/lib/api/fetcher";
import type { PurchaseLibraryResponse, SessionUser } from "@/lib/types/store";

export async function getMe() {
  return apiFetch<SessionUser>("/users/me");
}

export async function getMyPurchases() {
  return apiFetch<PurchaseLibraryResponse>("/users/purchases");
}
