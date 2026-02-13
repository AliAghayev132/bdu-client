import { notFound } from "next/navigation";
import { getEventBySlug, transformEventItem } from "@/lib/api/events";
import EventDetailContent from "../../(components)/EventDetailContent";

export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const currentLocale = locale || "en";

  const eventData = await getEventBySlug(slug, currentLocale);
  const event = transformEventItem(eventData, currentLocale);

  if (!event) {
    return { title: "Event not found" };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bdu.edu.az";

  return {
    title: event.seo?.metaTitle || event.title,
    description: event.seo?.metaDescription || event.excerpt,
    keywords: event.seo?.keywords?.join(", "),
    alternates: {
      canonical: `${baseUrl}/en/events/${event.slug}`,
      languages: {
        az: `${baseUrl}/tedbirler/${event.alternateSlug}`,
        en: `${baseUrl}/en/events/${event.slug}`,
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

export default async function EventsDetailPage({ params }) {
  const { slug, locale } = await params;
  const currentLocale = locale || "en";

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
