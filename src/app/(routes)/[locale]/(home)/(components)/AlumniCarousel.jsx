"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heydaraliyev from "@/assets/images/heydaraliyev.png"
// Mock data - şəkilləri sonra dəyişə bilərsiniz
const FEATURED_PERSON = {
    id: 0,
    name: "Heydər Əliyev",
    title: "Ümummilli Lider",
    image: heydaraliyev,
};

const ALUMNI_DATA = [
    {
        id: 1,
        name: "Rəsul Rza",
        title: "Xalq Şairi",
        image: heydaraliyev,
    },
    {
        id: 2,
        name: "Mirvarid Dilbazi",
        title: "Xalq Şairi",
        image: heydaraliyev,
    },
    {
        id: 3,
        name: "Bəxtiyar Vahabzadə",
        title: "Xalq Şairi",
        image: heydaraliyev,
    },
    {
        id: 4,
        name: "Nəriman Nərimanov",
        title: "Dövlət Xadimi",
        image: heydaraliyev,
    },
    {
        id: 5,
        name: "Şövkət Ələkbərova",
        title: "Xalq Artisti",
        image: heydaraliyev,
    },
    {
        id: 6,
        name: "Müslüm Maqomayev",
        title: "Xalq Artisti",
        image: heydaraliyev,
    },
    {
        id: 7,
        name: "Lütfi Zadə",
        title: "Alim",
        image: heydaraliyev,
    },
    {
        id: 8,
        name: "Zərifə Əliyeva",
        title: "Akademik",
        image: heydaraliyev,
    },
];

export default function AlumniCarousel() {
    const t = useTranslations("home");
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: "center",
        slidesToScroll: 1,
        duration: 30,
    });

    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const autoScrollRef = useRef(null);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    // Auto-scroll with hover pause
    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);

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
    }, [emblaApi, onSelect, isHovered]);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    return (
        <section className="wrapper sm:py-10 py-4">
            <div className="bg-primary/5 xl:border-2 border-primary/20 sm:py-8 sm:px-8 py-6 px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="md:text-2xl sm:text-xl text-lg font-bold text-secondary uppercase tracking-wide">
                        {t("alumni.title", { default: "FƏXRLƏRİMİZ" })}
                    </h2>
                    <Link
                        href="/fexrlerimiz"
                        className="text-secondary/70 hover:text-secondary text-sm font-medium uppercase tracking-wide transition-colors"
                    >
                        {t("alumni.viewAll", { default: "BÜTÜN SİYAHI" })}
                    </Link>
                </div>

                {/* Main Content */}
                <div className="flex gap-4">
                    {/* Fixed Featured Person - Left Side */}
                    <div className="hidden lg:block flex-shrink-0 w-[180px] xl:w-[200px]">
                        <div className="group relative overflow-hidden bg-gray-100">
                            <div className="relative aspect-square w-full">
                                <Image
                                    src={FEATURED_PERSON.image}
                                    alt={FEATURED_PERSON.name}
                                    fill
                                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                    sizes="200px"
                                />
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-white font-bold text-lg">{FEATURED_PERSON.name}</h3>
                                    <p className="text-white/80 text-sm">{FEATURED_PERSON.title}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Carousel - Right Side */}
                    <div
                        className="flex flex-col items-center overflow-hidden"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div className="overflow-hidden h-full flex items-center" ref={emblaRef}>
                            <div className="flex">
                                {/* Mobile: Show featured person in carousel */}
                                <div className="lg:hidden flex-shrink-0 w-[140px] sm:w-[160px] pl-3 first:pl-0">
                                    <div className="group relative overflow-hidden bg-gray-100">
                                        <div className="relative aspect-square">
                                            <Image
                                                src={FEATURED_PERSON.image}
                                                alt={FEATURED_PERSON.name}
                                                fill
                                                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                                sizes="160px"
                                            />
                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                                <h3 className="text-white font-bold text-sm">{FEATURED_PERSON.name}</h3>
                                                <p className="text-white/80 text-xs">{FEATURED_PERSON.title}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Alumni Cards */}
                                {ALUMNI_DATA.map((person, index) => (
                                    <div
                                        key={person.id}
                                        className="flex-shrink-0 w-[140px] sm:w-[160px] lg:w-[160px] xl:w-[180px] pl-3"
                                    >
                                        <div className="group relative overflow-hidden bg-gray-100 cursor-pointer">
                                            <div className="relative aspect-square">
                                                <Image
                                                    src={person.image}
                                                    alt={person.name}
                                                    fill
                                                    className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                                                    sizes="180px"
                                                />
                                                {/* Shadow overlay from bottom on hover */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                {/* Name and title - slides up on hover */}
                                                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                                                    <h3 className="text-white font-bold text-sm lg:text-base leading-tight">
                                                        {person.name}
                                                    </h3>
                                                    <p className="text-white/80 text-xs mt-0.5">{person.title}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Buttons */}

                    </div>
                </div>
            </div>
        </section>
    );
}
