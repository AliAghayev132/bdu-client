"use client";

import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "@/app/(routes)/[locale]/[category]/[...slug]/(components)/Breadcrumbs";

// Şəkil URL helper
function getImageUrl(imagePath) {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
    "http://localhost:3001";
  return `${baseUrl}${imagePath}`;
}

// ─── PersonPage: Sütunlar alt-alta, hər sütunun başlığı görünür ───
function PersonPageContent({ page, rawPage, locale }) {
  const columns = rawPage?.columns || [];
  const allPersons = columns.flatMap((col) => col.persons || []);

  return (
    <div className="space-y-10">
      {/* Səhifə başlığı */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-secondary mb-4">{page.title}</h1>
        {page.description && (
          <p className="text-gray-600 max-w-2xl mx-auto">{page.description}</p>
        )}
      </div>

      {/* Sütunlar — alt-alta */}
      {columns.map((column, colIdx) => {
        const persons = column.persons || [];
        if (persons.length === 0) return null;

        // Boşluq olan başlıqları göstərmə
        const title = (
          column.title?.[locale] ||
          column.title?.az ||
          ""
        ).trim();

        return (
          <section key={column._id || colIdx} className="space-y-6">
            {/* Sütun başlığı */}
            {title && (
              <h2 className="text-2xl font-bold text-secondary border-b-2 border-primary/20 pb-3">
                {title}
              </h2>
            )}

            {/* Şəxslər grid */}
            <div className={column.centered
              ? "flex flex-wrap justify-center gap-6"
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            }>
              {persons.map((person) => {
                const personSlug =
                  person.slug?.[locale] || person.slug?.az || "";
                const personName =
                  person.name?.[locale] || person.name?.az || "";
                const personPosition =
                  person.position?.[locale] || person.position?.az || "";

                return (
                  <Link
                    key={person._id}
                    href={`${page.path}/${personSlug}`}
                    className={`group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 border border-gray-100${column.centered ? " w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]" : ""}`}
                  >
                    <div className="aspect-[3/4] relative mb-4 rounded-lg overflow-hidden bg-gray-100">
                      {person.image ? (
                        <Image
                          src={getImageUrl(person.image)}
                          alt={personName}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg
                            className="w-20 h-20"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    <h3 className="font-semibold text-secondary group-hover:text-primary transition-colors text-center">
                      {personName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 text-center">
                      {personPosition}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Boş vəziyyət */}
      {allPersons.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>Bu səhifədə hələ məzmun yoxdur.</p>
        </div>
      )}
    </div>
  );
}

// ─── Statik Səhifə ───
function StaticPageContent({ page }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-secondary mb-4">{page.title}</h1>
        {page.description && (
          <p className="text-lg text-gray-600">{page.description}</p>
        )}
      </div>

      {page.content ? (
        <div
          className="ProseMirror prose prose-lg max-w-none prose-headings:text-secondary prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>Bu səhifədə hələ məzmun yoxdur.</p>
        </div>
      )}
    </div>
  );
}

// ─── Ana komponent ───
export default function DynamicPageContent({ page, locale, rawPage }) {
  const breadcrumbItems = [
    { label: locale === "az" ? "Ana Səhifə" : "Home", href: "/" },
    { label: page.title, href: page.path },
  ];

  return (
    <div className="min-h-screen bg-bg-light">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumbs breadcrumbs={breadcrumbItems} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {page.pageType === "personPage" ? (
          <PersonPageContent page={page} rawPage={rawPage} locale={locale} />
        ) : (
          <StaticPageContent page={page} />
        )}
      </div>
    </div>
  );
}
