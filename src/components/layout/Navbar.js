'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useState, useEffect, useRef, useCallback } from 'react';
import MegaMenu from './MegaMenu';
import { menuData, bottomNavItems, getLabel } from '@/data/menuData';
import { translateUrl } from "@/utils/urlTranslator";
import { useGSAP } from '@gsap/react';

export default function Navbar({ onMenuToggle, navbarTop = 0 }) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [activeMenu, setActiveMenu] = useState(null);
  const closeTimeoutRef = useRef(null);

  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = useCallback((newLocale) => {
    // Translate URL to target locale
    const translatedPath = translateUrl(pathname, newLocale);
    router.replace(translatedPath, { locale: newLocale });
  }, [pathname, router]);

  const topMenuKeys = ['university', 'education', 'science', 'social', 'cooperation'];

  const handleNavbarLeave = useCallback((e) => {
    // Clear any existing timeout first
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    
    // Əgər mega menu-ya gedirsə, bağlama
    const relatedTarget = e.relatedTarget;
    if (relatedTarget && relatedTarget instanceof Element && relatedTarget.closest('.bdu-mega-menu')) {
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

  return (
    <nav 
      className="bdu-nav text-secondary hidden lg:block relative z-50"
      onMouseEnter={handleNavbarEnter}
      onMouseLeave={handleNavbarLeave}
    >
      <div className=" mx-auto">
        {/* Main Navigation - Top Nav */}
        <div 
          className="bdu-nav-top wrapper flex items-center justify-between min-1600:py-2 py-1"
          style={{
            paddingLeft: "16px"
          }}
          onMouseLeave={(e) => {
            // Top nav-dan çıxanda mega menu-nu bağla
            const relatedTarget = e.relatedTarget;
            if (relatedTarget && relatedTarget instanceof Element) {
              // Əgər mega menu-ya gedirsə, bağlama
              if (relatedTarget.closest('.bdu-mega-menu')) {
                return;
              }
            }
            // Digər hallarda bağla
            if (closeTimeoutRef.current) {
              clearTimeout(closeTimeoutRef.current);
            }
            closeTimeoutRef.current = setTimeout(() => {
              setActiveMenu(null);
            }, 500);
          }}
        >
          {/* e-BDU Button */}
          {/* <Link
            href="/e-bdu"
            className="px-4 py-2 bg-white border border-secondary hover:bg-secondary/80 hover:text-white rounded text-sm font-medium transition-colors"
          >
            e-BDU
          </Link> */}

          {/* Desktop Mega Menu */}
          <div className="nav-top-links flex items-center space-x-1">
            {topMenuKeys.map((menuKey) => {
              const menuItem = menuData[menuKey];
              return (
                <div
                  key={menuKey}
                  className="relative"
                  onMouseEnter={() => handleMenuItemEnter(menuKey)}
                >
                  <button
                    className="px-4 laptop:py-4 py-3 laptop:text-sm text-xs font-medium hover:text-primary transition-colors uppercase"
                  >
                    {getLabel(menuItem, locale)}
                  </button>
                </div>
              );
            })}
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
          navbarTop={navbarTop}
        />

        {/* Bottom Navigation */}
        <div className='w-full border-t border-secondary/10'></div>
        <div 
          className="bdu-nav-bottom px-4 wrapper flex items-center justify-between space-x-6 py-4 "
        >
                {/* Right - Rector Info and Language Switcher */}
          <div className="flex items-center gap-6">
            {/* Language Switcher */}
            <div className="flex gap-2">
              <button
                onClick={() => handleLanguageChange("az")}
                className={`px-3 py-1 laptop:text-sm text-xs font-medium transition-colors ${
                  locale === "az"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                >
                AZ
              </button>
              <button
                onClick={() => handleLanguageChange("en")}
                className={`px-3 py-1 laptop:text-sm text-xs font-medium transition-colors ${
                  locale === "en"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                >
                EN
              </button>
            </div>
          </div>
                <div className='flex items-center gap-6'>
          {bottomNavItems.map((item) => (
            <Link
            key={item.id}
            href={typeof item.href === 'object' ? item.href[locale] : item.href}
            className="laptop:text-[15px] text-[14px] hover:text-primary transition-colors"
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
