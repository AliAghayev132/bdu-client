/**
 * News API Helper Functions
 * Server-side fetch üçün helper functions
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * Ən son xəbərləri gətir (home page üçün)
 * @param {string} locale - az/en
 * @param {number} limit - xəbər sayı
 */
export async function getLatestNews(locale = "az", limit = 6) {
  try {
    const res = await fetch(
      `${API_URL}/news/latest?locale=${locale}&limit=${limit}`,
      {
        next: { revalidate: 300 }, // 5 dəqiqə cache
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch latest news:", res.status);
      return [];
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching latest news:", error);
    return [];
  }
}

/**
 * Bütün xəbərləri gətir (list page üçün)
 * @param {string} locale - az/en
 * @param {number} page - səhifə nömrəsi
 * @param {number} limit - xəbər sayı
 * @param {string} category - kateqoriya filter
 */
export async function getAllNews(
  locale = "az",
  page = 1,
  limit = 20,
  category = null
) {
  try {
    let url = `${API_URL}/news?locale=${locale}&page=${page}&limit=${limit}`;
    if (category) {
      url += `&category=${category}`;
    }

    const res = await fetch(url, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.error("Failed to fetch news:", res.status);
      return { news: [], pagination: null };
    }

    const data = await res.json();
    return {
      news: data.data || [],
      pagination: data.pagination || null,
    };
  } catch (error) {
    console.error("Error fetching news:", error);
    return { news: [], pagination: null };
  }
}

/**
 * Slug-a görə tək xəbər gətir (detail page üçün)
 * @param {string} slug - xəbər slug-ı
 * @param {string} locale - az/en
 */
export async function getNewsBySlug(slug, locale = "az") {
  try {
    const res = await fetch(`${API_URL}/news/${slug}?locale=${locale}`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      console.error("Failed to fetch news by slug:", res.status);
      return null;
    }

    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error("Error fetching news by slug:", error);
    return null;
  }
}

/**
 * Backend news data-nı frontend formatına çevir
 * @param {object} newsItem - backend news object
 * @param {string} locale - az/en
 */
export function transformNewsItem(newsItem, locale = "az") {
  if (!newsItem) return null;

  return {
    id: newsItem._id,
    title: newsItem.title?.[locale] || newsItem.title?.az || "",
    slug: newsItem.slug?.[locale] || newsItem.slug?.az || "",
    excerpt: newsItem.excerpt?.[locale] || newsItem.excerpt?.az || "",
    content: newsItem.content?.[locale] || newsItem.content?.az || "",
    image: newsItem.coverImage || null,
    date: newsItem.publishedAt || newsItem.createdAt,
    category: newsItem.category || "other",
    views: newsItem.views || 0,
    author: newsItem.author?.username || null,
    seo: {
      metaTitle:
        newsItem.seo?.metaTitle?.[locale] || newsItem.title?.[locale] || "",
      metaDescription:
        newsItem.seo?.metaDescription?.[locale] ||
        newsItem.excerpt?.[locale] ||
        "",
      keywords: newsItem.seo?.keywords || [],
    },
  };
}

/**
 * News array-ı transform et
 */
export function transformNewsArray(newsArray, locale = "az") {
  if (!Array.isArray(newsArray)) return [];
  return newsArray.map((item) => transformNewsItem(item, locale));
}
