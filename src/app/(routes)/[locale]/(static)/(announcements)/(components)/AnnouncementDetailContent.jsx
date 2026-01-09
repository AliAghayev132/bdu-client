"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import Breadcrumbs from "../../../[category]/[...slug]/(components)/Breadcrumbs";
import { Calendar, Eye, Users, ArrowLeft, Clock, Paperclip, AlertTriangle } from "lucide-react";
import { Link } from "@/i18n/routing";
import { getAnnouncementTypeColor, getAnnouncementTypeName } from "@/lib/api/announcements";

/**
 * AnnouncementDetailContent - Elan detalları komponenti
 */
export default function AnnouncementDetailContent({ announcement, locale }) {
    if (!announcement) {
        return (
            <div className="wrapper mx-auto px-4 py-10 text-center">
                <h1 className="text-2xl font-bold text-gray-600">
                    {locale === "az" ? "Elan tapılmadı" : "Announcement not found"}
                </h1>
                <Link
                    href={locale === "az" ? "/elanlar" : "/announcements"}
                    className="inline-flex items-center gap-2 mt-4 text-[#B8956A] hover:underline"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {locale === "az" ? "Elanlara qayıt" : "Back to announcements"}
                </Link>
            </div>
        );
    }

    const path = locale === "az" ? "/elanlar" : "/en/announcements";
    const breadcrumbs = [
        { label: locale === "az" ? "Ana səhifə" : "Home", href: "/" },
        { label: locale === "az" ? "Elanlar" : "Announcements", href: path },
        { label: announcement.title, href: "#" },
    ];

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString(
            locale === "az" ? "az-AZ" : "en-US",
            { year: "numeric", month: "long", day: "numeric" }
        );
    };

    // Target audience translation
    const audienceNames = {
        students: locale === "az" ? "Tələbələr" : "Students",
        faculty: locale === "az" ? "Müəllimlər" : "Faculty",
        staff: locale === "az" ? "İşçilər" : "Staff",
        alumni: locale === "az" ? "Məzunlar" : "Alumni",
        all: locale === "az" ? "Hamı" : "Everyone",
    };

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <article className="wrapper mx-auto px-4 py-6">
                {/* Header */}
                <header className="mb-8 max-w-4xl mx-auto">
                    {/* Type Badge */}
                    <div className="flex items-center gap-3 mb-4">
                        <span
                            className="inline-block px-4 py-1.5 text-sm font-semibold text-white rounded-full"
                            style={{ backgroundColor: getAnnouncementTypeColor(announcement.type) }}
                        >
                            {getAnnouncementTypeName(announcement.type, locale)}
                        </span>
                        {announcement.isPinned && (
                            <span className="px-3 py-1 bg-[#B8956A] text-white text-xs rounded-full">
                                📌 {locale === "az" ? "Sabitlənmiş" : "Pinned"}
                            </span>
                        )}
                        {announcement.priority === "high" || announcement.priority === "critical" ? (
                            <span className="px-3 py-1 bg-red-500 text-white text-xs rounded-full flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                {locale === "az" ? "Vacib" : "Important"}
                            </span>
                        ) : null}
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary mb-4 leading-tight">
                        {announcement.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        {announcement.publishedAt && (
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                <time suppressHydrationWarning>{formatDate(announcement.publishedAt)}</time>
                            </div>
                        )}
                        {announcement.endDate && (
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                <span>
                                    {locale === "az" ? "Son tarix:" : "Deadline:"} {formatDate(announcement.endDate)}
                                </span>
                            </div>
                        )}
                        {announcement.views > 0 && (
                            <div className="flex items-center gap-1.5">
                                <Eye className="w-4 h-4" />
                                <span>{announcement.views} {locale === "az" ? "baxış" : "views"}</span>
                            </div>
                        )}
                    </div>

                    {/* Target Audience */}
                    {announcement.targetAudience && announcement.targetAudience.length > 0 && !announcement.targetAudience.includes("all") && (
                        <div className="mt-4 flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                                {locale === "az" ? "Hədəf auditoriya:" : "Target audience:"}
                            </span>
                            <div className="flex gap-2">
                                {announcement.targetAudience.map((audience) => (
                                    <span key={audience} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                        {audienceNames[audience] || audience}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </header>

                {/* Content */}
                <div className="max-w-4xl mx-auto">
                    {/* Main Content - HTML with prose formatting */}
                    {announcement.content && (
                        <article className="prose prose-lg max-w-none">
                            <div
                                className="py-2 sm:text-base text-sm 
                  prose-headings:text-secondary prose-headings:font-bold
                  prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                  prose-a:text-[#B8956A] prose-a:underline hover:prose-a:text-[#B8956A]/80
                  prose-img:rounded-xl prose-img:shadow-md prose-img:my-6 prose-img:mx-auto
                  prose-strong:text-secondary prose-strong:font-semibold
                  prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4
                  prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4
                  prose-li:mb-2 prose-li:text-gray-700"
                                dangerouslySetInnerHTML={{ __html: announcement.content }}
                            />
                        </article>
                    )}

                    {/* Attachments */}
                    {announcement.attachments && announcement.attachments.length > 0 && (
                        <div className="mt-8 p-4 bg-gray-50 rounded-2xl">
                            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                <Paperclip className="w-4 h-4" />
                                {locale === "az" ? "Əlavələr" : "Attachments"}
                            </h3>
                            <div className="space-y-2">
                                {announcement.attachments.map((file, index) => (
                                    <a
                                        key={index}
                                        href={file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200 hover:border-[#B8956A] transition-colors"
                                    >
                                        <span className="text-sm text-gray-600">{file.name}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Back Button */}
                <div className="max-w-4xl mx-auto mt-10 pt-6 border-t border-gray-200">
                    <Link
                        href={locale === "az" ? "/elanlar" : "/announcements"}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#B8956A]/10 text-[#B8956A] rounded-xl hover:bg-[#B8956A] hover:text-white transition-colors font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {locale === "az" ? "Bütün elanlar" : "All announcements"}
                    </Link>
                </div>
            </article>
        </>
    );
}
