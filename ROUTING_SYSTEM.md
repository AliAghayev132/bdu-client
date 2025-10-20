# BDU Routing System Documentation

## 📋 Ümumi Baxış

Bu layihə üçün maksimum dinamik və scalable routing sistemi yaradılıb. Sistem unlimited nested navigation-ı dəstəkləyir və backend-də asanlıqla idarə edilə bilər.

## 🗂️ Struktur

```
src/
├── app/
│   └── (routes)/
│       └── [locale]/
│           └── [category]/
│               └── [...slug]/
│                   └── page.js          # Dynamic catch-all route
├── components/
│   └── layout/
│       ├── Header.js
│       ├── Navbar.js                    # Top & Bottom Navigation
│       ├── MegaMenu.js                  # Mega dropdown menu
│       └── MobileMenu.js
└── data/
    ├── menuData.js                      # Menu strukturu
    └── pageSchema.js                    # Backend data schema
```

## 🎯 Routing Sistemi

### Dynamic Routes

Next.js catch-all route istifadə edilir: `[category]/[...slug]`

**Nümunələr:**
```
/university/history
→ category: "university"
→ slug: ["history"]

/university/scientific-council/activities/2025
→ category: "university"
→ slug: ["scientific-council", "activities", "2025"]
```

### URL Strukturu

```
/{locale}/{category}/{slug-1}/{slug-2}/{slug-3}/...
```

- `locale`: `az` və ya `en` (default: `az`)
- `category`: `university`, `education`, `science`, `social`, `cooperation`
- `slug`: Unlimited nested segments

## 📊 Menu Data Structure

### menuData.js

Bütün menyu strukturu `src/data/menuData.js` faylında yerləşir:

```javascript
export const menuData = {
  university: {
    id: 'university',
    label: { az: 'UNİVERSİTET', en: 'UNIVERSITY' },
    type: 'mega',
    columns: [
      {
        title: { az: 'Ümumi', en: 'General' },
        items: [
          {
            id: 'scientific-council',
            label: { az: 'Elmi Şura', en: 'Scientific Council' },
            href: '/university/scientific-council',
            subitems: [
              {
                label: { az: 'Tərkibi', en: 'Structure' },
                href: '/university/scientific-council/structure'
              },
              {
                label: { az: 'Fəaliyyəti', en: 'Activities' },
                href: '/university/scientific-council/activities',
                subitems: [
                  {
                    label: { az: '2025-ci il', en: '2025' },
                    href: '/university/scientific-council/activities/2025'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};
```

### Xüsusiyyətlər:
- ✅ Unlimited nesting (subitems -> subitems -> subitems...)
- ✅ Multi-language support (az/en)
- ✅ Mega menu (4 column grid)
- ✅ Hover-based nested dropdowns
- ✅ Responsive design

## 🎨 Mega Menu Component

Desktop-da AliExpress/Amazon tipli mega dropdown:

```javascript
// Hover etdikdə açılır
onMouseEnter={() => setActiveMenu('university')}

// 4 column grid layout
<div className="grid grid-cols-4 gap-8">
  {columns.map(column => ...)}
</div>

// Nested subitems (hover-based)
{item.subitems && (
  <div className="absolute left-full top-0 ...">
    {/* Submenu content */}
  </div>
)}
```

## 📄 Backend Data Schema

### Page Schema (src/data/pageSchema.js)

Hər səhifə üçün backend-də bu strukturu istifadə edin:

```javascript
{
  id: 'scientific-council',
  category: 'university',
  slug: ['scientific-council'],
  fullPath: '/university/scientific-council',
  
  content: {
    az: {
      title: 'Elmi Şura',
      body: '<p>Məzmun...</p>',
      seo: { metaTitle: '...', metaDescription: '...' }
    },
    en: { ... }
  },
  
  type: 'page | blog | list | archive',
  
  sidebar: {
    show: true,
    items: [...]
  },
  
  subPages: [...],
  
  settings: {
    showBreadcrumbs: true,
    showSidebar: true,
    template: 'default'
  }
}
```

## 🔄 Backend Integration

### API Endpoints (tövsiyə edilən)

