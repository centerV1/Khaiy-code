import type { Metadata } from "next";
import "./globals.css";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Locale, routing } from "@/i18n/routing";
import { Footer } from "@/components/Footer/footer";
import { Header } from "@/components/Header/header";
import { AppProviders } from "@/components/providers/app-providers";

export const metadata: Metadata = {
  title: "Khaiy Code",
  description: "Marketplace for premium code products",
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
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <AppProviders>
            <div className="relative min-h-screen overflow-x-hidden" id="page-top">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_26%),radial-gradient(circle_at_85%_5%,_rgba(96,165,250,0.18),_transparent_20%)]" />
              <div className="relative flex min-h-screen flex-col">
                <Header locale={local} />
                <main className="flex-1 pt-28">{children}</main>
                <Footer locale={local} />
              </div>
            </div>
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
