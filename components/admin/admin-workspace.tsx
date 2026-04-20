"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FolderTree, PlusCircle, Shield, Trash2 } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { useTranslations } from "next-intl";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  createCategory,
  deleteCategory,
  getCategories,
} from "@/lib/api/category";
import { getErrorMessage } from "@/lib/api/fetcher";
import { hasRole } from "@/lib/auth/roles";
import { useRealtimeEvents } from "@/lib/hooks/use-realtime-events";
import { withLocale } from "@/lib/site";
import type { Category } from "@/lib/types/store";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useTranslate } from "@/utils/useTranslate";

type AdminWorkspaceProps = {
  locale: string;
  initialCategories: Category[];
};

export function AdminWorkspace({
  locale,
  initialCategories,
}: AdminWorkspaceProps) {
  const t = useTranslations();
  const translate = useTranslate();
  const router = useRouter();
  const { user, status, isAuthenticated } = useAuth();
  const canAccessAdmin = hasRole(user, "ADMIN");
  const [categories, setCategories] = useState(initialCategories);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  async function refreshCategories() {
    const nextCategories = await getCategories({ fresh: true });
    setCategories(nextCategories);
  }

  useRealtimeEvents(["categoryUpdate", "productUpdate"], () => {
    void refreshCategories().catch((refreshError) => {
      setError(getErrorMessage(refreshError));
    });
    router.refresh();
  });

  function handleCreateCategory(formData: FormData) {
    setFeedback(null);
    setError(null);

    startTransition(async () => {
      try {
        await createCategory({
          name_th: String(formData.get("name_th") ?? "").trim(),
          name_en: String(formData.get("name_en") ?? "").trim(),
        });

        formRef.current?.reset();
        setFeedback(t("status.categoryCreatedSuccess"));
        void refreshCategories().catch(() => undefined);
      } catch (createError) {
        setError(getErrorMessage(createError));
      }
    });
  }

  function handleDeleteCategory(categoryId: number) {
    setFeedback(null);
    setError(null);
    setDeletingId(categoryId);

    startTransition(async () => {
      try {
        await deleteCategory(categoryId);
        setCategories((currentCategories) =>
          currentCategories.filter((category) => category.id !== categoryId),
        );
        setFeedback(t("status.categoryDeletedSuccess"));
        void refreshCategories().catch(() => undefined);
      } catch (deleteError) {
        setError(getErrorMessage(deleteError));
      } finally {
        setDeletingId(null);
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

          {feedback ? (
            <p className="mt-5 text-sm text-emerald-600">{feedback}</p>
          ) : null}
          {error ? <p className="mt-5 text-sm text-red-500">{error}</p> : null}

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
                      disabled={isPending && deletingId === category.id}
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

      <section className="mt-8 rounded-[2.5rem] border border-dashed border-sky-200 bg-white/72 p-8 shadow-lg shadow-sky-100/50">
        <div className="flex items-start gap-3">
          <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
            <Shield className="size-5" />
          </span>
          <div>
            <h2 className="text-xl font-semibold text-slate-950">
              {t("admin.futureToolsTitle")}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              {t("admin.futureToolsDescription")}
            </p>
          </div>
        </div>
      </section>
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
