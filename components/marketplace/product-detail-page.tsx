"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Download, Plus } from "lucide-react";

import { ProductCard } from "@/components/marketplace/product-card";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  formatPrice,
  getCategoryName,
  getPrimaryImage,
  getProductDescription,
  getProductName,
  getSiteCopy,
  toCartSnapshot,
  withLocale,
} from "@/lib/site";
import type { ProductSummary } from "@/lib/types/store";
import { cn } from "@/lib/utils";
import { useCart } from "@/providers/cart-provider";

type ProductDetailPageProps = {
  locale: string;
  product: ProductSummary;
  relatedProducts: ProductSummary[];
};

export function ProductDetailPage({
  locale,
  product,
  relatedProducts,
}: ProductDetailPageProps) {
  const copy = getSiteCopy(locale);
  const { addItem, hasProduct } = useCart();
  const primaryImage = getPrimaryImage(product);
  const inCart = hasProduct(product.id);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <Link
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        href={withLocale(locale, "/product")}
      >
        <ArrowLeft className="size-4" />
        {copy.nav.products}
      </Link>

      <section className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] border border-white/60 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.25),_rgba(255,255,255,0.85)_55%)] shadow-2xl shadow-sky-100/70">
          {primaryImage ? (
            <Image
              alt={getProductName(product, locale)}
              className="object-cover"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              src={primaryImage}
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(14,165,233,0.35),_transparent_30%),linear-gradient(135deg,_rgba(15,23,42,0.08),_rgba(14,165,233,0.25))]" />
          )}
        </div>

        <div className="rounded-[2.5rem] border border-white/60 bg-white/88 p-8 shadow-xl shadow-sky-100/70">
          <div className="flex flex-wrap gap-2">
            {product.category.map((category) => (
              <span
                className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700"
                key={category.id}
              >
                {getCategoryName(category, locale)}
              </span>
            ))}
          </div>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950">
            {getProductName(product, locale)}
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            {getProductDescription(product, locale)}
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-4 rounded-[2rem] bg-sky-50/80 p-5">
            <div>
              <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Seller
              </dt>
              <dd className="mt-2 text-sm font-medium text-slate-800">
                {product.user.email}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Price
              </dt>
              <dd className="mt-2 text-xl font-semibold text-slate-950">
                {formatPrice(product.price, locale)}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Updated
              </dt>
              <dd className="mt-2 text-sm font-medium text-slate-800">
                {new Date(product.updatedAt).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Delivery
              </dt>
              <dd className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-800">
                <Download className="size-4 text-sky-600" />
                ZIP source file
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              className="h-12 flex-1 rounded-full bg-sky-600 text-white hover:bg-sky-500"
              onClick={() => addItem(toCartSnapshot(product, locale))}
            >
              {inCart ? copy.common.added : copy.common.addToCart}
              <Plus className="size-4" />
            </Button>
            <Link
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-12 rounded-full px-6",
              )}
              href={withLocale(locale, "/profile")}
            >
              {copy.nav.profile}
            </Link>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="mt-16">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-600">
                More to explore
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                Related products
              </h2>
            </div>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} locale={locale} product={related} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
