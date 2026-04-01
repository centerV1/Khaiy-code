"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { getApiBaseUrl, getErrorMessage } from "@/lib/api/fetcher";
import { cn } from "@/lib/utils";
import { getSiteCopy, withLocale } from "@/lib/site";
import { useAuth } from "@/providers/auth-provider";

export function LoginForm({ locale }: { locale: string }) {
  const copy = getSiteCopy(locale);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const apiBaseUrl = getApiBaseUrl();

  function onSubmit(formData: FormData) {
    setError(null);

    startTransition(async () => {
      try {
        await login({
          email: String(formData.get("email") ?? ""),
          password: String(formData.get("password") ?? ""),
        });

        router.push(
          searchParams.get("redirect") || withLocale(locale, "/profile"),
        );
      } catch (submitError) {
        setError(getErrorMessage(submitError));
      }
    });
  }

  return (
    <section className="mx-auto w-full max-w-md rounded-[2rem] border border-white/60 bg-white/88 p-8 shadow-xl shadow-sky-100/70 backdrop-blur">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-600">
          {copy.nav.login}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          {copy.auth.loginTitle}
        </h1>
        <p className="text-sm leading-6 text-slate-600">
          {copy.auth.loginDescription}
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
          {copy.auth.continueWithGoogle}
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
          {copy.auth.continueWithFacebook}
        </a>
      </div>

      <div className="mt-6 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-400">
        <span className="h-px flex-1 bg-sky-100" />
        <span>{copy.auth.orContinueWithEmail}</span>
        <span className="h-px flex-1 bg-sky-100" />
      </div>

      <form action={onSubmit} className="mt-6 space-y-5">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">
            {copy.auth.email}
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
            {copy.auth.password}
          </span>
          <input
            className="h-12 w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 text-sm text-slate-950 outline-none transition focus:border-sky-400 focus:bg-white"
            minLength={6}
            name="password"
            required
            type="password"
          />
        </label>

        {error ? <p className="text-sm text-red-500">{error}</p> : null}

        <Button
          className="h-12 w-full rounded-full"
          disabled={isPending}
          type="submit"
        >
          {isPending ? copy.auth.pending : copy.auth.submitLogin}
        </Button>
      </form>

      <p className="mt-6 text-sm text-slate-500">
        {copy.auth.swapToSignup}{" "}
        <Link
          className="font-semibold text-sky-700 transition hover:text-sky-500"
          href={withLocale(locale, "/signup")}
        >
          {copy.nav.signup}
        </Link>
      </p>
    </section>
  );
}
