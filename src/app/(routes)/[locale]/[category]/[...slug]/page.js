import { notFound } from "next/navigation";
import Image from "next/image";
import { buildBreadcrumbs, getPageDataFromMenu } from "@/data/menuData";
import Breadcrumbs from "./(components)/Breadcrumbs";
import NotFound from "./(components)/NotFound";
import SideBar from "./(components)/SideBar";

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
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      {/* Page Content */}
      <div className="wrapper mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}

          <SideBar pageData={pageData} locale={locale} />
          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Page Title */}
            <h1 className="text-3xl font-bold text-secondary mb-6">
              {pageData.content[locale]?.title || "Səhifə"}
            </h1>

            {pageData.content[locale]?.description && (
              <p className="text-lg text-gray-600 mb-6">
                {pageData.content[locale].description}
              </p>
            )}

            {/* Render based on page type */}
            {pageType === "card" &&
            pageData.items &&
            pageData.items.length > 0 ? (
              /* Card Layout - for people/staff listings */
              <div className="grid md:grid-cols-2 gap-6">
                {pageData.items.map((person) => {
                  // Auto-generate detail URL if hasDetail is true
                  const hasDetailPage = person.hasDetail === true;
                  const CardWrapper = hasDetailPage ? "a" : "div";

                  // Generate URL: current path + card id
                  const detailUrl = hasDetailPage
                    ? `${fullPath}/${person.id}`
                    : null;
                  const cardProps = detailUrl ? { href: detailUrl } : {};

                  return (
                    <CardWrapper
                      key={person.id}
                      {...cardProps}
                      className={`flex gap-4 bg-bg-light rounded-lg hover:shadow-lg transition-shadow ${
                        hasDetailPage ? "cursor-pointer" : ""
                      }`}
                    >
                      {person.image && (
                        <div className="flex-shrink-0">
                          <Image
                            src={person.image}
                            alt={person.name?.[locale] || ""}
                            width={120}
                            height={120}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                      )}
                      <div className="flex-1 p-6">
                        <h3 className="font-bold text-lg text-secondary mb-1">
                          {person.name?.[locale]}
                        </h3>
                        {person.position && (
                          <p className="text-sm text-gray-600 mb-2">
                            {person.position[locale]}
                          </p>
                        )}
                        {person.phone && (
                          <p className="text-sm text-gray-700">
                            Tel.: {person.phone}
                          </p>
                        )}
                        {person.email && (
                          <p className="text-sm text-gray-700">
                            E-mail: {person.email}
                          </p>
                        )}
                      </div>
                    </CardWrapper>
                  );
                })}
              </div>
            ) : (
              /* Blog Layout - Quill.js content */
              <div>
                {/* Detail page - Şəkil və əlaqə məlumatları */}
                {pageData.detailItem && (
                  <div className="flex gap-6 mb-8 bg-bg-light rounded-lg">
                    {pageData.detailItem.image && (
                      <div className="flex-shrink-0">
                        <Image
                          src={pageData.detailItem.image}
                          alt={pageData.detailItem.name?.[locale] || ""}
                          width={120}
                          height={120}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    )}
                    <div className="flex-1 p-6">
                      <h2 className="text-xl font-bold text-secondary mb-2">
                        {pageData.detailItem.name?.[locale]}
                      </h2>
                      <p className="text-gray-600 mb-4">
                        {pageData.detailItem.position?.[locale]}
                      </p>
                      {pageData.detailItem.phone && (
                        <p className="text-sm text-gray-700 mb-1">
                          <strong>Tel.:</strong> {pageData.detailItem.phone}
                        </p>
                      )}
                      {pageData.detailItem.email && (
                        <p className="text-sm text-gray-700">
                          <strong>E-mail:</strong> {pageData.detailItem.email}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Blog content */}
                <article className="prose prose-lg max-w-none">
                  <div
                    className="bg-white prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: pageData.content[locale]?.body || "",
                    }}
                  />
                </article>
              </div>
            )}

            {/* Sub-pages links */}
            {pageData.subPages && pageData.subPages.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xl font-bold text-secondary mb-6">
                  {locale === "az" ? "Alt səhifələr" : "Sub-pages"}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {pageData.subPages.map((subPage) => (
                    <a
                      key={subPage.id}
                      href={
                        typeof subPage.href === "object"
                          ? subPage.href[locale]
                          : subPage.href
                      }
                      className="block bg-bg-light p-6 rounded-lg hover:shadow-lg transition-shadow border border-gray-200"
                    >
                      <h3 className="font-bold text-primary mb-2 text-lg">
                        {subPage.title[locale]}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {subPage.description[locale]}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Author & Date */}
            {pageData.author && (
              <div className="mt-12 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div>
                    <span className="font-medium">
                      {pageData.author.name[locale]}
                    </span>
                    {" • "}
                    <span>{pageData.author.role[locale]}</span>
                  </div>
                  <div>
                    {locale === "az" ? "Yenilənib" : "Updated"}:{" "}
                    {new Date(pageData.updatedAt).toLocaleDateString(
                      locale === "az" ? "az-AZ" : "en-US"
                    )}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Generate static params for known routes (optional - SEO üçün)
export async function generateStaticParams() {
  // Backend-dən bütün mövcud route-ları gətirib generate edə bilərik
  return [
    { locale: "az", category: "university", slug: ["history"] },
    { locale: "az", category: "university", slug: ["scientific-council"] },
    {
      locale: "az",
      category: "university",
      slug: ["scientific-council", "structure"],
    },
    {
      locale: "az",
      category: "university",
      slug: ["scientific-council", "activities"],
    },
    {
      locale: "az",
      category: "university",
      slug: ["scientific-council", "activities", "2025"],
    },
    // və s.
  ];
}

// Metadata generation
export async function generateMetadata({ params }) {
  const { locale, category, slug } = await params;
  const pageTitle = slug ? slug[slug.length - 1].replace(/-/g, " ") : category;

  return {
    title: `${pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1)} - BDU`,
    description: `Bakı Dövlət Universiteti - ${pageTitle}`,
  };
}
