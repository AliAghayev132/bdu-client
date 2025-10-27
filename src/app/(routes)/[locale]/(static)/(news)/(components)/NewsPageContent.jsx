"use client";
import React from "react";
import Breadcrumbs from "../../../[category]/[...slug]/(components)/Breadcrumbs";
import PageTitle from "@/components/common/PageTitle";
import NewsFilter from "./NewsFilter";
import NewsList from "./NewsList";


const NewsPageContent = ({ content, news, locale }) => {
  const [activeCategory, setActiveCategory] = React.useState("all");
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
      <div className="wrapper mx-auto px-4 sm:py-8 py-3">
        <header className="w-full mx-auto laptop:mb-6 mb-3">
          <PageTitle title={content.title} />
        </header>
        <main>
          <NewsFilter activeCategory={activeCategory} setActiveCategory={setActiveCategory}/>
          <NewsList news={news}/>
        </main>
      </div>
    </>
  );
};

export default NewsPageContent;
