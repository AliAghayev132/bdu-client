import NewsPageContent from "../(components)/NewsPageContent";
import { getAllNews, transformNewsArray } from "@/lib/api/news";
import { getActiveAnnouncements, transformAnnouncementsArray } from "@/lib/api/announcements";

export default async function NewsPage({ params }) {
  const { locale } = await params;

  const content = {
    en: {
      title: "NEWS",
      breadcrumbs: "News",
    },
  };

  // Fetch news from API
  const { news: newsData } = await getAllNews(locale, 1, 20);
  const news = transformNewsArray(newsData, locale);

  // Fetch announcements
  const announcementsData = await getActiveAnnouncements(locale);
  const announcements = transformAnnouncementsArray(announcementsData, locale);

  return <NewsPageContent content={content.en} locale={locale} news={news} announcements={announcements} />;
}
