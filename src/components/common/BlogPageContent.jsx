"use client";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import StructuredData from "@/components/seo/StructuredData";
import Breadcrumbs from '@/app/(routes)/[locale]/[category]/[...slug]/(components)/Breadcrumbs';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';


const BlogPageContent = ({ locale, content }) => {

  if (!content) return null;

  const path = locale === "az" ? "/telebeler-ucun" : "/en/for-students";
  const breadcrumbs = [
    { label: locale === "az" ? "Ana səhifə" : "Home", href: "/" },
    { label: content.breadcrumbs, href: path },
  ];

  const imageList = content?.sliderImages || content?.content?.sliderImages || [];
  const hasSlider = Array.isArray(imageList) && imageList.length > 0;
  const slides = useMemo(() => {
    if (!hasSlider) return [];
    return imageList.map((img, idx) => {
      const src = typeof img === 'string' ? img : (img?.src || '');
      const width = typeof img === 'object' && img?.width ? img.width : 1600;
      const height = typeof img === 'object' && img?.height ? img.height : 900;
      return { src, width, height, idx };
    }).filter(s => s.src);
  }, [imageList, hasSlider]);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', containScroll: 'trimSnaps' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const update = () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      const inView = emblaApi.slidesInView(true)?.length || 1;
      setSlidesPerView(Math.max(1, inView));
      onSelect();
    };
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', update);
    update();
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    const id = setInterval(() => {
      if (!emblaApi) return;
      emblaApi.scrollNext();
    }, 3000);
    return () => clearInterval(id);
  }, [emblaApi]);

  return (
     <>
      {/* Structured Data */}
      <StructuredData
        type="breadcrumb"
        data={{ breadcrumbs }}
        locale={locale}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      {/* Page Content */}
      <div className="wrapper mx-auto px-4 sm:py-8 py-3">
        <header className="w-full mx-auto laptop:mb-6 mb-3">
          <h1 className="laptop:text-3xl md:text-2xl text-xl font-bold text-primary tracking-wider uppercase">
            {content.title}
          </h1>
        </header>
        <div className='py-2 sm:text-base text-sm' dangerouslySetInnerHTML={{ __html: content.content.body }} />

        {hasSlider && slides.length > 0 && (
          <div className="mt-8">
            <div className="relative overflow-hidden" ref={emblaRef}>
              <div className="flex touch-pan-y -ml-3">
                {slides.map((s, i) => (
                  <div
                    key={i}
                    className="shrink-0 basis-full sm:basis-1/2 md:basis-1/3 laptop:basis-1/4 pl-3"
                  >
                    <button
                      type="button"
                      onClick={() => { setSelectedIndex(i); setLightboxOpen(true); }}
                      className="block w-full"
                    >
                      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-3xl">
                        <Image
                          src={s.src}
                          alt={content.title || 'slide'}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
                          className="object-cover"
                          priority={i === 0}
                        />
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* {slides.length > slidesPerView && (
              <div className="mt-3 flex items-center justify-center gap-2">
                {Array.from({ length: Math.max(1, slides.length - slidesPerView + 1) }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => emblaApi && emblaApi.scrollTo(i)}
                    className={`h-2 w-2 rounded-full transition-colors ${selectedIndex === i ? 'bg-primary' : 'bg-gray-300'}`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )} */}
          </div>
        )}

        {hasSlider && (
          <Lightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            index={selectedIndex}
            slides={slides.map(s => ({ src: s.src }))}
          />
        )}
      </div>
    </>
  )
}

export default BlogPageContent
