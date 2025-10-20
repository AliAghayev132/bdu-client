import HeroSlider from './(components)/HeroSlider';
import NewsSection from './(components)/NewsSection';

export default function HomePage() {
  return (
    <div className='home overflow-hidden'>
      <HeroSlider />
      <NewsSection />
    </div>
  );
}
