/**
 * Persons API Helper Functions
 * Slug əsaslı axtarış — backend hər iki dildə (az/en) slug axtarır
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * Bütün şəxsləri gətir
 */
export async function getAllPersons(locale = "az", category = null) {
  try {
    let url = `${API_URL}/misc/persons?locale=${locale}`;
    if (category) url += `&category=${category}`;

    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching persons:", error);
    return [];
  }
}

/**
 * Slug ilə şəxs gətir — backend hər iki dildə axtarır
 */
export async function getPersonBySlug(slug, locale = "az") {
  try {
    const res = await fetch(`${API_URL}/misc/persons/${slug}?locale=${locale}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error("Error fetching person by slug:", error);
    return null;
  }
}
