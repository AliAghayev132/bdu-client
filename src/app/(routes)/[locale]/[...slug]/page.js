import { notFound } from "next/navigation";
import { getPageByPath, transformPageData } from "@/lib/api/pages";
import DynamicPageContent from "./(components)/DynamicPageContent";

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const path = "/" + (Array.isArray(slug) ? slug.join("/") : slug);
  
  const page = await getPageByPath(path, locale);
  
  if (!page) {
    return {
      title: "Səhifə tapılmadı",
    };
  }

  const pageData = transformPageData(page, locale);

  return {
    title: pageData.seo?.metaTitle || pageData.title,
    description: pageData.seo?.metaDescription || pageData.description,
    keywords: pageData.seo?.keywords?.join(", "),
    openGraph: {
      title: pageData.seo?.metaTitle || pageData.title,
      description: pageData.seo?.metaDescription || pageData.description,
      images: pageData.seo?.ogImage ? [pageData.seo.ogImage] : [],
    },
  };
}

export default async function DynamicPage({ params }) {
  const { locale, slug } = await params;
  
  // Build path from slug segments
  const path = "/" + (Array.isArray(slug) ? slug.join("/") : slug);
  
  // Fetch page from backend
  const page = await getPageByPath(path, locale);
  
  // If page not found, show 404
  if (!page) {
    notFound();
  }

  const pageData = transformPageData(page, locale);

  return <DynamicPageContent page={pageData} locale={locale} rawPage={page} />;
}
