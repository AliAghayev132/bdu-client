/**
 * Events API Helper Functions
 * Server-side fetch üçün helper functions
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * Yaxınlaşan tədbirləri gətir (homepage swiper üçün)
 */
export async function getUpcomingEvents(locale = "az", limit = 10) {
  try {
    const res = await fetch(
      `${API_URL}/misc/events/upcoming?locale=${locale}&limit=${limit}`,
      {
        next: { revalidate: 180 },
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch upcoming events:", res.status);
      return [];
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return [];
  }
}

/**
 * Bütün tədbirləri gətir (list page üçün)
 */
export async function getAllEvents(locale = "az", page = 1, limit = 12, category = "all") {
  try {
    let url = `${API_URL}/misc/events?locale=${locale}&page=${page}&limit=${limit}`;
    if (category && category !== "all") {
      url += `&category=${category}`;
    }

    const res = await fetch(url, {
      next: { revalidate: 180 },
    });

    if (!res.ok) {
      console.error("Failed to fetch events:", res.status);
      return { events: [], pagination: null };
    }

    const data = await res.json();
    return {
      events: data.data || [],
      pagination: data.pagination || null,
    };
  } catch (error) {
    console.error("Error fetching events:", error);
    return { events: [], pagination: null };
  }
}

/**
 * Slug-a görə tədbir gətir (detail page üçün)
 */
export async function getEventBySlug(slug, locale = "az") {
  try {
    const res = await fetch(
      `${API_URL}/misc/events/${slug}?locale=${locale}`,
      {
        next: { revalidate: 180 },
      }
    );

    if (!res.ok) {
      if (res.status === 404) return null;
      console.error("Failed to fetch event by slug:", res.status);
      return null;
    }

    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error("Error fetching event by slug:", error);
    return null;
  }
}

/**
 * Backend event data-nı frontend formatına çevir
 */
export function transformEventItem(item, locale = "az") {
  if (!item) return null;

  const altLocale = locale === "az" ? "en" : "az";
  const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

  return {
    id: item._id,
    title: item.title?.[locale] || item.title?.az || "",
    slug: item.slug?.[locale] || item.slug?.az || "",
    alternateSlug: item.slug?.[altLocale] || item.slug?.az || "",
    excerpt: item.excerpt?.[locale] || item.excerpt?.az || "",
    content: item.content?.[locale] || item.content?.az || "",
    coverImage: item.coverImage ? (item.coverImage.startsWith("http") ? item.coverImage : `${IMAGE_URL}${item.coverImage}`) : "",
    eventDate: item.eventDate,
    eventTime: item.eventTime || "",
    location: item.location?.[locale] || item.location?.az || "",
    organizer: item.organizer?.[locale] || item.organizer?.az || "",
    category: item.category || "other",
    tags: item.tags || [],
    views: item.views || 0,
    registrationRequired: item.registrationRequired || false,
    registrationLink: item.registrationLink || "",
    capacity: item.capacity || null,
    publishedAt: item.publishedAt || item.createdAt,
    seo: {
      metaTitle: item.seo?.metaTitle?.[locale] || "",
      metaDescription: item.seo?.metaDescription?.[locale] || "",
      keywords: item.seo?.keywords || [],
    },
  };
}

/**
 * Events array-ı transform et
 */
export function transformEventsArray(eventsArray, locale = "az") {
  if (!Array.isArray(eventsArray)) return [];
  return eventsArray.map((item) => transformEventItem(item, locale));
}

/**
 * Tədbir kateqoriya adı
 */
export function getEventCategoryName(category, locale = "az") {
  const names = {
    conference: { az: "Konfrans", en: "Conference" },
    seminar: { az: "Seminar", en: "Seminar" },
    workshop: { az: "Emalatxana", en: "Workshop" },
    ceremony: { az: "Mərasim", en: "Ceremony" },
    competition: { az: "Müsabiqə", en: "Competition" },
    other: { az: "Digər", en: "Other" },
  };
  return names[category]?.[locale] || names.other[locale];
}
