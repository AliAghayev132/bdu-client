import FacultiesPageContent from "@/components/common/FacultiesPageContent";
import { buildLocalizedMetadata } from "@/seo/metadata";

// Azərbaycan dili üçün content
const content = {
  az: {
    title: "FAKÜLTƏLƏR",
    breadcrumbs: "Fakültələr",
    description:
      "Bakı Dövlət Universitetində 16 fakültə fəaliyyət göstərir və bu fakültələrdə müxtəlif elmi istiqamətlərdə bakalavr, magistratura və doktorantura səviyyəsində mütəxəssislər hazırlanır.",
    categories: {
      natural: "TƏBİƏT FƏNLƏRİ FAKÜLTƏLƏRİ",
      humanities: "HUMANİTAR FƏNLƏR FAKÜLTƏLƏRİ",
      social: "SOSİAL FƏNLƏR FAKÜLTƏLƏRİ",
    },
    infoBox: {
      title: "Subdomain Sistemi",
      description:
        "Hər fakültə öz subdomain-ində fəaliyyət göstərir. Məsələn, Mexanika-riyaziyyat fakültəsi math.bdu.info.az ünvanında yerləşir.",
    },
  },
};

export default async function FakultelerPage({ params }) {
  const { locale } = await params;
  return <FacultiesPageContent content={content.az} locale={locale} />;
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
