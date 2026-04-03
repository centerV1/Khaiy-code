import { apiFetch } from "@/lib/api/fetcher";
import type { CreateCheckoutSessionResponse } from "@/lib/types/store";

export async function createCheckoutSession(productIds: number[]) {
  return apiFetch<CreateCheckoutSessionResponse>("/payment/payment-session", {
    method: "POST",
    body: {
      items: productIds.map((productId) => ({ productId })),
    },
  });
}
