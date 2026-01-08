import FacultiesPageContent from "@/components/common/FacultiesPageContent";
import { buildLocalizedMetadata } from "@/seo/metadata";

// English content
const content = {
  en: {
    title: "FACULTIES",
    breadcrumbs: "Faculties",
    description:
      "There are 16 faculties operating at Baku State University, where specialists are trained at bachelor, master and doctoral levels in various scientific fields.",
    categories: {
      natural: "NATURAL SCIENCES FACULTIES",
      humanities: "HUMANITIES FACULTIES",
      social: "SOCIAL SCIENCES FACULTIES",
    },
    infoBox: {
      title: "Subdomain System",
      description:
        "Each faculty operates on its own subdomain. For example, the Faculty of Mechanics and Mathematics is located at math.bdu.info.az.",
    },
  },
};

export default async function FacultiesPage({ params }) {
  const { locale } = await params;
  return <FacultiesPageContent content={content.en} locale={locale} />;
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return buildLocalizedMetadata({
    locale,
    slugs: { az: "/fakulteler", en: "/en/faculties" },
    title: { az: "Fakültələr", en: "Faculties" },
    description: {
      az: "Bakı Dövlət Universitetinin fakültələri haqqında məlumat.",
      en: "Information about the faculties of Baku State University.",
    },
    keywords: {
      az: "BDU, fakültələr, təhsil, universitet, mexanika-riyaziyyat",
      en: "BSU, faculties, education, university, mechanics-mathematics",
    },
  });
}
