import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import UserLayout from "@/components/layout/UserLayout";
import { AlternateSlugProvider } from "@/context/AlternateSlugContext";

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <AlternateSlugProvider>
        <UserLayout>{children}</UserLayout>
      </AlternateSlugProvider>
    </NextIntlClientProvider>
  );
}
