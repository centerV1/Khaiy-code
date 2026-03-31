import type { Metadata } from "next";
import { IBM_Plex_Mono, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Locale, routing } from "@/i18n/routing";

const brandSans = Noto_Sans_Thai({
  variable: "--font-brand",
  subsets: ["thai"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const codeMono = IBM_Plex_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "KhaiCode",
    template: "%s",
  },
  description: "Premium storefront frontend for selling source code and digital products.",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ local: string }>;
}>) {
  const { local } = await params;
  if (!routing.locales.includes(local as Locale)) {
    notFound();
  }
  const messages = await getMessages();
  return (
    <html lang={local} suppressHydrationWarning>
      <body
        className={`${brandSans.variable} ${codeMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
