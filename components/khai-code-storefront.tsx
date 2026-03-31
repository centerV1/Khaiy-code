"use client";

import { startTransition, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Download,
  LockKeyhole,
  ShoppingBag,
  Trash2,
} from "lucide-react";

export type StoreCategory = {
  id: number;
  name: string;
  description: string;
};

export type StoreProduct = {
  id: number;
  slug: string;
  name: string;
  categoryId: number;
  category: string;
  tagline: string;
  description: string;
  stack: string;
  license: string;
  delivery: string;
  eta: string;
  price: number;
  includes: string[];
  featured?: boolean;
};

type StorefrontCopy = Readonly<{
  allCategories: string;
  emptyCategory: string;
  catalogCaption: string;
  addLabel: string;
  removeLabel: string;
  includeLabel: string;
  stackLabel: string;
  licenseLabel: string;
  etaLabel: string;
  summaryTitle: string;
  summaryBody: string;
  summaryEmpty: string;
  paymentLabel: string;
  totalLabel: string;
  loginLabel: string;
  historyLabel: string;
  loginMethods: readonly string[];
  checkout: string;
  checkoutHint: string;
  checkoutDisabled: string;
  successTitle: string;
  successBody: string;
  downloadLabel: string;
  unlockedTitle: string;
  unlockedBody: string;
  featuredBadge: string;
}>;

type KhaiCodeStorefrontProps = {
  categories: StoreCategory[];
  products: StoreProduct[];
  locale: string;
  copy: StorefrontCopy;
};

