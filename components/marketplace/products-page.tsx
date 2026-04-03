"use client";

import { useDeferredValue, useState } from "react";
import { useTranslations } from "next-intl";

import { ProductCard } from "@/components/marketplace/product-card";
import { useTranslate } from "@/utils/useTranslate";
import type { Category, ProductSummary } from "@/lib/types/store";

type ProductsPageProps = {
  locale: string;
  products: ProductSummary[];
  categories: Category[];
  hasBackendError: boolean;
};

export function ProductsPage({
  locale,
  products,
  categories,
  hasBackendError,
}: ProductsPageProps) {
  const t = useTranslations();
  const translate = useTranslate();
  const [query, setQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const deferredQuery = useDeferredValue(query);

  const filteredProducts = products.filter((product) => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();
    const matchesQuery =
      normalizedQuery.length === 0 ||
      translate(product, "name").toLowerCase().includes(normalizedQuery) ||
      translate(product, "description")
        .toLowerCase()
        .includes(normalizedQuery) ||
      product.user.email.toLowerCase().includes(normalizedQuery);

    const matchesCategory =
      activeCategoryId === null ||
      product.category.some((category) => category.id === activeCategoryId);

    return matchesQuery && matchesCategory;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <section className="rounded-[2.5rem] border border-white/60 bg-white/85 p-8 shadow-xl shadow-sky-100/70">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-600">
              {t("nav.products")}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
              {t("products.title")}
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              {t("products.description")}
            </p>
          </div>

          <div className="w-full max-w-xl space-y-4">
            <input
              className="h-12 w-full rounded-full border border-sky-100 bg-sky-50/70 px-5 text-sm text-slate-950 outline-none transition focus:border-sky-400 focus:bg-white"
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("products.searchPlaceholder")}
              value={query}
            />
            <div className="flex flex-wrap gap-2">
              <button
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeCategoryId === null
                    ? "bg-sky-600 text-white"
                    : "bg-sky-50 text-slate-700 hover:bg-sky-100"
                }`}
                onClick={() => setActiveCategoryId(null)}
                type="button"
              >
                {t("products.filterAll")}
              </button>
              {categories.map((category) => (
                <button
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeCategoryId === category.id
                      ? "bg-sky-600 text-white"
                      : "bg-sky-50 text-slate-700 hover:bg-sky-100"
                  }`}
                  key={category.id}
                  onClick={() => setActiveCategoryId(category.id)}
                  type="button"
                >
                  {translate(category, "name")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 flex items-center justify-between text-sm text-slate-500">
        <span>
          {filteredProducts.length} {t("products.showingLabel")}
        </span>
        {hasBackendError ? (
          <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">
            {t("status.apiUnavailable")}
          </span>
        ) : null}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} locale={locale} product={product} />
          ))}
        </div>
      ) : (
        <section className="mt-10 rounded-[2rem] border border-dashed border-sky-200 bg-white/70 px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold text-slate-950">
            {t("products.noResultsTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
            {t("products.noResultsDescription")}
          </p>
        </section>
      )}
    </div>
  );
}
