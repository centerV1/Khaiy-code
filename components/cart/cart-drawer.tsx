"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, ShoppingBag, Trash2, X } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/api/fetcher";
import { createCheckoutSession } from "@/lib/api/payment";
import { formatPrice, withLocale } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useCart } from "@/providers/cart-provider";

type CartDrawerProps = {
  locale: string;
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({ locale, open, onClose }: CartDrawerProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const { items, subtotal, removeItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCheckout() {
    setCheckoutError(null);

    startTransition(async () => {
      try {
        const session = await createCheckoutSession(
          items.map((item) => item.productId),
        );

        window.location.href = session.checkoutUrl;
      } catch (error) {
        setCheckoutError(getErrorMessage(error));
      }
    });
  }

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-50 transition ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <button
        aria-label={t("cart.close")}
        className={`absolute inset-0 bg-slate-950/35 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        type="button"
      />

      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/40 bg-white/92 shadow-2xl shadow-sky-950/10 transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-sky-100 px-5 py-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">
              {t("cart.title")}
            </h2>
          </div>

          <button
            className="rounded-full border border-sky-100 p-2 text-slate-500 transition hover:border-sky-200 hover:text-slate-950"
            onClick={onClose}
            type="button"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="border-b border-sky-100 px-5 py-4 text-sm text-slate-600">
          {t("cart.description")}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="rounded-full bg-sky-100 p-4 text-sky-700">
              <ShoppingBag className="size-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-950">
                {t("cart.emptyTitle")}
              </h3>
              <p className="text-sm leading-6 text-slate-600">
                {t("cart.emptyDescription")}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
              {items.map((item) => (
                <div
                  className="rounded-3xl border border-sky-100 bg-white p-4 shadow-sm shadow-sky-100/60"
                  key={item.productId}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),_rgba(255,255,255,0.9)_60%)] text-[10px] font-semibold uppercase tracking-[0.3em] text-sky-700">
                      {t("labels.code")}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-950">
                        {item.snapshot.name}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">
                        {item.snapshot.description}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-sm font-medium text-sky-700">
                          {formatPrice(item.snapshot.price, locale)}
                        </p>
                        <button
                          className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition hover:text-red-500"
                          onClick={() => removeItem(item.productId)}
                          type="button"
                        >
                          <Trash2 className="size-3.5" />
                          {t("cart.remove")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-sky-100 px-5 py-5">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>{t("cart.subtotal")}</span>
                <span className="text-lg font-semibold text-slate-950">
                  {formatPrice(subtotal, locale)}
                </span>
              </div>

              {!isAuthenticated ? (
                <>
                  <p className="mt-4 text-sm leading-6 text-slate-500">
                    {t("cart.authNotice")}
                  </p>
                  <Link
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      "mt-4 h-11 w-full rounded-full",
                    )}
                    href={`${withLocale(locale, "/login")}?redirect=${encodeURIComponent(
                      pathname,
                    )}`}
                    onClick={onClose}
                  >
                    {t("cart.loginToCheckout")}
                    <ArrowRight className="size-4" />
                  </Link>
                </>
              ) : (
                <Button
                  className="mt-4 h-11 w-full rounded-full"
                  disabled={isPending}
                  onClick={handleCheckout}
                >
                  {isPending ? t("auth.pending") : t("common.checkout")}
                  <ArrowRight className="size-4" />
                </Button>
              )}

              {checkoutError ? (
                <p className="mt-3 text-sm text-red-500">{checkoutError}</p>
              ) : null}
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
