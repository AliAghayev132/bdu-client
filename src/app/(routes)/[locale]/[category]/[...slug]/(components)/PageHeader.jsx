import React from "react";

const PageHeader = ({ title, description }) => {
  return (
    <header>
    <h1 className="laptop:text-[28px] md:text-2xl text-xl font-bold text-primary tracking-wider uppercase">
        {title || "Səhifə"}
      </h1>
      {description ? (
        <p className="md:text-lg sm:text-base text-xs text-gray-600 md:mb-6 mb-5 ">{description}</p>
      ) : null}
    </header>
  );
};

export default PageHeader;
