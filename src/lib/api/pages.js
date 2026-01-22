/**
 * Pages API Helper Functions
 * Server-side fetch for dynamic page data
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * Get page by path
 * @param {string} path - Page path like /leadership or /rehberlik
 * @param {string} locale - az/en
 */
export async function getPageByPath(path, locale = "az") {
  try {
    // Normalize path - remove leading slash for URL
    const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
    
    const res = await fetch(`${API_URL}/misc/pages/path/${normalizedPath}?locale=${locale}`, {
      next: { revalidate: 3600 }, // 1 saat cache
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      console.error("Failed to fetch page by path:", res.status);
      return null;
    }

    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error("Error fetching page by path:", error);
    return null;
  }
}

/**
 * Get all pages
 * @param {string} locale - az/en
 * @param {number} limit - number of pages to fetch
 */
export async function getAllPages(locale = "az", limit = 50) {
  try {
    const res = await fetch(`${API_URL}/misc/pages?locale=${locale}&limit=${limit}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error("Failed to fetch pages:", res.status);
      return [];
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching pages:", error);
    return [];
  }
}

/**
 * Transform page data for frontend
 */
export function transformPageData(page, locale = "az") {
  if (!page) return null;

  return {
    id: page._id,
    path: page.path?.[locale] || page.path?.az || "",
    title: page.title?.[locale] || page.title?.az || "",
    description: page.description?.[locale] || page.description?.az || "",
    content: page.content?.[locale] || page.content?.az || "",
    pageType: page.pageType || "static",
    columns: page.columns || [],
    seo: {
      metaTitle: page.seo?.metaTitle?.[locale] || page.seo?.metaTitle?.az || "",
      metaDescription: page.seo?.metaDescription?.[locale] || page.seo?.metaDescription?.az || "",
      keywords: page.seo?.keywords || [],
      ogImage: page.seo?.ogImage || "",
    },
    publishedAt: page.publishedAt,
    author: page.author?.username || "",
  };
}
