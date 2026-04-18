"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { Package, Trash2, UploadCloud } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  createProduct,
  deleteProduct,
  getMyProducts,
} from "@/lib/api/products";
import { getErrorMessage } from "@/lib/api/fetcher";
import { hasRole } from "@/lib/auth/roles";
import {
  formatPrice,
  withLocale,
} from "@/lib/site";
import type { Category, SellerProduct } from "@/lib/types/store";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useTranslate } from "@/utils/useTranslate";

type SellWorkspaceProps = {
  locale: string;
  categories: Category[];
};

export function SellWorkspace({ locale, categories }: SellWorkspaceProps) {
  const t = useTranslations();
  const translate = useTranslate();
  const { user, status, isAuthenticated } = useAuth();
  const canAccessSell = hasRole(user, "SELLER", "ADMIN");
  const canDeleteProducts = hasRole(user, "ADMIN");
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const loadListings = async () => {
    try {
      const data = await getMyProducts();
      setProducts(data);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !canAccessSell) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void loadListings();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [canAccessSell, isAuthenticated]);

  function handleSubmit(formData: FormData) {
    setFeedback(null);
    setError(null);

    startTransition(async () => {
      try {
        const payload = {
          name_th: String(formData.get("name_th") ?? ""),
          name_en: String(formData.get("name_en") ?? ""),
          description_th: String(formData.get("description_th") ?? ""),
          description_en: String(formData.get("description_en") ?? ""),
          price: Number(formData.get("price") ?? 0),
          categoryIds: formData
            .getAll("categoryIds")
            .map((value) => Number(value))
            .filter((value) => Number.isFinite(value)),
          file: formData.get("file") as File,
          images: formData
            .getAll("images")
            .filter((value): value is File => value instanceof File && value.size > 0),
        };

        await createProduct(payload);
        await loadListings();

        formRef.current?.reset();
        setFeedback(t("status.productPublishedSuccess"));
      } catch (submitError) {
        setError(getErrorMessage(submitError));
      }
    });
  }

  function handleDelete(productId: number) {
    if (!canDeleteProducts) {
      return;
    }

    setFeedback(null);
    setError(null);

    startTransition(async () => {
      try {
        await deleteProduct(productId);
        await loadListings();
        setFeedback(t("status.productRemovedSuccess"));
      } catch (deleteError) {
        setError(getErrorMessage(deleteError));
      }
    });
  }

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/60 bg-white/80 p-8 text-sm text-slate-500 shadow-xl shadow-sky-100/70">
          {t("status.loadingSellerWorkspace")}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <section className="rounded-[2.5rem] border border-white/60 bg-white/88 p-10 shadow-xl shadow-sky-100/70">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-600">
            {t("nav.sell")}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
            {t("sell.guestTitle")}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            {t("sell.guestDescription")}
          </p>
          <Link
            className={cn(
              buttonVariants({ variant: "default" }),
              "mt-8 h-12 rounded-full px-6",
            )}
            href={withLocale(locale, "/login")}
          >
            {t("sell.guestCta")}
          </Link>
        </section>
      </div>
    );
  }

  if (!canAccessSell) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <section className="rounded-[2.5rem] border border-white/60 bg-white/88 p-10 shadow-xl shadow-sky-100/70">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-600">
            {t("nav.sell")}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
            {t("sell.restrictedTitle")}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            {t("sell.restrictedDescription")}{" "}
            <a
              className="font-medium text-sky-700 underline decoration-sky-300 underline-offset-4 transition hover:text-sky-800"
              href="mailto:khaiycode@gmail.com"
            >
              khaiycode@gmail.com
            </a>
          </p>
          <Link
            className={cn(
              buttonVariants({ variant: "default" }),
              "mt-8 h-12 rounded-full px-6",
            )}
            href={withLocale(locale, "/profile")}
          >
            {t("sell.restrictedCta")}
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <section className="rounded-[2.5rem] border border-white/60 bg-white/88 p-8 shadow-xl shadow-sky-100/70">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-600">
          {t("nav.sell")}
        </p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
              {t("sell.title")}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              {t("sell.description")}
            </p>
          </div>
          <div className="rounded-[2rem] border border-sky-100 bg-sky-50/80 px-5 py-4 text-sm text-slate-700">
            {t("labels.loggedInAs")} <span className="font-semibold">{user?.email}</span>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <form
          action={handleSubmit}
          className="rounded-[2.5rem] border border-white/60 bg-white/88 p-8 shadow-xl shadow-sky-100/70"
          ref={formRef}
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
              <UploadCloud className="size-5" />
            </span>
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">
                {t("sell.formTitle")}
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {t("sell.formDescription")}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Field label={t("sell.fields.nameTh")} name="name_th" />
            <Field label={t("sell.fields.nameEn")} name="name_en" />
            <TextAreaField
              label={t("sell.fields.descriptionTh")}
              name="description_th"
            />
            <TextAreaField
              label={t("sell.fields.descriptionEn")}
              name="description_en"
            />
            <Field
              label={t("sell.fields.price")}
              min="1"
              name="price"
              step="1"
              type="number"
            />
            <FileField
              accept=".zip,application/zip"
              label={t("sell.fields.file")}
              name="file"
            />
            <div className="md:col-span-2">
              <FileField
                accept="image/png,image/jpeg,image/jpg"
                label={t("sell.fields.images")}
                multiple
                name="images"
              />
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium text-slate-700">
              {t("sell.fields.categories")}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((category) => (
                <label
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-sky-100 bg-sky-50/70 px-4 py-2 text-sm text-slate-700"
                  key={category.id}
                >
                  <input
                    className="size-4 rounded border-sky-300 text-sky-600"
                    name="categoryIds"
                    type="checkbox"
                    value={category.id}
                  />
                  {translate(category, "name")}
                </label>
              ))}
            </div>
          </div>

          {feedback ? <p className="mt-5 text-sm text-emerald-600">{feedback}</p> : null}
          {error ? <p className="mt-5 text-sm text-red-500">{error}</p> : null}

          <Button
            className="mt-8 h-12 rounded-full px-6"
            disabled={isPending}
            type="submit"
          >
            {isPending ? t("sell.submitting") : t("sell.submit")}
          </Button>
        </form>

        <section className="rounded-[2.5rem] border border-white/60 bg-white/88 p-8 shadow-xl shadow-sky-100/70">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <Package className="size-5" />
            </span>
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">
                {t("sell.listingsTitle")}
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {t("sell.listingsDescription")}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {products.length > 0 ? (
              products.map((product) => (
                <article
                  className="rounded-[2rem] border border-sky-100 bg-white p-5 shadow-sm shadow-sky-100/50"
                  key={product.id}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-slate-950">
                        {translate(product, "name")}
                      </p>
                      <p className="mt-2 text-sm text-slate-500">
                        {formatPrice(product.price, locale)}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {product.category.map((category) => (
                          <span
                            className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700"
                            key={category.id}
                          >
                            {translate(category, "name")}
                          </span>
                        ))}
                      </div>
                    </div>
                    {canDeleteProducts ? (
                      <button
                        className="inline-flex size-10 items-center justify-center rounded-full border border-sky-100 text-slate-500 transition hover:border-red-200 hover:text-red-500"
                        onClick={() => handleDelete(product.id)}
                        type="button"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    ) : null}
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
    </div>
  );
}

function Field(props: {
  label: string;
  name: string;
  type?: string;
  step?: string;
  min?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{props.label}</span>
      <input
        className="h-12 w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 text-sm text-slate-950 outline-none transition focus:border-sky-400 focus:bg-white"
        min={props.min}
        name={props.name}
        required
        step={props.step}
        type={props.type ?? "text"}
      />
    </label>
  );
}

function TextAreaField(props: { label: string; name: string }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{props.label}</span>
      <textarea
        className="min-h-36 w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-400 focus:bg-white"
        name={props.name}
        required
      />
    </label>
  );
}

function FileField(props: {
  label: string;
  name: string;
  accept: string;
  multiple?: boolean;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{props.label}</span>
      <input
        accept={props.accept}
        className="block w-full rounded-2xl border border-dashed border-sky-200 bg-sky-50/60 px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-sky-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
        multiple={props.multiple}
        name={props.name}
        required={!props.multiple}
        type="file"
      />
    </label>
  );
}
