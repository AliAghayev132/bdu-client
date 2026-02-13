/**
 * Menu API Helper Functions
 * Server-side fetch for mega menu data
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * Get all mega menu categories
 */
export async function getAllMenus() {
  try {
    const res = await fetch(`${API_URL}/misc/menu`, {
      next: { revalidate: 60 }, // 1 dəqiqə cache
    });

    if (!res.ok) {
      console.error("Failed to fetch menus:", res.status);
      return {};
    }

    const data = await res.json();
    return data.data || {};
  } catch (error) {
    console.error("Error fetching menus:", error);
    return {};
  }
}

/**
 * Get menu by ID
 * @param {string} id - menu category ID (university, education, etc.)
 */
export async function getMenuById(id) {
  try {
    const res = await fetch(`${API_URL}/misc/menu/${id}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error(`Failed to fetch menu ${id}:`, res.status);
      return null;
    }

    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error(`Error fetching menu ${id}:`, error);
    return null;
  }
}

/**
 * Get only mega type menus
 */
export async function getMegaMenus() {
  try {
    const allMenus = await getAllMenus();
    
    // Filter only mega type menus
    const megaMenus = {};
    Object.keys(allMenus).forEach(key => {
      if (allMenus[key].type === 'mega') {
        megaMenus[key] = allMenus[key];
      }
    });

    return megaMenus;
  } catch (error) {
    console.error("Error fetching mega menus:", error);
    return {};
  }
}
