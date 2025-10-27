import React from "react";

const SectionTitle = ({ children }) => {
  return (
    <h1 className="laptop:text-[20px] mobile:text-[18px] text-[16px] font-bold text-secondary tracking-wider uppercase">
      {children}
    </h1>
  );
};

export default SectionTitle;
