import React from "react";

const PageTitle = ({ title }) => {
  return (
    <h1 className="laptop:text-[28px] md:text-2xl text-xl font-bold text-primary tracking-wider uppercase">
      {title}
    </h1>
  );
};

export default PageTitle;
