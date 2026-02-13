"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Mock data - linkleri sonra deyise bilersiz
const EXTERNAL_LINKS = [
    {
        id: 1,
        key: "youth",
        href: "https://mys.gov.az",
    },
    {
        id: 2,
        key: "academy",
        href: "https://science.gov.az",
    },
    {
        id: 3,
        key: "attestation",
        href: "https://aak.gov.az",
    },
    {
        id: 4,
        key: "examCenter",
        href: "https://dim.gov.az",
    },
    {
        id: 5,
        key: "unesco",
        href: "https://unesco.az",
    },
    {
        id: 6,
        key: "azertac",
        href: "https://azertag.az",
    },
    {
        id: 7,
        key: "intellectual",
        href: "https://copat.gov.az",
    },
    {
        id: 8,
        key: "heydar-aliyev-fond",
        href: "https://heydaraliyevfund.az",
    },
    {
        id: 9,
        key: "azerbaycan-portal",
        href: "https://azerbaycanportal.az",
    },
    {
        id: 10,
        key: "virtual-qarabagh",
        href: "https://virtualqarabagh.az",
    },
];

export default function ExternalLinksSection() {
    const t = useTranslations("home");
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: "start",
        slidesToScroll: 1,
        duration: 30,
        dragFree: true,
    });

    const [isHovered, setIsHovered] = useState(false);
    const autoScrollRef = useRef(null);

    // Auto-scroll with hover pause
    useEffect(() => {
        if (!emblaApi) return;

        const startAutoScroll = () => {
            if (autoScrollRef.current) clearInterval(autoScrollRef.current);
            autoScrollRef.current = setInterval(() => {
                if (!isHovered && emblaApi) {
                    emblaApi.scrollNext();
                }
            }, 3000);
        };

        startAutoScroll();

        return () => {
            if (autoScrollRef.current) clearInterval(autoScrollRef.current);
        };
    }, [emblaApi, isHovered]);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    return (
        <section className="wrapper sm:py-6 py-3">
            <div className=" sm:py-4 sm:px-4 py-6 px-4 bg-primary/5 xl:border-2 border-primary/20">
                {/* Carousel Container */}
                <div
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* Carousel */}
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex">
                            {EXTERNAL_LINKS.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex-shrink-0 w-[180px] sm:w-[220px] lg:w-[240px] px-3"
                                >
                                    <a
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group block h-[100px] sm:h-[120px] transition-all duration-300"
                                    >
                                        <div className="h-full flex flex-col items-center justify-center text-center px-2 py-4 border-y border-transparent group-hover:scale-110 will-change-transform transition-all duration-300">
                                            {/* Top Line (optional, subtle) */}
                                            <div className="w-12 h-[2px] bg-secondary/10 group-hover:bg-primary/40 transition-colors mb-3" />

                                            <div className="flex flex-col items-center">
                                                {t(`externalLinks.items.${item.key}`).split("|").map((part, index, array) => (
                                                    <span
                                                        key={index}
                                                        className={`font-bold text-secondary/80 group-hover:text-secondary uppercase tracking-wider leading-tight transition-colors duration-300 ${array.length > 1 && index === 0
                                                                ? "text-[7px] sm:text-[9px] mb-[4px] font-semibold"
                                                                : "text-[11px] sm:text-[13px] font-bold"
                                                            }`}
                                                    >
                                                        {part}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Bottom Line (optional, subtle) */}
                                            <div className="w-12 h-[2px] bg-secondary/10 group-hover:bg-primary/40 transition-colors mt-3" />
                                        </div>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* View All Link */}
                {/* <div className="flex justify-end mt-4 px-3">
                    <Link
                        href="/xarici-elaqeler"
                        className="text-secondary/50 hover:text-primary text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2"
                    >
                        <span>{t("externalLinks.viewAll")}</span>
                        <div className="w-6 h-[1px] bg-secondary/30 group-hover:w-10 transition-all" />
                    </Link>
                </div> */}
            </div>
        </section>
    );
}
