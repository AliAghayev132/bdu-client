"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import "yet-another-react-lightbox/styles.css";
import Lightbox from "yet-another-react-lightbox";

const defaultEmblaOptions = { loop: true, align: "start", containScroll: "trimSnaps" };

const ImageCarousel = React.memo(function ImageCarousel({
  slides = [],
  title,
  autoplay = 3000,
  loop = true,
  showDots = true,
  emblaOptions = {},
}) {
  const normalizedSlides = useMemo(
    () =>
      (slides || [])
        .map((img, idx) => {
          const src = typeof img === "string" ? img : img?.src || "";
          if (!src) return null;
          return {
            src,
            width: typeof img === "object" && img?.width ? img.width : 1600,
            height: typeof img === "object" && img?.height ? img.height : 900,
            alt: img?.alt || title || "slide",
            idx,
          };
        })
        .filter(Boolean),
    [slides, title]
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({
    ...defaultEmblaOptions,
    ...emblaOptions,
    loop,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const viewportRef = useRef(null);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const update = () => {
      const inView = emblaApi.slidesInView(true)?.length || 1;
      setSlidesPerView(Math.max(1, inView));
      onSelect();
    };
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", update);
    update();
  }, [emblaApi, onSelect]);

  // Autoplay with pause-on-hover and page visibility
  useEffect(() => {
    if (!emblaApi || !autoplay) return;
    let timerId;

    const start = () => {
      stop();
      timerId = setInterval(() => {
        emblaApi?.scrollNext();
      }, autoplay);
    };
    const stop = () => {
      if (timerId) clearInterval(timerId);
      timerId = undefined;
    };

    const node = viewportRef.current;
    if (node) {
      node.addEventListener("mouseenter", stop);
      node.addEventListener("mouseleave", start);
    }

    const handleVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    start();
    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
      if (node) {
        node.removeEventListener("mouseenter", stop);
        node.removeEventListener("mouseleave", start);
      }
    };
  }, [emblaApi, autoplay]);

  if (!normalizedSlides.length) return null;

  const pageCount = Math.max(1, normalizedSlides.length - slidesPerView + 1);

  return (
    <div className="mt-8">
      <div className="relative overflow-hidden" ref={(el) => { viewportRef.current = el; emblaRef(el); }}>
        <div className="flex touch-pan-y -ml-3">
          {normalizedSlides.map((s, i) => (
            <div key={i} className="shrink-0 basis-full sm:basis-1/2 md:basis-1/3 laptop:basis-1/4 pl-3">
              <button
                type="button"
                onClick={() => { setSelectedIndex(i); setLightboxOpen(true); }}
                className="block w-full"
                aria-label={`Open image ${i + 1}`}
              >
                <div className="relative w-full aspect-[16/9] overflow-hidden rounded-3xl">
                  <Image
                    src={s.src}
                    alt={s.alt}
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

      {showDots && normalizedSlides.length > slidesPerView && (
        <div className="mt-3 flex items-center justify-center gap-2 sm:hidden ">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => emblaApi && emblaApi.scrollTo(i)}
              className={`h-2 w-2 rounded-full transition-colors ${selectedIndex === i ? "bg-secondary" : "bg-gray-300"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={selectedIndex}
        slides={normalizedSlides.map((s) => ({ src: s.src, description: s.alt }))}
      />
    </div>
  );
});

export default ImageCarousel;
