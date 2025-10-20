import React from "react";

const SideBar = ({pageData, locale}) => {
  return (
    <>
    {pageData?.sidebar?.show && pageData.sidebar.items.length > 0 && (
        <aside className="lg:col-span-1">
          <div className="bg-bg-light p-6 rounded-lg sticky top-44">
            <h3 className="font-bold text-secondary mb-4 uppercase text-sm">
              {locale === "az" ? "Naviqasiya" : "Navigation"}
            </h3>
            <nav className="space-y-1">
              {pageData.sidebar.items.map((item, index) => {
                const itemLabel =
                  typeof item.label === "object"
                    ? item.label[locale]
                    : item.label;
                const itemHref =
                  typeof item.href === "object" ? item.href[locale] : item.href;

                // Rekursiv render funksiyası
                const renderSubitems = (subitems, level = 1) => {
                  if (!subitems || subitems.length === 0) return null;

                  const marginClass =
                    level === 1 ? "ml-2" : level === 2 ? "ml-4" : "ml-6";

                  return (
                    <div className={`${marginClass} mt-1 space-y-1`}>
                      {subitems.map((subitem, subIndex) => {
                        const subLabel =
                          typeof subitem.label === "object"
                            ? subitem.label[locale]
                            : subitem.label;
                        const subHref =
                          typeof subitem.href === "object"
                            ? subitem.href[locale]
                            : subitem.href;

                        return (
                          <div key={subIndex}>
                            <a
                              href={subHref}
                              className="block px-3 py-2 text-sm text-gray-600 hover:bg-white hover:text-primary rounded transition-colors"
                            >
                              {subLabel}
                            </a>
                            {/* Rekursiv - daha dərin səviyyələr */}
                            {subitem.subitems &&
                              renderSubitems(subitem.subitems, level + 1)}
                          </div>
                        );
                      })}
                    </div>
                  );
                };

                return (
                  <div key={index}>
                    <a
                      href={itemHref}
                      className="block px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-white hover:text-primary rounded transition-colors"
                    >
                      {itemLabel}
                    </a>
                    {/* Render children rekursiv */}
                    {item.children && renderSubitems(item.children)}
                  </div>
                );
              })}
            </nav>
          </div>
        </aside>
      )}
    </>
  );
};

export default SideBar;
