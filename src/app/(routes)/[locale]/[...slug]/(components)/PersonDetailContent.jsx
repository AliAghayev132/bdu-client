"use client";

import React from "react";
import Image from "next/image";
import Breadcrumbs from "@/app/(routes)/[locale]/[category]/[...slug]/(components)/Breadcrumbs";
import { Mail, Phone, Award, BookOpen, Briefcase, GraduationCap } from "lucide-react";

export default function PersonDetailContent({ person, locale, parentPage }) {
  const name = person.name?.[locale] || person.name?.az || "";
  const position = person.position?.[locale] || person.position?.az || "";
  const bio = person.bio?.[locale] || person.bio?.az || "";

  // Dinamik breadcrumbs — parentPage varsa ondan istifadə et
  const breadcrumbs = [
    { label: locale === "az" ? "Ana səhifə" : "Home", href: "/" },
  ];

  if (parentPage) {
    breadcrumbs.push({
      label: parentPage.title,
      href: parentPage.path,
    });
  }

  breadcrumbs.push({ label: name, href: "#" });

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
      "http://localhost:3001";
    return `${baseUrl}${imagePath}`;
  };

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      <div className="wrapper mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-secondary/5 to-primary/5 rounded-3xl p-8 md:p-12 mb-8">
          <div className="grid md:grid-cols-[300px_1fr] gap-8 items-start">
            {/* Profile Image */}
            <div className="relative">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                {person.image ? (
                  <Image
                    src={getImageUrl(person.image)}
                    alt={name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                    <span className="text-white text-6xl font-bold">
                      {name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-3">
                {name}
              </h1>
              <p className="text-xl text-primary font-semibold mb-6">
                {position}
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                {person.email && (
                  <a
                    href={`mailto:${person.email}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors group"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Mail size={20} className="text-primary" />
                    </div>
                    <span className="font-medium">{person.email}</span>
                  </a>
                )}
                {person.phone && (
                  <a
                    href={`tel:${person.phone}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors group"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Phone size={20} className="text-primary" />
                    </div>
                    <span className="font-medium">{person.phone}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        {bio && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <BookOpen size={20} className="text-primary" />
              </div>
              {locale === "az" ? "Bioqrafiya" : "Biography"}
            </h2>
            <div
              className="ProseMirror prose prose-lg max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: bio }}
            />
          </div>
        )}

        {/* Education Section */}
        {person.education && person.education.length > 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <GraduationCap size={20} className="text-primary" />
              </div>
              {locale === "az" ? "Təhsil" : "Education"}
            </h2>
            <div className="space-y-4">
              {person.education.map((edu, index) => (
                <div key={index} className="border-l-4 border-primary pl-6 py-2">
                  <h3 className="font-bold text-lg text-secondary">
                    {edu.degree?.[locale] || edu.degree?.az}
                  </h3>
                  <p className="text-gray-700">
                    {edu.institution?.[locale] || edu.institution?.az}
                  </p>
                  {edu.year && (
                    <p className="text-sm text-gray-500 mt-1">{edu.year}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience Section */}
        {person.experience && person.experience.length > 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Briefcase size={20} className="text-primary" />
              </div>
              {locale === "az" ? "İş Təcrübəsi" : "Experience"}
            </h2>
            <div className="space-y-4">
              {person.experience.map((exp, index) => (
                <div key={index} className="border-l-4 border-primary pl-6 py-2">
                  <h3 className="font-bold text-lg text-secondary">
                    {exp.position?.[locale] || exp.position?.az}
                  </h3>
                  <p className="text-gray-700">
                    {exp.organization?.[locale] || exp.organization?.az}
                  </p>
                  {(exp.startYear || exp.endYear) && (
                    <p className="text-sm text-gray-500 mt-1">
                      {exp.startYear} -{" "}
                      {exp.endYear ||
                        (locale === "az" ? "Davam edir" : "Present")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Awards Section */}
        {person.awards && person.awards.length > 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Award size={20} className="text-primary" />
              </div>
              {locale === "az" ? "Mükafatlar" : "Awards"}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {person.awards.map((award, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-4 border border-primary/20"
                >
                  <h3 className="font-bold text-secondary mb-1">
                    {award.title?.[locale] || award.title?.az}
                  </h3>
                  {award.year && (
                    <p className="text-sm text-gray-600">{award.year}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Publications Section */}
        {person.publications && person.publications.length > 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <BookOpen size={20} className="text-primary" />
              </div>
              {locale === "az" ? "Nəşrlər" : "Publications"}
            </h2>
            <div className="space-y-3">
              {person.publications.map((pub, index) => (
                <div
                  key={index}
                  className="border-b border-gray-100 pb-3 last:border-0"
                >
                  <p className="text-gray-700 font-medium">
                    {pub.title?.[locale] || pub.title?.az}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    {pub.type && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {pub.type}
                      </span>
                    )}
                    {pub.year && (
                      <span className="text-sm text-gray-500">{pub.year}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
