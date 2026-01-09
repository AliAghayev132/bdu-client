"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Breadcrumbs from "../../../[category]/[...slug]/(components)/Breadcrumbs";
import { Calendar, Eye, Tag, User, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";

/**
 * NewsDetailContent - Xəbər detalları komponenti
 */
export default function NewsDetailContent({ news, locale }) {
    const t = useTranslations("news");

    if (!news) {
        return (
            <div className="wrapper mx-auto px-4 py-10 text-center">
                <h1 className="text-2xl font-bold text-gray-600">
                    {locale === "az" ? "Xəbər tapılmadı" : "News not found"}
                </h1>
                <Link
                    href={locale === "az" ? "/xeberler" : "/news"}
                    className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {locale === "az" ? "Xəbərlərə qayıt" : "Back to news"}
                </Link>
            </div>
        );
    }

    const path = locale === "az" ? "/xeberler" : "/en/news";
    const breadcrumbs = [
        { label: locale === "az" ? "Ana səhifə" : "Home", href: "/" },
        { label: locale === "az" ? "Xəbərlər" : "News", href: path },
        { label: news.title, href: "#" },
    ];

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString(
            locale === "az" ? "az-AZ" : "en-US",
            {
                year: "numeric",
                month: "long",
                day: "numeric",
            }
        );
    };

    // Category translations
    const categoryNames = {
        university: locale === "az" ? "Universitet" : "University",
        education: locale === "az" ? "Təhsil" : "Education",
        science: locale === "az" ? "Elm" : "Science",
        events: locale === "az" ? "Tədbirlər" : "Events",
        other: locale === "az" ? "Digər" : "Other",
    };

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <article className="wrapper mx-auto px-4 py-6">
                {/* Header */}
                <header className="mb-8">
                    {/* Category Badge */}
                    {news.category && (
                        <span
                            className="inline-block px-3 py-1 text-xs font-medium text-white rounded-full mb-4"
                            style={{ backgroundColor: getCategoryColor(news.category) }}
                        >
                            {categoryNames[news.category] || news.category}
                        </span>
                    )}

                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary mb-4 leading-tight">
                        {news.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        {news.date && (
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                <time suppressHydrationWarning>{formatDate(news.date)}</time>
                            </div>
                        )}
                        {news.views > 0 && (
                            <div className="flex items-center gap-1.5">
                                <Eye className="w-4 h-4" />
                                <span>
                                    {news.views} {locale === "az" ? "baxış" : "views"}
                                </span>
                            </div>
                        )}
                        {news.author && (
                            <div className="flex items-center gap-1.5">
                                <User className="w-4 h-4" />
                                <span>{news.author}</span>
                            </div>
                        )}
                    </div>
                </header>

                {/* Cover Image */}
                {news.image && (
                    <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden mb-8">
                        <Image
                            src={
                                news.image.startsWith("http")
                                    ? news.image
                                    : `${process.env.NEXT_PUBLIC_IMAGE_URL || ""}${news.image}`
                            }
                            alt={news.title}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, 1200px"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="max-w-4xl">
                    {/* Excerpt */}
                    {news.excerpt && (
                        <p className="text-lg text-gray-600 mb-6 font-medium leading-relaxed border-l-4 border-primary pl-4">
                            {news.excerpt}
                        </p>
                    )}

                    {/* Main Content - HTML */}
                    {news.content && (
                        <div
                            className="prose prose-lg max-w-none prose-headings:text-secondary prose-a:text-primary prose-img:rounded-xl"
                            dangerouslySetInnerHTML={{ __html: news.content }}
                        />
                    )}
                </div>

                {/* Back Button */}
                <div className="mt-10 pt-6 border-t border-gray-200">
                    <Link
                        href={locale === "az" ? "/xeberler" : "/news"}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-colors font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {locale === "az" ? "Bütün xəbərlər" : "All news"}
                    </Link>
                </div>
            </article>
        </>
    );
}

// Category color helper
function getCategoryColor(category) {
    const colors = {
        university: "#2C4B62",
        education: "#4A7C4D",
        science: "#7C4D8A",
        events: "#AA9674",
        other: "#6B7280",
    };
    return colors[category] || colors.other;
}
