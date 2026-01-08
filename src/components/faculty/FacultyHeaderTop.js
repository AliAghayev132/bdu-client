"use client";

import { useLocale } from "next-intl";
import Image from "next/image";
import { useFaculty } from "@/context/FacultyContext";

/**
 * FacultyHeaderTop - Fakültə üçün xüsusi header top
 * Logo və ad fakültəyə görə dəyişir
 */
export default function FacultyHeaderTop({ onMenuToggle }) {
  const locale = useLocale();
  const { faculty, themeColor, logo, name } = useFaculty();

  // Main BDU saytına keçid üçün URL
  const mainSiteUrl = "https://bdu.info.az";

  return (
    <div
      className="border-b border-white/20"
      style={{ backgroundColor: themeColor }}
    >
      <div className="max-w-[1600px] mx-auto px-4 min-w-1600:py-2.5 py-2">
        {/* Mobile View */}
        <div className="flex lg:hidden py-2 items-center justify-between">
          <div className="flex items-center sm:gap-3 gap-1.5">
            <div className="w-11 h-11 overflow-hidden rounded-full bg-white/10">
              <Image
                src={logo}
                alt={name[locale]}
                width={44}
                height={44}
                className="object-contain w-full h-full "
              />
            </div>
            <div>
              <p className="sm:text-[8px] text-[6px] mb-[2px] text-white/70 uppercase tracking-wide">
                BAKI DÖVLƏT UNİVERSİTETİ
              </p>
              <h1 className="sm:text-sm text-xs font-bold text-white uppercase">
                {name[locale]}
              </h1>
            </div>
          </div>
          <button
            onClick={onMenuToggle}
            className="p-2 hover:bg-white/10 rounded transition-colors"
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:flex items-center justify-between relative">
          {/* Left - Faculty Logo and Name */}
          <div className="flex items-center gap-4">
            <div className="laptop:w-20 w-18 h-20 overflow-hidden rounded-full bg-white p-1">
              <Image
                src={logo}
                alt={name[locale]}
                width={80}
                height={80}
                className="object-contain w-full h-full "
              />
            </div>
            <div>
              <p className="laptop:text-xs text-[10px] text-white/70 uppercase tracking-wide">
                BAKI DÖVLƏT UNİVERSİTETİ
              </p>
              <h1 className="laptop:text-xl text-lg font-bold text-white uppercase">
                {name[locale]}
              </h1>
            </div>
          </div>

          {/* Center - BDU Icon */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <a
              href={mainSiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block opacity-80 hover:opacity-100 transition-opacity"
            >
              <Image
                src="/bsu-icon.svg"
                alt="BDU Logo"
                width={64}
                height={64}
                className="object-contain invert brightness-0"
              />
            </a>
          </div>

          {/* Right - Quick Links (Fakültə üçün sadələşdirilmiş) */}
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] text-white/60 uppercase">
                {locale === "az" ? "Əsas sayta keçid" : "Go to main site"}
              </span>
              <a
                href={mainSiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white font-medium hover:underline"
              >
                bdu.info.az
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
