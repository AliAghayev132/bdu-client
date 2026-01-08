"use client";

import { useEffect, useState, useCallback } from "react";
import FacultyHeader from "./FacultyHeader";
import Footer from "@/components/layout/Footer";
import { FacultyProvider } from "@/context/FacultyContext";

/**
 * FacultyLayout - Fakültə səhifələri üçün xüsusi layout
 * Normal UserLayout-un fakültə versiyası
 */
export default function FacultyLayout({ faculty, children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMenuToggle = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const handleMenuClose = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <FacultyProvider faculty={faculty}>
      <FacultyHeader onMenuToggle={handleMenuToggle} />

      {/* Mobile menu - gələcəkdə əlavə edilə bilər */}
      {/* {isMobile && <FacultyMobileMenu isOpen={isMobileMenuOpen} onClose={handleMenuClose} />} */}

      <main className="bg-white overflow-hidden min-h-screen">{children}</main>

      <Footer />
    </FacultyProvider>
  );
}
