"use client";

import Link from "next/link";
import { Download, Library, LogOut, ShieldCheck } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  getMyPurchases,
} from "@/lib/api/users";
import { getErrorMessage } from "@/lib/api/fetcher";
import { hasRole } from "@/lib/auth/roles";
import { getPurchasedProductDownload } from "@/lib/api/products";
import {
  formatDate,
  formatPrice,
  getPrimaryImage,
  withLocale,
} from "@/lib/site";
import type { PurchaseItem } from "@/lib/types/store";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useTranslate } from "@/utils/useTranslate";

export function ProfileDashboard({ locale }: { locale: string }) {
  const t = useTranslations();
  const translate = useTranslate();
  const { user, status, isAuthenticated, logout } = useAuth();
  const canViewListings = hasRole(user, "ADMIN", "SELLER");
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    void (async () => {
      try {
        const response = await getMyPurchases();
        setPurchases(response.products);
      } catch (loadError) {
        toast.error(getErrorMessage(loadError));
      }
    })();
  }, [isAuthenticated]);

  function handleDownload(productId: number) {
    setDownloadingId(productId);

    startTransition(async () => {
      try {
        const download = await getPurchasedProductDownload(productId);
        toast.success(t("status.downloadReady"));
        window.open(download.url, "_blank", "noopener,noreferrer");
      } catch (downloadError) {
        toast.error(getErrorMessage(downloadError));
      } finally {
        setDownloadingId(null);
      }
    });
  }

  function handleLogout() {
    startTransition(async () => {
      try {
        await logout();
        toast.success(t("status.logoutSuccess"));
      } catch (logoutError) {
        toast.error(getErrorMessage(logoutError));
      }
    });
  }

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/60 bg-white/80 p-8 text-sm text-slate-500 shadow-xl shadow-sky-100/70">
          {t("status.loadingProfile")}
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <section className="rounded-[2.5rem] border border-white/60 bg-white/88 p-10 shadow-xl shadow-sky-100/70">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-600">
            {t("nav.profile")}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
            {t("profile.guestTitle")}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            {t("profile.guestDescription")}
          </p>
          <Link
            className={cn(
              buttonVariants({ variant: "default" }),
              "mt-8 h-12 rounded-full px-6",
            )}
            href={withLocale(locale, "/login")}
          >
            {t("profile.guestCta")}
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <section className="rounded-[2.5rem] border border-white/60 bg-white/88 p-8 shadow-xl shadow-sky-100/70">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-600">
          {t("nav.profile")}
        </p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
              {t("profile.title")}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              {t("profile.description")}
            </p>
          </div>
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3 rounded-[2rem] border border-sky-100 bg-sky-50/80 px-5 py-4 text-sm text-slate-700">
              <span className="inline-flex size-11 items-center justify-center overflow-hidden rounded-full border border-white/80 bg-white text-sm font-semibold text-slate-800 shadow-sm shadow-sky-100/70">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt={user.email}
                    className="size-full object-cover"
                    src={user.avatarUrl}
                  />
                ) : (
                  user.email.slice(0, 2).toUpperCase()
                )}
              </span>
              <span>
                {t("labels.signedInAs")} <span className="font-semibold">{user.email}</span>
              </span>
            </div>
            <Button
              className="h-12 rounded-full bg-slate-900 px-5 text-white hover:bg-slate-800"
              disabled={isPending}
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
              {t("nav.logout")}
            </Button>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <MetricCard
          className={canViewListings ? undefined : "md:col-span-2"}
          label={t("labels.purchases")}
          value={String(user.purchaseCount)}
        />
        {canViewListings ? (
          <MetricCard
            label={t("labels.listings")}
            value={String(user.productCount)}
          />
        ) : null}
        <MetricCard label={t("labels.provider")} value={user.provider} />
      </div>

      <section className="mt-8 rounded-[2.5rem] border border-white/60 bg-white/88 p-8 shadow-xl shadow-sky-100/70">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <Library className="size-5" />
          </span>
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">
              {t("profile.purchasesTitle")}
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {t("profile.purchasesDescription")}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {purchases.length > 0 ? (
            purchases.map((purchase) => (
              <article
                className="grid gap-5 rounded-[2rem] border border-sky-100 bg-white p-5 shadow-sm shadow-sky-100/50 md:grid-cols-[110px_1fr_auto]"
                key={`${purchase.orderId}-${purchase.product.id}`}
              >
                <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.25),rgba(255,255,255,0.92)_60%)]">
                  {getPrimaryImage(purchase.product) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt={translate(purchase.product, "name")}
                      className="h-full w-full object-cover"
                      src={getPrimaryImage(purchase.product) ?? ""}
                    />
                  ) : null}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xl font-semibold text-slate-950">
                      {translate(purchase.product, "name")}
                    </p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      <ShieldCheck className="size-3.5" />
                      {t("profile.ownedLabel")}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    {t("profile.purchasedOn")}{" "}
                    {formatDate(purchase.purchasedAt, locale)}
                  </p>
                  <p className="mt-3 text-sm font-medium text-slate-700">
                    {formatPrice(purchase.unitPrice / 100, locale)}
                  </p>
                </div>

                <div className="flex items-center">
                  <Button
                    className="h-11 rounded-full px-5"
                    disabled={isPending && downloadingId === purchase.product.id}
                    onClick={() => handleDownload(purchase.product.id)}
                  >
                    <Download className="size-4" />
                    {downloadingId === purchase.product.id
                      ? t("auth.pending")
                      : t("profile.download")}
                  </Button>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[2rem] border border-dashed border-sky-200 bg-sky-50/60 px-5 py-10 text-center text-sm leading-6 text-slate-500">
              {t("common.emptyState")}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[2rem] border border-white/60 bg-white/88 p-6 shadow-lg shadow-sky-100/60",
        className,
      )}
    >
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
        {value}
      </p>
    </div>
  );
}
