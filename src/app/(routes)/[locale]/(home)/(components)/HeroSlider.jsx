"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import Image from "next/image";
import bdu1 from '@/assets/images/baki-dovlet-universiteti.jpg'

const HeroSlider = () => {
  const locale = useLocale();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      id: 1,
      image: bdu1,
      alt: "BDU Campus",
      year: "2025",
      title: {
        az: "Tam Maliyyələşdirilən Magistratura Təqaüdləri",
        en: "Fully Funded Graduate Studentship"
      },
      subtitle: {
        az: "2025-2026 üçün müraciətlər qəbul edilir",
        en: "For 2025-2026. Check our selection of studentship accepting applications now"
      },
      // link: {
      //   az: "/tedris/magistratura",
      //   en: "/education/graduate"
      // }
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80",
      alt: "University Building",
      year: "2024",
      title: {
        az: "Beynəlxalq Tələbə Mübadiləsi Proqramları",
        en: "International Student Exchange Programs"
      },
      subtitle: {
        az: "Dünyanın aparıcı universitetləri ilə əməkdaşlıq",
        en: "Collaboration with world's leading universities"
      },
      // link: {
      //   az: "/emekdasliq/beynelxalq",
      //   en: "/cooperation/international"
      // }
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume autoplay after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="relative max-w-[1600px] mx-auto h-[60vh] pt-4 px-4 overflow-hidden">
      {/* Slides */}
      <div className="relative h-full rounded-2xl overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                className="object-cover"
                priority={index === 0}
                quality={90}
              />
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
            </div>

            {/* Content Overlay - Oxford Style */}
            <div className="absolute inset-0 flex items-end z-10">
              <div className="wrapper mx-auto lg:px-10 px-4 pb-16 w-full">
                <div className=" flex justify-between w-full">
                  {/* Year Badge */}
                  <div className="inline-block mb-4">
                    <span className="text-white/90 text-4xl font-light tracking-wider">
                      {slide.year}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="max-w-xl">
                    
                  <h2 className="text-white text-3xl md:text-4xl font-semibold mb-4 leading-tight">
                    {slide.title[locale]}
                  </h2>

                  {/* Subtitle */}
                  <p className="text-white/90 text-base md:text-lg mb-6 leading-relaxed">
                    {slide.subtitle[locale]}
                  </p>
                  </div>
<div></div>
                  {/* CTA Link - Optional */}
                  {slide.link && (
                    <Link
                      href={slide.link[locale]}
                      className="inline-flex items-center gap-2 text-white hover:text-primary transition-colors group"
                    >
                      <span className="text-sm font-medium">
                        {locale === 'az' ? 'Ətraflı' : 'Learn More'}
                      </span>
                      <svg
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
           {/* Progress Bar */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
        <div
          className="h-full bg-primary transition-all"
          style={{
            width: isAutoPlaying ? "100%" : "0%",
            transition: isAutoPlaying ? "width 5s linear" : "none",
            animation: isAutoPlaying ? "progress 5s linear infinite" : "none",
          }}
        />
      </div> */}
      </div>

      {/* Navigation Arrows - Bottom Right */}
      <div className="absolute bottom-8 right-20 z-20 flex gap-3">
        <button
          onClick={prevSlide}
          className="w-12 h-12 bg-white/90 hover:bg-white rounded-lg flex items-center justify-center text-gray-800 transition-all shadow-lg group"
          aria-label="Previous slide"
        >
          <svg
            className="w-5 h-5 transform group-hover:-translate-x-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="w-12 h-12 bg-white/90 hover:bg-white rounded-lg flex items-center justify-center text-gray-800 transition-all shadow-lg group"
          aria-label="Next slide"
        >
          <svg
            className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

   

      {/* Decorative bottom wave */}

      {/* CSS for progress animation */}
      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSlider;
