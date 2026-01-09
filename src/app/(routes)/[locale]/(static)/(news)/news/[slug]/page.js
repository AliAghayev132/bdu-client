import { notFound } from "next/navigation";
import { getNewsBySlug, transformNewsItem } from "@/lib/api/news";
import NewsDetailContent from "../../(components)/NewsDetailContent";

/**
 * News Detail Page (English)
 * Route: /news/[slug]
 */

export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const currentLocale = locale || "en";

  const newsData = await getNewsBySlug(slug, currentLocale);
  const news = transformNewsItem(newsData, currentLocale);

  if (!news) {
    return {
      title: "News not found",
    };
  }

  return {
    title: news.seo?.metaTitle || news.title,
    description: news.seo?.metaDescription || news.excerpt,
    keywords: news.seo?.keywords?.join(", "),
    openGraph: {
      title: news.title,
      description: news.excerpt,
      images: news.image
        ? [
            {
              url: news.image.startsWith("http")
                ? news.image
                : `${process.env.NEXT_PUBLIC_IMAGE_URL || ""}${news.image}`,
              width: 1200,
              height: 630,
              alt: news.title,
            },
          ]
        : [],
    },
  };
}

export default async function NewsDetailPage({ params }) {
  const { slug, locale } = await params;
  const currentLocale = locale || "en";

  const newsData = await getNewsBySlug(slug, currentLocale);
  const news = transformNewsItem(newsData, currentLocale);

  if (!news) {
    notFound();
  }

  return <NewsDetailContent news={news} locale={currentLocale} />;
}
