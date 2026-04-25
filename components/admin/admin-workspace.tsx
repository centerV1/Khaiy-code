"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FolderTree, Package, PlusCircle, Trash2, X } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  createCategory,
  deleteCategory,
  getCategories,
} from "@/lib/api/category";
import { deleteProduct, getProducts } from "@/lib/api/products";
import { getErrorMessage } from "@/lib/api/fetcher";
import { hasRole } from "@/lib/auth/roles";
import { useRealtimeEvents } from "@/lib/hooks/use-realtime-events";
import { formatPrice, withLocale } from "@/lib/site";
import type { Category, ProductSummary } from "@/lib/types/store";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useTranslate } from "@/utils/useTranslate";

type AdminWorkspaceProps = {
  locale: string;
  initialCategories: Category[];
  initialProducts: ProductSummary[];
};

export function AdminWorkspace({
  locale,
  initialCategories,
  initialProducts,
}: AdminWorkspaceProps) {
  const t = useTranslations();
  const translate = useTranslate();
  const router = useRouter();
  const { user, status, isAuthenticated } = useAuth();
  const canAccessAdmin = hasRole(user, "ADMIN");
  const [categories, setCategories] = useState(initialCategories);
  const [products, setProducts] = useState(initialProducts);
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(
    null,
  );
  const [deletingProductId, setDeletingProductId] = useState<number | null>(
    null,
  );
  const [confirmingProduct, setConfirmingProduct] =
    useState<ProductSummary | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  async function refreshCategories() {
    const nextCategories = await getCategories({ fresh: true });
    setCategories(nextCategories);
  }

  async function refreshProducts() {
    const nextProducts = await getProducts({ fresh: true });
    setProducts(nextProducts);
  }

  useRealtimeEvents(["categoryUpdate", "productUpdate"], () => {
    void refreshCategories().catch((refreshError) => {
      toast.error(getErrorMessage(refreshError));
    });
    void refreshProducts().catch((refreshError) => {
      toast.error(getErrorMessage(refreshError));
    });
    router.refresh();
  });

  function handleCreateCategory(formData: FormData) {
    startTransition(async () => {
      try {
        await createCategory({
          name_th: String(formData.get("name_th") ?? "").trim(),
          name_en: String(formData.get("name_en") ?? "").trim(),
        });

        formRef.current?.reset();
        toast.success(t("status.categoryCreatedSuccess"));
        void refreshCategories().catch(() => undefined);
      } catch (createError) {
        toast.error(getErrorMessage(createError));
      }
    });
  }

  function handleDeleteCategory(categoryId: number) {
    setDeletingCategoryId(categoryId);

    startTransition(async () => {
      try {
        await deleteCategory(categoryId);
        setCategories((currentCategories) =>
          currentCategories.filter((category) => category.id !== categoryId),
        );
        toast.success(t("status.categoryDeletedSuccess"));
        void refreshCategories().catch(() => undefined);
      } catch (deleteError) {
        toast.error(getErrorMessage(deleteError));
      } finally {
        setDeletingCategoryId(null);
      }
    });
  }

  function handleDeleteProduct(productId: number) {
    setDeletingProductId(productId);

    startTransition(async () => {
      try {
        await deleteProduct(productId);
        setProducts((currentProducts) =>
          currentProducts.filter((product) => product.id !== productId),
        );
        setConfirmingProduct(null);
        toast.success(t("status.productRemovedSuccess"));
        void refreshProducts().catch(() => undefined);
        void refreshCategories().catch(() => undefined);
      } catch (deleteError) {
        toast.error(getErrorMessage(deleteError));
      } finally {
        setDeletingProductId(null);
      }
    });
  }

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/60 bg-white/80 p-8 text-sm text-slate-500 shadow-xl shadow-sky-100/70">
          {t("status.loadingAdminWorkspace")}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <section className="rounded-[2.5rem] border border-white/60 bg-white/88 p-10 shadow-xl shadow-sky-100/70">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-600">
            {t("admin.eyebrow")}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
            {t("admin.guestTitle")}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            {t("admin.guestDescription")}
          </p>
          <Link
            className={cn(
              buttonVariants({ variant: "default" }),
              "mt-8 h-12 rounded-full px-6",
            )}
            href={withLocale(locale, "/login")}
          >
            {t("admin.guestCta")}
          </Link>
        </section>
      </div>
    );
  }

  if (!canAccessAdmin) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <section className="rounded-[2.5rem] border border-white/60 bg-white/88 p-10 shadow-xl shadow-sky-100/70">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-600">
            {t("admin.eyebrow")}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
            {t("admin.restrictedTitle")}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            {t("admin.restrictedDescription")}
          </p>
          <Link
            className={cn(
              buttonVariants({ variant: "default" }),
              "mt-8 h-12 rounded-full px-6",
            )}
            href={withLocale(locale, "/profile")}
          >
            {t("admin.restrictedCta")}
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <section className="rounded-[2.5rem] border border-white/60 bg-white/88 p-8 shadow-xl shadow-sky-100/70">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-600">
          {t("admin.eyebrow")}
        </p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
              {t("admin.title")}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              {t("admin.description")}
            </p>
          </div>
          <div className="rounded-[2rem] border border-sky-100 bg-sky-50/80 px-5 py-4 text-sm text-slate-700">
            {t("labels.loggedInAs")}{" "}
            <span className="font-semibold">{user?.email}</span>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <form
          action={handleCreateCategory}
          className="rounded-[2.5rem] border border-white/60 bg-white/88 p-8 shadow-xl shadow-sky-100/70"
          ref={formRef}
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
              <PlusCircle className="size-5" />
            </span>
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">
                {t("admin.categoryFormTitle")}
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {t("admin.categoryFormDescription")}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5">
            <Field label={t("admin.fields.categoryNameTh")} name="name_th" />
            <Field label={t("admin.fields.categoryNameEn")} name="name_en" />
          </div>

          <Button
            className="mt-8 h-12 rounded-full px-6"
            disabled={isPending}
            type="submit"
          >
            {isPending ? t("auth.pending") : t("admin.createCategory")}
          </Button>
        </form>

        <section className="rounded-[2.5rem] border border-white/60 bg-white/88 p-8 shadow-xl shadow-sky-100/70">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <FolderTree className="size-5" />
            </span>
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">
                {t("admin.categoryListTitle")}
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {t("admin.categoryListDescription")}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {categories.length > 0 ? (
              categories.map((category) => (
                <article
                  className="rounded-[2rem] border border-sky-100 bg-white p-5 shadow-sm shadow-sky-100/50"
                  key={category.id}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-slate-950">
                        {translate(category, "name")}
                      </p>
                      <p className="mt-2 text-sm text-slate-500">
                        {t("admin.categoryIdLabel")} #{category.id}
                      </p>
                      <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-400">
                        {category._count?.products ?? 0}{" "}
                        {t("admin.categoryProductsCountLabel")}
                      </p>
                    </div>
                    <button
                      className="inline-flex size-10 items-center justify-center rounded-full border border-sky-100 text-slate-500 transition hover:border-red-200 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isPending && deletingCategoryId === category.id}
                      onClick={() => handleDeleteCategory(category.id)}
                      type="button"
                    >
                      <Trash2 className="size-4" />
                    </button>
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

      <section className="mt-8 rounded-[2.5rem] border border-white/60 bg-white/88 p-8 shadow-xl shadow-sky-100/70">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
              <Package className="size-5" />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                {t("admin.productsTitle")}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                {t("admin.productsDescription")}
              </p>
            </div>
          </div>
          <div className="flex justify-center sm:min-w-32 sm:items-center sm:self-start">
            <p className="inline-flex h-9 items-center justify-center rounded-full bg-sky-50 px-4 text-sm font-medium text-sky-700">
              {products.length} {t("admin.productsCountLabel")}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {products.length > 0 ? (
            products.map((product) => {
              const productName = translate(product, "name");
              const productCategories = product.category.map((category) =>
                translate(category, "name"),
              );

              return (
                <article
                  className="rounded-[2rem] border border-sky-100 bg-white p-5 shadow-sm shadow-sky-100/50"
                  key={product.id}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <Link
                      className="min-w-0 flex-1 rounded-[1.5rem] outline-none transition focus-visible:ring-3 focus-visible:ring-sky-200"
                      href={withLocale(locale, `/admin/${product.id}`)}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-lg font-semibold text-slate-950">
                          {productName}
                        </p>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                          Category ID #{product.id}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">
                        {t("labels.seller")}: {product.user.email}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {productCategories.length > 0 ? (
                          productCategories.map((categoryName, index) => (
                            <span
                              className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700"
                              key={`${product.id}-admin-${categoryName}-${index}`}
                            >
                              {categoryName}
                            </span>
                          ))
                        ) : (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                            {t("admin.noCategoriesLabel")}
                          </span>
                        )}
                      </div>
                      <p className="mt-3 text-base font-semibold text-slate-950">
                        {formatPrice(product.price, locale)}
                      </p>
                    </Link>

                    <button
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-red-100 px-4 text-sm font-medium text-red-600 transition hover:border-red-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 lg:shrink-0"
                      disabled={isPending && deletingProductId === product.id}
                      onClick={() => setConfirmingProduct(product)}
                      type="button"
                    >
                      <Trash2 className="size-4" />
                      {t("admin.deleteProduct")}
                    </button>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-[2rem] border border-dashed border-sky-200 bg-sky-50/60 px-5 py-10 text-center text-sm leading-6 text-slate-500">
              {t("common.emptyState")}
            </div>
          )}
        </div>
      </section>

      {confirmingProduct ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-8 backdrop-blur-sm">
          <section className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white p-6 shadow-2xl shadow-slate-900/20">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-red-500">
                  {t("admin.confirmDeleteEyebrow")}
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                  {t("admin.confirmDeleteTitle")}
                </h2>
              </div>
              <button
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-slate-100 text-slate-500 transition hover:bg-slate-50"
                onClick={() => setConfirmingProduct(null)}
                type="button"
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              {t("admin.confirmDeleteDescription", {
                product: translate(confirmingProduct, "name"),
              })}
            </p>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                className="inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={
                  isPending && deletingProductId === confirmingProduct.id
                }
                onClick={() => handleDeleteProduct(confirmingProduct.id)}
                style={{
                  backgroundColor: "#dc2626",
                  boxShadow: "0 8px 18px rgba(220, 38, 38, 0.22)",
                }}
                type="button"
              >
                {isPending && deletingProductId === confirmingProduct.id
                  ? t("auth.pending")
                  : t("admin.confirmDeleteAction")}
              </button>
              <button
                className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={
                  isPending && deletingProductId === confirmingProduct.id
                }
                onClick={() => setConfirmingProduct(null)}
                type="button"
              >
                {t("common.cancel")}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

function Field(props: { label: string; name: string }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{props.label}</span>
      <input
        className="h-12 w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 text-sm text-slate-950 outline-none transition focus:border-sky-400 focus:bg-white"
        name={props.name}
        required
        type="text"
      />
    </label>
  );
}
