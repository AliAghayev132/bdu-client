import { notFound } from "next/navigation";
import { getEventBySlug, transformEventItem } from "@/lib/api/events";
import EventDetailContent from "../../(components)/EventDetailContent";

export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const currentLocale = locale || "az";

  const eventData = await getEventBySlug(slug, currentLocale);
  const event = transformEventItem(eventData, currentLocale);

  if (!event) {
    return { title: "Tədbir tapılmadı" };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bdu.edu.az";

  return {
    title: event.seo?.metaTitle || event.title,
    description: event.seo?.metaDescription || event.excerpt,
    keywords: event.seo?.keywords?.join(", "),
    alternates: {
      canonical: `${baseUrl}/tedbirler/${event.slug}`,
      languages: {
        az: `${baseUrl}/tedbirler/${event.slug}`,
        en: `${baseUrl}/en/events/${event.alternateSlug}`,
      },
    },
    openGraph: {
      title: event.title,
      description: event.excerpt,
      images: event.coverImage
        ? [{ url: event.coverImage, width: 1200, height: 630, alt: event.title }]
        : [],
    },
  };
}

export default async function TedbirlerDetailPage({ params }) {
  const { slug, locale } = await params;
  const currentLocale = locale || "az";

  const eventData = await getEventBySlug(slug, currentLocale);
  const event = transformEventItem(eventData, currentLocale);

  if (!event) {
    notFound();
  }

  return (
    <EventDetailContent
      event={event}
      locale={currentLocale}
      alternateSlug={event.alternateSlug}
    />
  );
}
