import React from "react";
import { Link } from "@/i18n/routing";

const SubPagesGrid = ({ subPages, locale }) => {
  if (!subPages || subPages.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold text-secondary mb-6">
        {locale === "az" ? "Alt səhifələr" : "Sub-pages"}
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {subPages.map((subPage) => (
          <Link
            key={subPage.id}
            href={typeof subPage.href === "object" ? subPage.href[locale] : subPage.href}
            className="block bg-bg-light p-6 rounded-lg hover:shadow-lg transition-shadow border border-gray-200"
          >
            <h3 className="font-bold text-primary mb-2 text-lg">
              {subPage.title[locale]}
            </h3>
            <p className="text-sm text-gray-600">{subPage.description[locale]}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SubPagesGrid;
