import React from "react";

const PageHeader = ({ title, description }) => {
  return (
    <header>
      <h1 className="md:text-3xl sm:text-2xl text-lg font-bold text-secondary md:mb-4 sm:mb-3 mb-1">
        {title || "Səhifə"}
      </h1>
      {description ? (
        <p className="md:text-lg sm:text-base text-xs text-gray-600 md:mb-6 mb-5 ">{description}</p>
      ) : null}
    </header>
  );
};

export default PageHeader;
