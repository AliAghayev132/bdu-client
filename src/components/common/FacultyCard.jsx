'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';

/**
 * FacultyCard Component
 * Fakültələr səhifəsində istifadə edilən kart komponenti
 * Click-də /faculty-system/[facultyId] yoluna yönləndirir
 */
export default function FacultyCard({ faculty }) {
    const locale = useLocale();

    // Faculty system route
    const facultyHref = `/faculty-system/${faculty.id}`;

    return (
        <Link
            href={facultyHref}
            className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 
                 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 
                 transition-all duration-300 cursor-pointer"
            style={{
                '--faculty-color': faculty.themeColor,
            }}
        >
            {/* Logo */}
            <div className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden 
                      border-2 border-gray-100 group-hover:border-[var(--faculty-color)] 
                      transition-colors duration-300">
                <Image
                    src={faculty.logo}
                    alt={faculty.name[locale]}
                    fill
                    sizes="96px"
                    className="object-cover"
                />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-secondary 
                       group-hover:text-[var(--faculty-color)] transition-colors duration-300 
                       line-clamp-2">
                    {faculty.name[locale]}
                </h3>
                {faculty.description && (
                    <p className="mt-1 text-xs sm:text-sm text-gray-500 line-clamp-2 hidden sm:block">
                        {faculty.description[locale]}
                    </p>
                )}
            </div>

            {/* Arrow Icon */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-50 
                      group-hover:bg-[var(--faculty-color)] flex items-center justify-center 
                      transition-all duration-300">
                <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-300"
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
            </div>
        </Link>
    );
}

