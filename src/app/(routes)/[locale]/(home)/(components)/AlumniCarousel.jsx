"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heydaraliyev from "@/assets/images/heydaraliyev.png"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Fallback data
const FEATURED_PERSON = {
    id: 0,
    name: { az: "Heydər Əliyev", en: "Heydar Aliyev" },
    title: { az: "Ümummilli Lider", en: "National Leader" },
    image: heydaraliyev,
};

const FALLBACK_ALUMNI = [
    { id: 1, name: { az: "Rəsul Rza", en: "Rasul Rza" }, title: { az: "Xalq Şairi", en: "People's Poet" }, image: heydaraliyev },
    { id: 2, name: { az: "Mirvarid Dilbazi", en: "Mirvarid Dilbazi" }, title: { az: "Xalq Şairi", en: "People's Poet" }, image: heydaraliyev },
    { id: 3, name: { az: "Bəxtiyar Vahabzadə", en: "Bakhtiyar Vahabzade" }, title: { az: "Xalq Şairi", en: "People's Poet" }, image: heydaraliyev },
    { id: 4, name: { az: "Nəriman Nərimanov", en: "Nariman Narimanov" }, title: { az: "Dövlət Xadimi", en: "Statesman" }, image: heydaraliyev },
    { id: 5, name: { az: "Şövkət Ələkbərova", en: "Shovkat Alakbarova" }, title: { az: "Xalq Artisti", en: "People's Artist" }, image: heydaraliyev },
    { id: 6, name: { az: "Müslüm Maqomayev", en: "Muslim Magomayev" }, title: { az: "Xalq Artisti", en: "People's Artist" }, image: heydaraliyev },
    { id: 7, name: { az: "Lütfi Zadə", en: "Lotfi Zadeh" }, title: { az: "Alim", en: "Scientist" }, image: heydaraliyev },
    { id: 8, name: { az: "Zərifə Əliyeva", en: "Zarifa Aliyeva" }, title: { az: "Akademik", en: "Academician" }, image: heydaraliyev },
];

export default function AlumniCarousel({ apiPrides }) {
    const locale = useLocale();
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

    // Use API prides if available, otherwise fallback
    const alumniData = (apiPrides && apiPrides.length > 0)
        ? apiPrides.filter(p => p.isActive !== false).map((p) => ({
            ...p,
            id: p._id,
            name: p.fullName || p.name,
            title: p.title,
            image: p.image?.startsWith('/') ? `${API_BASE}${p.image}` : p.image,
        }))
        : FALLBACK_ALUMNI;

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
                                    alt={typeof FEATURED_PERSON.name === 'object' ? FEATURED_PERSON.name[locale] : FEATURED_PERSON.name}
                                    fill
                                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                    sizes="200px"
                                />
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-white font-bold text-lg">{typeof FEATURED_PERSON.name === 'object' ? FEATURED_PERSON.name[locale] : FEATURED_PERSON.name}</h3>
                                    <p className="text-white/80 text-sm">{typeof FEATURED_PERSON.title === 'object' ? FEATURED_PERSON.title[locale] : FEATURED_PERSON.title}</p>
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
                                                alt={typeof FEATURED_PERSON.name === 'object' ? FEATURED_PERSON.name[locale] : FEATURED_PERSON.name}
                                                fill
                                                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                                sizes="160px"
                                            />
                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                                <h3 className="text-white font-bold text-sm">{typeof FEATURED_PERSON.name === 'object' ? FEATURED_PERSON.name[locale] : FEATURED_PERSON.name}</h3>
                                                <p className="text-white/80 text-xs">{typeof FEATURED_PERSON.title === 'object' ? FEATURED_PERSON.title[locale] : FEATURED_PERSON.title}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Alumni Cards */}
                                {alumniData.map((person, index) => {
                                    const personName = typeof person.name === 'object' ? person.name[locale] : person.name;
                                    const personTitle = typeof person.title === 'object' ? person.title[locale] : person.title;
                                    const isApiImage = typeof person.image === 'string';
                                    return (
                                    <div
                                        key={person.id || person._id || index}
                                        className="flex-shrink-0 w-[140px] sm:w-[160px] lg:w-[160px] xl:w-[180px] pl-3"
                                    >
                                        <div className="group relative overflow-hidden bg-gray-100 cursor-pointer">
                                            <div className="relative aspect-square">
                                                {isApiImage ? (
                                                    <img
                                                        src={person.image}
                                                        alt={personName || ''}
                                                        className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <Image
                                                        src={person.image}
                                                        alt={personName || ''}
                                                        fill
                                                        className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                                                        sizes="180px"
                                                    />
                                                )}
                                                {/* Shadow overlay from bottom on hover */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                {/* Name and title - slides up on hover */}
                                                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                                                    <h3 className="text-white font-bold text-sm lg:text-base leading-tight">
                                                        {personName}
                                                    </h3>
                                                    <p className="text-white/80 text-xs mt-0.5">{personTitle}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Navigation Buttons */}

                    </div>
                </div>
            </div>
        </section>
    );
}
