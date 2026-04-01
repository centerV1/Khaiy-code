"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  formatPrice,
  getCategoryName,
  getPrimaryImage,
  getProductName,
  getSiteCopy,
  toCartSnapshot,
  withLocale,
} from "@/lib/site";
import type { ProductSummary } from "@/lib/types/store";
import { cn } from "@/lib/utils";
import { useCart } from "@/providers/cart-provider";

type ProductCardProps = {
  locale: string;
  product: ProductSummary;
};

export function ProductCard({ locale, product }: ProductCardProps) {
  const copy = getSiteCopy(locale);
  const { addItem, hasProduct } = useCart();
  const primaryImage = getPrimaryImage(product);
  const inCart = hasProduct(product.id);

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-sky-100/80 bg-white/90 shadow-lg shadow-sky-100/60 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-200/70">
      <Link className="block" href={withLocale(locale, `/product/${product.id}`)}>
        <div className="relative aspect-[4/3] overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.22),_rgba(255,255,255,0.95)_55%,_rgba(224,242,254,0.8))]">
          {primaryImage ? (
            <Image
              alt={getProductName(product, locale)}
              className="object-cover transition duration-500 group-hover:scale-105"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              src={primaryImage}
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(14,165,233,0.25),_transparent_30%),linear-gradient(135deg,_rgba(15,23,42,0.06),_rgba(14,165,233,0.18))]" />
          )}

          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/40 to-transparent" />
        </div>
      </Link>

      <div className="space-y-4 p-5">
        <div className="flex flex-wrap gap-2">
          {product.category.slice(0, 2).map((category) => (
            <span
              className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700"
              key={category.id}
            >
              {getCategoryName(category, locale)}
            </span>
          ))}
        </div>

        <div className="space-y-2">
          <Link href={withLocale(locale, `/product/${product.id}`)}>
            <h3 className="text-xl font-semibold tracking-tight text-slate-950 transition group-hover:text-sky-700">
              {getProductName(product, locale)}
            </h3>
          </Link>
          <p className="line-clamp-3 text-sm leading-6 text-slate-600">
            {product.description_en === product.description_th
              ? product.description_en
              : locale === "th"
                ? product.description_th
                : product.description_en}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Seller
            </p>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {product.user.email}
            </p>
          </div>

          <p className="text-xl font-semibold text-slate-950">
            {formatPrice(product.price, locale)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            className="h-11 flex-1 rounded-full bg-sky-600 text-white hover:bg-sky-500"
            onClick={() => addItem(toCartSnapshot(product, locale))}
          >
            {inCart ? copy.common.added : copy.common.addToCart}
            <Plus className="size-4" />
          </Button>
          <Link
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 rounded-full px-4",
            )}
            href={withLocale(locale, `/product/${product.id}`)}
          >
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
