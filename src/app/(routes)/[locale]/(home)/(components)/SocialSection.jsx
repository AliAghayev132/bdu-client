"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import {
    Building2,
    BookOpen,
    Music,
    Tv,
    UtensilsCrossed,
    Dumbbell,
    Newspaper,
    Stethoscope,
    Coffee
} from "lucide-react";

// Mock data - şəkilləri sonra dəyişə bilərsiniz
const SOCIAL_ITEMS = [
    {
        id: 1,
        key: "dormitory",
        href: "/telebe-evi",
        icon: Building2,
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1600&auto=format&fit=crop",
    },
    {
        id: 2,
        key: "library",
        href: "/kitab-evi",
        icon: BookOpen,
        image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1600&auto=format&fit=crop",
    },
    {
        id: 3,
        key: "culture",
        href: "/medeniyyet",
        icon: Music,
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1600&auto=format&fit=crop",
    },
    {
        id: 4,
        key: "tv",
        href: "/bdu-tv",
        icon: Tv,
        image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=1600&auto=format&fit=crop",
    },
    {
        id: 5,
        key: "cafeteria",
        href: "/ictimai-iase",
        icon: UtensilsCrossed,
        image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?q=80&w=1600&auto=format&fit=crop",
    },
    {
        id: 6,
        key: "sports",
        href: "/idman",
        icon: Dumbbell,
        image: "https://images.unsplash.com/photo-1638569794984-d47b2983c1c6?q=80&w=1600&auto=format&fit=crop",
    },
    {
        id: 7,
        key: "newspaper",
        href: "/qezet",
        icon: Newspaper,
        image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1600&auto=format&fit=crop",
    },
    {
        id: 8,
        key: "medical",
        href: "/tibbi-xidmet",
        icon: Stethoscope,
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1600&auto=format&fit=crop",
    },
    {
        id: 9,
        key: "leisure",
        href: "/istihet",
        icon: Coffee,
        image: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=1600&auto=format&fit=crop",
    },
];

export default function SocialSection() {
    const t = useTranslations("home");
    const [activeIndex, setActiveIndex] = useState(0);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const imageRefs = useRef([]);
    const animationRef = useRef(null);

    // Initialize refs array
    useEffect(() => {
        imageRefs.current = imageRefs.current.slice(0, SOCIAL_ITEMS.length);
    }, []);

    const handleItemHover = useCallback((index) => {
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
                SOCIAL_ITEMS.forEach((_, i) => {
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

        // Animate next image in
        animationRef.current.to(nextRef, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.4,
            ease: "power3.inOut",
        }, 0);

    }, [activeIndex]);

    const currentItem = SOCIAL_ITEMS[hoveredIndex ?? activeIndex];

    return (
        <section className="wrapper sm:py-10 py-4">
            <div className="bg-primary/5 xl:border-2 border-primary/20 sm:py-8 sm:px-8 py-6 px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="md:text-2xl sm:text-xl text-lg font-bold text-secondary uppercase tracking-wide">
                        {t("social.title", { default: "SOSİAL HƏYAT" })}
                    </h2>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left - Buttons Grid */}
                    <div>
                        <div className="grid grid-cols-3 gap-4">
                            {SOCIAL_ITEMS.map((item, index) => {
                                const Icon = item.icon;
                                const isActive = hoveredIndex === index || (hoveredIndex === null && activeIndex === index);

                                return (
                                    <button
                                        key={item.id}
                                        className={`group flex flex-col items-center gap-3 p-4 lg:p-6 rounded-lg transition-all ${isActive
                                            ? "bg-secondary text-white"
                                            : "bg-white hover:bg-secondary/5 text-secondary"
                                            }`}
                                        onMouseEnter={() => handleItemHover(index)}
                                    >
                                        <Icon className={`w-8 h-8 lg:w-10 lg:h-10 ${isActive ? "text-white" : "text-primary"
                                            }`} />
                                        <span className={`text-xs lg:text-sm font-medium text-center leading-tight ${isActive ? "text-white" : "text-secondary/80"
                                            }`}>
                                            {t(`social.items.${item.key}`, { default: item.key })}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Description Box */}
                        <div className="mt-6 p-4 lg:p-6 bg-white border-l-4 border-primary">
                            <h3 className="font-bold text-secondary uppercase mb-2">
                                {t(`social.items.${currentItem.key}`, { default: currentItem.key })}
                            </h3>
                            <p className="text-secondary/70 text-sm leading-relaxed">
                                {t(`social.descriptions.${currentItem.key}`, {
                                    default: "Universitetin sosial həyatı haqqında ətraflı məlumat."
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Right - Single Image - stretches to match left side */}
                    <div className="relative overflow-hidden bg-gray-100 rounded-lg min-h-[400px] lg:min-h-0">
                        {/* All images preloaded */}
                        {SOCIAL_ITEMS.map((item, index) => (
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
                                    alt={item.key}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    priority={index === 0}
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-secondary/30 via-transparent to-transparent" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
