  import React from "react";

const Button = ({ text, rounded = true, icon = null, weight = "normal", active=false, onClick = () => {} }) => {
  return (
    <button
      onClick={onClick}
      className={`laptop:text-sm mobile:text-xs text-[10px] mobile:px-6 px-4 py-2 flex items-center gap-2 text-center border border-primary text-primary
        hover:bg-primary hover:text-white whitespace-nowrap
     ${rounded ? "rounded-md" : ""} ${active ? "bg-primary text-white" : ""}`}
     style={{
        transition: "all 0.3s ease",
        fontWeight: weight
     }}
    >
      {icon && icon}
      {text}
    </button>
  );
};

export default Button;
