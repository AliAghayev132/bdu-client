"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Calendar, MapPin, Clock } from "lucide-react";

const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

export default function EventsSwiper({ events = [] }) {
  const locale = useLocale();
  const t = useTranslations("home");

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi, onSelect]);

  if (!events.length) return null;

  const eventsPath = locale === "az" ? "/tedbirler" : "/events";

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "az" ? "az-AZ" : "en-US", {
      day: "numeric",
      month: "short",
    });
  };

  const formatDay = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).getDate();
  };

  const formatMonth = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(locale === "az" ? "az-AZ" : "en-US", {
      month: "short",
    });
  };

  const getCategoryLabel = (category) => {
    const labels = {
      conference: locale === "az" ? "Konfrans" : "Conference",
      seminar: locale === "az" ? "Seminar" : "Seminar",
      workshop: locale === "az" ? "Emalatxana" : "Workshop",
      ceremony: locale === "az" ? "Mərasim" : "Ceremony",
      competition: locale === "az" ? "Müsabiqə" : "Competition",
      other: locale === "az" ? "Tədbir" : "Event",
    };
    return labels[category] || labels.other;
  };

  return (
    <section className="lg:py-10 md:py-8 sm:py-6 py-4 bg-white">
      <div className="wrapper">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="md:text-2xl sm:text-xl text-lg font-bold text-secondary">
            {t("events.title", { default: locale === "az" ? "TƏDBİRLƏR" : "EVENTS" })}
          </h2>

          <div className="flex items-center gap-3">
            {/* Navigation Arrows */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className="p-2 rounded-lg border border-secondary/20 text-secondary hover:bg-secondary hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-secondary transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={scrollNext}
                disabled={!canScrollNext}
                className="p-2 rounded-lg border border-secondary/20 text-secondary hover:bg-secondary hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-secondary transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <Link
              href={eventsPath}
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              {locale === "az" ? "Hamısına bax →" : "View all →"}
            </Link>
          </div>
        </div>

        {/* Embla Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {events.map((event) => {
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
                <div
                  key={event._id}
                  className="flex-shrink-0 w-[300px] sm:w-[340px] lg:w-[360px]"
                >
                  <Link
                    href={`${eventsPath}/${slug}`}
                    className="group block bg-white border-2 border-secondary/10 rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Cover Image */}
                    <div className="relative h-44 overflow-hidden">
                      {coverImage ? (
                        <Image
                          src={coverImage}
                          alt={title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <Calendar className="w-10 h-10 text-secondary/30" />
                        </div>
                      )}

                      {/* Date Badge */}
                      <div className="absolute top-3 left-3 bg-white rounded-lg shadow-md px-3 py-1.5 text-center min-w-[52px]">
                        <div className="text-xl font-bold text-secondary leading-none">
                          {formatDay(event.eventDate)}
                        </div>
                        <div className="text-[10px] uppercase font-semibold text-primary mt-0.5">
                          {formatMonth(event.eventDate)}
                        </div>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 bg-secondary/80 text-white text-[10px] font-medium rounded-full uppercase tracking-wide">
                          {getCategoryLabel(event.category)}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-secondary group-hover:text-primary transition-colors line-clamp-2 mb-2 leading-snug">
                        {title}
                      </h3>

                      {excerpt && (
                        <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                          {excerpt}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-[11px] text-gray-400">
                        {event.eventTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{event.eventTime}</span>
                          </div>
                        )}
                        {location && (
                          <div className="flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
