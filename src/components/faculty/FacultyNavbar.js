"use client";

import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useFaculty } from "@/context/FacultyContext";
import { translateUrl } from "@/utils/urlTranslator";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

/**
 * FacultyNavbar - Fakültə üçün xüsusi navbar
 * Dizayn əsas Navbar ilə eyni, sadəcə rəng və menu fərqli
 */
export default function FacultyNavbar({ onMenuToggle, navbarTop = 0 }) {
  const locale = useLocale();
  const { faculty, themeColor, menuData } = useFaculty();
  const [activeMenu, setActiveMenu] = useState(null);
  const closeTimeoutRef = useRef(null);
  const navRef = useRef(null);
  const topNavRef = useRef(null);
  const stickyLogoRef = useRef(null);
  const [topNavBottom, setTopNavBottom] = useState(null);
  const [showStickyLogo, setShowStickyLogo] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = useCallback(
    (newLocale) => {
      const targetPath = translateUrl(pathname, newLocale);
      router.replace(targetPath, { locale: newLocale });
    },
    [pathname, router]
  );

  // Fakültə menu itemləri
  const topMenuKeys = menuData ? Object.keys(menuData) : [];

  const handleNavbarLeave = useCallback((e) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    const relatedTarget = e.relatedTarget;
    if (
      relatedTarget &&
      relatedTarget instanceof Element &&
      relatedTarget.closest(".faculty-mega-menu")
    ) {
      return;
    }
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  }, []);

  const handleNavbarEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
  }, []);

  const handleCloseMenu = useCallback(() => {
    setActiveMenu(null);
  }, []);

  const handleMenuItemEnter = useCallback((menuKey) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
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

  // Dropdown menu render
  const renderDropdown = (menuKey) => {
    if (!menuData || !menuData[menuKey]) return null;
    const items = menuData[menuKey].items || [];

    return (
      <div
        className="faculty-mega-menu absolute top-full left-0 mt-1 min-w-[200px] bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50"
        onMouseEnter={handleNavbarEnter}
        onMouseLeave={handleNavbarLeave}
      >
        {items.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            onClick={handleCloseMenu}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--faculty-primary)] transition-colors"
            style={{ "--faculty-primary": themeColor }}
          >
            {typeof item.label === "object" ? item.label[locale] : item.label}
          </Link>
        ))}
      </div>
    );
  };

  // Bottom nav itemləri - fakültə üçün
  const bottomNavItems = [
    {
      id: "applicants",
      label: { az: "Abituriyentlər üçün", en: "For Applicants" },
      href: "/applicants",
    },
    {
      id: "students",
      label: { az: "Tələbələr üçün", en: "For Students" },
      href: "/students",
    },
    {
      id: "graduates",
      label: { az: "Məzunlar üçün", en: "For Graduates" },
      href: "/graduates",
    },
    {
      id: "employees",
      label: { az: "Əməkdaşlar üçün", en: "For Employees" },
      href: "/employees",
    },
  ];

  return (
    <nav
      ref={navRef}
      className="faculty-nav text-white hidden lg:block relative z-50"
      style={{ backgroundColor: themeColor }}
      onMouseEnter={handleNavbarEnter}
      onMouseLeave={handleNavbarLeave}
    >
      <div className="relative mx-auto">
        {/* Main Navigation - Top Nav */}
        <div
          ref={topNavRef}
          className="wrapper relative flex items-center justify-between min-1600:py-2 py-1"
          style={{
            paddingLeft: showStickyLogo ? "130px" : "16px",
            transition: "all 0.3s ease",
          }}
        >
          {/* Sticky logo placeholder */}
          <div
            ref={stickyLogoRef}
            className="absolute left-10 top-full -translate-y-1/2 opacity-0 scale-90"
            style={{ pointerEvents: "none" }}
          >
            {faculty && (
              <Image
                src={faculty.logo}
                alt={faculty.name[locale]}
                width={60}
                height={60}
                className="object-contain rounded-full bg-white p-1"
              />
            )}
          </div>

          {/* Desktop Menu Items */}
          <div className="nav-top-links w-full flex items-center justify-between space-x-1">
            <div className="flex items-center gap-1">
              {/* Dil selector sol tərəfdə */}
              <div className="flex items-center gap-1 mr-4 border-r border-white/20 pr-4">
                <button
                  onClick={() => handleLanguageChange("az")}
                  className={`px-2 py-0.5 text-xs font-medium transition-colors rounded ${
                    locale === "az"
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  AZ
                </button>
                <button
                  onClick={() => handleLanguageChange("en")}
                  className={`px-2 py-0.5 text-xs font-medium transition-colors rounded ${
                    locale === "en"
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Menu itemləri */}
              {topMenuKeys.map((menuKey) => {
                const menuItem = menuData[menuKey];
                if (!menuItem) return null;

                return (
                  <div
                    key={menuKey}
                    className="relative"
                    onMouseEnter={() => handleMenuItemEnter(menuKey)}
                    onMouseLeave={handleNavbarLeave}
                  >
                    <button className="px-4 laptop:py-4 py-3 laptop:text-[14px] text-xs font-semibold hover:bg-white/10 transition-colors uppercase rounded">
                      {typeof menuItem.label === "object"
                        ? menuItem.label[locale]
                        : menuItem.label}
                    </button>

                    {/* Dropdown */}
                    {activeMenu === menuKey && renderDropdown(menuKey)}
                  </div>
                );
              })}
            </div>

            {/* Sağ tərəf - e-BDU button */}
            <a
              href="https://bdu.info.az"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded text-sm font-medium transition-colors"
            >
              e-BDU
            </a>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="w-full border-t border-white/20"></div>
        <div className="wrapper flex items-center justify-center gap-x-8 laptop:py-3 py-2 transition-all duration-400">
          {bottomNavItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="laptop:text-[13px] text-[11px] font-medium hover:underline transition-colors text-center text-white/90 hover:text-white"
            >
              {item.label[locale]}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
