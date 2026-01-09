import { notFound } from "next/navigation";
import { getNewsBySlug, transformNewsItem } from "@/lib/api/news";
import NewsDetailContent from "../../(components)/NewsDetailContent";
import AnnouncementsList from "@/app/(routes)/[locale]/(home)/(components)/AnnouncementsList";

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

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bdu.edu.az";

  return {
    title: news.seo?.metaTitle || news.title,
    description: news.seo?.metaDescription || news.excerpt,
    keywords: news.seo?.keywords?.join(", "),
    alternates: {
      canonical: `${baseUrl}/en/news/${news.slug}`,
      languages: {
        az: `${baseUrl}/xeberler/${news.alternateSlug}`,
        en: `${baseUrl}/en/news/${news.slug}`,
      },
    },
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

  return (
    <div className="wrapper mx-auto px-4">
      <div className="grid xl:grid-cols-[1fr_320px] gap-6">
        {/* News Content - Left Side */}
        <div>
          <NewsDetailContent
            news={news}
            locale={currentLocale}
            alternateSlug={news.alternateSlug}
          />
        </div>

        {/* Announcements Sidebar - Right Side (XL only) */}
        <aside className="hidden xl:block sticky top-24 h-fit">
          <AnnouncementsList />
        </aside>
      </div>
    </div>
  );
}
