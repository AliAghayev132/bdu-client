"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Breadcrumbs from "../../../[category]/[...slug]/(components)/Breadcrumbs";
import PageTitle from "@/components/common/PageTitle";
import { Calendar, Clock, Tag, Bell, Users, AlertTriangle, Info, GraduationCap, Calendar as CalendarIcon, MoreHorizontal } from "lucide-react";
import { getAnnouncementTypeColor, getAnnouncementTypeName } from "@/lib/api/announcements";

/**
 * AnnouncementsPageContent - Elanlar səhifəsi komponenti
 */
export default function AnnouncementsPageContent({ announcements, content, locale, pagination }) {
    const t = useTranslations("announcements");
    const [activeType, setActiveType] = useState("all");

    const path = locale === "az" ? "/elanlar" : "/en/announcements";
    const breadcrumbs = [
        { label: locale === "az" ? "Ana səhifə" : "Home", href: "/" },
        { label: content.breadcrumbs, href: path },
    ];

    // Type filter options
    const typeFilters = [
        { id: "all", label: locale === "az" ? "Bütün elanlar" : "All announcements", icon: Bell },
        { id: "academic", label: locale === "az" ? "Tədris" : "Academic", icon: GraduationCap },
        { id: "event", label: locale === "az" ? "Tədbirlər" : "Events", icon: CalendarIcon },
        { id: "info", label: locale === "az" ? "Məlumat" : "Info", icon: Info },
        { id: "warning", label: locale === "az" ? "Xəbərdarlıq" : "Warning", icon: AlertTriangle },
        { id: "other", label: locale === "az" ? "Digər" : "Other", icon: MoreHorizontal },
    ];

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString(
            locale === "az" ? "az-AZ" : "en-US",
            { day: "numeric", month: "long", year: "numeric" }
        );
    };

    // Get type icon
    const getTypeIcon = (type) => {
        const icons = {
            info: Info,
            warning: AlertTriangle,
            urgent: AlertTriangle,
            event: CalendarIcon,
            academic: GraduationCap,
            other: Bell,
        };
        return icons[type] || Bell;
    };

    // Filter announcements by type (client-side)
    const filteredAnnouncements = activeType === "all"
        ? announcements
        : announcements.filter(a => a.type === activeType);

    const announcementsPath = locale === "az" ? "/elanlar" : "/announcements";

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <div className="wrapper mx-auto px-4 py-6">
                <header className="w-full mx-auto mb-6">
                    <PageTitle title={content.title} />
                </header>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {typeFilters.map((filter) => {
                        const Icon = filter.icon;
                        return (
                            <button
                                key={filter.id}
                                onClick={() => setActiveType(filter.id)}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeType === filter.id
                                        ? "bg-[#B8956A] text-white shadow-md"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {filter.label}
                            </button>
                        );
                    })}
                </div>

                {/* Announcements Grid */}
                {filteredAnnouncements.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                        {filteredAnnouncements.map((item) => {
                            const TypeIcon = getTypeIcon(item.type);
                            return (
                                <Link
                                    key={item.id}
                                    href={`${announcementsPath}/${item.slug || item.id}`}
                                    className="group block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                                >
                                    {/* Header with type badge */}
                                    <div
                                        className="px-5 py-3 flex items-center justify-between"
                                        style={{ backgroundColor: `${getAnnouncementTypeColor(item.type)}15` }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <TypeIcon
                                                className="w-4 h-4"
                                                style={{ color: getAnnouncementTypeColor(item.type) }}
                                            />
                                            <span
                                                className="text-xs font-semibold uppercase"
                                                style={{ color: getAnnouncementTypeColor(item.type) }}
                                            >
                                                {getAnnouncementTypeName(item.type, locale)}
                                            </span>
                                        </div>
                                        {item.isPinned && (
                                            <span className="px-2 py-0.5 bg-[#B8956A] text-white text-xs rounded-full">
                                                📌
                                            </span>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        {/* Date */}
                                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <time suppressHydrationWarning>{formatDate(item.publishedAt || item.startDate)}</time>
                                            </div>
                                            {item.views > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <span>{item.views} {locale === "az" ? "baxış" : "views"}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-base font-semibold text-secondary group-hover:text-[#B8956A] transition-colors line-clamp-2 mb-2">
                                            {item.title}
                                        </h3>

                                        {/* Excerpt from content */}
                                        {item.content && (
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {item.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 text-gray-500">
                        <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg">
                            {locale === "az" ? "Hazırda elan yoxdur" : "No announcements available"}
                        </p>
                    </div>
                )}

                {/* Pagination - if needed */}
                {pagination && pagination.pages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        {Array.from({ length: pagination.pages }, (_, i) => (
                            <button
                                key={i + 1}
                                className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${pagination.page === i + 1
                                        ? "bg-[#B8956A] text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