```
GET /api/pages/{category}/{slug-path}?locale=az
→ Səhifə məlumatını qaytarır

GET /api/pages?category=university&locale=az
→ Kateqoriyaya görə bütün səhifələr

GET /api/pages/search?q=elmi&locale=az
→ Axtarış

POST /api/pages
→ Yeni səhifə yaratmaq (admin)

PUT /api/pages/{id}
→ Səhifəni yeniləmək (admin)

DELETE /api/pages/{id}
→ Səhifəni silmək (admin)
```

### Database Schema (MongoDB nümunəsi)

```javascript
const PageSchema = new Schema({
  id: { type: String, required: true, unique: true },
  category: { type: String, required: true, enum: ['university', 'education', 'science', 'social', 'cooperation'] },
  slug: [String],
  fullPath: { type: String, required: true, unique: true },
  content: {
    az: {
      title: String,
      description: String,
      body: String,
      seo: {
        metaTitle: String,
        metaDescription: String,
        keywords: [String]
      }
    },
    en: { ... }
  },
  type: { type: String, enum: ['page', 'blog', 'list', 'archive'] },
  sidebar: Object,
  subPages: [Object],
  items: [Object],
  settings: Object,
  status: { type: String, enum: ['published', 'draft', 'archived'] },
  publishedAt: Date,
  updatedAt: Date,
  author: Object
});
```

## 🚀 Yeni Səhifə Əlavə Etmək

### 1. Menu-ya əlavə et (menuData.js)

```javascript
{
  id: 'new-page',
  label: { az: 'Yeni Səhifə', en: 'New Page' },
  href: '/university/new-page'
}
```

### 2. Backend-də page data yarat

```javascript
{
  id: 'new-page',
  category: 'university',
  slug: ['new-page'],
  fullPath: '/university/new-page',
  content: { ... }
}
```

### 3. Avtomatik işləyir!

Route automatically handled by `[category]/[...slug]/page.js`

## 📱 Mobile Menu

Mobil üçün tam ekran menyu:
- AZ/EN dil seçimi
- Search bar
- Main menu items
- Expandable subitems (ayrı səhifə kimi)
- GSAP animasiyalar

## 🎯 Advantages

✅ **Unlimited Nesting**: İstədiyiniz qədər dərin hierarchy
✅ **Backend-Friendly**: Sadə JSON struktur
✅ **Dynamic**: Kod dəyişdirmədən yeni səhifələr əlavə edin
✅ **Multi-Language**: Az/En dəstəyi
✅ **SEO Optimized**: Dynamic metadata generation
✅ **Scalable**: Minlərlə səhifəni handle edə bilər
✅ **Clean URLs**: `/university/scientific-council/activities/2025`

## 🔧 Tips

1. **Menu data-nı cache edin**: Backend-dən static generate edin
2. **ISR istifadə edin**: `revalidate: 3600` (1 saat)
3. **Breadcrumbs**: Avtomatik generate olunur
4. **Sidebar navigation**: Page data-dan dinamik yaranır
5. **Sub-pages**: Card layout ilə göstərilir

## 📝 Example Usage

```javascript
// 1. Menu-da göstərmək
import { menuData } from '@/data/menuData';

// 2. Səhifə render etmək
const page = await getPageByPath('university', ['scientific-council'], 'az');

// 3. Breadcrumbs
const breadcrumbs = buildBreadcrumbs('/university/scientific-council', 'az');
```

## 🎨 Customization

### Mega Menu Columns

`menuData.js`-də column sayını dəyişə bilərsiniz:

```javascript
columns: [
  { title: {...}, items: [...] },  // Column 1
  { title: {...}, items: [...] },  // Column 2
  { title: {...}, items: [...] },  // Column 3
  { title: {...}, items: [...] },  // Column 4
]
```

### Template Types

```javascript
settings: {
  template: 'default | blog | archive | custom'
}
```

Hər template üçün ayrı layout yarada bilərsiniz.

---

**Qeyd**: Bu sistem maksimum dinamik və backend-friendly dizayn edilib. Yeni feature-lar əlavə etmək çox asandır!
