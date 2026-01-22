"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ArrowUpRight } from "lucide-react";

// Mock data - şəkilləri sonra dəyişə bilərsiniz
const SCIENCE_LINKS = [
    {
        id: 1,
        key: "library",
        href: "/elmi-kitabxana",
        image: "https://images.unsplash.com/photo-1588580000645-4562a6d2c839?q=80&w=1600&auto=format&fit=crop",
    },
    {
        id: 2,
        key: "research",
        href: "/tedqiqat-merkezi",
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1600&auto=format&fit=crop",
    },
    {
        id: 3,
        key: "techCenter",
        href: "/texniki-yaradiciliq",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop",
    },
    {
        id: 4,
        key: "labs",
        href: "/laboratoriyalar",
        image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?q=80&w=1600&auto=format&fit=crop",
    },
];

export default function ScienceSection() {
    const t = useTranslations("home");
    const [activeIndex, setActiveIndex] = useState(0);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const imageRefs = useRef([]);
    const containerRef = useRef(null);
    const animationRef = useRef(null);

    // Initialize refs array
    useEffect(() => {
        imageRefs.current = imageRefs.current.slice(0, SCIENCE_LINKS.length);
    }, []);

    const handleLinkHover = useCallback((index) => {
        if (index === activeIndex) return;

        setHoveredIndex(index);

        // Kill any ongoing animation
        if (animationRef.current) {
            animationRef.current.kill();
        }

        const currentRef = imageRefs.current[activeIndex];
        const nextRef = imageRefs.current[index];

        if (!currentRef || !nextRef) {
            setActiveIndex(index);
            return;
        }

        // Set z-index: next image on top
        gsap.set(nextRef, { zIndex: 20, clipPath: "inset(0% 0% 100% 0%)" });
        gsap.set(currentRef, { zIndex: 10 });

        animationRef.current = gsap.timeline({
            onComplete: () => {
                setActiveIndex(index);
                // Reset all z-indexes and clip-paths
                SCIENCE_LINKS.forEach((_, i) => {
                    const ref = imageRefs.current[i];
                    if (ref) {
                        gsap.set(ref, {
                            zIndex: i === index ? 10 : 1,
                            clipPath: "inset(0% 0% 0% 0%)"
                        });
                    }
                });
            }
        });

        // Custom ease for premium feel
        const customEase = "power3.inOut";

        // Animate next image in (reveal from top to bottom)
        animationRef.current.to(nextRef, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.4,
            ease: customEase,
        }, 0);

    }, [activeIndex]);

    return (
        <section className="wrapper sm:py-10 py-4">
            <div className="bg-primary/5 xl:border-2 border-primary/20 sm:py-8 sm:px-8 py-6 px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="md:text-2xl sm:text-xl text-lg font-bold text-secondary uppercase tracking-wide">
                        {t("science.title", { default: "ELM VƏ İNNOVASİYA" })}
                    </h2>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left - Image with clip-path animation */}
                    <div
                        ref={containerRef}
                        className="relative aspect-[4/3] lg:aspect-[16/11] overflow-hidden bg-gray-100"
                    >
                        {/* All images preloaded - visibility controlled by z-index */}
                        {SCIENCE_LINKS.map((item, index) => (
                            <div
                                key={item.id}
                                ref={el => imageRefs.current[index] = el}
                                className="absolute inset-0"
                                style={{
                                    zIndex: index === activeIndex ? 10 : 1,
                                    clipPath: "inset(0% 0% 0% 0%)"
                                }}
                            >
                                <Image
                                    src={item.image}
                                    alt={t(`science.items.${item.key}`, { default: item.key })}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    priority={index === 0}
                                />
                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 via-transparent to-transparent" />
                            </div>
                        ))}

                        {/* Active indicator badge */}
                        <div className="absolute bottom-4 left-4 px-4 py-2 bg-white/95 backdrop-blur-sm z-30">
                            <span className="text-secondary font-bold text-sm uppercase tracking-wider">
                                {t(`science.items.${SCIENCE_LINKS[activeIndex].key}`, { default: SCIENCE_LINKS[activeIndex].key })}
                            </span>
                        </div>
                    </div>

                    {/* Right - Links */}
                    <div className="flex flex-col justify-center">
                        <div className="space-y-1">
                            {SCIENCE_LINKS.map((item, index) => (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={`group relative flex items-center justify-between py-4 lg:py-5 border-b border-secondary/10 ${activeIndex === index
                                        ? "border-secondary/30"
                                        : "hover:border-secondary/30"
                                        }`}
                                    onMouseEnter={() => handleLinkHover(index)}
                                >
                                    {/* Link number */}
                                    <div className="flex items-center gap-4 lg:gap-6">
                                        <span className={`text-sm font-mono ${hoveredIndex === index || (hoveredIndex === null && activeIndex === index)
                                                ? "text-primary"
                                                : "text-secondary/40"
                                            }`}>
                                            0{index + 1}
                                        </span>

                                        {/* Link text */}
                                        <span className={`text-lg lg:text-xl font-semibold uppercase tracking-wide ${hoveredIndex === index || (hoveredIndex === null && activeIndex === index)
                                                ? "text-secondary"
                                                : "text-secondary/70"
                                            }`}>
                                            {t(`science.items.${item.key}`, { default: item.key })}
                                        </span>
                                    </div>

                                    {/* Arrow icon */}
                                    <div className={`flex items-center justify-center min-w-8 min-h-8 rounded-full ${hoveredIndex === index || (hoveredIndex === null && activeIndex === index)
                                            ? "bg-primary text-white"
                                            : "bg-secondary/5 text-secondary/50"
                                        }`}>
                                        <ArrowUpRight className="w-4 h-4" />
                                    </div>

                                    {/* Active indicator line */}
                                    <div className={`absolute left-0 bottom-0 h-[2px] bg-primary ${hoveredIndex === index || (hoveredIndex === null && activeIndex === index)
                                            ? "w-full"
                                            : "w-0"
                                        }`} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
