import NewsPageContent from "../(components)/NewsPageContent";
import { getAllNews, transformNewsArray } from "@/lib/api/news";

export default async function XeberlerPage({ params }) {
  const { locale } = await params;

  const content = {
    az: {
      title: "XƏBƏRLƏR",
      breadcrumbs: "Xəbərlər",
    },
  };

  // Fetch news from API
  const { news: newsData } = await getAllNews(locale, 1, 20);
  const news = transformNewsArray(newsData, locale);

  return <NewsPageContent content={content.az} locale={locale} news={news} />;
}
