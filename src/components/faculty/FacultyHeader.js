"use client";

import { useEffect, useRef, useState } from "react";
import FacultyHeaderTop from "./FacultyHeaderTop";
import FacultyNavbar from "./FacultyNavbar";
import { useFaculty } from "@/context/FacultyContext";

/**
 * FacultyHeader - Fakültə üçün xüsusi header
 * HeaderTop + Navbar birləşməsi
 */
export default function FacultyHeader({ onMenuToggle }) {
  const [navbarTop, setNavbarTop] = useState(0);
  const headerTopRef = useRef(null);
  const navbarRef = useRef(null);
  const { themeColor } = useFaculty();

  useEffect(() => {
    const handleScroll = () => {
      if (navbarRef.current) {
        const rect = navbarRef.current.getBoundingClientRect();
        setNavbarTop(rect.bottom);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Header Top - Fixed position on mobile */}
      <div
        ref={headerTopRef}
        className="faculty-header lg:static fixed top-0 left-0 right-0 z-40"
      >
        <FacultyHeaderTop onMenuToggle={onMenuToggle} />
      </div>

      {/* Spacer - HeaderTop üçün yer saxlayır (mobile) */}
      <div
        className="h-[72px] lg:hidden block"
        style={{ backgroundColor: themeColor }}
      />

      {/* Navbar - Sticky */}
      <div
        ref={navbarRef}
        className="faculty-navbar w-full mx-auto sticky top-0 z-50"
        style={{ backgroundColor: themeColor }}
      >
        <FacultyNavbar onMenuToggle={onMenuToggle} navbarTop={navbarTop} />
      </div>
    </>
  );
}
