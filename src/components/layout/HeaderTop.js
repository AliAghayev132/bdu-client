"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import aliyev from '@/assets/images/heydar-aliyev.png'

export default function HeaderTop({ onMenuToggle }) {
  const t = useTranslations("header");

  return (
    <div className=" bg-white border-b border-secondary/10">
      <div className="max-w-[1540px] mx-auto px-15 min-w-1600:py-2.5 py-2">
        {/* Mobile View */}
        <div className="flex lg:hidden py-2 items-center justify-between">
          <div className="flex items-center sm:gap-3 gap-1.5">
            <Link href="/" className="block w-11 h-11 overflow-hidden">
            <Image
              src="/bsu-logo.png"
              alt="BDU Logo"
              width={44}
              height={44}
              className="object-contain w-full h-full"
              />
              </Link>
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
            <Link href="/" className="block">
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
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <Link href="/" className="block mb-1">
              <Image
                src="/bsu-icon.svg"
                alt="BDU Logo"
                width={60}
                height={60}
                className="object-contain"
              />
            </Link>
            
            {/* 1919 Decorative Line */}
            <div className="flex items-center w-[300px] gap-2 mt-2">
              <div className="h-[0.8px] flex-1 bg-primary" />
              <span className="text-[14px] font-bold text-primary tracking-[2px] font-mark-pro">1919</span>
              <div className="h-[0.8px] flex-1 bg-primary" />
            </div>
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
