import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Montserrat } from "next/font/google";
import "@/app/globals.css";
import UserLayout from '@/components/layout/UserLayout';

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});


export const metadata = {
  title: "Bakı Dövlət Universiteti - BDU",
  description: "Azərbaycanın ən qədim və nüfuzlu ali təhsil müəssisəsi",
};

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${montserrat.variable}  antialiased`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <UserLayout>
            {children}
          </UserLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
