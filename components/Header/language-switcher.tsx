"use client";

import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import { FlagIcon } from "@/components/Header/flag-icon";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  locale: string;
  mobile?: boolean;
};

const LANGUAGE_OPTIONS = [
  {
    locale: "th",
    label: "Thai",
  },
  {
    locale: "en",
    label: "Eng",
  },
] as const;

export function LanguageSwitcher({
  locale,
  mobile = false,
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const activeLanguage =
    LANGUAGE_OPTIONS.find((item) => item.locale === locale) ??
    LANGUAGE_OPTIONS[1];

  return (
    <div
      className={cn("relative", mobile ? "w-full" : "shrink-0")}
      ref={containerRef}
    >
      <button
        className={cn(
          "inline-flex items-center gap-3 rounded-full border border-sky-100 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm shadow-sky-100/60 transition hover:border-sky-200 hover:text-slate-950",
          isPending && "pointer-events-none opacity-80",
          mobile ? "w-full justify-between rounded-2xl px-4 py-3" : "h-11",
        )}
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span className="flex items-center gap-3">
          <FlagIcon className="size-8" locale={activeLanguage.locale} />
          <span>{activeLanguage.label}</span>
        </span>
        <ChevronDown
          className={cn(
            "size-4 transition",
            open ? "rotate-180 text-sky-700" : "text-slate-400",
          )}
        />
      </button>

      {open ? (
        <div
          className={cn(
            "absolute z-50 overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(240,249,255,0.95))] p-2 shadow-2xl shadow-sky-200/60 backdrop-blur-xl",
            mobile
              ? "left-0 top-[calc(100%+0.5rem)] w-full"
              : "right-0 top-[calc(100%+0.75rem)] w-52.5",
          )}
        >
          <div className="space-y-1">
            {LANGUAGE_OPTIONS.map((item) => {
              const isActive = item.locale === activeLanguage.locale;

              return (
                <button
                  className={cn(
                    "flex w-full items-center justify-between rounded-[1.6rem] px-4 py-3 text-sm transition",
                    isActive
                      ? "bg-white text-slate-950 shadow-md shadow-sky-100/70"
                      : "text-slate-500 hover:bg-white/80 hover:text-slate-900",
                  )}
                  key={item.locale}
                  onClick={() => {
                    if (isActive) {
                      setOpen(false);
                      return;
                    }

                    const href = getLocaleHref(
                      pathname,
                      item.locale,
                      searchParams.toString(),
                    );

                    startTransition(() => {
                      router.replace(href, { scroll: false });
                      setOpen(false);
                    });
                  }}
                  type="button"
                >
                  <span className="text-[15px] font-medium">{item.label}</span>
                  <FlagIcon className="size-11" locale={item.locale} />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function getLocaleHref(pathname: string, targetLocale: string, search: string) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return withSearch(`/${targetLocale}`, search);
  }

  if (segments[0] === "en" || segments[0] === "th") {
    segments[0] = targetLocale;
    return withSearch(`/${segments.join("/")}`, search);
  }

  return withSearch(`/${targetLocale}/${segments.join("/")}`, search);
}

function withSearch(pathname: string, search: string) {
  return search ? `${pathname}?${search}` : pathname;
}
