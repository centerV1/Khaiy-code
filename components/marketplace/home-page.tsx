"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { ProductCard } from "@/components/marketplace/product-card";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice, withLocale } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { Category, ProductSummary } from "@/lib/types/store";
import { useTranslate } from "@/utils/useTranslate";

type HomePageProps = {
  locale: string;
  products: ProductSummary[];
  categories: Category[];
  hasBackendError: boolean;
};

export function HomePage({
  locale,
  products,
  categories,
  hasBackendError,
}: HomePageProps) {
  const t = useTranslations();
  const translate = useTranslate();
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="pb-20">
      <section className="relative overflow-hidden border-b border-white/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.25),_transparent_35%),radial-gradient(circle_at_80%_20%,_rgba(125,211,252,0.45),_transparent_20%),linear-gradient(180deg,_rgba(248,252,255,0.95),_rgba(239,246,255,0.9))]" />
        <div className="relative mx-auto grid min-h-[calc(100svh-81px)] max-w-7xl gap-14 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-14">
          <div className="flex max-w-2xl flex-col justify-center">
            <p className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.35em] text-sky-700">
              <Sparkles className="size-4" />
              {t("home.eyebrow")}
            </p>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              {t("home.title")}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              {t("home.description")}
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "h-12 rounded-full bg-sky-600 px-6 text-white hover:bg-sky-500",
                )}
                href={withLocale(locale, "/product")}
              >
                {t("home.primaryCta")}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-12 rounded-full border-white/70 bg-white/80 px-6 text-slate-900 hover:bg-white",
                )}
                href={withLocale(locale, "/sell")}
              >
                {t("home.secondaryCta")}
              </Link>
            </div>

            {hasBackendError ? (
              <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50/90 px-5 py-4 text-sm leading-6 text-amber-800">
                {t("status.backendUnavailable")}
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 lg:grid-rows-[1.2fr_0.8fr]">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-[linear-gradient(135deg,_rgba(14,165,233,0.1),_rgba(255,255,255,0.9)_40%,_rgba(59,130,246,0.16))] p-6 shadow-2xl shadow-sky-200/50">
              <div className="absolute inset-x-6 top-6 flex items-center justify-between text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
                <span>{t("brand")}</span>
                <span>{products.length} {t("labels.assets")}</span>
              </div>
              <div className="mt-14 space-y-4">
                {featuredProducts.map((product) => (
                  <div
                    className="rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-md shadow-sky-100/80 backdrop-blur"
                    key={product.id}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.35em] text-sky-600">
                          {product.category[0]
                            ? translate(product.category[0], "name")
                            : t("nav.products")}
                        </p>
                        <p className="text-xl font-semibold tracking-tight text-slate-950">
                          {translate(product, "name")}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-slate-500">
                        {formatPrice(product.price, locale)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[2rem] border border-sky-100 bg-white/85 p-5 shadow-lg shadow-sky-100/60">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-600">
                  {t("home.categoryTitle")}
                </p>
                <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                  {categories.length}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {t("home.categoryDescription")}
                </p>
              </div>
              <div className="rounded-[2rem] border border-sky-100 bg-slate-950 p-5 shadow-lg shadow-slate-300/40">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-300">
                  {t("labels.sellerFlow")}
                </p>
                <p className="mt-4 text-3xl font-semibold tracking-tight text-white">
                  {t("labels.uploadPreviewCheckout")}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {t("home.sellerDescription")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-600">
              {t("home.featuredTitle")}
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
              {t("home.featuredDescription")}
            </h2>
          </div>
          <Link
            className="text-sm font-semibold text-sky-700 transition hover:text-sky-500"
            href={withLocale(locale, "/product")}
          >
            {t("common.browse")}
          </Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} locale={locale} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 pt-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-600">
            {t("home.sellerTitle")}
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            {t("home.finalTitle")}
          </h2>
          <p className="mt-4 max-w-lg text-base leading-7 text-slate-600">
            {t("home.finalDescription")}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {categories.slice(0, 6).map((category) => (
            <div
              className="rounded-[2rem] border border-sky-100 bg-white/85 p-5 shadow-md shadow-sky-100/60"
              key={category.id}
            >
              <p className="text-lg font-semibold text-slate-950">
                {translate(category, "name")}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {(category._count?.products ?? 0).toString()}{" "}
                {t("labels.productsConnectedToCategory")}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
