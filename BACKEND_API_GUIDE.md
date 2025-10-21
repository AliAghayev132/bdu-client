# Backend API İnteqrasiya Təlimatı

Bu sənəd backend API-nin necə qurulmalı olduğunu və Next.js frontend ilə necə inteqrasiya ediləcəyini izah edir.

## 📋 Tələb olunan API Endpoint-ləri

### 1. Menu Data API
**Endpoint:** `GET /api/menu`

**Cavab formatı:**
```json
{
  "university": {
    "id": "university",
    "label": {
      "az": "UNİVERSİTET",
      "en": "UNIVERSITY"
    },
    "type": "mega",
    "columns": [
      {
        "title": { "az": "Ümumi", "en": "General" },
        "items": [
          {
            "id": "history",
            "label": { "az": "Universitetin tarixi", "en": "University History" },
            "href": { "az": "/universitet/tarix", "en": "/university/history" },
            "content": {
              "az": {
                "title": "Universitetin tarixi",
                "description": "BDU-nun 100 illik tarixi",
                "body": "<p>HTML məzmun...</p>"
              },
              "en": {
                "title": "University History",
                "description": "100 years of BSU",
                "body": "<p>HTML content...</p>"
              }
            },
            "pageType": "blog",
            "subitems": []
          }
        ]
      }
    ]
  }
}
```

### 2. Routes API (Sitemap üçün)
**Endpoint:** `GET /api/routes`

**Cavab formatı:**
```json
[
  {
    "path": "/university/history",
    "locale": "az",
    "lastModified": "2025-01-15T10:00:00Z",
    "changeFrequency": "weekly",
    "priority": 0.8
  },
  {
    "path": "/university/history",
    "locale": "en",
    "lastModified": "2025-01-15T10:00:00Z",
    "changeFrequency": "weekly",
    "priority": 0.8
  }
]
```

### 3. Page Data API (Optional - SSR üçün)
**Endpoint:** `GET /api/pages?path=/university/history&locale=az`

**Cavab formatı:**
```json
{
  "content": {
    "az": {
      "title": "Universitetin tarixi",
      "description": "BDU-nun 100 illik tarixi",
      "body": "<p>HTML məzmun...</p>"
    }
  },
  "type": { "az": "blog" },
  "items": [],
  "sidebar": {
    "show": true,
    "items": []
  }
}
```

## 🔧 Backend Tələbləri

### Cache Headers
Backend API-dən gələn cavablarda cache header-ləri olmalıdır:

```http
Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400
```

### CORS
Frontend domain-ə CORS icazəsi:

```javascript
// Express.js nümunəsi
app.use(cors({
  origin: ['https://bdu.edu.az', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}));
```

## 📊 Database Schema (Nümunə)

### Pages Table
```sql
CREATE TABLE pages (
  id SERIAL PRIMARY KEY,
  path VARCHAR(255) NOT NULL,
  locale VARCHAR(5) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  body TEXT,
  page_type VARCHAR(50) DEFAULT 'blog',
  keywords TEXT,
  last_modified TIMESTAMP DEFAULT NOW(),
  change_frequency VARCHAR(20) DEFAULT 'weekly',
  priority DECIMAL(2,1) DEFAULT 0.7,
  UNIQUE(path, locale)
);
```

### Menu Items Table
```sql
CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  parent_id INTEGER REFERENCES menu_items(id),
  category VARCHAR(50) NOT NULL,
  item_id VARCHAR(100) NOT NULL,
  label_az VARCHAR(255),
  label_en VARCHAR(255),
  href_az VARCHAR(255),
  href_en VARCHAR(255),
  page_type VARCHAR(50),
  has_detail BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0
);
```

## 🚀 Frontend Deployment Addımları

### 1. Environment Variables
`.env.production` faylı yaradın:

```env
NEXT_PUBLIC_SITE_URL=https://bdu.edu.az
NEXT_PUBLIC_API_URL=https://api.bdu.edu.az/api
REVALIDATE_TIME=600
```

### 2. Build
```bash
npm run build
```

### 3. Vercel/Netlify Deploy
```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod
```

## 🔍 SEO Yoxlama

### Google Search Console
1. Site-i əlavə edin: https://search.google.com/search-console
2. Sitemap göndərin: `https://bdu.edu.az/sitemap.xml`
3. URL inspection ilə səhifələri yoxlayın

### Structured Data Test
https://search.google.com/test/rich-results

### PageSpeed Insights
https://pagespeed.web.dev/

## 📈 Monitoring

### ISR Cache
```javascript
// pages/api/revalidate.js - Manual revalidation
export default async function handler(req, res) {
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    await res.revalidate('/university/history');
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
}
```

## 🎯 Performance Tips

1. **Image Optimization**: Backend-dən şəkilləri WebP formatında göndərin
2. **CDN**: Static asset-ləri CDN-də host edin
3. **Database Indexing**: `path` və `locale` sütunlarına index qoyun
4. **Redis Cache**: API cavablarını Redis-də cache edin

## 📞 Dəstək

Suallar üçün: tech@bdu.edu.az
