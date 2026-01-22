/**
 * Persons API Helper Functions
 * Server-side fetch for person/leadership data
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * Get all persons
 * @param {string} locale - az/en
 * @param {string} category - leadership/faculty/staff
 */
export async function getAllPersons(locale = "az", category = null) {
  try {
    let url = `${API_URL}/misc/persons?locale=${locale}`;
    if (category) {
      url += `&category=${category}`;
    }

    const res = await fetch(url, {
      next: { revalidate: 3600 }, // 1 saat cache
    });

    if (!res.ok) {
      console.error("Failed to fetch persons:", res.status);
      return [];
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching persons:", error);
    return [];
  }
}

/**
 * Get person by slug
 * @param {string} slug - person slug
 * @param {string} locale - az/en
 */
export async function getPersonBySlug(slug, locale = "az") {
  try {
    const res = await fetch(`${API_URL}/misc/persons/${slug}?locale=${locale}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      console.error("Failed to fetch person by slug:", res.status);
      return null;
    }

    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error("Error fetching person by slug:", error);
    return null;
  }
}

/**
 * Transform person data for frontend
 */
export function transformPersonItem(person, locale = "az") {
  if (!person) return null;

  return {
    id: person._id,
    slug: person.slug?.[locale] || person.slug?.az || "",
    name: person.name?.[locale] || person.name?.az || "",
    position: person.position?.[locale] || person.position?.az || "",
    image: person.image || null,
    phone: person.phone || "",
    email: person.email || "",
    bio: person.bio?.[locale] || person.bio?.az || "",
    education: person.education || [],
    experience: person.experience || [],
    awards: person.awards || [],
    publications: person.publications || [],
    socialLinks: person.socialLinks || {},
    category: person.category || "leadership",
    order: person.order || 0,
  };
}
