"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import { getErrorMessage } from "@/lib/api/fetcher";
import { createCheckoutSession } from "@/lib/api/payment";
import { withLocale } from "@/lib/site";
import { useAuth } from "@/providers/auth-provider";

export function useDirectCheckout(locale: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated, status } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function buildRedirectTarget() {
    const query = searchParams.toString();

    return query ? `${pathname}?${query}` : pathname;
  }

  function buyNow(productId: number) {
    setError(null);

    if (status === "loading") {
      return;
    }

    if (!isAuthenticated) {
      router.push(
        `${withLocale(locale, "/login")}?redirect=${encodeURIComponent(buildRedirectTarget())}`,
      );
      return;
    }

    startTransition(async () => {
      try {
        const session = await createCheckoutSession([productId]);
        window.location.href = session.checkoutUrl;
      } catch (checkoutError) {
        setError(getErrorMessage(checkoutError));
      }
    });
  }

  return {
    buyNow,
    checkoutError: error,
    isPending,
    isReady: status !== "loading",
  };
}
