import BlogPageContent from "@/components/common/BlogPageContent";
import { buildLocalizedMetadata } from "@/seo/metadata";

export default async function TelebeUcunPage({ params }) {
  const { locale } = await params;
  return <BlogPageContent locale={locale} />;
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return buildLocalizedMetadata({
    locale,
    slugs: { az: "/telebeler-ucun", en: "/en/for-students" },
    title: { az: "Tələbələr üçün", en: "For Students" },
    description: {
      az: "BDU-da tələbə həyatı, tədris prosesi və imkanlar haqqında məlumat.",
      en: "Information about student life, education process and opportunities at BSU.",
    },
    keywords: {
      az: "BDU, tələbə, təhsil, universitet, tələbələr üçün",
      en: "BSU, student, education, university, for students",
    },
  });
}
