"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { CartDrawer } from "@/components/cart/cart-drawer";
import { LanguageSwitcher } from "@/components/Header/language-switcher";
import { buttonVariants } from "@/components/ui/button";
import { getInitials, withLocale } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useCart } from "@/providers/cart-provider";

type HeaderProps = {
  locale: string;
};

export function Header({ locale }: HeaderProps) {
  const pathname = usePathname();
  const t = useTranslations();
  const { user, isAuthenticated } = useAuth();
  const { count } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigation = [
    { href: withLocale(locale, "/"), label: t("nav.home") },
    { href: withLocale(locale, "/product"), label: t("nav.products") },
    { href: withLocale(locale, "/sell"), label: t("nav.sell") },
    { href: withLocale(locale, "/profile"), label: t("nav.profile") },
  ];

  const isActive = (href: string) =>
    href === withLocale(locale, "/")
      ? pathname === href
      : pathname.startsWith(href);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          isScrolled
            ? "border-b border-sky-100/80 bg-white/82 shadow-[0_16px_40px_-24px_rgba(14,165,233,0.45)] backdrop-blur-2xl"
            : "border-b border-white/55 bg-white/64 backdrop-blur-xl",
        )}
        style={{
          backdropFilter: isScrolled ? "blur(24px)" : "blur(16px)",
          WebkitBackdropFilter: isScrolled ? "blur(24px)" : "blur(16px)",
        }}
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-300 sm:px-6 lg:px-8",
            isScrolled ? "py-3" : "py-4",
          )}
        >
          <div className="flex items-center gap-8">
            <Link
              className="inline-flex items-center gap-3"
              href={withLocale(locale, "/")}
            >
              <span
                className={cn(
                  "text-sm font-semibold uppercase tracking-[0.25em] transition-colors sm:block",
                  isScrolled ? "text-sky-700" : "text-slate-900",
                )}
              >
                {t("brand")}
              </span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {navigation.map((item) => (
                <Link
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive(item.href)
                      ? "bg-sky-100 text-sky-700 shadow-sm shadow-sky-100/80"
                      : isScrolled
                        ? "text-slate-700 hover:bg-white hover:text-slate-950"
                        : "text-slate-600 hover:bg-white/80 hover:text-slate-950"
                  }`}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <LanguageSwitcher locale={locale} />
            <button
              className={cn(
                "relative inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition",
                isScrolled
                  ? "border-sky-100 bg-white text-slate-700 shadow-sm shadow-sky-100/70 hover:border-sky-200 hover:text-slate-950"
                  : "border-sky-100/80 bg-white/90 text-slate-700 hover:border-sky-200 hover:bg-white hover:text-slate-950",
              )}
              onClick={() => setCartOpen(true)}
              type="button"
            >
              <ShoppingCart className="size-4" />
              {t("nav.cart")}
              {count > 0 ? (
                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-sky-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {count}
                </span>
              ) : null}
            </button>

            {isAuthenticated && user ? (
              <>
                <Link
                  className="inline-flex size-11 items-center justify-center rounded-full border border-sky-100 bg-white text-sm font-semibold text-slate-800 transition hover:border-sky-200"
                  href={withLocale(locale, "/profile")}
                >
                  {user.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt={user.email}
                      className="size-full rounded-full object-cover"
                      src={user.avatarUrl}
                    />
                  ) : (
                    getInitials(user.email)
                  )}
                </Link>
              </>
            ) : (
              <>
                <Link
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    isScrolled
                      ? "rounded-full border-sky-100 bg-white px-5 text-slate-800 shadow-sm shadow-sky-100/70 hover:bg-sky-50"
                      : "rounded-full border-sky-100 bg-white/90 px-5 text-slate-800 hover:bg-sky-50",
                  )}
                  href={withLocale(locale, "/login")}
                >
                  {t("nav.login")}
                </Link>
                <Link
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "rounded-full bg-sky-600 px-5 text-white shadow-[0_12px_30px_-18px_rgba(14,165,233,0.9)] hover:bg-sky-500",
                  )}
                  href={withLocale(locale, "/signup")}
                >
                  {t("nav.signup")}
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              className={cn(
                "relative inline-flex size-11 items-center justify-center rounded-full border text-slate-700 transition",
                isScrolled
                  ? "border-sky-100 bg-white shadow-sm shadow-sky-100/70"
                  : "border-sky-100/80 bg-white/90",
              )}
              onClick={() => setCartOpen(true)}
              type="button"
            >
              <ShoppingCart className="size-4" />
              {count > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-sky-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {count}
                </span>
              ) : null}
            </button>
            <button
              className={cn(
                "inline-flex size-11 items-center justify-center rounded-full border text-slate-700 transition",
                isScrolled
                  ? "border-sky-100 bg-white shadow-sm shadow-sky-100/70"
                  : "border-sky-100/80 bg-white/90",
              )}
              onClick={() => setMobileMenuOpen((value) => !value)}
              type="button"
            >
              <Menu className="size-4" />
            </button>
          </div>
        </div>

        {mobileMenuOpen ? (
          <div className="border-t border-sky-100 px-4 py-4 md:hidden">
            <LanguageSwitcher locale={locale} mobile />

            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  className={`block rounded-2xl px-4 py-3 text-sm font-medium ${
                    isActive(item.href)
                      ? "bg-sky-100 text-sky-700"
                      : "bg-white text-slate-700"
                  }`}
                  href={item.href}
                  key={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "rounded-full",
                    )}
                    href={withLocale(locale, "/profile")}
                  >
                    {t("nav.profile")}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "rounded-full",
                    )}
                    href={withLocale(locale, "/login")}
                  >
                    {t("nav.login")}
                  </Link>
                  <Link
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      "rounded-full",
                    )}
                    href={withLocale(locale, "/signup")}
                  >
                    {t("nav.signup")}
                  </Link>
                </>
              )}
            </div>
          </div>
        ) : null}
      </header>

      <CartDrawer
        locale={locale}
        onClose={() => setCartOpen(false)}
        open={cartOpen}
      />
    </>
  );
}
