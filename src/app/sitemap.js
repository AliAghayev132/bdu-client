import { menuData, bottomNavItems } from "@/data/menuData";

/**
 * Dynamic Sitemap Generator
 * Backend API-dən və ya menuData-dan bütün route-ları çəkib sitemap yaradır
 * Google indexləməsi üçün vacibdir
 */
function collectLinksFromMenu() {
  const pairs = [];

  const pushPair = (hrefObj) => {
    if (!hrefObj || typeof hrefObj !== "object") return;
    const az = hrefObj.az;
    const en = hrefObj.en;
    if (az || en) pairs.push({ az, en });
  };

  const walkItems = (items) => {
    if (!Array.isArray(items)) return;
    for (const item of items) {
      if (item?.href) pushPair(item.href);
      if (item?.subitems) walkItems(item.subitems);
      if (item?.items) walkItems(item.items); // some nodes use 'items' as nested lists
    }
  };

  for (const key in menuData) {
    const category = menuData[key];
    if (!category?.columns) continue;
    for (const col of category.columns) {
      if (col?.items) walkItems(col.items);
    }
  }

  for (const bn of bottomNavItems) {
    if (bn?.href) pushPair(bn.href);
  }

  // de-duplicate by pair signature
  const uniq = new Map();
  for (const p of pairs) {
    const key = `${p.az || ""}|${p.en || ""}`;
    uniq.set(key, p);
  }
  return Array.from(uniq.values());
}

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bdu.info.az";

  // Static pages (home and important landing pages)
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
      alternates: { languages: { az: baseUrl, en: `${baseUrl}/en` } },
    },
    {
      url: `${baseUrl}/elaqe`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: { az: `${baseUrl}/elaqe`, en: `${baseUrl}/en/contact` } },
    },
    {
      url: `${baseUrl}/telebeler-ucun`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: { languages: { az: `${baseUrl}/telebeler-ucun`, en: `${baseUrl}/en/for-students` } },
    },
  ];

  // Dynamic pages derived from menuData and bottomNavItems
  const menuPairs = collectLinksFromMenu();
  const dynamicPages = menuPairs.map(({ az, en }) => {
    const url = `${baseUrl}${az || en || ""}`;
    return {
      url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: {
        languages: {
          ...(az ? { az: `${baseUrl}${az}` } : {}),
          ...(en ? { en: `${baseUrl}${en}` } : {}),
        },
      },
    };
  });

  return [...staticPages, ...dynamicPages];
}
