import NotFound from "@/app/(routes)/[locale]/[category]/[...slug]/(components)/NotFound";
import BlogPageContent from "@/components/common/BlogPageContent";
import { buildLocalizedMetadata } from "@/seo/metadata";




export default async function AbituriyentlerUcunPage({ params }) {
  const { locale } = await params;
  return <NotFound/>;
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return buildLocalizedMetadata({
    locale,
    slugs: { az: "/abituriyentler-ucun", en: "/en/for-applicants" },
    title: { az: "Abituriyentlər üçün", en: "For applicants" },
    description: {
      az: "BDU-da abituriyentlər , tədris prosesi və imkanlar haqqında məlumat.",
      en: "Information about applicant , education process and opportunities at BDU.",
    },
    keywords: {
      az: "BDU, abituriyentlər, təhsil, universitet, abituriyentlər üçün",
      en: "BSU, applicant, education, university, for applicants",
    },
  });
}

