"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

// Mock data - şəkilləri sonra dəyişə bilərsiniz
const INTERNATIONAL_LINKS = [
    {
        id: 1,
        key: "foreignStudents",
        href: "/xarici-telebeler",
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop",
    },
    {
        id: 2,
        key: "doubleDegree",
        href: "/ikili-diplom",
        image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop",
    },
    {
        id: 3,
        key: "internationalCenters",
        href: "/beynelxalq-merkezler",
        image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop",
    },
    {
        id: 4,
        key: "internationalOrgs",
        href: "/beynelxalq-teskilatlar",
        image: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=800&auto=format&fit=crop",
    },
    {
        id: 5,
        key: "grants",
        href: "/qrant-layiheleri",
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop",
    },
];

export default function InternationalRelationsSection() {
    const t = useTranslations("home");

    return (
        <section className="wrapper sm:py-10 py-4">
            <div className="bg-primary/5 xl:border-2 border-primary/20 sm:py-8 sm:px-8 py-6 px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="md:text-2xl sm:text-xl text-lg font-bold text-secondary uppercase tracking-wide">
                        {t("internationalRelations.title")}
                    </h2>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                    {INTERNATIONAL_LINKS.map((item) => (
                        <Link
                            key={item.id}
                            href={item.href}
                            className="group flex flex-col bg-white"
                        >
                            {/* Image */}
                            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                                <Image
                                    src={item.image}
                                    alt={t(`internationalRelations.items.${item.key}`)}
                                    width={600}
                                    height={600}
                                    className="object-cover w-full h-full will-change-transform transition-transform duration-500 ease-out group-hover:scale-105"
                                />
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/20 transition-colors duration-300" />
                            </div>

                            {/* Title */}
                            <div className="pt-3 pb-4 flex items-center justify-center">
                                <h3 className="text-[11px] h-full sm:text-xs lg:text-sm font-bold text-secondary/80 group-hover:text-secondary uppercase tracking-wide leading-tight transition-colors duration-300 text-center">
                                    {t(`internationalRelations.items.${item.key}`)}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
