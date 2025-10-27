"use client";
import AnimatedButton from "@/components/common/AnimatedButton/AnimatedButton";
import Button from "@/components/common/Button";
import { useTranslations } from "next-intl";
import React from "react";

const NewsFilter = ({ setActiveCategory, activeCategory }) => {
    const t = useTranslations("news");
  
  return (
    <div
      className="overflow-x-scroll scrollbar-hide py-4 mb-4"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      <div className="flex gap-2">
        {/* <AnimatedButton label="Bütün Xəbərlər" animateOnScroll={false} /> */}
        <Button
          text={t("filter.all-news")}
          weight="600"
          active={activeCategory === "all"}
          onClick={() => setActiveCategory(t("filter.all-news"))}
        />
        <Button
          text={t("filter.education")}
          weight="600"
          active={activeCategory === "education"}
          onClick={() => setActiveCategory(t("filter.education"))}
        />
        <Button
          text={t("filter.science")}
          weight="600"
          active={activeCategory === "science"}
          onClick={() => setActiveCategory(t("filter.science"))}
        />
        
      </div>
    </div>
  );
};

export default NewsFilter;
