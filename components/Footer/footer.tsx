import Link from "next/link";
import { Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { withLocale } from "@/lib/site";

type FooterProps = {
  locale: string;
};

export async function Footer({ locale }: FooterProps) {
  const t = await getTranslations();

  const links = [
    { href: withLocale(locale, "/product"), label: t("footer.links.products") },
    { href: withLocale(locale, "/sell"), label: t("footer.links.sellers") },
    { href: withLocale(locale, "/profile"), label: t("footer.links.profile") },
    { href: withLocale(locale, "/"), label: t("footer.links.about") },
  ];

  const contactLink = {
    href: "mailto:hello@khaiycode.com",
    label: t("footer.emailPrimary"),
  };

  return (
    <footer className="mx-1 mb-4 mt-14 rounded-[2rem] border border-slate-200/80 bg-white/95 shadow-[0_16px_48px_-38px_rgba(15,23,42,0.14)] sm:mx-4 lg:mx-6">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 md:px-10 md:py-12">
        <div className="flex flex-col gap-8">
          <div className="flex items-start justify-between gap-6">
            <a
              className="inline-flex items-center gap-3 font-semibold tracking-tight text-slate-950 transition hover:text-sky-600"
              href="#page-top"
            >
              {t("brand")}
            </a>
            <div className="flex items-center gap-4 text-slate-500">
              <a
                aria-label={contactLink.label}
                className="inline-flex items-center justify-center text-slate-500 transition hover:text-slate-900"
                href={contactLink.href}
                title={contactLink.label}
              >
                <Mail className="size-5" />
              </a>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-y-3 text-[15px] text-slate-800">
            {links.map((item, index) => (
              <div
                className="flex items-center"
                key={`${item.href}-${item.label}-${index}`}
              >
                <Link
                  className="transition hover:text-sky-600"
                  href={item.href}
                >
                  {item.label}
                </Link>
                {index < links.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="px-4 text-slate-300 sm:px-5"
                  >
                    |
                  </span>
                ) : null}
              </div>
            ))}
          </nav>

          <div className="border-t border-dashed border-slate-200" />

          <div className="flex flex-col gap-4 text-sm text-slate-500 md:flex-row md:items-center">
            <p>{t("footer.copyright")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