export default function KhaiCodeStorefront({
  categories,
  products,
  locale,
  copy,
}: KhaiCodeStorefrontProps) {
  const [activeCategory, setActiveCategory] = useState<number | "all">("all");
  const [cart, setCart] = useState<number[]>([]);
  const [purchased, setPurchased] = useState<number[]>([]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") {
      return products;
    }

    return products.filter((product) => product.categoryId === activeCategory);
  }, [activeCategory, products]);

  const selectedProducts = useMemo(
    () => products.filter((product) => cart.includes(product.id)),
    [cart, products],
  );

  const purchasedProducts = useMemo(
    () => products.filter((product) => purchased.includes(product.id)),
    [products, purchased],
  );

  const total = useMemo(
    () => selectedProducts.reduce((sum, product) => sum + product.price, 0),
    [selectedProducts],
  );

  const paymentPayload = useMemo(
    () =>
      JSON.stringify(
        {
          items: selectedProducts.map((product) => ({ productId: product.id })),
        },
        null,
        2,
      ),
    [selectedProducts],
  );

  const money = useMemo(
    () =>
      new Intl.NumberFormat(locale === "th" ? "th-TH" : "en-US", {
        style: "currency",
        currency: "THB",
        maximumFractionDigits: 0,
      }),
    [locale],
  );

  function toggleCart(productId: number) {
    setCart((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  }

  function checkout() {
    if (!selectedProducts.length) {
      return;
    }

    startTransition(() => {
      setPurchased((current) =>
        Array.from(new Set([...current, ...selectedProducts.map((product) => product.id)])),
      );
      setCart([]);
    });
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            aria-pressed={activeCategory === "all"}
            className="filter-chip"
          >
            {copy.allCategories}
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              aria-pressed={activeCategory === category.id}
              className="filter-chip"
            >
              {category.name}
            </button>
          ))}
        </div>

        <p className="max-w-2xl text-sm leading-6 text-[color:var(--muted-ink)]">
          {copy.catalogCaption}
        </p>

        <ul className="divide-y divide-[color:var(--line-strong)] border-y border-[color:var(--line-strong)]">
          {filteredProducts.length ? (
            filteredProducts.map((product) => {
              const selected = cart.includes(product.id);

              return (
                <li
                  key={product.id}
                  className="group grid gap-6 py-6 transition-colors duration-300 hover:bg-black/[0.02] md:grid-cols-[minmax(0,1.2fr)_minmax(14rem,0.7fr)_auto]"
                >
                  <div className="space-y-3 pr-0 md:pr-6">
                    <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.24em] text-[color:var(--muted-ink)]">
                      <span>{product.category}</span>
                      {product.featured ? (
                        <span className="inline-flex rounded-full border border-[color:var(--line-strong)] bg-[color:var(--accent)] px-2.5 py-1 text-[color:var(--ink)]">
                          {copy.featuredBadge}
                        </span>
                      ) : null}
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-heading text-2xl font-semibold tracking-tight text-[color:var(--ink)]">
                        {product.name}
                      </h3>
                      <p className="text-sm font-medium uppercase tracking-[0.18em] text-[color:var(--muted-ink)]">
                        {product.tagline}
                      </p>
                    </div>
                    <p className="max-w-2xl text-base leading-7 text-[color:var(--muted-ink)]">
                      {product.description}
                    </p>
                    <div className="space-y-2 text-sm text-[color:var(--muted-ink)]">
                      <p className="font-medium text-[color:var(--ink)]">
                        {copy.includeLabel}
                      </p>
                      <ul className="flex flex-wrap gap-x-6 gap-y-2">
                        {product.includes.map((item) => (
                          <li key={item} className="inline-flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-[color:var(--accent)]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <dl className="grid gap-4 self-start border-l border-[color:var(--line)] pl-0 text-sm text-[color:var(--muted-ink)] md:pl-6">
                    <div className="space-y-1">
                      <dt className="text-xs uppercase tracking-[0.22em]">
                        {copy.stackLabel}
                      </dt>
                      <dd className="font-medium text-[color:var(--ink)]">{product.stack}</dd>
                    </div>
                    <div className="space-y-1">
                      <dt className="text-xs uppercase tracking-[0.22em]">
                        {copy.licenseLabel}
                      </dt>
                      <dd className="font-medium text-[color:var(--ink)]">{product.license}</dd>
                    </div>
                    <div className="space-y-1">
                      <dt className="text-xs uppercase tracking-[0.22em]">
                        {copy.etaLabel}
                      </dt>
                      <dd className="font-medium text-[color:var(--ink)]">{product.eta}</dd>
                    </div>
                  </dl>

                  <div className="flex min-w-[11rem] flex-col items-start gap-4 md:items-end">
                    <div className="text-left md:text-right">
                      <p className="font-heading text-3xl font-semibold tracking-tight text-[color:var(--ink)]">
                        {money.format(product.price)}
                      </p>
                      <p className="mt-1 text-sm text-[color:var(--muted-ink)]">
                        {product.delivery}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleCart(product.id)}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-all duration-200 md:w-auto ${
                        selected
                          ? "bg-[color:var(--ink)] text-white"
                          : "border border-[color:var(--line-strong)] bg-white/70 text-[color:var(--ink)] hover:border-[color:var(--ink)] hover:bg-white"
                      }`}
                    >
                      {selected ? copy.removeLabel : copy.addLabel}
                      <ArrowRight className="size-4" />
                    </button>
                  </div>
                </li>
              );
            })
          ) : (
            <li className="py-12 text-base text-[color:var(--muted-ink)]">
              {copy.emptyCategory}
            </li>
          )}
        </ul>
      </div>

      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="surface-panel space-y-6 p-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted-ink)]">
              {copy.paymentLabel}
            </p>
            <h3 className="font-heading text-2xl font-semibold tracking-tight text-[color:var(--ink)]">
              {copy.summaryTitle}
            </h3>
            <p className="text-sm leading-6 text-[color:var(--muted-ink)]">
              {copy.summaryBody}
            </p>
          </div>

          <div className="space-y-3" aria-live="polite">
            {selectedProducts.length ? (
              <ul className="space-y-3">
                {selectedProducts.map((product) => (
                  <li
                    key={product.id}
                    className="flex items-start justify-between gap-3 border-b border-[color:var(--line)] pb-3"
                  >
                    <div>
                      <p className="font-medium text-[color:var(--ink)]">{product.name}</p>
                      <p className="text-sm text-[color:var(--muted-ink)]">
                        {product.category}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleCart(product.id)}
                      className="inline-flex items-center gap-1 text-sm text-[color:var(--muted-ink)] transition-colors hover:text-[color:var(--ink)]"
                      aria-label={`${copy.removeLabel} ${product.name}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-3xl border border-dashed border-[color:var(--line-strong)] px-4 py-5 text-sm leading-6 text-[color:var(--muted-ink)]">
                {copy.summaryEmpty}
              </p>
            )}
          </div>

          <div className="rounded-[1.75rem] bg-[color:var(--hero)] p-4 text-white">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/60">
                <CreditCard className="size-4" />
                Bruno mock payload
              </span>
              <span className="text-xs text-white/45">POST /payment/payment-session</span>
            </div>
            <pre className="overflow-x-auto text-xs leading-6 text-white/90">
              <code>{paymentPayload}</code>
            </pre>
          </div>

          <div className="space-y-4 border-y border-[color:var(--line)] py-4">
            <div className="flex items-center gap-2 text-sm font-medium text-[color:var(--ink)]">
              <LockKeyhole className="size-4 text-[color:var(--accent)]" />
              {copy.loginLabel}
            </div>
            <div className="flex flex-wrap gap-2">
              {copy.loginMethods.map((method) => (
                <span
                  key={method}
                  className="inline-flex rounded-full border border-[color:var(--line-strong)] px-3 py-2 text-sm text-[color:var(--muted-ink)]"
                >
                  {method}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm text-[color:var(--muted-ink)]">
              <ShoppingBag className="size-4 text-[color:var(--accent)]" />
              {copy.historyLabel}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm uppercase tracking-[0.22em] text-[color:var(--muted-ink)]">
                {copy.totalLabel}
              </span>
              <span className="font-heading text-3xl font-semibold tracking-tight text-[color:var(--ink)]">
                {money.format(total)}
              </span>
            </div>
            <button
              type="button"
              onClick={checkout}
              disabled={!selectedProducts.length}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] px-5 py-4 text-base font-semibold text-[color:var(--ink)] transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-[color:var(--line)] disabled:text-[color:var(--muted-ink)]"
            >
              {selectedProducts.length ? copy.checkout : copy.checkoutDisabled}
              <ArrowRight className="size-4" />
            </button>
            <p className="text-sm leading-6 text-[color:var(--muted-ink)]">
              {copy.checkoutHint}
            </p>
          </div>

          {purchasedProducts.length ? (
            <div className="space-y-4 rounded-[1.75rem] border border-emerald-500/20 bg-emerald-500/[0.08] p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 text-emerald-600" />
                <div>
                  <p className="font-medium text-[color:var(--ink)]">{copy.successTitle}</p>
                  <p className="mt-1 text-sm leading-6 text-[color:var(--muted-ink)]">
                    {copy.successBody}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.22em] text-[color:var(--muted-ink)]">
                  {copy.unlockedTitle}
                </p>
                <ul className="space-y-2">
                  {purchasedProducts.map((product) => (
                    <li
                      key={product.id}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-white/70 px-4 py-3"
                    >
                      <div>
                        <p className="font-medium text-[color:var(--ink)]">{product.name}</p>
                        <p className="text-sm text-[color:var(--muted-ink)]">
                          /downloads/{product.slug}.zip
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line-strong)] px-3 py-2 text-sm text-[color:var(--ink)]">
                        <Download className="size-4" />
                        {copy.downloadLabel}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm leading-6 text-[color:var(--muted-ink)]">
                  {copy.unlockedBody}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
