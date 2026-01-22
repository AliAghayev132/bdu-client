"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import Breadcrumbs from "@/app/(routes)/[locale]/[category]/[...slug]/(components)/Breadcrumbs";

// PersonPage Component - for personPage type
function PersonPageContent({ page, rawPage, locale }) {
  const columns = rawPage?.columns || [];
  
  // Get all persons from all columns (flat list)
  const allPersons = columns.flatMap(column => column.persons || []);

  // Image URL helper
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) return imagePath;
    // Otherwise build the URL
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';
    return `${baseUrl}${imagePath}`;
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-secondary mb-4">{page.title}</h1>
        {page.description && (
          <p className="text-gray-600 max-w-2xl mx-auto">{page.description}</p>
        )}
      </div>

      {/* Persons Grid - all persons without column titles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allPersons.map((person, personIndex) => (
          <Link
            key={personIndex}
            href={`/${locale}/university/leadership/${person.slug?.[locale] || person.slug?.az || ""}`}
            className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4 border border-gray-100"
          >
            {/* Person Image */}
            <div className="aspect-[3/4] relative mb-4 rounded-lg overflow-hidden bg-gray-100">
              {person.image ? (
                <Image
                  src={getImageUrl(person.image)}
                  alt={person.name?.[locale] || person.name?.az || ""}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Person Info - Ad Soyad */}
            <h3 className="font-semibold text-secondary group-hover:text-primary transition-colors text-center">
              {person.name?.[locale] || person.name?.az || ""}
            </h3>
            <p className="text-sm text-gray-500 mt-1 text-center">
              {person.position?.[locale] || person.position?.az || ""}
            </p>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {allPersons.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>Bu səhifədə hələ məzmun yoxdur.</p>
        </div>
      )}
    </div>
  );
}

// Static Page Component - for static/blog/card types
function StaticPageContent({ page }) {
  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-secondary mb-4">{page.title}</h1>
        {page.description && (
          <p className="text-lg text-gray-600">{page.description}</p>
        )}
      </div>

      {/* Page Content */}
      {page.content && (
        <div 
          className="prose prose-lg max-w-none prose-headings:text-secondary prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      )}

      {/* Empty State */}
      {!page.content && (
        <div className="text-center py-12 text-gray-500">
          <p>Bu səhifədə hələ məzmun yoxdur.</p>
        </div>
      )}
    </div>
  );
}

export default function DynamicPageContent({ page, locale, rawPage }) {
  // Build breadcrumb items
  const breadcrumbItems = [
    { label: locale === "az" ? "Ana Səhifə" : "Home", href: `/${locale}` },
    { label: page.title, href: page.path },
  ];

  return (
    <div className="min-h-screen bg-bg-light">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumbs breadcrumbs={breadcrumbItems} />
        </div>
      </div>

      {/* Page Content */}
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
