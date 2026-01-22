"use client";
import React from "react";
import Breadcrumbs from "../../../[category]/[...slug]/(components)/Breadcrumbs";
import PageTitle from "@/components/common/PageTitle";
import NewsFilter from "./NewsFilter";
import NewsList from "./NewsList";
import SectionTitle from "@/components/common/SectionTitle";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";


const NewsPageContent = ({ content, news, locale, announcements = [] }) => {
  const t = useTranslations("news");
  const [activeCategory, setActiveCategory] = React.useState(t("filter.all-news"));
  if (!content) return null;

  const path = locale === "az" ? "/xeberler" : "/en/news";
  const breadcrumbs = [
    { label: locale === "az" ? "Ana səhifə" : "Home", href: "/" },
    { label: content.breadcrumbs, href: path },
  ];

  const announcementsPath = locale === 'az' ? '/elanlar' : '/announcements';

  // Format date for announcements
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'az' ? 'az-AZ' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString(locale === 'az' ? 'az-AZ' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Breadcrumbs */}
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      {/* Page Content */}
      <div className="wrapper mx-auto px-4 py-3">
        <header className="w-full mx-auto mb-3">
          <PageTitle title={content.title} />
        </header>
        <main className="grid xl:grid-cols-[1fr_320px] gap-6">
          {/* News Section - Left */}
          <div>
            <NewsFilter activeCategory={activeCategory} setActiveCategory={setActiveCategory}/>
            <SectionTitle>{activeCategory}</SectionTitle>
            <NewsList news={news}/>
          </div>

          {/* Announcements Sidebar - Right */}
          <aside className="hidden xl:block">
            <div className="bg-gradient-to-br from-[#B8956A]/10 to-[#B8956A]/5 rounded-3xl overflow-hidden sticky top-24">
              {/* Header */}
              <div className="bg-[#B8956A] px-6 py-4 flex items-center justify-between">
                <h2 className="text-white font-bold text-lg">
                  {locale === 'az' ? 'ELANLAR' : 'ANNOUNCEMENTS'}
                </h2>
              </div>

              {/* Announcements List */}
              <div className="custom-scrollbar max-h-[700px] overflow-y-auto">
                {announcements.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {announcements.map((item) => (
                      <Link
                        key={item.id}
                        href={`${announcementsPath}/${item.slug || item.id}`}
                        className="block px-6 py-4 hover:bg-white/50 transition-colors group"
                      >
                        {/* Date and Time */}
                        <div className="flex items-center gap-2 text-xs text-[#B8956A] font-medium mb-2">
                          <time suppressHydrationWarning>{formatDate(item.publishedAt || item.startDate)}</time>
                          <span>|</span>
                          <time suppressHydrationWarning>{formatTime(item.publishedAt || item.startDate)}</time>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm text-gray-700 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                          {item.title}
                        </h3>

                        {/* Type Badge */}
                        <div className="mt-2 inline-flex items-center gap-1 text-xs text-[#B8956A] font-medium">
                          <span>– {locale === 'az' ? 'ELAN' : 'ANNOUNCEMENT'}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-8 text-center text-gray-500">
                    {locale === 'az' ? 'Hazırda aktiv elan yoxdur' : 'No active announcements'}
                  </div>
                )}
              </div>

              {/* Footer Button */}
              <div className="border-t border-gray-200">
                <Link
                  href={announcementsPath}
                  className="block w-full text-center px-4 py-2.5 bg-[#B8956A] text-white hover:bg-[#A07D54] transition-colors font-medium text-sm"
                >
                  {locale === 'az' ? 'BÜTÜN ELANLAR' : 'ALL ANNOUNCEMENTS'}
                </Link>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </>
  );
};

export default NewsPageContent;
