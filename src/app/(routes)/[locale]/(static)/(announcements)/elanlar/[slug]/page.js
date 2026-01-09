import { notFound } from "next/navigation";
import {
  getAnnouncementBySlug,
  transformAnnouncementItem,
} from "@/lib/api/announcements";
import AnnouncementDetailContent from "../../(components)/AnnouncementDetailContent";

/**
 * Elan Detalları Səhifəsi (Azərbaycanca)
 * Route: /elanlar/[slug]
 */

export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const currentLocale = locale || "az";

  const announcementData = await getAnnouncementBySlug(slug, currentLocale);
  const announcement = transformAnnouncementItem(
    announcementData,
    currentLocale
  );

  if (!announcement) {
    return {
      title: "Elan tapılmadı",
    };
  }

  return {
    title: announcement.title,
    description: announcement.content
      ?.replace(/<[^>]*>/g, "")
      .substring(0, 160),
  };
}

export default async function ElanlarDetailPage({ params }) {
  const { slug, locale } = await params;
  const currentLocale = locale || "az";

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
    />
  );
}
