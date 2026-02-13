/**
 * Home Page API Helper Functions
 * Server-side fetch üçün helper functions
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * Ana səhifə datasını gətir (slides, prides)
 */
export async function getHomePageData() {
  try {
    const res = await fetch(`${API_URL}/misc/home`, {
      next: { revalidate: 300 }, // 5 dəqiqə cache
    });

    if (!res.ok) {
      console.error("Failed to fetch home page data:", res.status);
      return null;
    }

    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error("Error fetching home page data:", error);
    return null;
  }
}
