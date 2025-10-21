import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";

const CardsGrid = ({ items, locale, fullPath }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="grid md:grid-cols-2 gap-4 md:gap-6">
      {items.map((person) => {
        const hasDetailPage = person.hasDetail === true;
        const CardWrapper = hasDetailPage ? Link : "div";
        const detailUrl = hasDetailPage ? `${fullPath}/${person.id}` : null;
        const cardProps = detailUrl ? { href: detailUrl } : {};

        return (
          <CardWrapper
            key={person.id}
            {...cardProps}
            className={`flex flex-row items-start gap-2 sm:gap-3 md:gap-4 bg-white border-2 border-primary/20 rounded-xl p-1.5 sm:p-3 md:p-4 hover:shadow-md hover:border-gray-300 transition-all ${
              hasDetailPage ? "cursor-pointer" : ""
            }`}
          >
            {person.image && (
              <div className="flex-shrink-0 relative w-20 md:w-24 aspect-[3/4] overflow-hidden rounded-lg">
                <Image
                  src={person.image}
                  alt={person.name?.[locale] || ""}
                  fill
                  sizes="(max-width: 768px) 80px, 96px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 sm:p-0 p-1">
              <h3 className="font-medium sm:text-base text-sm md:text-lg text-primary mb-1">
                {person.name?.[locale]}
              </h3>
              {person.position && (
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-2 line-clamp-2">{person.position[locale]}</p>
              )}
              {person.phone && (
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-700">Tel.: {person.phone}</p>
              )}
              {person.email && (
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-700">E-mail: {person.email}</p>
              )}
            </div>
          </CardWrapper>
        );
      })}
    </div>
  );
};

export default CardsGrid;
