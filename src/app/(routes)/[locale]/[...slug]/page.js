import { notFound } from "next/navigation";
import { getPageByPath, transformPageData } from "@/lib/api/pages";
import { getPersonBySlug } from "@/lib/api/persons";
import DynamicPageContent from "./(components)/DynamicPageContent";
import PersonDetailContent from "./(components)/PersonDetailContent";

/**
 * Dinamik slug resolver:
 * 1. Tam path ilə səhifə axtarır (məs: /rehberlik)
 * 2. Tapılmazsa, parent path-i yoxlayır — əgər personPage tipidirsə,
 *    son segment-i person slug kimi axtarır (məs: /rehberlik/rektor → parent=/rehberlik, slug=rektor)
 */
async function resolveSlug(slugSegments, locale) {
  const fullPath = "/" + slugSegments.join("/");

  // 1. Tam path ilə səhifə axtarışı
  const page = await getPageByPath(fullPath, locale);
  if (page) {
    return { type: "page", page };
  }

  // 2. Parent path + person slug axtarışı
  if (slugSegments.length >= 2) {
    const personSlug = slugSegments[slugSegments.length - 1];
    const parentPath = "/" + slugSegments.slice(0, -1).join("/");

    const parentPage = await getPageByPath(parentPath, locale);
    if (parentPage && parentPage.pageType === "personPage") {
      const person = await getPersonBySlug(personSlug, locale);
      if (person) {
        return { type: "person", person, parentPage };
      }
    }
  }

  // 3. Tek segment slug ilə birbaşa person axtarışı
  if (slugSegments.length === 1) {
    const person = await getPersonBySlug(slugSegments[0], locale);
    if (person) {
      return { type: "person", person, parentPage: null };
    }
  }

  return null;
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const segments = Array.isArray(slug) ? slug : [slug];

  const result = await resolveSlug(segments, locale);

  if (!result) return { title: "Səhifə tapılmadı" };

  if (result.type === "page") {
    const p = transformPageData(result.page, locale);
    return {
      title: p.seo?.metaTitle || p.title,
      description: p.seo?.metaDescription || p.description,
      keywords: p.seo?.keywords?.join(", "),
    };
  }

  // Person
  const { person } = result;
  const name = person.name?.[locale] || person.name?.az || "";
  const position = person.position?.[locale] || person.position?.az || "";
  return {
    title: `${name} - ${position}`,
    description: person.bio?.[locale] || position,
  };
}

export default async function DynamicPage({ params }) {
  const { locale, slug } = await params;
  const segments = Array.isArray(slug) ? slug : [slug];

  const result = await resolveSlug(segments, locale);

  if (!result) notFound();

  if (result.type === "page") {
    const pageData = transformPageData(result.page, locale);
    return <DynamicPageContent page={pageData} locale={locale} rawPage={result.page} />;
  }

  // Person detail
  const parentPageData = result.parentPage
    ? transformPageData(result.parentPage, locale)
    : null;

  return (
    <PersonDetailContent
      person={result.person}
      locale={locale}
      parentPage={parentPageData}
    />
  );
}
