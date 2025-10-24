import { buildBreadcrumbs, getPageDataFromMenu } from "@/data/menuData";
import Breadcrumbs from "./(components)/Breadcrumbs";
import NotFound from "./(components)/NotFound";
import SideBar from "./(components)/SideBar";
import PageHeader from "./(components)/PageHeader";
import CardsGrid from "./(components)/CardsGrid";
import DetailHeader from "./(components)/DetailHeader";
import BlogContent from "./(components)/BlogContent";
import SubPagesGrid from "./(components)/SubPagesGrid";
import AuthorInfo from "./(components)/AuthorInfo";
import StructuredData from "@/components/seo/StructuredData";

// Bu dynamic page bütün nested route-ları handle edəcək
// Məsələn:
// /university/scientific-council -> category="university", slug=["scientific-council"]
// /university/scientific-council/activities/2025 -> category="university", slug=["scientific-council", "activities", "2025"]

export default async function DynamicPage({ params }) {
  const { locale, category, slug } = await params;

  // Full path yaradırıq
  const fullPath = `/${category}/${slug ? slug.join("/") : ""}`;
  const breadcrumbs = buildBreadcrumbs(fullPath, locale);

  // MenuData-dan məlumat gətir (SINGLE SOURCE OF TRUTH)
  const pageData = getPageDataFromMenu(fullPath, locale);

  // If no page data, show NotFound
  if (!pageData) {
    return <NotFound locale={locale} />;
  }

  // Get page type
  const pageType = pageData.type?.[locale] || "blog";

  console.log("Page Data:", { fullPath, pageType, sidebar: pageData.sidebar });

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Structured Data for SEO */}
      <StructuredData type="breadcrumb" data={{ breadcrumbs }} locale={locale} />
      {pageData.detailItem && (
        <StructuredData type="person" data={{ person: pageData.detailItem }} locale={locale} />
      )}
      {pageData.content[locale]?.body && (
        <StructuredData 
          type="article" 
          data={{ 
            article: {
              title: pageData.content[locale]?.title,
              description: pageData.content[locale]?.description,
              author: pageData.author,
              updatedAt: pageData.updatedAt,
              publishedAt: pageData.publishedAt
            }
          }} 
          locale={locale} 
        />
      )}
      
      {/* Breadcrumbs */}
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      {/* Page Content */}
      <div className="wrapper mx-auto px-4 sm:py-12 pt-1 pb-6">
        <div className="relative grid lg:grid-cols-4 sm:gap-8 gap-6">
          {/* Sidebar */}

          <SideBar pageData={pageData} locale={locale} />
          {/* Main Content */}
          <main className="lg:col-span-3">
            <PageHeader
              title={pageData.content[locale]?.title}
              description={pageData.content[locale]?.description}
            />

            {/* Render based on page type */}
            {pageType === "card" && pageData.items && pageData.items.length > 0 ? (
              <CardsGrid items={pageData.items} locale={locale} fullPath={fullPath} />
            ) : (
              <div>
                <DetailHeader detailItem={pageData.detailItem} locale={locale} />
                <BlogContent html={pageData.content[locale]?.body || ""} />
              </div>
            )}

            {
              pageType === "blog" && pageData.items && pageData.items.length > 0 && (
                <BlogContent html={pageData.content[locale]?.body || ""} />
              )
            }

            {/* Sub-pages links */}
            {pageData.subPages && pageData.subPages.length > 0 && (
              <SubPagesGrid subPages={pageData.subPages} locale={locale} />
            )}

            {/* Author & Date */}
            {pageData.author && (
              <AuthorInfo author={pageData.author} updatedAt={pageData.updatedAt} locale={locale} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Generate static params for ISR/SSG
// Backend API-dən bütün route-ları çəkib pre-render edir
export async function generateStaticParams() {
  try {
    // Backend API-dən route-ları çək
    const { fetchAllRoutes } = await import('@/lib/api');
    const routes = await fetchAllRoutes();
    
    // Convert to Next.js params format
    return routes.map(route => {
      const pathParts = route.path.split('/').filter(Boolean);
      const [category, ...slug] = pathParts;
      
      return {
        locale: route.locale,
        category,
        slug: slug.length > 0 ? slug : undefined
      };
    });
  } catch (error) {
    console.error('Error generating static params:', error);
    // Fallback to some basic routes
    return [
      { locale: "az", category: "university", slug: ["history"] },
      { locale: "en", category: "university", slug: ["history"] }
    ];
  }
}

// ISR revalidation - hər 10 dəqiqədə yenilə
export const revalidate = 600;

// Metadata generation with full SEO support
export async function generateMetadata({ params }) {
  const { locale, category, slug } = await params;
  const fullPath = `/${category}/${slug ? slug.join("/") : ""}`;
  const pageData = getPageDataFromMenu(fullPath, locale);
  
  if (!pageData) {
    return {
      title: locale === 'az' ? 'Səhifə tapılmadı' : 'Page Not Found',
      description: 'Bakı Dövlət Universiteti'
    };
  }
  
  const title = pageData.content[locale]?.title || category;
  const description = pageData.content[locale]?.description || `Bakı Dövlət Universiteti - ${title}`;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bdu.info.az';
  const canonicalPath = locale === 'az' ? fullPath : `/en${fullPath}`;
  const canonicalUrl = `${baseUrl}${canonicalPath}`;
  
  return {
    title: `${title}`,
    description,
    keywords: pageData.keywords?.[locale] || 'Bakı Dövlət Universiteti, BDU, Azerbaijan, University',
    
    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'az': `${baseUrl}${fullPath}`,
        'en': `${baseUrl}/en${fullPath}`,
        'x-default': `${baseUrl}${fullPath}`
      }
    },
    
    // Open Graph
    openGraph: {
      title: `${title}`,
      description,
      url: canonicalUrl,
      siteName: 'Bakı Dövlət Universiteti',
      locale: locale === 'az' ? 'az_AZ' : 'en_US',
      type: 'website',
      image: `${baseUrl}/favicon/favicon.ico`,
      images: pageData.detailItem?.image ? [
        {
          url: `${baseUrl}${pageData.detailItem.image}`,
          width: 1200,
          height: 630,
          alt: title
        }
      ] : []
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: `${title}`,
      description,
      images: pageData.detailItem?.image ? [`${baseUrl}${pageData.detailItem.image}`] : []
    },
    
    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  };
}
