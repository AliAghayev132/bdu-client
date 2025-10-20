'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { translateUrl } from '@/utils/urlTranslator';
import { useGSAP } from '@gsap/react';

export default function MobileMenu({ isOpen, onClose }) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef(null);
  const overlayRef = useRef(null);
  const submenuRef = useRef(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const handleLanguageChange = (newLocale) => {
    const translatedPath = translateUrl(pathname, newLocale);
    router.replace(translatedPath, { locale: newLocale });
  };

  const openSubmenu = (menuKey) => {
    setActiveSubmenu(menuKey);
    if (submenuRef.current) {
      gsap.to(submenuRef.current, {
        x: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  const closeSubmenu = () => {
    if (submenuRef.current) {
      gsap.to(submenuRef.current, {
        x: '100%',
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => setActiveSubmenu(null),
      });
    }
  };

 useGSAP(() => {
    if (!menuRef.current || !overlayRef.current) return;

    const ctx = gsap.context(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
        
        // Fade in animasiyası
        gsap.to(overlayRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
        
        gsap.to(menuRef.current, {
          x: 0,
          opacity: 1,
          duration: 0.4,
          ease: 'power3.out',
        });
      } else {
        // Fade out animasiyası
        gsap.to(menuRef.current, {
          x: '100%',
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
        });
        
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            document.body.style.overflow = 'unset';
          },
        });
      }
    });

    return () => {
      ctx.revert();
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const mainMenuItems = [
    { 
      key: 'university', 
      href: '/university',
      hasSubmenu: true,
      submenu: [
        { label: 'University History', href: '/university/history' },
        { label: 'Heydar Aliyev and BSU', href: '/university/aliyev' },
        { label: 'President of Azerbaijan and BSU', href: '/university/president' },
        { label: 'Board of Trustees', href: '/university/trustees' },
        { label: 'Scientific Council', href: '/university/council' },
        { label: 'Scientific-Methodological Council', href: '/university/methodological' },
        { label: 'Accreditation', href: '/university/accreditation' },
        { label: 'Quality assurance', href: '/university/quality' },
        { label: 'Rankings', href: '/university/rankings' },
        { label: 'Leadership', href: '/university/leadership' },
        { label: 'Official documents', href: '/university/documents' },
        { label: 'Honorary doctors', href: '/university/doctors' },
        { label: 'Alumni', href: '/university/alumni' },
        { label: 'Campus', href: '/university/campus' },
        { label: 'Gazakh branch', href: '/university/gazakh' },
        { label: 'Economics and Humanities College', href: '/university/college' },
        { label: 'Young Talents Lyceum', href: '/university/lyceum' },
      ]
    },
    { key: 'education', href: '/education', hasSubmenu: true, submenu: [] },
    { key: 'science', href: '/science', hasSubmenu: true, submenu: [] },
    { key: 'social', href: '/social', hasSubmenu: true, submenu: [] },
    { key: 'cooperation', href: '/cooperation', hasSubmenu: true, submenu: [] },
  ];

  const subMenuItems = [
    { key: 'rectorOffice', href: '/rector', label: 'Appeal to the Rector' },
    { key: 'applicants', href: '/applicants', label: 'For applicants' },
    { key: 'students', href: '/students', label: 'For students' },
    { key: 'graduates', href: '/graduates', label: 'For employees' },
    { key: 'news', href: '/contact', label: 'For graduates' },
    { key: 'contact', href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 z-[60] opacity-0 pointer-events-none lg:hidden"
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
        onClick={onClose}
      />

      {/* Mobile Menu - Full Screen */}
      <div
        ref={menuRef}
        className="bdu-mobile-menu fixed inset-0 bg-white z-[70] lg:hidden opacity-0"
        style={{ transform: 'translateX(100%)' }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Menyu</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Top Bar - Language */}
          <div className="bg-container text-white px-4 py-3">
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => handleLanguageChange('az')}
                className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${
                  locale === 'az' ? 'bg-white text-container' : 'bg-secondary'
                }`}
              >
                AZ
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${
                  locale === 'en' ? 'bg-white text-container' : 'bg-secondary'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="px-4 py-3 border-b">
            <div className="relative">
              <input
                type="search"
                placeholder="Search"
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto">
            {/* Main Menu Items */}
            <div className="border-b">
              {mainMenuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => item.hasSubmenu ? openSubmenu(item.key) : null}
                  className="w-full flex items-center justify-between px-4 py-4 text-left font-medium text-gray-800 hover:bg-bg-light transition-colors uppercase text-sm border-b"
                >
                  {t(item.key)}
                  {item.hasSubmenu && (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>

            {/* Sub Menu Items */}
            <div className="py-2">
              {subMenuItems.map((item) => (
                <Link
                  key={item.key}
                  href={typeof item.href === 'object' ? item.href[locale] : item.href}
                  onClick={onClose}
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-bg-light hover:text-primary transition-colors"
                >
                  {item.label[locale] || item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Submenu Panel */}
      {activeSubmenu && (
        <div
          ref={submenuRef}
          className="fixed inset-0 bg-white z-[80] lg:hidden"
          style={{ transform: 'translateX(100%)' }}
        >
          <div className="flex flex-col h-full">
            {/* Submenu Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b">
              <button
                onClick={closeSubmenu}
                className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Menyu</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Submenu Title Bar */}
            <div className="bg-container text-white px-4 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold uppercase">{t(activeSubmenu)}</h2>
              <span className="text-sm">e-BDU</span>
            </div>

            {/* Submenu Items */}
            <nav className="flex-1 overflow-y-auto">
              {mainMenuItems.find(item => item.key === activeSubmenu)?.submenu?.map((subItem, idx) => (
                <Link
                  key={idx}
                  href={typeof subItem.href === 'object' ? subItem.href[locale] : subItem.href}
                  onClick={onClose}
                  className="block px-4 py-3 text-gray-700 hover:bg-bg-light hover:text-primary transition-colors border-b"
                >
                  {subItem.label[locale] || subItem.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
