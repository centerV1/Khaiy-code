"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { ProductCard } from "@/components/marketplace/product-card";
import { RichTextContent } from "@/components/ui/rich-text-editor";
import { useRealtimeEvents } from "@/lib/hooks/use-realtime-events";
import { Button } from "@/components/ui/button";
import {
  formatDate,
  formatPrice,
  getPrimaryImage,
  toCartSnapshot,
  withLocale,
} from "@/lib/site";
import { useDirectCheckout } from "@/lib/hooks/use-direct-checkout";
import type { ProductSummary } from "@/lib/types/store";
import { useCart } from "@/providers/cart-provider";
import { useTranslate } from "@/utils/useTranslate";

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
  const t = useTranslations();
  const translate = useTranslate();
  const router = useRouter();
  const { addItem, hasProduct, removeItem } = useCart();
  const { buyNow, isPending, isReady } = useDirectCheckout(locale);
  const primaryImage = getPrimaryImage(product);
  const inCart = hasProduct(product.id);
  const productName = translate(product, "name");
  const productDescription = translate(product, "description");
  const productDetail = translate(product, "detail");
  const categoryNames = product.category.map((category) =>
    translate(category, "name"),
  );

  useRealtimeEvents(["productUpdate", "categoryUpdate"], () => {
    router.refresh();
  });

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <Link
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        href={withLocale(locale, "/product")}
      >
        <ArrowLeft className="size-4" />
        {t("nav.products")}
      </Link>

      <section className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative aspect-[4/3] min-h-72 w-full overflow-hidden rounded-[2.5rem] border border-white/60 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.25),_rgba(255,255,255,0.85)_55%)] shadow-2xl shadow-sky-100/70">
          {primaryImage ? (
            <Image
              alt={productName}
              className="object-cover"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              src={primaryImage}
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(14,165,233,0.35),_transparent_30%),linear-gradient(135deg,_rgba(15,23,42,0.08),_rgba(14,165,233,0.25))]" />
          )}
        </div>

        <div className="rounded-[2.5rem] border border-white/60 bg-white/88 p-8 shadow-xl shadow-sky-100/70">
          <div className="flex flex-wrap gap-2">
            {categoryNames.map((categoryName, index) => (
              <span
                className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700"
                key={`${product.id}-detail-${categoryName}-${index}`}
              >
                {categoryName}
              </span>
            ))}
          </div>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950">
            {productName}
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            {productDescription}
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-4 rounded-[2rem] bg-sky-50/80 p-5">
            <div>
              <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">
                {t("labels.seller")}
              </dt>
              <dd className="mt-2 text-sm font-medium text-slate-800">
                {product.user.email}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">
                {t("labels.price")}
              </dt>
              <dd className="mt-2 text-xl font-semibold text-slate-950">
                {formatPrice(product.price, locale)}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">
                {t("labels.updated")}
              </dt>
              <dd className="mt-2 text-sm font-medium text-slate-800">
                {formatDate(product.updatedAt, locale)}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">
                {t("labels.delivery")}
              </dt>
              <dd className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-800">
                <Download className="size-4 text-sky-600" />
                {t("labels.zipSourceFile")}
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              className="h-12 flex-1 rounded-full bg-sky-600 text-white hover:bg-sky-500"
              disabled={!isReady || isPending}
              onClick={() => buyNow(product.id)}
            >
              {isPending ? t("auth.pending") : t("common.buy")}
            </Button>
            <Button
              aria-label={inCart ? t("common.added") : t("common.addToCart")}
              className={
                inCart
                  ? "size-12 shrink-0 rounded-full border border-sky-600 bg-sky-600 text-white hover:bg-sky-500"
                  : "size-12 shrink-0 rounded-full border border-sky-100 bg-white text-sky-700 hover:bg-sky-50"
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
      </section>

      {productDetail ? (
        <section className="mt-10 rounded-[2.5rem] border border-white/60 bg-white/88 p-8 shadow-xl shadow-sky-100/70">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-600">
            {t("labels.productDetails")}
          </p>
          <RichTextContent className="mt-6" html={productDetail} />
        </section>
      ) : null}

      {relatedProducts.length > 0 ? (
        <section className="mt-16">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-600">
                {t("labels.moreToExplore")}
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {t("labels.relatedProducts")}
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
