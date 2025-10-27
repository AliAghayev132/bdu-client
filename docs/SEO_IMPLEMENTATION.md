# 🚀 BDU SEO İmplementasiyası

Bu sənəd BDU saytında tətbiq edilmiş SEO optimizasiyalarını və backend inteqrasiya strategiyasını izah edir.

## ✅ Tətbiq Edilmiş Optimizasiyalar

### 1. **Server Components (SSR/ISR)**
- ✅ Bütün səhifələr server-side render edilir
- ✅ ISR (Incremental Static Regeneration) aktiv: `revalidate = 600` (10 dəqiqə)
- ✅ `generateStaticParams()` ilə əsas səhifələr build zamanı pre-render edilir

**Fayl:** `src/app/(routes)/[locale]/[category]/[...slug]/page.js`

```javascript
export const revalidate = 600; // ISR - hər 10 dəqiqə yenilə
```

### 2. **Dynamic Sitemap**
- ✅ Backend API-dən və ya menuData-dan avtomatik sitemap generasiyası
- ✅ Hər iki dil üçün URL-lər (az, en)
- ✅ Hreflang alternates dəstəyi
- ✅ Priority və changeFrequency parametrləri

**Fayl:** `src/app/sitemap.js`

**Test:** `http://localhost:3000/sitemap.xml`

### 3. **Robots.txt**
- ✅ Dinamik robots.txt generasiyası
- ✅ Sitemap referansı
- ✅ Crawl qaydaları

**Fayl:** `src/app/robots.js`

**Test:** `http://localhost:3000/robots.txt`

### 4. **Metadata & Hreflang**
Hər səhifə üçün tam SEO metadata:
- ✅ Title & Description
- ✅ Keywords
- ✅ Canonical URL
- ✅ Hreflang alternates (az, en, x-default)
- ✅ Open Graph tags (Facebook, LinkedIn)
- ✅ Twitter Card
- ✅ Robots directives

**Nümunə HTML output:**
```html
<link rel="canonical" href="https://bdu.edu.az/university/history" />
<link rel="alternate" hreflang="az" href="https://bdu.edu.az/university/history" />
<link rel="alternate" hreflang="en" href="https://bdu.edu.az/en/university/history" />
<link rel="alternate" hreflang="x-default" href="https://bdu.edu.az/university/history" />
```

### 5. **Structured Data (JSON-LD)**
Google üçün schema.org structured data:
- ✅ Organization schema (BDU məlumatları)
- ✅ BreadcrumbList schema (naviqasiya)
- ✅ Person schema (rəhbərlik, əməkdaşlar)
- ✅ Article schema (məqalələr, xəbərlər)

**Fayl:** `src/components/seo/StructuredData.jsx`

