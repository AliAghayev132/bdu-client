import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import FacultySystemClientLayout from "./FacultySystemClientLayout";

/**
 * Faculty System Layout - Server Component
 * Admin paneli kimi ayrı layout - UserLayout olmadan
 * NextIntlClientProvider ilə i18n dəstəyi
 */
export default async function FacultySystemLayout({ children }) {
  // Default locale = az
  const messages = await getMessages({ locale: "az" });

  return (
    <NextIntlClientProvider messages={messages} locale="az">
      <FacultySystemClientLayout>{children}</FacultySystemClientLayout>
    </NextIntlClientProvider>
  );
}
