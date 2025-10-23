"use client";

import React, { useState, useEffect, useRef } from "react";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import Image from "next/image";
import bdu1 from '@/assets/images/baki-dovlet-universiteti.jpg';
import bdu2 from '@/assets/images/hero1.jpg';
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";


const HeroSlider = () => {
  const locale = useLocale();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const videoRefs = useRef({});
  const autoPlayTimerRef = useRef(null);

  const slides = [
    {
      id: 1,
      type: 'video',
      // Video path - next-video will automatically optimize it
      // The .json file is metadata created by next-video (can be deleted if not needed)
      video: '/videos/bdu-video.mp4',
      poster: bdu1, // Poster image while loading
      alt: "BDU Video",
      year: "2025",
      title: {
        az: "Bakı Dövlət Universiteti",
        en: "Baku State University"
      },
      subtitle: {
        az: "Azərbaycanın ən qədim və nüfuzlu ali təhsil müəssisəsi",
        en: "Azerbaijan's oldest and most prestigious higher education institution"
      },
    },
    {
      id: 2,
      type: 'image',
      image: bdu2,
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
    },
    {
      id: 3,
      type: 'image',
      image: bdu1,
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
    },
  ];

  // Handle video ended event
  const handleVideoEnded = () => {
    // Move to next slide when video ends
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // Auto-play functionality for images
  useEffect(() => {
    if (!isAutoPlaying) return;

    const currentSlideData = slides[currentSlide];
    
    // If current slide is a video, don't set timer (video will auto-advance)
    if (currentSlideData?.type === 'video') {
      return;
    }

    // For images, auto-advance after 5 seconds
    autoPlayTimerRef.current = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
    };
  }, [isAutoPlaying, currentSlide, slides.length]);

//   useEffect(() => {
//   const handleVisibility = () => {
//     if (document.hidden) videoRefs.current.pause();
//     else videoRefs.current.play();
//   };
//   document.addEventListener('visibilitychange', handleVisibility);
//   return () => document.removeEventListener('visibilitychange', handleVisibility);
// }, []);

  // Control video playback
  useEffect(() => {
    const currentSlideData = slides[currentSlide];
    
    // Play video if current slide is video
    if (currentSlideData?.type === 'video' && videoRefs.current[currentSlide]) {
      const videoElement = videoRefs.current[currentSlide];
      videoElement.play().catch(err => console.log('Video autoplay prevented:', err));
    }

    // Pause all other videos
    Object.keys(videoRefs.current).forEach(key => {
      if (parseInt(key) !== currentSlide && videoRefs.current[key]) {
        videoRefs.current[key].pause();
        videoRefs.current[key].currentTime = 0;
      }
    });
  }, [currentSlide, slides]);

  useEffect(() => {
  const currentVideo = videoRefs.current[currentSlide];
  return () => {
    if (currentVideo) {
      currentVideo.pause();
      currentVideo.removeAttribute('src');
      currentVideo.load();
    }
  };
}, [currentSlide]);

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
    <section className="relative wrapper h-[65vh] laptop:max-h-[700px] max-h-[260px] sm:max-h-[500px] pt-4 overflow-hidden">
      {/* Slides */}
      <div className="relative h-full rounded-3xl overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background - Video or Image */}
            <div className="absolute inset-0">
              {slide.type === 'video' ? (
                <>
                  <video
                    ref={(el) => videoRefs.current[index] = el}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    loop={false}
                    preload={index === 0 ? "auto" : "metadata"}
                    poster={typeof slide.poster === 'string' ? slide.poster : slide.poster?.src}
                    onEnded={handleVideoEnded}
                  >
                    <source src={slide.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  {/* Gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none" />
                </>
              ) : (
                <>
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                  {/* Gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
                </>
              )}
            </div>

            {/* Content Overlay - Oxford Style */}
            <div className="absolute inset-0 flex items-end z-10">
              <div className="wrapper mx-auto lg:px-10 px-4 md:pb-16 pb-14 w-full">
                <div className=" flex md:flex-row flex-col justify-between w-full">
                  {/* Year Badge */}
                  <div className="inline-block sm:mb-4 mb-2">
                    <span className="text-white/90 lg:text-4xl sm:text-3xl text-lg font-light tracking-wider">
                      {slide.year}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="max-w-xl ">
                    
                  <h2 className="text-white text-lg sm:text-3xl md:text-4xl font-semibold sm:mb-4 mb-2 leading-tight">
                    {slide.title[locale]}
                  </h2>

                  {/* Subtitle */}
                  <p className="text-white/90 sm:line-clamp-4 line-clamp-2 text-sm sm:text-lg md:text-lg sm:mb-6 mb-2 leading-relaxed">
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
      <div className="absolute sm:bottom-8 bottom-4 md:right-20 sm:right-10 right-6 z-20 flex sm:gap-3 gap-2">
        <button
          onClick={prevSlide}
          className="sm:w-12 sm:h-12 w-8 h-8 bg-white/90 hover:bg-white rounded-lg flex items-center justify-center text-gray-800 transition-all shadow-lg group"
          aria-label="Previous slide"
        >
        <ChevronLeftIcon className="sm:w-5 w-4 sm:h-5 h-4 transform group-hover:-translate-x-0.5 transition-transform" />
        </button>

        <button
          onClick={nextSlide}
          className="sm:w-12 sm:h-12 w-8 h-8 bg-white/90 hover:bg-white rounded-lg flex items-center justify-center text-gray-800 transition-all shadow-lg group"
          aria-label="Next slide"
        >
        <ChevronRightIcon className="sm:w-5 w-4 sm:h-5 h-4 transform group-hover:translate-x-0.5 transition-transform" />
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
