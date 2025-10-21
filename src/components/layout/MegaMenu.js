"use client";
import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { gsap } from "gsap";
import { getLabel } from "@/data/menuData";
import { useGSAP } from "@gsap/react";

// Rekursiv SubMenu Panel Component
function SubMenuPanel({ items, parentLabel, locale, onClose, level = 0 }) {
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
      <div className="w-80 border-r border-gray-200 px-6">
        <h3 className="text-base font-semibold text-secondary mb-4 pb-2 border-b border-gray-200">
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
              <div onClick={onClose}>
                <Link
                  href={
                    typeof subitem.href === "object"
                      ? subitem.href[locale]
                      : subitem.href
                  }
                  className={`group flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-all ${
                    hoveredSubItem === subIndex
                      ? "bg-white text-primary font-medium"
                      : "text-gray-700 hover:bg-white/50"
                  }`}
                >
                <span>{getLabel(subitem, locale)}</span>
                {subitem.subitems && (
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
                )}
              </Link>
              </div>
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
}

export default function MegaMenu({
  activeMenu,
  menuData,
  topMenuKeys,
  isOpen,
  onClose,
  onMouseEnterFromNav,
  navbarTop = 0,
}) {
  const locale = useLocale();
  const menuRef = useRef(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const hoverTimeoutRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const leftSidebarRef = useRef(null);
  const previousActiveMenu = useRef(null);

  const handleMenuEnter = () => {
    // Clear any close timeouts
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    // Mega menu-ya girəndə navbar-a bildiriş göndər
    if (onMouseEnterFromNav) {
      onMouseEnterFromNav();
    }
  };

  const handleMenuLeave = (e) => {
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
  };

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

  // Flatten all items from all columns into a single list
  const allItems = currentItem.columns.flatMap((column) => column.items);

  // Handle hover with delay
  const handleItemEnter = (index) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredItem(index.toString());
  };

  const handleItemLeave = () => {
    // Set timeout to clear hover after 200ms
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredItem(null);
    }, 200);
  };

  const handlePanelEnter = () => {
    // Clear timeout when entering right panel
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  const handlePanelLeave = () => {
    // Clear hover when leaving right panel
    setHoveredItem(null);
  };

  return (
    <div
      ref={menuRef}
      className="bdu-mega-menu fixed left-0 right-0 wrapper border-2 border-primary/50 rounded-xl bg-bg-light z-40"
      style={{
        display: "none",
        opacity: 0,
        visibility: "hidden",
        top: navbarTop > 0 ? `${navbarTop}px` : "var(--navbar-height, 120px)",
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

      <div className="w-full">
        <div className="max-w-[1540px] mx-auto flex">
          {/* Left Sidebar - All Items */}
          <div ref={leftSidebarRef} className="w-80 bg-bg-light border-r border-gray-200 py-6">
            <ul className="space-y-0.5">
              {allItems.map((navItem, itemIndex) => (
                <li
                  key={itemIndex}
                  className="relative px-2"
                  onMouseEnter={() => handleItemEnter(itemIndex)}
                  onMouseLeave={handleItemLeave}
                >
                  <div onClick={onClose}>
                    <Link
                      href={
                        typeof navItem.href === "object"
                          ? navItem.href[locale]
                          : navItem.href
                      }
                      className={`group flex items-center rounded-lg overflow-hidden justify-between px-6 py-2 transition-all duration-150 ${
                        hoveredItem === itemIndex.toString()
                          ? "bg-white text-primary"
                          : "text-gray-700 hover:bg-white/50"
                      }`}
                    >
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {getLabel(navItem, locale)}
                      </div>
                      {navItem.description && (
                        <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                          {getLabel(navItem.description, locale)}
                        </div>
                      )}
                    </div>
                    {navItem.subitems && (
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
                    )}
                  </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Panel - Submenu Content (Rekursiv) */}
          <div
            className="flex-1 py-6 min-h-[400px] flex"
            onMouseEnter={handlePanelEnter}
            onMouseLeave={handlePanelLeave}
          >
            {hoveredItem !== null &&
              allItems[parseInt(hoveredItem)]?.subitems && (
                <SubMenuPanel
                  items={allItems[parseInt(hoveredItem)].subitems}
                  parentLabel={getLabel(allItems[parseInt(hoveredItem)], locale)}
                  locale={locale}
                  onClose={onClose}
                />
              )}

            {/* Empty state when no item is hovered */}
            {hoveredItem === null && (
              <div className="flex items-center justify-center h-full text-gray-400 w-full">
                <p className="text-sm">Kateqoriyaya hover edin</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative bottom shadow */}
      {/* <div className="h-2 bg-gradient-to-b from-gray-50 to-transparent"></div> */}
    </div>
  );
}
