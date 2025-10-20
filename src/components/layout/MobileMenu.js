'use client';

import { useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { useRef, useState, useCallback, memo, useEffect } from 'react';
import { gsap } from 'gsap';
import { translateUrl } from '@/utils/urlTranslator';
import { useGSAP } from '@gsap/react';
import { menuData, bottomNavItems, getLabel } from '@/data/menuData';

// Recursive Menu Item Component for submenu slides
const MenuItem = memo(({ item, locale, onClose, onNavigate }) => {
  const hasChildren = item.subitems && item.subitems.length > 0;
  const itemHref = typeof item.href === 'object' ? item.href[locale] : item.href;
  const itemLabel = getLabel(item, locale);

  const handleClick = useCallback(() => {
    if (hasChildren) {
      onNavigate(item);
    } else if (itemHref) {
      onClose();
    }
  }, [hasChildren, itemHref, item, onClose, onNavigate]);

  return (
    <div>
      {itemHref && !hasChildren ? (
        <Link
          href={itemHref}
          onClick={onClose}
          className="block px-4 py-3.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors border-b border-primary/10"
        >
          {itemLabel}
        </Link>
      ) : (
        <button
          onClick={handleClick}
          className="w-full flex items-center justify-between px-4 py-3.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors border-b border-primary/10"
        >
          <span>{itemLabel}</span>
          {hasChildren && (
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
});

MenuItem.displayName = 'MenuItem';

function MobileMenu({ isOpen, onClose }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef(null);
  const overlayRef = useRef(null);
  const slidesRef = useRef([]);
  
  // Navigation state: [main, category, subcategory, ...]
  const [navigationStack, setNavigationStack] = useState([{ type: 'main' }]);
  const currentSlide = navigationStack[navigationStack.length - 1];

  const handleLanguageChange = useCallback((newLocale) => {
    const translatedPath = translateUrl(pathname, newLocale);
    router.replace(translatedPath, { locale: newLocale });
  }, [pathname, router]);

  // Convert menuData to array
  const menuItems = Object.values(menuData);

  // Navigate to submenu
  const navigateToSubmenu = useCallback((item) => {
    setNavigationStack(prev => [...prev, { type: 'submenu', item }]);
  }, []);

  // Go back
  const navigateBack = useCallback(() => {
    setNavigationStack(prev => prev.slice(0, -1));
  }, []);

  // Reset navigation when menu closes
  useEffect(() => {
    if (!isOpen) {
      setNavigationStack([{ type: 'main' }]);
    }
  }, [isOpen]);

  // Main menu open/close animation
  useGSAP(() => {
    if (!menuRef.current || !overlayRef.current) return;

    const ctx = gsap.context(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
        gsap.to(overlayRef.current, { opacity: 1, duration: 0.25, ease: 'power2.out' });
        gsap.to(menuRef.current, { x: 0, duration: 0.3, ease: 'power3.out' });
      } else {
        gsap.to(menuRef.current, { x: '100%', duration: 0.25, ease: 'power2.in' });
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.25,
          ease: 'power2.in',
          onComplete: () => { document.body.style.overflow = 'unset'; }
        });
      }
    });

    return () => {
      ctx.revert();
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Slide navigation animation
  useEffect(() => {
    if (!isOpen) return;
    
    const currentIndex = navigationStack.length - 1;
    slidesRef.current.forEach((slide, index) => {
      if (!slide) return;
      
      if (index === currentIndex) {
        // Current slide
        gsap.to(slide, {
          x: 0,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
          display: 'flex'
        });
      } else if (index < currentIndex) {
        // Previous slides (to the left)
        gsap.to(slide, {
          x: '-100%',
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
          onComplete: () => { slide.style.display = 'none'; }
        });
      } else {
        // Future slides (to the right)
        gsap.set(slide, { x: '100%', opacity: 0, display: 'none' });
      }
    });
  }, [navigationStack, isOpen]);

  // Flatten menu columns
  const flattenMenuItems = useCallback((columns) => {
    const items = [];
    columns.forEach(column => {
      column.items.forEach(item => items.push(item));
    });
    return items;
  }, []);

  // Render main menu
  const renderMainMenu = () => (
    <div
      ref={el => slidesRef.current[0] = el}
      className="absolute inset-0 flex flex-col"
      style={{ transform: 'translateX(0)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-primary/20">
        <span className="font-semibold text-secondary">Menyu</span>
        <button
          onClick={onClose}
          className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
          aria-label="Close menu"
        >
          <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Language Switcher */}
      <div className="bg-secondary px-4 py-3">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handleLanguageChange('az')}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${
              locale === 'az' ? 'bg-white text-secondary shadow-sm' : 'bg-secondary/50 text-white hover:bg-secondary/70'
            }`}
          >
            AZ
          </button>
          <button
            onClick={() => handleLanguageChange('en')}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${
              locale === 'en' ? 'bg-white text-secondary shadow-sm' : 'bg-secondary/50 text-white hover:bg-secondary/70'
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-primary/20">
        <div className="relative">
          <input
            type="search"
            placeholder={locale === 'az' ? 'Axtar' : 'Search'}
            className="w-full pl-4 pr-10 py-2.5 border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
          />
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Main Categories */}
      <nav className="flex-1 overflow-y-auto">
        {menuItems.map((category) => (
          <button
            key={category.id}
            onClick={() => navigateToSubmenu(category)}
            className="w-full flex items-center justify-between px-4 py-4 text-left font-semibold text-secondary hover:bg-primary/5 transition-colors border-b border-primary/10 uppercase text-sm"
          >
            <span>{getLabel(category, locale)}</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}

        {/* Bottom Navigation */}
        <div className="border-t border-primary/20 mt-2">
          {bottomNavItems.map((item) => {
            const itemHref = typeof item.href === 'object' ? item.href[locale] : item.href;
            return (
              <Link
                key={item.id}
                href={itemHref}
                onClick={onClose}
                className="block px-4 py-3.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors border-b border-primary/10"
              >
                {getLabel(item, locale)}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );

  // Render submenu slide
  const renderSubmenu = (slideData, index) => {
    const { item } = slideData;
    const items = item.columns ? flattenMenuItems(item.columns) : (item.subitems || []);

    return (
      <div
        key={index}
        ref={el => slidesRef.current[index] = el}
        className="absolute inset-0 flex-col"
        style={{ transform: 'translateX(100%)', display: 'none' }}
      >
        {/* Header with Back Button */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-primary/20 bg-primary/5">
          <button
            onClick={navigateBack}
            className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
            aria-label="Back"
          >
            <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="flex-1 font-semibold text-secondary uppercase text-sm">
            {getLabel(item, locale)}
          </span>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Submenu Items */}
        <nav className="flex-1 overflow-y-auto">
          {items.map((subItem, idx) => (
            <MenuItem
              key={idx}
              item={subItem}
              locale={locale}
              onClose={onClose}
              onNavigate={navigateToSubmenu}
            />
          ))}
        </nav>
      </div>
    );
  };

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 z-[60] opacity-0 pointer-events-none lg:hidden"
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
        onClick={onClose}
      />

      {/* Mobile Menu - Full Screen with Slides */}
      <div
        ref={menuRef}
        className="bdu-mobile-menu fixed inset-0 bg-white z-[70] lg:hidden"
        style={{ transform: 'translateX(100%)' }}
      >
        <div className="relative h-full overflow-hidden">
          {/* Main Menu Slide */}
          {renderMainMenu()}

          {/* Submenu Slides */}
          {navigationStack.slice(1).map((slideData, index) => 
            renderSubmenu(slideData, index + 1)
          )}
        </div>
      </div>
    </>
  );
}

export default MobileMenu;
