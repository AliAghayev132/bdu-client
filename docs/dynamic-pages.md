# Dynamic pages architecture (BDU client)

This document explains how localized dynamic pages are built, how menu-driven content works, and how admin routes are isolated from locale routing.

## Overview

- **App Router**
  - Site pages: `app/(routes)/[locale]/[category]/[...slug]/page.js`
  - Admin: `app/(routes)/(admin)/admin/...` with its own `layout.js`
- **Internationalization**
  - `next-intl` middleware manages locales.
  - Middleware explicitly skips `/admin` so it won’t be treated as a locale.
- **Single Source of Truth**
  - `src/data/menuData.js` stores navigation and page metadata (labels, hrefs per locale, page types, nested subitems, optional card-detail metadata).

## Key files

- `src/data/menuData.js`
- `src/components/layout/MegaMenu.js`
- `src/components/layout/Navbar.js`
- `src/app/(routes)/[locale]/[category]/[...slug]/page.js`
- `src/middleware.js`

---

## Data model: menuData.js

Top-level categories (e.g., `university`, `education`, `science`, `social`, `cooperation`) contain columns and items.

Item fields (most used):
- `id`
- `label: { az, en }`
- `href: { az, en } | string`
- `description?`
- `pageType?` — `blog` | `card`
- `content?` localized object `{ az: { title, description, body? }, en: {...} }`
- `items?` — for card pages (grid items)
- `subitems?` — nested navigation/pages
- For card detail pages inside `items`:
  - `hasDetail: true`
  - Detail URL: `parent.href[locale] + '/' + cardItem.id`
  - Detail content from card fields (e.g., `name`, `position`, `bio` localized)

Helpers:
- `getLabel(item, locale)` — localized label
- `buildBreadcrumbs(path, locale)` — builds breadcrumb trail
- `resolveLocalizedPath(currentPath, targetLocale)` — maps to the other locale via known pairs; falls back to a best-effort translator elsewhere
- `findMenuItemByPath(path, locale)` — recursive matcher by `href`
- `generateSidebar(currentPath, locale)` — returns sidebar model when current item has `subitems`
- `getPageDataFromMenu(path, locale)` — core resolver that returns:
  - For matched item: `{ content, type, items, sidebar }`
  - For card detail: `{ content-from-card, type: 'blog', detailItem, sidebar-from-parent }`
  - Otherwise: `null`

---

## Navbar and MegaMenu

- `Navbar.js`
  - Renders top mega-menu entries using `menuData` keys.
  - Language switch uses `resolveLocalizedPath` first, then URL translation.
  - Maintains a single `activeMenu` and passes it into `MegaMenu`.
- `MegaMenu.js`
  - Shows the active category with left sections (columns) and a recursive right panel (`SubMenuPanel`) for `subitems`.
  - Links use the i18n `Link` and localized `href`.

---

## Dynamic page: [locale]/[category]/[...slug]/page.js

Parameters: `{ locale, category, slug }`.

- Construct path: `fullPath = '/' + category + '/' + (slug?.join('/') || '')`
- Build breadcrumbs: `buildBreadcrumbs(fullPath, locale)`
- Resolve page: `const pageData = getPageDataFromMenu(fullPath, locale)`
- If no data: render `NotFound`

Rendering:
- `pageType = pageData.type?.[locale] || 'blog'`
- `SideBar` uses `pageData.sidebar`
- `PageHeader` from `pageData.content[locale]`
- Content logic:
  - `card` with `items.length > 0` → `CardsGrid`
  - else → optional `DetailHeader` (for card-detail) + `BlogContent` (`html`)
  - if `pageType === 'blog'` and `items.length > 0` → render `BlogContent` again (pattern for content + links)
- Optional: `SubPagesGrid`, `AuthorInfo`

SEO/Structured data:
- Breadcrumbs schema
- Person schema when `detailItem` exists
- Article schema when body exists
- `generateMetadata` sets title, description, canonicals, alternates, OG, Twitter, robots

---

## Middleware: exclude admin from i18n handling

`src/middleware.js`:

```js
import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intl = createMiddleware(routing);

export default function middleware(req) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/admin')) {
    return NextResponse.next();
  }
  return intl(req);
}

export const config = {
  matcher: ['/', '/(az|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
```

Effect: `/admin/...` is not processed by the intl middleware and won’t be captured by `[locale]`.

---

## Authoring guide

Create a simple blog page:
1. Add a menu item under the proper category/column with localized `label` and `href`.
2. Set `pageType: 'blog'`.
3. Provide `content[az|en] = { title, description, body }`.

Create a cards page with optional details:
1. Parent item: `pageType: 'card'`, and `items[]` with card data (e.g., `name`, `position`, `image`).
2. For any card that should have a detail page, set `hasDetail: true` and populate localized `bio` (and other fields).
3. Detail URL is generated automatically from the parent `href` and card `id`.

Nested pages:
- Use `subitems[]` at any level; each entry is the same shape and can itself have `subitems`.

Localization safety:
- Keep `href.az` and `href.en` in sync for every item so language switching stays correct via `resolveLocalizedPath`.

---

## Admin routes

- Located under `app/(routes)/(admin)/admin/...`
- Own `layout.js` and components (`Sidebar`, headers, etc.)
- Isolated from site layouts and locale middleware.

---

## Future improvements

- Add tests for `getPageDataFromMenu`, `resolveLocalizedPath`, and `buildBreadcrumbs`.
- Consider a CMS-backed generator that outputs this JSON structure for production.
