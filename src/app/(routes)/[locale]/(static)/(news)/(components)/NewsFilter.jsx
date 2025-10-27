import AnimatedButton from "@/components/common/AnimatedButton/AnimatedButton";
import Button from "@/components/common/Button";
import React from "react";

const NewsFilter = ({ setActiveCategory, activeCategory }) => {
  return (
    <div
      className="overflow-x-scroll scrollbar-hide py-4"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      <div className="flex gap-2">
        {/* <AnimatedButton label="Bütün Xəbərlər" animateOnScroll={false} /> */}
        <Button
          text="Bütün Xəbərlər"
          weight="500"
          active={activeCategory === "all"}
          onClick={() => setActiveCategory("all")}
        />
        <Button
          text="Tədris"
          weight="500"
          active={activeCategory === "education"}
          onClick={() => setActiveCategory("education")}
        />
        <Button
          text="Elm"
          weight="500"
          active={activeCategory === "science"}
          onClick={() => setActiveCategory("science")}
        />
        
      </div>
    </div>
  );
};

export default NewsFilter;
