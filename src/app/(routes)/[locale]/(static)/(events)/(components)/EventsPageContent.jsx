"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { Calendar, MapPin, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import Breadcrumbs from "../../../[category]/[...slug]/(components)/Breadcrumbs";
import PageTitle from "@/components/common/PageTitle";
import { getEventCategoryName } from "@/lib/api/events";

const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

export default function EventsPageContent({ initialEvents, initialPagination, locale }) {
  const eventsPath = locale === "az" ? "/tedbirler" : "/events";

  const breadcrumbs = [
    { label: locale === "az" ? "Ana səhifə" : "Home", href: "/" },
    { label: locale === "az" ? "Tədbirlər" : "Events", href: eventsPath },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(
      locale === "az" ? "az-AZ" : "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      <div className="wrapper mx-auto px-4 py-3">
        <header className="w-full mx-auto laptop:mb-6 mb-3">
          <PageTitle title={locale === "az" ? "TƏDBİRLƏR" : "EVENTS"} />
        </header>

        {initialEvents.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialEvents.map((event) => {
              const title = event.title?.[locale] || event.title?.az || "";
              const slug = event.slug?.[locale] || event.slug?.az || "";
              const excerpt = event.excerpt?.[locale] || event.excerpt?.az || "";
              const location = event.location?.[locale] || event.location?.az || "";
              const coverImage = event.coverImage
                ? event.coverImage.startsWith("http")
                  ? event.coverImage
                  : `${IMAGE_URL}${event.coverImage}`
                : "";

              return (
                <Link
                  key={event._id}
                  href={`${eventsPath}/${slug}`}
                  className="group block bg-white border-2 border-secondary/10 rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  {/* Cover Image */}
                  <div className="relative h-48 overflow-hidden">
                    {coverImage ? (
                      <Image
                        src={coverImage}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Calendar className="w-12 h-12 text-secondary/30" />
                      </div>
                    )}
                    {/* Category */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 bg-secondary/80 text-white text-[10px] font-medium rounded-full uppercase tracking-wide">
                        {getEventCategoryName(event.category, locale)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-base font-semibold text-secondary group-hover:text-primary transition-colors line-clamp-2 mb-2 leading-snug">
                      {title}
                    </h3>

                    {excerpt && (
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                        {excerpt}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-auto">
                      {event.eventDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <time suppressHydrationWarning>{formatDate(event.eventDate)}</time>
                        </div>
                      )}
                      {event.eventTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{event.eventTime}</span>
                        </div>
                      )}
                      {location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[150px]">{location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center text-gray-500">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">
              {locale === "az" ? "Hazırda tədbir yoxdur" : "No events available"}
            </p>
          </div>
        )}

        {/* Pagination */}
        {initialPagination && initialPagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            {Array.from({ length: initialPagination.pages }, (_, i) => i + 1).map((pageNum) => (
              <Link
                key={pageNum}
                href={`${eventsPath}?page=${pageNum}`}
                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  pageNum === initialPagination.page
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {pageNum}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
