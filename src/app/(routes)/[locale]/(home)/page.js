import BlogSection from './(components)/BlogSection/BlogSection';
import HeroSlider from './(components)/HeroSlider';
import NewsSection from './(components)/NewsSection';
import EducationSection from './(components)/EducationSection';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const basePath = locale === 'az' ? '' : `/${locale}`;

  const title = 'Bakı Dövlət Universiteti';
  const description = 'Azərbaycanın ən qədim və nüfuzlu ali təhsil müəssisəsi';

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
      type: 'website',
    },
  };
}

export default function HomePage() {
  return (
    <div className='home overflow-hidden'>
      <HeroSlider />
      <NewsSection />
      <EducationSection />
      <BlogSection/>
    </div>
  );
}
