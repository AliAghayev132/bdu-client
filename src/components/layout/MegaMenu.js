"use client";
import { useState, useRef, useEffect, useCallback, memo } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { gsap } from "gsap";
import { getLabel } from "@/data/menuData";
import { useGSAP } from "@gsap/react";
import bakuPanorama from "@/assets/images/baku-panorama-blue.png";
import Image from "next/image";

// Rekursiv SubMenu Panel Component
const SubMenuPanel = memo(function SubMenuPanel({
  items,
  parentLabel,
  locale,
  onClose,
  level = 0,
}) {
  const [hoveredSubItem, setHoveredSubItem] = useState(null);
  const hoverTimeoutRef = useRef(null);

  const handleSubItemEnter = (index) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredSubItem(index);
  };

  const handleSubItemLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredSubItem(null);
    }, 200);
  };

  const handleNestedPanelEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  return (
    <div className="flex flex-1">
      {/* Current Level - Subitems */}
      <div className="w-72 border-r border-gray-200 laptop:px-6 px-4">
        <h3 className="laptop:text-sm text-xs font-semibold text-secondary mb-2 pb-2 border-b border-gray-200">
          {parentLabel}
        </h3>
        <ul className="space-y-0.5">
          {items.map((subitem, subIndex) => (
            <li
              key={subIndex}
              className="relative"
              onMouseEnter={() => handleSubItemEnter(subIndex)}
              onMouseLeave={handleSubItemLeave}
            >
              {(() => {
                const itemHref = typeof subitem.href === "object"
                  ? subitem.href[locale]
                  : subitem.href;
                const hasValidHref = itemHref && itemHref !== "#" && itemHref !== "";

                const className = `group flex items-center justify-between px-4 py-2 rounded-lg laptop:text-sm text-xs transition-all ${
                  hoveredSubItem === subIndex
                    ? "bg-white text-primary font-medium"
                    : "text-gray-700 hover:bg-white/50"
                }`;

                const content = <span>{getLabel(subitem, locale)}</span>;
                const arrow = subitem.subitems && (
                  <svg
                    className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                );

                return hasValidHref ? (
                  <Link
                    href={itemHref}
                    onClick={onClose}
                    className={className}
                  >
                    {content}
                    {arrow}
                  </Link>
                ) : (
                  <div className={`${className} cursor-default`}>
                    {content}
                    {arrow}
                  </div>
                );
              })()}
            </li>
          ))}
        </ul>
      </div>

      {/* Next Level - Nested Subitems (Rekursiv) */}
      {hoveredSubItem !== null && items[hoveredSubItem]?.subitems && (
        <div
          className="flex-1 flex animate-in fade-in slide-in-from-left-1 duration-200"
          onMouseEnter={handleNestedPanelEnter}
          onMouseLeave={handleSubItemLeave}
        >
          <SubMenuPanel
            items={items[hoveredSubItem].subitems}
            parentLabel={getLabel(items[hoveredSubItem], locale)}
            locale={locale}
            onClose={onClose}
            level={level + 1}
          />
        </div>
      )}
    </div>
  );
});