**Test:** [Google Rich Results Test](https://search.google.com/test/rich-results)

### 6. **Locale-Aware Navigation**
- ✅ Bütün daxili linklər `@/i18n/routing` `Link` komponenti istifadə edir
- ✅ HMR zamanı locale itməsinin qarşısı alınır
- ✅ Avtomatik locale prefix qurulması

**Yenilənmiş komponentlər:**
- `SideBar.jsx`
- `CardsGrid.jsx`
- `SubPagesGrid.jsx`
- `Breadcrumbs.jsx`

### 7. **Backend API İnteqrasiyası**
Backend-dən dinamik məlumat çəkmək üçün hazır struktur:

**Fayl:** `src/lib/api.js`

**Funksiyalar:**
- `fetchMenuData()` - Menu strukturu
- `fetchAllRoutes()` - Sitemap üçün route-lar
- `fetchPageData()` - Səhifə məlumatları

**Fallback:** Backend əlçatmaz olduqda lokal `menuData.js` istifadə olunur.

## 📊 Backend API Tələbləri

### Endpoint-lər

1. **GET /api/menu**
   - Menu strukturu (bütün səhifələr, subitems, content)
   - Cache: 1 saat

2. **GET /api/routes**
   - Sitemap üçün bütün route-lar
   - Hər iki dil üçün
   - Cache: 1 saat

3. **GET /api/pages?path=...&locale=...**
   - Konkret səhifə məlumatı
   - Cache: 10 dəqiqə

Ətraflı məlumat: `BACKEND_API_GUIDE.md`

## 🔧 Environment Variables

`.env.local` faylı yaradın:

```env
NEXT_PUBLIC_SITE_URL=https://bdu.info.az
NEXT_PUBLIC_API_URL=http://localhost:3001/api
REVALIDATE_TIME=600
```

Production üçün `.env.production`:

```env
NEXT_PUBLIC_SITE_URL=https://bdu.info.az
NEXT_PUBLIC_API_URL=https://api.bdu.info.az/api
REVALIDATE_TIME=600
```

## 🚀 Deployment

### 1. Build
```bash
npm run build
```

### 2. Test Local
```bash
npm run start
```

### 3. Yoxlama
- Sitemap: `http://localhost:3000/sitemap.xml`
- Robots: `http://localhost:3000/robots.txt`
- Metadata: View Page Source və `<head>` bölməsinə baxın

### 4. Production Deploy
```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod

# Custom server
pm2 start npm --name "bdu-frontend" -- start
```

## 📈 Google Search Console Setup

### 1. Site Əlavə Et
1. [Google Search Console](https://search.google.com/search-console)-a daxil ol
2. Property əlavə et: `https://bdu.info.az`
3. Domain verification (DNS TXT record)

### 2. Sitemap Göndər
1. Sitemaps → Add new sitemap
2. URL: `https://bdu.info.az/sitemap.xml`
3. Submit

### 3. Hreflang Yoxla
1. Settings → International Targeting
2. Hreflang tags-ı yoxla
3. URL Inspection ilə test et

### 4. Core Web Vitals Monitor
1. Experience → Core Web Vitals
2. Performance məlumatlarını izlə

## 🎯 Performance Checklist

- [x] Server Components (SSR)
- [x] ISR (Incremental Static Regeneration)
- [x] Image Optimization (next/image)
- [x] Dynamic Sitemap
- [x] Robots.txt
- [x] Metadata (Title, Description, Keywords)
- [x] Canonical URLs
- [x] Hreflang Alternates
- [x] Open Graph Tags
- [x] Twitter Cards
- [x] Structured Data (JSON-LD)
- [x] Locale-aware Navigation
- [x] Backend API Integration
- [ ] Redis Cache (Backend)
- [ ] CDN Setup (Cloudflare/AWS)
- [ ] Image WebP Conversion (Backend)

## 🔍 SEO Testing Tools

### Metadata & Tags
- [Meta Tags Checker](https://metatags.io/)
- [Open Graph Debugger](https://www.opengraph.xyz/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### Structured Data
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)

### Performance
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

### Mobile
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

### Hreflang
- [Hreflang Tags Testing Tool](https://www.aleydasolis.com/english/international-seo-tools/hreflang-tags-generator/)

## 📞 Dəstək

Texniki suallar üçün:
- Email: tech@bdu.edu.az
- Slack: #bdu-frontend

## 📝 Changelog

### v1.0.0 (2025-01-21)
- ✅ Server Components & ISR
- ✅ Dynamic Sitemap
- ✅ Robots.txt
- ✅ Full Metadata Support
- ✅ Hreflang Alternates
- ✅ Structured Data (JSON-LD)
- ✅ Locale-aware Navigation
- ✅ Backend API Integration Layer
- ✅ Comprehensive Documentation

---

**Status:** ✅ Production Ready

**Next Steps:**
1. Backend API-ni qur və test et
2. Production environment variables set et
3. Google Search Console-da site verify et
4. Sitemap göndər
5. 2-3 həftə sonra indexləməni yoxla
