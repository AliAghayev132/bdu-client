"use client";

export default function SearchTrigger({ className, children }) {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("open-search"));
  };

  return (
    <button onClick={handleClick} className={className} type="button">
      {children}
    </button>
  );
}
