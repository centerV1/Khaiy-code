"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, UploadCloud } from "lucide-react";
import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { updateProduct } from "@/lib/api/products";
import { getErrorMessage } from "@/lib/api/fetcher";
import { hasRole } from "@/lib/auth/roles";
import { withLocale } from "@/lib/site";
import type { Category, ProductSummary } from "@/lib/types/store";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useTranslate } from "@/utils/useTranslate";

type AdminProductEditorProps = {
  locale: string;
  product: ProductSummary;
  categories: Category[];
};

export function AdminProductEditor({
  locale,
  product,
  categories,
}: AdminProductEditorProps) {
  const t = useTranslations();
  const translate = useTranslate();
  const router = useRouter();
  const { user, status, isAuthenticated } = useAuth();
  const canAccessAdmin = hasRole(user, "ADMIN");
  const [currentProduct, setCurrentProduct] = useState(product);
  const [formKey, setFormKey] = useState(0);
  const [isPending, startTransition] = useTransition();
  const selectedCategoryIds = new Set(
    currentProduct.category.map((category) => category.id),
  );

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        const file = formData.get("file");
        const updatedProduct = await updateProduct(currentProduct.id, {
          name_th: String(formData.get("name_th") ?? "").trim(),
          name_en: String(formData.get("name_en") ?? "").trim(),
          description_th: String(formData.get("description_th") ?? "").trim(),
          description_en: String(formData.get("description_en") ?? "").trim(),
          detail_th: String(formData.get("detail_th") ?? "").trim(),
          detail_en: String(formData.get("detail_en") ?? "").trim(),
          price: Number(formData.get("price") ?? 0),
          categoryIds: formData
            .getAll("categoryIds")
            .map((value) => Number(value))
            .filter((value) => Number.isFinite(value)),
          file: file instanceof File && file.size > 0 ? file : undefined,
        });

        setCurrentProduct(updatedProduct);
        setFormKey((key) => key + 1);
        toast.success(t("status.productUpdatedSuccess"));
        router.refresh();
      } catch (updateError) {
        toast.error(getErrorMessage(updateError));
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
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <Link
        className="inline-flex items-center gap-2 text-sm font-medium text-sky-700 transition hover:text-sky-900"
        href={withLocale(locale, "/admin")}
      >
        <ArrowLeft className="size-4" />
        {t("admin.backToAdmin")}
      </Link>

      <section className="mt-6 rounded-[2.5rem] border border-white/60 bg-white/88 p-8 shadow-xl shadow-sky-100/70">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-600">
          {t("admin.eyebrow")}
        </p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
              {t("admin.productEditTitle")}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              {t("admin.productEditDescription")}
            </p>
          </div>
          <div className="rounded-[2rem] border border-sky-100 bg-sky-50/80 px-5 py-4 text-sm text-slate-700">
            <span className="font-semibold">Create by </span>
            <span className="mx-2 text-slate-950">
              {currentProduct.user.email}
            </span>
          </div>
        </div>
      </section>

      <form
        action={handleSubmit}
        className="mt-8 rounded-[2.5rem] border border-white/60 bg-white/88 p-8 shadow-xl shadow-sky-100/70"
        key={`${currentProduct.id}-${formKey}`}
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
            <UploadCloud className="size-5" />
          </span>
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">
              {t("admin.productEditFormTitle")}
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {t("admin.productEditFormDescription")}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Field
            defaultValue={currentProduct.name_th}
            label={t("sell.fields.nameTh")}
            name="name_th"
          />
          <Field
            defaultValue={currentProduct.name_en}
            label={t("sell.fields.nameEn")}
            name="name_en"
          />
          <TextAreaField
            defaultValue={currentProduct.description_th}
            label={t("sell.fields.descriptionTh")}
            name="description_th"
          />
          <TextAreaField
            defaultValue={currentProduct.description_en}
            label={t("sell.fields.descriptionEn")}
            name="description_en"
          />
          <div className="md:col-span-2">
            <RichTextEditor
              defaultValue={currentProduct.detail_th}
              label={t("sell.fields.detailTh")}
              name="detail_th"
            />
          </div>
          <div className="md:col-span-2">
            <RichTextEditor
              defaultValue={currentProduct.detail_en}
              label={t("sell.fields.detailEn")}
              name="detail_en"
            />
          </div>
          <Field
            defaultValue={String(currentProduct.price)}
            label={t("sell.fields.price")}
            min="1"
            name="price"
            step="1"
            type="number"
          />
          <FileField label={t("admin.replaceFile")} name="file" />
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
                  defaultChecked={selectedCategoryIds.has(category.id)}
                  name="categoryIds"
                  type="checkbox"
                  value={category.id}
                />
                {translate(category, "name")}
              </label>
            ))}
          </div>
        </div>

        <Button
          className="mt-8 h-12 rounded-full px-6"
          disabled={isPending}
          type="submit"
        >
          {isPending ? t("auth.pending") : t("admin.updateProduct")}
        </Button>
      </form>
    </div>
  );
}

function Field(props: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  step?: string;
  min?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{props.label}</span>
      <input
        className="h-12 w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 text-sm text-slate-950 outline-none transition focus:border-sky-400 focus:bg-white"
        defaultValue={props.defaultValue}
        min={props.min}
        name={props.name}
        required
        step={props.step}
        type={props.type ?? "text"}
      />
    </label>
  );
}

function TextAreaField(props: {
  label: string;
  name: string;
  defaultValue?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{props.label}</span>
      <textarea
        className="min-h-32 w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-400 focus:bg-white"
        defaultValue={props.defaultValue}
        name={props.name}
        required
      />
    </label>
  );
}

function FileField(props: { label: string; name: string }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{props.label}</span>
      <input
        accept=".zip,application/zip"
        className="block h-12 w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-2 text-sm text-slate-600 outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white focus:border-sky-400 focus:bg-white"
        name={props.name}
        type="file"
      />
    </label>
  );
}
