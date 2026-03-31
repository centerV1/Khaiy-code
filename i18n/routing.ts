import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "th"],
  defaultLocale: "en",

  pathnames: {
    "/": "/",
    "/about": "/about",
    "/about/[aboutId]": "/about/[aboutId]",
    //  "/contacts": {
    //   en: "/contact-me",
    //   th: "/contactez-moi",
    // },
  },
});

export type Locale = (typeof routing.locales)[number];
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
