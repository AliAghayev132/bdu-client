"use client";
import React, { useMemo } from "react";
import StructuredData from "@/components/seo/StructuredData";
import Breadcrumbs from "@/app/(routes)/[locale]/[category]/[...slug]/(components)/Breadcrumbs";
import PageTitle from "./PageTitle";
import ImageCarousel from "./ImageCarousel";

const BlogPageContent = ({ locale, content }) => {
  if (!content) return null;

  const path = locale === "az" ? "/telebeler-ucun" : "/en/for-students";
  const breadcrumbs = [
    { label: locale === "az" ? "Ana səhifə" : "Home", href: "/" },
    { label: content.breadcrumbs, href: path },
  ];

  const imageList =
    content?.sliderImages || content?.content?.sliderImages || [];
  const hasSlider = Array.isArray(imageList) && imageList.length > 0;
  const slides = useMemo(() => {
    if (!hasSlider) return [];
    return imageList
      .map((img, idx) => {
        const src = typeof img === "string" ? img : img?.src || "";
        const width = typeof img === "object" && img?.width ? img.width : 1600;
        const height =
          typeof img === "object" && img?.height ? img.height : 900;
        return { src, width, height, idx };
      })
      .filter((s) => s.src);
  }, [imageList, hasSlider]);

  // Slider logic is entirely inside ImageSlider for reuse and performance.

  return (
    <>
      {/* Structured Data */}
      <StructuredData
        type="breadcrumb"
        data={{ breadcrumbs }}
        locale={locale}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      {/* Page Content */}
      <div className="wrapper mx-auto px-4 py-3">
        <header className="w-full mx-auto laptop:mb-6 mb-3">
          <PageTitle title={content.title} />
        </header>
        <article className="prose prose-lg max-w-none">
          <div
            className="py-2 sm:text-base text-sm"
            dangerouslySetInnerHTML={{ __html: content.content.body }}
          />
        </article>
        {hasSlider && slides.length > 0 && (
          <ImageCarousel slides={slides} title={content.title} autoplay={3000} loop />
        )}
      </div>
    </>
  );
};

export default BlogPageContent;
