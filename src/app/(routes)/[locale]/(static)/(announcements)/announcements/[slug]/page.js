import { notFound } from "next/navigation";
import {
  getAnnouncementBySlug,
  transformAnnouncementItem,
} from "@/lib/api/announcements";
import AnnouncementDetailContent from "../../(components)/AnnouncementDetailContent";

/**
 * Announcement Detail Page (English)
 * Route: /announcements/[slug]
 */

export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const currentLocale = locale || "en";

  const announcementData = await getAnnouncementBySlug(slug, currentLocale);
  const announcement = transformAnnouncementItem(
    announcementData,
    currentLocale
  );

  if (!announcement) {
    return {
      title: "Announcement not found",
    };
  }

  return {
    title: announcement.title,
    description: announcement.content
      ?.replace(/<[^>]*>/g, "")
      .substring(0, 160),
  };
}

export default async function AnnouncementsDetailPage({ params }) {
  const { slug, locale } = await params;
  const currentLocale = locale || "en";

  const announcementData = await getAnnouncementBySlug(slug, currentLocale);
  const announcement = transformAnnouncementItem(
    announcementData,
    currentLocale
  );

  if (!announcement) {
    notFound();
  }

  return (
    <AnnouncementDetailContent
      announcement={announcement}
      locale={currentLocale}
      alternateSlug={announcement.alternateSlug}
    />
  );
}
