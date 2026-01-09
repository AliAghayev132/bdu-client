import AnnouncementsPageContent from "../(components)/AnnouncementsPageContent";
import {
  getAllAnnouncements,
  transformAnnouncementsArray,
} from "@/lib/api/announcements";

export default async function AnnouncementsPage({ params }) {
  const { locale } = await params;

  const content = {
    title: "ANNOUNCEMENTS",
    breadcrumbs: "Announcements",
  };

  // Fetch announcements from API
  const { announcements: announcementsData, pagination } =
    await getAllAnnouncements(locale, 1, 20);
  const announcements = transformAnnouncementsArray(announcementsData, locale);

  return (
    <AnnouncementsPageContent
      announcements={announcements}
      content={content}
      locale={locale}
      pagination={pagination}
    />
  );
}
