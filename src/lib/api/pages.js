/**
 * Pages API Helper Functions
 * Dinamik səhifə data fetching
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * Path ilə səhifə gətir (multi-segment dəstəkləyir: /rehberlik, /a/b/c)
 */
export async function getPageByPath(path, locale = "az") {
  try {
    const cleanPath = path.startsWith("/") ? path.substring(1) : path;

    const res = await fetch(`${API_URL}/misc/pages/path/${cleanPath}?locale=${locale}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error("Error fetching page by path:", error);
    return null;
  }
}

/**
 * Bütün səhifələri gətir
 */
export async function getAllPages(locale = "az", limit = 50) {
  try {
    const res = await fetch(`${API_URL}/misc/pages?locale=${locale}&limit=${limit}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching pages:", error);
    return [];
  }
}

/**
 * Səhifə datasını frontend üçün transform et
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
