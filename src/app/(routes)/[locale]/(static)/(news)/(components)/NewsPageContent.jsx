"use client";
import React from "react";
import Breadcrumbs from "../../../[category]/[...slug]/(components)/Breadcrumbs";
import PageTitle from "@/components/common/PageTitle";
import NewsFilter from "./NewsFilter";
import NewsList from "./NewsList";
import SectionTitle from "@/components/common/SectionTitle";
import { useTranslations } from "next-intl";


const NewsPageContent = ({ content, news, locale }) => {
  const t = useTranslations("news");
  const [activeCategory, setActiveCategory] = React.useState(t("filter.all-news"));
  if (!content) return null;

   const path = locale === "az" ? "/xeberler" : "/en/news";
  const breadcrumbs = [
    { label: locale === "az" ? "Ana səhifə" : "Home", href: "/" },
    { label: content.breadcrumbs, href: path },
  ];

  return (
    <>
      {/* Breadcrumbs */}
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      {/* Page Content */}
      <div className="wrapper mx-auto px-4 py-3">
        <header className="w-full mx-auto mb-3">
          <PageTitle title={content.title} />
        </header>
        <main>

          <NewsFilter activeCategory={activeCategory} setActiveCategory={setActiveCategory}/>
          <SectionTitle>{activeCategory}</SectionTitle>
          <NewsList news={news}/>
        </main>
      </div>
    </>
  );
};

export default NewsPageContent;
