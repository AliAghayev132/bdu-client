/**
 * API helper functions for fetching dynamic menu/page data from backend
 * Backend inteqrasiyası üçün hazır struktur
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Fetch menu data from backend (menuData.js əvəzinə)
 * Backend-dən bütün menu strukturunu gətirir
 */
export async function fetchMenuData() {
  try {
    const res = await fetch(`${API_BASE_URL}/menu`, {
      next: { revalidate: 3600 } // 1 saat cache (ISR)
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch menu data');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching menu data:', error);
    // Fallback to local menuData if backend fails
    const { menuData } = await import('@/data/menuData');
    return menuData;
  }
}

/**
 * Fetch all routes for sitemap generation
 * Sitemap üçün bütün mövcud route-ları gətirir
 */
export async function fetchAllRoutes() {
  try {
    const res = await fetch(`${API_BASE_URL}/routes`, {
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch routes');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching routes:', error);
    // Fallback: extract routes from local menuData
    return extractRoutesFromMenuData();
  }
}

/**
 * Extract all routes from menuData structure
 * menuData-dan bütün route-ları çıxarır (fallback)
 */
async function extractRoutesFromMenuData() {
  const { menuData } = await import('@/data/menuData');
  const routes = [];
  
  function traverseMenu(items, locale) {
    for (const item of items) {
      if (item.href) {
        const href = typeof item.href === 'object' ? item.href[locale] : item.href;
        if (href && !routes.some(r => r.path === href && r.locale === locale)) {
          routes.push({
            path: href,
            locale,
            lastModified: new Date().toISOString(),
            changeFrequency: 'weekly',
            priority: 0.8
          });
        }
      }
      
      // Traverse subitems recursively
      if (item.subitems) {
        traverseMenu(item.subitems, locale);
      }
      
      // Traverse detail pages (hasDetail cards)
      if (item.items) {
        for (const cardItem of item.items) {
          if (cardItem.hasDetail) {
            const parentHref = typeof item.href === 'object' ? item.href[locale] : item.href;
            const detailPath = `${parentHref}/${cardItem.id}`;
            routes.push({
              path: detailPath,
              locale,
              lastModified: new Date().toISOString(),
              changeFrequency: 'monthly',
              priority: 0.6
            });
          }
        }
      }
    }
  }
  
  // Traverse all categories for both locales
  const locales = ['az', 'en'];
  for (const categoryKey in menuData) {
    const category = menuData[categoryKey];
    if (category.columns) {
      for (const locale of locales) {
        for (const column of category.columns) {
          traverseMenu(column.items, locale);
        }
      }
    }
  }
  
  return routes;
}

/**
 * Fetch page data by path (SSR/ISR)
 */
export async function fetchPageData(path, locale) {
  try {
    const res = await fetch(`${API_BASE_URL}/pages?path=${encodeURIComponent(path)}&locale=${locale}`, {
      next: { revalidate: 600 } // 10 dəqiqə cache
    });
    
    if (!res.ok) {
      return null;
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching page data:', error);
    return null;
  }
}