export default function MegaMenu({
  activeMenu,
  menuData,
  topMenuKeys,
  isOpen,
  onClose,
  onMouseEnterFromNav,
}) {
  const locale = useLocale();
  const menuRef = useRef(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const hoverTimeoutRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const leftSidebarRef = useRef(null);
  const imageRef = useRef(null);
  const previousActiveMenu = useRef(null);

  const handleMenuEnter = useCallback(() => {
    // Clear any close timeouts
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    // Mega menu-ya girəndə navbar-a bildiriş göndər
    if (onMouseEnterFromNav) {
      onMouseEnterFromNav();
    }
  }, [onMouseEnterFromNav]);

  const handleMenuLeave = useCallback(
    (e) => {
      // Clear any existing timeout
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }

      // Əgər navbar-a qayıdırsa, bağlama (çünki başqa menu açılacaq)
      const relatedTarget = e.relatedTarget;
      if (
        relatedTarget &&
        relatedTarget instanceof Element &&
        (relatedTarget.closest(".bdu-nav") ||
          relatedTarget.closest(".bdu-navbar"))
      ) {
        return;
      }

      // Tamamilə kənara çıxanda bağla
      closeTimeoutRef.current = setTimeout(() => {
        onClose();
      }, 150);
    },
    [onClose]
  );

  // Handle hover with delay
  const handleItemEnter = useCallback((index) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredItem(index.toString());
  }, []);

  const handleItemLeave = useCallback(() => {
    // Set timeout to clear hover after 200ms
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredItem(null);
    }, 200);
  }, []);

  const handlePanelEnter = useCallback(() => {
    // Clear timeout when entering right panel
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  }, []);

  const handlePanelLeave = useCallback(() => {
    // Clear hover when leaving right panel
    setHoveredItem(null);
  }, []);

  // Animate mega menu open/close
  useGSAP(() => {
    if (!menuRef.current) return;

    const ctx = gsap.context(() => {
      if (isOpen) {
        gsap.set(menuRef.current, { display: "block" });
        gsap.to(menuRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });

        if (imageRef.current) {
          gsap.fromTo(
            imageRef.current,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 }
          );
        }
      } else {
        gsap.to(menuRef.current, {
          autoAlpha: 0,
          y: -10,
          duration: 0.2,
          ease: "power2.in",
          onComplete: () => {
            gsap.set(menuRef.current, { display: "none" });
          },
        });
      }
    }, menuRef);

    return () => {
      ctx.revert(); // ✅ təmiz animation
      clearTimeout(hoverTimeoutRef.current);
      clearTimeout(closeTimeoutRef.current);
    };
  }, [isOpen]);

  if (!activeMenu || !menuData[activeMenu]) return null;

  const currentItem = menuData[activeMenu];
  if (!currentItem || !currentItem.columns) return null;

  // Create sections with column titles
  const sections = currentItem.columns.map((column) => ({
    title: column.title,
    items: column.items,
  }));

  // Flatten all items for indexing (keep for backward compatibility)
  const allItems = currentItem.columns.flatMap((column) => column.items);

  return (
    <div
      ref={menuRef}
      className="bdu-mega-menu max-w-[1540px] mx-auto absolute left-0 right-0 z-[60] w-full"
      style={{
        display: "none",
        opacity: 0,
        visibility: "hidden",
        top: "100%",
      }}
      onMouseEnter={handleMenuEnter}
      onMouseLeave={handleMenuLeave}
    >
      {/* Invisible bridge - navbar və mega menu arasında hover bridge */}
      <div
        className="absolute -top-8 left-0 right-0 h-8 bg-transparent pointer-events-none"
        onMouseEnter={handleMenuEnter}
      />

      {/* Decorative top border */}
      {/* <div className="h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div> */}

      <div className="relative max-w-[1540px] mx-auto border-2 border-primary/50 rounded-xl bg-bg-light overflow-x-auto custom-scrollbar">
        <div className="w-xl overflow-hidden absolute bottom-0 right-5 z-10">
          <Image
            ref={imageRef}
            src={bakuPanorama}
            alt="BDU"
            width={720}
            height={125}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="max-w-[1540px] mx-auto flex min-w-max">
          {/* Left Sidebar - Sections with Titles */}
          <div
            ref={leftSidebarRef}
            className="w-72 flex-shrink-0 bg-bg-light border-r border-gray-200 py-6 max-h-[600px] overflow-y-auto custom-scrollbar"
          >
            <div className="space-y-3">
              {sections.map((section, sectionIndex) => {
                // Calculate global index for each item
                const startIndex = sections
                  .slice(0, sectionIndex)
                  .reduce((acc, s) => acc + s.items.length, 0);

                return (
                  <div key={sectionIndex} className="px-2">
                    {/* Section Title */}
                    <h3 className="laptop:text-sm text-xs font-semibold text-primary uppercase tracking-wider mb-2 px-4">
                      {typeof section.title === "object"
                        ? section.title[locale]
                        : section.title}
                    </h3>

                    {/* Section Items */}
                    <ul className="space-y-0.5">
                      {section.items.map((navItem, itemIndex) => {
                        const globalIndex = startIndex + itemIndex;
                        return (
                          <li
                            key={itemIndex}
                            className="relative"
                            onMouseEnter={() => handleItemEnter(globalIndex)}
                            onMouseLeave={handleItemLeave}
                          >
                            {(() => {
                              const itemHref = typeof navItem.href === "object"
                                ? navItem.href[locale]
                                : navItem.href;
                              const hasValidHref = itemHref && itemHref !== "#" && itemHref !== "";
                              
                              const content = (
                                <div className="flex-1">
                                  <div className="laptop:text-sm text-xs font-medium">
                                    {getLabel(navItem, locale)}
                                  </div>
                                  {navItem.description && (
                                    <div className="laptop:text-xs text-[10px] text-gray-500 mt-0.5 line-clamp-1">
                                      {getLabel(navItem.description, locale)}
                                    </div>
                                  )}
                                </div>
                              );

                              const arrow = navItem.subitems && (
                                <svg
                                  className="w-4 h-4 text-gray-400 group-hover:text-primary transition-all"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              );

                              const className = `group flex items-center rounded-lg overflow-hidden justify-between px-4 py-2 transition-all duration-150 ${
                                hoveredItem === globalIndex.toString()
                                  ? "bg-white text-primary"
                                  : "text-gray-700 hover:bg-white/50"
                              }`;

                              return hasValidHref ? (
                                <Link
                                  href={itemHref}
                                  onClick={onClose}
                                  className={className}
                                >
                                  {content}
                                  {arrow}
                                </Link>
                              ) : (
                                <div className={`${className} cursor-default`}>
                                  {content}
                                  {arrow}
                                </div>
                              );
                            })()}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel - Submenu Content (Rekursiv) */}
          <div
            className="flex-1 py-6 min-h-[400px] flex min-w-0"
            onMouseEnter={handlePanelEnter}
            onMouseLeave={handlePanelLeave}
          >
            {hoveredItem !== null &&
              allItems[parseInt(hoveredItem)]?.subitems && (
                <SubMenuPanel
                  items={allItems[parseInt(hoveredItem)].subitems}
                  parentLabel={getLabel(
                    allItems[parseInt(hoveredItem)],
                    locale
                  )}
                  locale={locale}
                  onClose={onClose}
                />
              )}

            {/* Empty state when no item is hovered */}
            {/* {hoveredItem === null && (
              <div className="flex items-center justify-center h-full text-gray-400 w-full">
                <p className="text-sm">Kateqoriyaya hover edin</p>
              </div>
            )} */}
          </div>
        </div>
      </div>

      {/* Decorative bottom shadow */}
      {/* <div className="h-2 bg-gradient-to-b from-gray-50 to-transparent"></div> */}
    </div>
  );
}
