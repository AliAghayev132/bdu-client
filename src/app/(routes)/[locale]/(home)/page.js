import BlogSection from "./(components)/BlogSection/BlogSection";
import HeroSlider from "./(components)/HeroSlider";
import NewsSection from "./(components)/NewsSection";
import EducationSection from "./(components)/EducationSection";
import AlumniCarousel from "./(components)/AlumniCarousel";
import ScienceSection from "./(components)/ScienceSection";
import SocialSection from "./(components)/SocialSection";
import ExternalLinksSection from "./(components)/ExternalLinksSection";
import InternationalRelationsSection from "./(components)/InternationalRelations";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const basePath = locale === "az" ? "" : `/${locale}`;

  const title = "Bakı Dövlət Universiteti";
  const description = "Azərbaycanın ən qədim və nüfuzlu ali təhsil müəssisəsi";

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `${basePath}`,
    },
    openGraph: {
      title,
      description,
      url: `${basePath}`,
      type: "website",
    },
  };
}

export default async function HomePage({ params }) {
  const { locale } = await params;
  return (
    <div className="home overflow-hidden">
      <HeroSlider />
      <NewsSection locale={locale} />
      <ExternalLinksSection />
      <EducationSection />
      <AlumniCarousel />
      <ScienceSection />
      <SocialSection />
      <InternationalRelationsSection />
      <BlogSection />
    </div>
  );
}
