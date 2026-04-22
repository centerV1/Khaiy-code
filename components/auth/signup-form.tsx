"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { getApiBaseUrl, getErrorMessage } from "@/lib/api/fetcher";
import { cn } from "@/lib/utils";
import { withLocale } from "@/lib/site";
import { useAuth } from "@/providers/auth-provider";

export function SignupForm({ locale }: { locale: string }) {
  const t = useTranslations();
  const router = useRouter();
  const { signup } = useAuth();
  const [isPending, startTransition] = useTransition();
  const apiBaseUrl = getApiBaseUrl();

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await signup({
          email: String(formData.get("email") ?? ""),
          password: String(formData.get("password") ?? ""),
        });

        toast.success(t("status.signupSuccess"));
        router.push(withLocale(locale, "/profile"));
      } catch (submitError) {
        toast.error(getErrorMessage(submitError));
      }
    });
  }

  return (
    <section className="mx-auto w-full max-w-md rounded-[2rem] border border-white/60 bg-white/88 p-8 shadow-xl shadow-sky-100/70 backdrop-blur">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-600">
          {t("nav.signup")}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          {t("auth.signupTitle")}
        </h1>
        <p className="text-sm leading-6 text-slate-600">
          {t("auth.signupDescription")}
        </p>
      </div>

      <div className="mt-8 grid gap-3">
        <a
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-12 w-full rounded-full border-sky-100 bg-white text-slate-800 hover:bg-sky-50",
          )}
          href={`${apiBaseUrl}/auth/google/login`}
        >
          <span className="inline-flex size-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
            G
          </span>
          {t("auth.continueWithGoogle")}
        </a>
        <a
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-12 w-full rounded-full border-sky-100 bg-white text-slate-800 hover:bg-sky-50",
          )}
          href={`${apiBaseUrl}/auth/facebook/login`}
        >
          <span className="inline-flex size-5 items-center justify-center rounded-full bg-[#1877F2] text-[10px] font-bold text-white">
            f
          </span>
          {t("auth.continueWithFacebook")}
        </a>
      </div>

      <div className="mt-6 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-400">
        <span className="h-px flex-1 bg-sky-100" />
        <span>{t("auth.orContinueWithEmail")}</span>
        <span className="h-px flex-1 bg-sky-100" />
      </div>

      <form action={onSubmit} className="mt-6 space-y-5">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">
            {t("auth.email")}
          </span>
          <input
            className="h-12 w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 text-sm text-slate-950 outline-none transition focus:border-sky-400 focus:bg-white"
            name="email"
            placeholder="hello@example.com"
            required
            type="email"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">
            {t("auth.password")}
          </span>
          <input
            className="h-12 w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 text-sm text-slate-950 outline-none transition focus:border-sky-400 focus:bg-white"
            minLength={6}
            name="password"
            required
            type="password"
          />
        </label>

        <Button
          className="h-12 w-full rounded-full"
          disabled={isPending}
          type="submit"
        >
          {isPending ? t("auth.pending") : t("auth.submitSignup")}
        </Button>
      </form>

      <p className="mt-6 text-sm text-slate-500">
        {t("auth.swapToLogin")}{" "}
        <Link
          className="font-semibold text-sky-700 transition hover:text-sky-500"
          href={withLocale(locale, "/login")}
        >
          {t("nav.login")}
        </Link>
      </p>
    </section>
  );
}
