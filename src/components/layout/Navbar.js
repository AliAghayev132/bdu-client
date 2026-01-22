"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import MegaMenu from "./MegaMenu";
import {
  bottomNavItems,
  getLabel,
  resolveLocalizedPath,
} from "@/data/menuData";
import { translateUrl } from "@/utils/urlTranslator";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import AnimatedButton from "../common/AnimatedButton/AnimatedButton";
import { useAlternateSlug } from "@/context/AlternateSlugContext";

export default function Navbar({ onMenuToggle, navbarTop = 0, menuData = {} }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [activeMenu, setActiveMenu] = useState(null);
  const closeTimeoutRef = useRef(null);
  const navRef = useRef(null);
  const topNavRef = useRef(null);
  const bottomNavRef = useRef(null);
  const stickyLogoRef = useRef(null);
  const [topNavBottom, setTopNavBottom] = useState(null);
  const [showStickyLogo, setShowStickyLogo] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // Get alternate slugs from context (for dynamic pages like news/announcements)
  const { alternateSlug } = useAlternateSlug();

  const handleLanguageChange = useCallback(
    (newLocale) => {
      // 1. First check if we have dynamic alternate slug from context (news, announcements, etc.)
      if (alternateSlug && alternateSlug[newLocale]) {
        router.replace(alternateSlug[newLocale], { locale: newLocale });
        return;
      }

      // 2. Fallback to static mapping from menuData/bottomNavItems
      const resolved = resolveLocalizedPath(pathname, newLocale);
      const targetPath = resolved || translateUrl(pathname, newLocale);
      router.replace(targetPath, { locale: newLocale });
    },
    [pathname, router, alternateSlug]
  );

  // Get top menu keys from backend data (only mega type menus)
  const topMenuKeys = Object.keys(menuData).filter(
    key => menuData[key]?.type === 'mega'
  ).sort((a, b) => (menuData[a]?.order || 0) - (menuData[b]?.order || 0));

  const handleNavbarLeave = useCallback((e) => {
    // Clear any existing timeout first
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    // Əgər mega menu-ya gedirsə, bağlama
    const relatedTarget = e.relatedTarget;
    if (
      relatedTarget &&
      relatedTarget instanceof Element &&
      relatedTarget.closest(".bdu-mega-menu")
    ) {
      return;
    }

    // Navbar-dan tamamilə çıxanda mega menu-nu bağla
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  }, []);

  const handleNavbarEnter = useCallback(() => {
    // Navbar-a qayıdanda timeout-u ləğv et
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
  }, []);

  const handleCloseMenu = useCallback(() => {
    setActiveMenu(null);
  }, []);

  const handleMenuItemEnter = useCallback((menuKey) => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    // Immediately switch to new menu
    setActiveMenu(menuKey);
  }, []);

  useGSAP(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleMeasure = () => {
      if (topNavRef.current) {
        const rect = topNavRef.current.getBoundingClientRect();
        setTopNavBottom(rect.bottom);
      }
      if (navRef.current) {
        const atTop = navRef.current.getBoundingClientRect().top <= 0;
        const isDesktop =
          typeof window !== "undefined" &&
          window.matchMedia &&
          window.matchMedia("(min-width: 1024px)").matches;
        setShowStickyLogo(atTop && isDesktop);
      }
    };
    handleMeasure();
    window.addEventListener("scroll", handleMeasure);
    window.addEventListener("resize", handleMeasure);
    return () => {
      window.removeEventListener("scroll", handleMeasure);
      window.removeEventListener("resize", handleMeasure);
    };
  }, []);

  useEffect(() => {
    if (!stickyLogoRef.current) return;
    if (showStickyLogo) {
      gsap.to(stickyLogoRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        delay: 0.2,
        ease: "power3.out",
        pointerEvents: "none",
      });
    } else {
      gsap.to(stickyLogoRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        ease: "power2.in",
      });
    }
  }, [showStickyLogo]);

  return (
    <nav
      ref={navRef}
      className="bdu-nav text-secondary hidden lg:block relative z-50"
      onMouseEnter={handleNavbarEnter}
      onMouseLeave={handleNavbarLeave}
    >
      <div className="relative mx-auto">
        {/* Main Navigation - Top Nav */}
        <div
          ref={topNavRef}
          className="bdu-nav-top wrapper relative flex items-center justify-between min-1600:py-2 py-1"
          style={{
            paddingLeft: showStickyLogo ? "130px" : "16px",
            transition: "all 0.3s ease",
          }}
          onMouseLeave={(e) => {
            const relatedTarget = e.relatedTarget;
            if (relatedTarget && relatedTarget instanceof Element) {
              if (relatedTarget.closest(".bdu-mega-menu")) {
                return;
              }
            }
            if (closeTimeoutRef.current) {
              clearTimeout(closeTimeoutRef.current);
            }
            closeTimeoutRef.current = setTimeout(() => {
              setActiveMenu(null);
            }, 150);
          }}
        >
          <div
            ref={stickyLogoRef}
            className="absolute left-10 top-full -translate-y-1/2 opacity-0 scale-90"
            style={{ pointerEvents: "none" }}
          >
            <Link href="/">
              <Image
                src="/bsu-logo.png"
                alt="BDU Logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </Link>
          </div>
          {/* e-BDU Button */}
          {/* <Link
            href="/e-bdu"
            className="px-4 py-2 bg-white border border-secondary hover:bg-secondary/80 hover:text-white rounded text-sm font-medium transition-colors"
          >
            e-BDU
          </Link> */}

          {/* Desktop Mega Menu */}
          <div className="nav-top-links w-full flex items-center justify-between space-x-1">
            <div className="flex items-center gap-1">
              {topMenuKeys.map((menuKey) => {
                const menuItem = menuData[menuKey];
                return (
                  <div
                    key={menuKey}
                    className="relative"
                    onMouseEnter={() => handleMenuItemEnter(menuKey)}
                  >
                    <button className="px-4 laptop:py-4 py-3 laptop:text-[14px] text-xs font-semibold hover:text-primary transition-colors uppercase">
                      {getLabel(menuItem, locale)}
                    </button>
                  </div>
                );
              })}
            </div>
            {/* Language Switcher */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleLanguageChange("az")}
                className={`px-3 py-1 laptop:text-sm text-xs font-medium transition-colors ${
                  locale === "az"
                    ? "bg-secondary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                AZ
              </button>
              <button
                onClick={() => handleLanguageChange("en")}
                className={`px-3 py-1 laptop:text-sm text-xs font-medium transition-colors ${
                  locale === "en"
                    ? "bg-secondary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Search */}
          {/* <div>
            <input
              type="search"
              placeholder="Axtarış..."
              className="px-4 py-1.5 rounded bg-white border border-secondary/30 text-secondary placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div> */}
          <div></div>
        </div>

        {/* Single Mega Menu - Content switches based on activeMenu */}
        <MegaMenu
          activeMenu={activeMenu}
          menuData={menuData}
          topMenuKeys={topMenuKeys}
          isOpen={activeMenu !== null}
          onClose={handleCloseMenu}
          onMouseEnterFromNav={handleNavbarEnter}
          navbarTop={topNavBottom ?? navbarTop}
        />

        {/* Bottom Navigation */}
        <div className="w-full border-t border-secondary/10"></div>
        <div
          ref={bottomNavRef}
          style={{
            paddingLeft: showStickyLogo ? "146px" : "32px",
            transition: "all 0.3s ease",
          }}
          className="bdu-nav-bottom  wrapper flex items-center justify-between space-x-6 laptop:py-4 py-2 transition-all duration-400"
        >
          {/* <button className="laptop:px-4 px-3 laptop:py-2 py-1.5 bg-bg-light  border border-white/30 hover:bg-secondary/80 hover:text-white laptop:text-sm text-xs font-medium transition-colors">
            e-BDU
          </button> */}
          <AnimatedButton label="e-BDU" animateOnScroll={false} width="8rem" />
          {/* Right - Rector Info and Language Switcher */}
          <div className="flex items-center  laptop:gap-x-8 gap-x-6">
            {bottomNavItems.map((item) => (
              <Link
                key={item.id}
                href={
                  typeof item.href === "object" ? item.href[locale] : item.href
                }
                className="laptop:text-[14px] text-[12px] font-medium hover:text-primary transition-colors text-center"
              >
                {getLabel(item, locale)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
