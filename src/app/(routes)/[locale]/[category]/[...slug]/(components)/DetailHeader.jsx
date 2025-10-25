import React from "react";
import Image from "next/image";

const DetailHeader = ({ detailItem, locale }) => {
  if (!detailItem) return null;

  return (
    <div className="flex flex-row items-start gap-3 sm:gap-4 md:gap-6 sm:mb-8 mb-4 bg-white border-2 border-primary/20 rounded-xl p-2 ">
      {detailItem.image && (
        <div className="flex-shrink-0 relative w-24 md:w-36 aspect-[3/4] overflow-hidden rounded-lg">
          <Image
            src={detailItem.image}
            alt={detailItem.name?.[locale] || ""}
            fill
            // sizes="(max-width: 768px) 96px, 112px"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex-1 sm:p-0 md:p-2">
        <h2 className="font-semibold text-primary sm:text-base text-sm md:text-xl lg:text-2xl mb-1">
          {detailItem.name?.[locale]}
        </h2>
        <p className="text-gray-600 text-[10px] sm:text-xs md:text-base mb-2">
          {detailItem.position?.[locale]}
        </p>
        {detailItem.phone && (
          <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 mb-1">
            <strong>Tel.:</strong> {detailItem.phone}
          </p>
        )}
        {detailItem.email && (
          <p className="text-[10px] sm:text-xs md:text-sm text-gray-700">
            <strong>E-mail:</strong> {detailItem.email}
          </p>
        )}
      </div>
    </div>
  );
};

export default DetailHeader;
