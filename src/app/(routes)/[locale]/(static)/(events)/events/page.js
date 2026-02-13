import { getAllEvents } from "@/lib/api/events";
import EventsPageContent from "../(components)/EventsPageContent";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bdu.edu.az";

  const title = locale === "en" ? "Events" : "Tədbirlər";
  const description = locale === "en"
    ? "Events at Baku State University"
    : "Bakı Dövlət Universitetinin tədbirləri";

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/en/events`,
      languages: {
        az: `${baseUrl}/tedbirler`,
        en: `${baseUrl}/en/events`,
      },
    },
    openGraph: { title, description },
  };
}

export default async function EventsPage({ params, searchParams }) {
  const { locale } = await params;
  const sp = await searchParams;
  const page = parseInt(sp?.page) || 1;
  const currentLocale = locale || "en";

  const { events, pagination } = await getAllEvents(currentLocale, page, 12);

  return (
    <EventsPageContent
      initialEvents={events}
      initialPagination={pagination}
      locale={currentLocale}
    />
  );
}
