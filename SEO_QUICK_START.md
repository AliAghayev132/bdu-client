# 🚀 SEO Quick Start Guide

## Nə Edildi?

### ✅ Frontend (Hazır)
1. **Server Components** - Bütün səhifələr SSR/ISR
2. **Dynamic Sitemap** - `/sitemap.xml`
3. **Robots.txt** - `/robots.txt`
4. **Metadata** - Title, Description, Hreflang, OG tags
5. **Structured Data** - JSON-LD schema.org
6. **Locale Navigation** - `@/i18n/routing` Link

### 🔄 Backend (Tələb olunur)
Backend API yaratmalısan:

**Endpoint 1:** `GET /api/menu`
```json
{
  "university": {
    "id": "university",
    "columns": [...]
  }
}
```

**Endpoint 2:** `GET /api/routes`
```json
[
  {
    "path": "/university/history",
    "locale": "az",
    "lastModified": "2025-01-21T10:00:00Z"
  }
]
```

Ətraflı: `BACKEND_API_GUIDE.md`

## Environment Setup

`.env.local` yarat:
```env
NEXT_PUBLIC_SITE_URL=https://bdu.info.az
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Test

```bash
# Build
npm run build

# Start
npm run start

# Yoxla
# Sitemap: http://localhost:3000/sitemap.xml
# Robots: http://localhost:3000/robots.txt
```

## Google Search Console

1. Site əlavə et: https://search.google.com/search-console
2. Sitemap göndər: `https://bdu.info.az/sitemap.xml`
3. 2-3 həftə gözlə (indexləmə)

## Nəticə

✅ **Google bu səhifələri indexləyəcək:**
- Server-render edilmiş HTML
- Sitemap-də qeyd olunmuş URL-lər
- Hreflang ilə hər iki dil
- Structured data ilə zəngin nəticələr

📊 **Performance:**
- ISR cache: 10 dəqiqə
- Backend cache: 1 saat
- CDN cache: 24 saat (tövsiyə)

🎯 **SEO Score:**
- Metadata: ✅
- Mobile-friendly: ✅
- Page Speed: ⚡ (optimizasiya olunub)
- Structured Data: ✅
- Hreflang: ✅

---

**Suallar?** `SEO_IMPLEMENTATION.md` və `BACKEND_API_GUIDE.md` oxu
