"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Search, X, Newspaper, Calendar, Megaphone, Users, ArrowRight, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const IMG_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function SearchOverlay({ isOpen, onClose }) {
  const locale = useLocale();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);
  const debounceRef = useRef(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setAnimating(true);
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    } else {
      document.body.style.overflow = "";
      // Delay unmount for exit animation
      const timer = setTimeout(() => {
        setAnimating(false);
        setQuery("");
        setResults(null);
      }, 300);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Debounced search
  const handleSearch = useCallback(
    (value) => {
      setQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (value.trim().length < 2) {
        setResults(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      debounceRef.current = setTimeout(async () => {
        try {
          const res = await fetch(
            `${API_URL}/misc/search?q=${encodeURIComponent(value.trim())}&locale=${locale}&limit=5`
          );
          const data = await res.json();
          if (data.success) {
            setResults(data.data);
          }
        } catch (err) {
          console.error("Search error:", err);
        } finally {
          setLoading(false);
        }
      }, 350);
    },
    [locale]
  );

  if (!isOpen && !animating) return null;

  const hasResults =
    results &&
    (results.news?.length > 0 ||
      results.events?.length > 0 ||
      results.announcements?.length > 0 ||
      results.persons?.length > 0);

  const noResults = results && !hasResults && query.trim().length >= 2;

  return (
    <div
      className={`fixed inset-0 z-[9999] transition-all duration-500 ${
        isOpen
          ? "opacity-100"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-white/70 backdrop-blur-2xl"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-6 right-6 md:top-10 md:right-10 p-3 text-secondary/40 hover:text-secondary hover:bg-secondary/10 rounded-full transition-all duration-300 ${
            isOpen ? "scale-100 rotate-0" : "scale-0 rotate-90"
          }`}
          style={{ transitionDelay: isOpen ? "200ms" : "0ms" }}
        >
          <X size={28} />
        </button>

        {/* Search area */}
        <div className="flex-1 flex flex-col items-center justify-start pt-[12vh] md:pt-[15vh] px-4 overflow-y-auto pb-20">
          {/* Title */}
          <h2
            className={`text-secondary/60 text-sm md:text-base font-medium tracking-widest uppercase mb-8 transition-all duration-700 ${
              isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}
            style={{ transitionDelay: isOpen ? "100ms" : "0ms" }}
          >
            {locale === "az" ? "Saytda axtarış" : "Search the site"}
          </h2>

          {/* Search Input */}
          <div
            className={`w-full max-w-2xl transition-all duration-700 ${
              isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: isOpen ? "200ms" : "0ms" }}
          >
            <div className="relative group">
              <Search
                size={24}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/30 group-focus-within:text-secondary/60 transition-colors"
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={
                  locale === "az"
                    ? "Xəbər, tədbir, elan, şəxs axtar..."
                    : "Search news, events, announcements, people..."
                }
                className="w-full pl-14 pr-14 py-5 md:py-6 bg-white/60 border-2 border-secondary/15 rounded-2xl text-secondary text-lg md:text-xl placeholder-secondary/30 focus:outline-none focus:border-secondary/30 focus:bg-white/80 transition-all shadow-lg"
              />
              {loading && (
                <Loader2
                  size={22}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-secondary/40 animate-spin"
                />
              )}
              {!loading && query && (
                <button
                  onClick={() => handleSearch("")}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-secondary/30 hover:text-secondary/60 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          <div
            className={`w-full max-w-2xl mt-8 space-y-6 transition-all duration-500 ${
              hasResults || noResults
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            {/* No results */}
            {noResults && !loading && (
              <div className="text-center py-10">
                <Search size={48} className="mx-auto mb-4 text-secondary/15" />
                <p className="text-secondary/50 text-lg">
                  {locale === "az"
                    ? `"${query}" üçün nəticə tapılmadı`
                    : `No results found for "${query}"`}
                </p>
                <p className="text-secondary/30 text-sm mt-2">
                  {locale === "az"
                    ? "Fərqli açar sözlər yoxlayın"
                    : "Try different keywords"}
                </p>
              </div>
            )}

            {/* News */}
            {results?.news?.length > 0 && (
              <ResultSection
                icon={Newspaper}
                title={locale === "az" ? "Xəbərlər" : "News"}
                color="blue"
              >
                {results.news.map((item) => (
                  <ResultItem
                    key={item._id}
                    href={`/xeberler/${item.slug?.[locale] || item.slug?.az}`}
                    image={item.coverImage ? `${IMG_URL}${item.coverImage}` : null}
                    title={item.title?.[locale] || item.title?.az}
                    subtitle={item.excerpt?.[locale] || item.excerpt?.az}
                    meta={item.publishedAt ? new Date(item.publishedAt).toLocaleDateString(locale === "az" ? "az-AZ" : "en-US") : null}
                    onClose={onClose}
                  />
                ))}
              </ResultSection>
            )}

            {/* Events */}
            {results?.events?.length > 0 && (
              <ResultSection
                icon={Calendar}
                title={locale === "az" ? "Tədbirlər" : "Events"}
                color="purple"
              >
                {results.events.map((item) => (
                  <ResultItem
                    key={item._id}
                    href={`/tedbirler/${item.slug?.[locale] || item.slug?.az}`}
                    image={item.coverImage ? `${IMG_URL}${item.coverImage}` : null}
                    title={item.title?.[locale] || item.title?.az}
                    subtitle={item.location?.[locale] || item.location?.az}
                    meta={item.eventDate ? new Date(item.eventDate).toLocaleDateString(locale === "az" ? "az-AZ" : "en-US") : null}
                    onClose={onClose}
                  />
                ))}
              </ResultSection>
            )}

            {/* Announcements */}
            {results?.announcements?.length > 0 && (
              <ResultSection
                icon={Megaphone}
                title={locale === "az" ? "Elanlar" : "Announcements"}
                color="amber"
              >
                {results.announcements.map((item) => (
                  <ResultItem
                    key={item._id}
                    href={`/elanlar/${item.slug?.[locale] || item.slug?.az || item._id}`}
                    title={item.title?.[locale] || item.title?.az}
                    meta={item.startDate ? new Date(item.startDate).toLocaleDateString(locale === "az" ? "az-AZ" : "en-US") : null}
                    onClose={onClose}
                  />
                ))}
              </ResultSection>
            )}

            {/* Persons */}
            {results?.persons?.length > 0 && (
              <ResultSection
                icon={Users}
                title={locale === "az" ? "Rəhbərlik" : "Leadership"}
                color="emerald"
              >
                {results.persons.map((item) => (
                  <ResultItem
                    key={item._id}
                    href={`/rehberlik/${item.slug?.[locale] || item.slug?.az}`}
                    image={item.image ? `${IMG_URL}${item.image}` : null}
                    title={item.name?.[locale] || item.name?.az}
                    subtitle={item.position?.[locale] || item.position?.az}
                    rounded
                    onClose={onClose}
                  />
                ))}
              </ResultSection>
            )}
          </div>

          {/* Quick links when no query */}
          {!query && (
            <div
              className={`w-full max-w-2xl mt-12 transition-all duration-700 ${
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: isOpen ? "400ms" : "0ms" }}
            >
              <p className="text-secondary/30 text-xs uppercase tracking-widest text-center mb-6">
                {locale === "az" ? "Populyar bölmələr" : "Popular sections"}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { label: locale === "az" ? "Xəbərlər" : "News", href: "/xeberler", icon: Newspaper },
                  { label: locale === "az" ? "Tədbirlər" : "Events", href: "/tedbirler", icon: Calendar },
                  { label: locale === "az" ? "Elanlar" : "Announcements", href: "/elanlar", icon: Megaphone },
                  { label: locale === "az" ? "Rəhbərlik" : "Leadership", href: "/rehberlik", icon: Users },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-2 px-5 py-2.5 bg-secondary/5 border border-secondary/10 rounded-xl text-secondary/50 hover:text-secondary hover:bg-secondary/10 hover:border-secondary/20 transition-all text-sm"
                  >
                    <item.icon size={16} />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultSection({ icon: Icon, title, color, children }) {
  const colorMap = {
    blue: "text-blue-600 bg-blue-50 border-blue-200",
    purple: "text-purple-600 bg-purple-50 border-purple-200",
    amber: "text-amber-600 bg-amber-50 border-amber-200",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-200",
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-1.5 rounded-lg border ${colorMap[color]}`}>
          <Icon size={14} />
        </div>
        <h3 className="text-secondary/60 text-sm font-semibold uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function ResultItem({ href, image, title, subtitle, meta, rounded, onClose }) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-secondary/5 transition-all group"
    >
      {image && (
        <div
          className={`w-12 h-12 flex-shrink-0 overflow-hidden bg-secondary/10 ${
            rounded ? "rounded-full" : "rounded-lg"
          }`}
        >
          <img
            src={image}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-secondary font-medium truncate group-hover:text-primary transition-colors">
          {title}
        </p>
        {subtitle && (
          <p className="text-secondary/40 text-sm truncate">{subtitle}</p>
        )}
      </div>
      {meta && (
        <span className="text-secondary/30 text-xs flex-shrink-0">{meta}</span>
      )}
      <ArrowRight
        size={16}
className="text-secondary/20 group-hover:text-secondary/50 group-hover:translate-x-1 transition-all flex-shrink-0"
      />
    </Link>
  );
}
