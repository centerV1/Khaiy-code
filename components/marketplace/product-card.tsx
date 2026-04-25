"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  formatPrice,
  getPrimaryImage,
  toCartSnapshot,
  withLocale,
} from "@/lib/site";
import { useDirectCheckout } from "@/lib/hooks/use-direct-checkout";
import type { ProductSummary } from "@/lib/types/store";
import { useCart } from "@/providers/cart-provider";
import { useTranslate } from "@/utils/useTranslate";

type ProductCardProps = {
  locale: string;
  product: ProductSummary;
};

export function ProductCard({ locale, product }: ProductCardProps) {
  const t = useTranslations();
  const translate = useTranslate();
  const { addItem, hasProduct, removeItem } = useCart();
  const { buyNow, isPending, isReady } = useDirectCheckout(locale);
  const primaryImage = getPrimaryImage(product);
  const inCart = hasProduct(product.id);
  const productName = translate(product, "name");
  const productDescription = translate(product, "description");
  const categoryNames = product.category.map((category) =>
    translate(category, "name"),
  );

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-sky-100/80 bg-white/90 shadow-lg shadow-sky-100/60 transition duration-300 hover:shadow-xl hover:shadow-sky-200/70">
      <Link className="block" href={withLocale(locale, `/product/${product.id}`)}>
        <div className="relative aspect-[4/3] min-h-64 w-full overflow-hidden bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.22),rgba(255,255,255,0.95)_55%,rgba(224,242,254,0.8))]">
          {primaryImage ? (
            <Image
              alt={productName}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              src={primaryImage}
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.25),transparent_30%),linear-gradient(135deg,rgba(15,23,42,0.06),rgba(14,165,233,0.18))]" />
          )}

          <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-slate-950/40 to-transparent" />
        </div>
      </Link>

      <div className="space-y-4 p-5">
        <div className="flex flex-wrap gap-2">
          {categoryNames.slice(0, 2).map((categoryName, index) => (
            <span
              className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700"
              key={`${product.id}-${categoryName}-${index}`}
            >
              {categoryName}
            </span>
          ))}
        </div>

        <div className="space-y-2">
          <Link href={withLocale(locale, `/product/${product.id}`)}>
            <h3 className="text-xl font-semibold tracking-tight text-slate-950 transition group-hover:text-sky-700">
              {productName}
            </h3>
          </Link>
          <p className="line-clamp-3 text-sm leading-6 text-slate-600">
            {productDescription}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              {t("labels.seller")}
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
            disabled={!isReady || isPending}
            onClick={() => buyNow(product.id)}
          >
            {isPending ? t("auth.pending") : t("common.buy")}
          </Button>
          <Button
            aria-label={inCart ? t("common.added") : t("common.addToCart")}
            className={
              inCart
                ? "size-11 shrink-0 rounded-full border border-sky-600 bg-sky-600 text-white hover:bg-sky-500"
                : "size-11 shrink-0 rounded-full border border-sky-100 bg-white text-sky-700 hover:bg-sky-50"
            }
            onClick={() => {
              if (inCart) {
                removeItem(product.id);
                toast.info(t("status.cartItemRemoved"));
                return;
              }

              addItem(
                toCartSnapshot({
                  product,
                  name: productName,
                  description: productDescription,
                  categories: categoryNames,
                }),
              );
              toast.success(t("status.cartItemAdded"));
            }}
            size="icon"
            variant="outline"
          >
            <ShoppingCart className="size-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
