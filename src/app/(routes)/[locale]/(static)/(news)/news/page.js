import NewsPageContent from "../(components)/NewsPageContent";
import { getAllNews, transformNewsArray } from "@/lib/api/news";

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
console.log(news)
  return <NewsPageContent content={content.en} locale={locale} news={news} />;
}
