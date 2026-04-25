"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/api/fetcher";
import { createCheckoutSession } from "@/lib/api/payment";
import { withLocale } from "@/lib/site";
import { useAuth } from "@/providers/auth-provider";

export function useDirectCheckout(locale: string) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated, status } = useAuth();
  const [isPending, startTransition] = useTransition();

  function buildRedirectTarget() {
    const query = searchParams.toString();

    return query ? `${pathname}?${query}` : pathname;
  }

  function buyNow(productId: number) {
    if (status === "loading") {
      return;
    }

    if (!isAuthenticated) {
      toast.info(t("status.redirectingToLogin"));
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
        toast.error(getErrorMessage(checkoutError));
      }
    });
  }

  return {
    buyNow,
    isPending,
    isReady: status !== "loading",
  };
}
