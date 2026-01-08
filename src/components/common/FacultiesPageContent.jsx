"use client";

import React from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import StructuredData from "@/components/seo/StructuredData";
import Breadcrumbs from "@/app/(routes)/[locale]/[category]/[...slug]/(components)/Breadcrumbs";
import PageTitle from "./PageTitle";
import FacultyCard from "./FacultyCard";
import { getFacultiesByCategory, facultyCategories } from "@/data/facultiesData";

const FacultiesPageContent = ({ locale, content }) => {
    if (!content) return null;

    const path = locale === "az" ? "/fakulteler" : "/en/faculties";
    const breadcrumbs = [
        { label: locale === "az" ? "Ana səhifə" : "Home", href: "/" },
        { label: content.breadcrumbs, href: path },
    ];

    // Təbiət fakültələri
    const naturalFaculties = getFacultiesByCategory("natural");

    return (
        <>
            {/* Structured Data */}
            <StructuredData
                type="breadcrumb"
                data={{ breadcrumbs }}
                locale={locale}
            />

            {/* Breadcrumbs */}
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            {/* Page Content */}
            <div className="wrapper mx-auto px-4 py-3">
                <header className="w-full mx-auto laptop:mb-6 mb-3">
                    <PageTitle title={content.title} />
                    {content.description && (
                        <p className="text-gray-600 text-sm sm:text-base max-w-3xl mt-2">
                            {content.description}
                        </p>
                    )}
                </header>

                {/* Faculty Categories */}
                <div className="space-y-10">
                    {/* Təbiət Fənləri Fakültələri */}
                    <section>
                        <h2 className="text-lg sm:text-xl font-bold text-primary mb-4 pb-2 border-b border-primary/20">
                            {content.categories?.natural}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {naturalFaculties.map((faculty) => (
                                <FacultyCard key={faculty.id} faculty={faculty} />
                            ))}
                        </div>
                    </section>
                </div>

                {/* Info Box */}
                <div className="mt-12 p-6 bg-secondary/5 rounded-2xl border border-secondary/10">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-secondary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-secondary mb-1">
                                {content.infoBox?.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {content.infoBox?.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FacultiesPageContent;
