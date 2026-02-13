"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Calendar, Clock, MapPin, Eye, Users, ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useAlternateSlug } from "@/context/AlternateSlugContext";
import Breadcrumbs from "../../../[category]/[...slug]/(components)/Breadcrumbs";
import { getEventCategoryName } from "@/lib/api/events";

export default function EventDetailContent({ event, locale, alternateSlug }) {
  const { setAlternateSlug, clearAlternateSlug } = useAlternateSlug();

  useEffect(() => {
    if (event && alternateSlug) {
      const slugs = locale === "az"
        ? { az: `/tedbirler/${event.slug}`, en: `/events/${alternateSlug}` }
        : { az: `/tedbirler/${alternateSlug}`, en: `/events/${event.slug}` };
      setAlternateSlug(slugs);
    }
    return () => clearAlternateSlug();
  }, [event, alternateSlug, locale, setAlternateSlug, clearAlternateSlug]);

  if (!event) {
    return (
      <div className="wrapper mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-gray-600">
          {locale === "az" ? "Tədbir tapılmadı" : "Event not found"}
        </h1>
        <Link
          href={locale === "az" ? "/tedbirler" : "/events"}
          className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          {locale === "az" ? "Tədbrlərə qayıt" : "Back to events"}
        </Link>
      </div>
    );
  }

  const eventsPath = locale === "az" ? "/tedbirler" : "/events";

  const breadcrumbs = [
    { label: locale === "az" ? "Ana səhifə" : "Home", href: "/" },
    { label: locale === "az" ? "Tədbirlər" : "Events", href: eventsPath },
    { label: event.title, href: "#" },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(
      locale === "az" ? "az-AZ" : "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );
  };

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      <article className="wrapper mx-auto px-4 py-6">
        {/* Cover Image */}
        {event.coverImage && (
          <div className="relative w-full max-w-4xl mx-auto h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden mb-8">
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        )}

        {/* Header */}
        <header className="mb-8 max-w-4xl mx-auto">
          {/* Category Badge */}
          <div className="flex items-center gap-3 mb-4">
            <span className="px-4 py-1.5 bg-primary text-white text-sm font-semibold rounded-full">
              {getEventCategoryName(event.category, locale)}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary mb-4 leading-tight">
            {event.title}
          </h1>

          {/* Excerpt */}
          {event.excerpt && (
            <p className="text-gray-600 text-lg mb-4 leading-relaxed">
              {event.excerpt}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 bg-gray-50 rounded-xl p-4">
            {event.eventDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary" />
                <time suppressHydrationWarning>{formatDate(event.eventDate)}</time>
              </div>
            )}
            {event.eventTime && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                <span>{event.eventTime}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{event.location}</span>
              </div>
            )}
            {event.views > 0 && (
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>{event.views} {locale === "az" ? "baxış" : "views"}</span>
              </div>
            )}
          </div>

          {/* Registration */}
          {event.registrationRequired && event.registrationLink && (
            <div className="mt-4 p-4 bg-primary/5 border-2 border-primary/20 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-secondary">
                    {locale === "az" ? "Qeydiyyat tələb olunur" : "Registration required"}
                  </p>
                  {event.capacity && (
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Users className="w-3.5 h-3.5" />
                      {locale === "az" ? `Tutum: ${event.capacity} nəfər` : `Capacity: ${event.capacity}`}
                    </p>
                  )}
                </div>
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
                >
                  {locale === "az" ? "Qeydiyyat" : "Register"}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </header>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {event.content && (
            <article className="prose prose-lg max-w-none">
              <div
                className="ProseMirror py-2 sm:text-base text-sm 
                  prose-headings:text-secondary prose-headings:font-bold
                  prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                  prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80
                  prose-img:rounded-xl prose-img:shadow-md prose-img:my-6 prose-img:mx-auto
                  prose-strong:text-secondary prose-strong:font-semibold
                  prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4
                  prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4
                  prose-li:mb-2 prose-li:text-gray-700"
                dangerouslySetInnerHTML={{ __html: event.content }}
              />
            </article>
          )}
        </div>

        {/* Back Button */}
        <div className="max-w-4xl mx-auto mt-10 pt-6 border-t border-gray-200">
          <Link
            href={eventsPath}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {locale === "az" ? "Bütün tədbirlər" : "All events"}
          </Link>
        </div>
      </article>
    </>
  );
}
