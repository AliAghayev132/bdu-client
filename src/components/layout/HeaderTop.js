"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import aliyev from '@/assets/images/heydar-aliyev.png'

export default function HeaderTop({ onMenuToggle }) {
  const t = useTranslations("header");



  return (
    <div className=" bg-white border-b border-secondary/10">
      <div className="max-w-[1600px] mx-auto px-4 min-w-1600:py-2.5 py-2">
        {/* Mobile View */}
        <div className="flex lg:hidden py-2 items-center justify-between">
          <div className="flex items-center sm:gap-3 gap-1.5">
            <Image
              src="/bsu-logo.png"
              alt="BDU Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <div>
            <p className="sm:text-[8px] text-[6px] mb-[2px] text-gray-600 uppercase tracking-wide">
                {t("subtitle")}
              </p>
            <h1 className="sm:text-sm text-xs font-bold text-secondary uppercase">
              {t("university")}
            </h1>
            </div>
          </div>
          <button
            onClick={onMenuToggle}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6 text-secondary"
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
          {/* Left - University Logo and Name */}
          <div className="flex items-center gap-4">
            <div className="laptop:w-20 w-18 overflow-hidden">
            <Link href="/">
              <Image
                src="/bsu-logo.png"
                alt="BDU Logo"
                width={80}
                height={80}
                className="object-contain w-full h-full"
                />
            </Link>
                </div>
            <div>
              <p className="laptop:text-xs text-[10px] text-gray-600 uppercase tracking-wide">
                {t("subtitle")}
              </p>
              <h1 className="laptop:text-xl text-lg font-bold text-secondary">
                {t("university")}
              </h1>
            </div>
          </div>

          {/* Center - BDU Logo - Absolute positioning for perfect centering */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/">
              <Image
                src="/bsu-icon.svg"
                alt="BDU Logo"
                width={64}
                height={64}
                className="object-contain"
              />
            </Link>
          </div>

          {/* Right - Rector Info and Language Switcher */}
          <div className="flex items-center gap-6">
            <p className="laptop:text-xs text-[10px] max-w-[270px] font-medium text-right text-primary ">
              Bakı Dövlət Universiteti Azərbaycan xalqının Azərbaycan Respublikasının milli sərvətidir, milli iftixarıdır.

            </p>
            <div className="laptop:w-20 w-18 overflow-hidden">
         <Image
         src={aliyev}
         alt="Heydar Aliyev"
         width={80}
         height={80}
         className="object-contain w-full h-full"
         />
         </div>

     
          </div>
        </div>
      </div>
    </div>
  );
}
