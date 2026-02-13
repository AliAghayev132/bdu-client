/**
 * Announcements API Helper Functions
 * Server-side fetch üçün helper functions
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * Aktiv elanları gətir (home page sidebar üçün)
 * @param {string} locale - az/en
 */
export async function getActiveAnnouncements(locale = "az") {
  try {
    const res = await fetch(
      `${API_URL}/misc/announcements/active?locale=${locale}`,
      {
        next: { revalidate: 180 }, // 3 dəqiqə cache
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch active announcements:", res.status);
      return [];
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching active announcements:", error);
    return [];
  }
}

/**
 * Bütün elanları gətir (list page üçün)
 * @param {string} locale - az/en
 * @param {number} page - səhifə nömrəsi
 * @param {number} limit - elan sayı
 * @param {string} type - elan tipi (info, warning, urgent, event, academic, other)
 */
export async function getAllAnnouncements(
  locale = "az",
  page = 1,
  limit = 20,
  type = "all"
) {
  try {
    let url = `${API_URL}/misc/announcements?locale=${locale}&page=${page}&limit=${limit}`;
    if (type && type !== "all") {
      url += `&type=${type}`;
    }

    const res = await fetch(url, {
      next: { revalidate: 180 },
    });

    if (!res.ok) {
      console.error("Failed to fetch announcements:", res.status);
      return { announcements: [], pagination: null };
    }

    const data = await res.json();
    return {
      announcements: data.data || [],
      pagination: data.pagination || null,
    };
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return { announcements: [], pagination: null };
  }
}

/**
 * Slug-a görə tək elan gətir (detail page üçün)
 * @param {string} slug - elan slug-ı
 * @param {string} locale - az/en
 */
export async function getAnnouncementBySlug(slug, locale = "az") {
  try {
    const res = await fetch(
      `${API_URL}/misc/announcements/${slug}?locale=${locale}`,
      {
        next: { revalidate: 180 },
      }
    );

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      console.error("Failed to fetch announcement by slug:", res.status);
      return null;
    }

    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error("Error fetching announcement by slug:", error);
    return null;
  }
}

/**
 * ID-yə görə tək elan gətir
 * @param {string} id - elan ID-si
 * @param {string} locale - az/en
 */
export async function getAnnouncementById(id, locale = "az") {
  try {
    const res = await fetch(
      `${API_URL}/misc/announcements/id/${id}?locale=${locale}`,
      {
        next: { revalidate: 180 },
      }
    );

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      console.error("Failed to fetch announcement by id:", res.status);
      return null;
    }

    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error("Error fetching announcement by id:", error);
    return null;
  }
}

/**
 * Backend announcement data-nı frontend formatına çevir
 * @param {object} item - backend announcement object
 * @param {string} locale - az/en
 */
export function transformAnnouncementItem(item, locale = "az") {
  if (!item) return null;

  const altLocale = locale === "az" ? "en" : "az";

  const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

  return {
    id: item._id,
    title: item.title?.[locale] || item.title?.az || "",
    slug: item.slug?.[locale] || item.slug?.az || "",
    // Alternativ dil üçün slug (dil dəyişdirəndə istifadə olunur)
    alternateSlug: item.slug?.[altLocale] || item.slug?.az || "",
    content: item.content?.[locale] || item.content?.az || "",
    coverImage: item.coverImage ? (item.coverImage.startsWith("http") ? item.coverImage : `${IMAGE_URL}${item.coverImage}`) : "",
    type: item.type || "info",
    priority: item.priority || "medium",
    startDate: item.startDate,
    endDate: item.endDate,
    targetAudience: item.targetAudience || ["all"],
    attachments: item.attachments || [],
    isPinned: item.isPinned || false,
    views: item.views || 0,
    publishedAt: item.publishedAt || item.createdAt,
  };
}

/**
 * Announcements array-ı transform et
 */
export function transformAnnouncementsArray(announcementsArray, locale = "az") {
  if (!Array.isArray(announcementsArray)) return [];
  return announcementsArray.map((item) =>
    transformAnnouncementItem(item, locale)
  );
}

/**
 * Elan tipi rəngi
 */
export function getAnnouncementTypeColor(type) {
  const colors = {
    info: "#3B82F6", // blue
    warning: "#F59E0B", // amber
    urgent: "#EF4444", // red
    event: "#10B981", // green
    academic: "#8B5CF6", // purple
    other: "#6B7280", // gray
  };
  return colors[type] || colors.info;
}

/**
 * Elan tipi adı
 */
export function getAnnouncementTypeName(type, locale = "az") {
  const names = {
    info: { az: "Məlumat", en: "Info" },
    warning: { az: "Xəbərdarlıq", en: "Warning" },
    urgent: { az: "Təcili", en: "Urgent" },
    event: { az: "Tədbir", en: "Event" },
    academic: { az: "Tədris", en: "Academic" },
    other: { az: "Digər", en: "Other" },
  };
  return names[type]?.[locale] || names.info[locale];
}
