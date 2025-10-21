import { fetchAllRoutes } from '@/lib/api';

/**
 * Dynamic Sitemap Generator
 * Backend API-dən və ya menuData-dan bütün route-ları çəkib sitemap yaradır
 * Google indexləməsi üçün vacibdir
 */
export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bdu.info.az';
  
  // Fetch all routes from backend or fallback to menuData
  const routes = await fetchAllRoutes();
  
  // Static pages (home, contact, etc.)
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          az: baseUrl,
          en: `${baseUrl}/en`
        }
      }
    }
  ];
  
  // Dynamic pages from API/menuData
  const dynamicPages = routes.map((route) => {
    const isAzerbaijani = route.locale === 'az';
    const path = route.path.startsWith('/') ? route.path : `/${route.path}`;
    const url = isAzerbaijani ? `${baseUrl}${path}` : `${baseUrl}/en${path}`;
    
    // Generate alternate URLs for both languages
    const azPath = path;
    const enPath = path; // Backend should provide both if different
    
    return {
      url,
      lastModified: route.lastModified || new Date(),
      changeFrequency: route.changeFrequency || 'weekly',
      priority: route.priority || 0.7,
      alternates: {
        languages: {
          az: `${baseUrl}${azPath}`,
          en: `${baseUrl}/en${enPath}`
        }
      }
    };
  });
  
  return [...staticPages, ...dynamicPages];
}
