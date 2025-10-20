'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import HeaderTop from './HeaderTop';
import Navbar from './Navbar';

export default function Header({ onMenuToggle }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [navbarTop, setNavbarTop] = useState(0);
  const headerTopRef = useRef(null);
  const navbarRef = useRef(null);

  // Scroll event
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
      
      // Navbar-ın actual bottom position-unu calculate et
      if (navbarRef.current) {
        const rect = navbarRef.current.getBoundingClientRect();
        setNavbarTop(rect.bottom);
      }
    };

    // Initial calculation
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // GSAP animations
  // useEffect(() => {
  //   if (!headerTopRef.current || !navbarRef.current) return;

  //   const ctx = gsap.context(() => {
  //     if (isScrolled) {
  //       // HeaderTop gizlənir
  //       gsap.to(headerTopRef.current, {
  //         y: -100,
  //         opacity: 0,
  //         duration: 0.3,
  //         ease: 'power2.out',
  //       });
        
  //       // Navbar shadow artır
  //       gsap.to(navbarRef.current, {
  //         boxShadow: 'none',
  //         duration: 0.3,
  //         ease: 'power2.out',
  //       });
  //     } else {
  //       // HeaderTop geri gəlir
  //       gsap.to(headerTopRef.current, {
  //         y: 0,
  //         opacity: 1,
  //         duration: 0.3,
  //         ease: 'power2.out',
  //       });
        
  //       // Navbar shadow azalır
  //       gsap.to(navbarRef.current, {
  //         boxShadow: 'none',
  //         duration: 0.3,
  //         ease: 'power2.out',
  //       });
  //     }
  //   });

  //   return () => ctx.revert();
  // }, [isScrolled]);

  return (
    <>
      {/* Header Top - Fixed position */}
      <div 
        ref={headerTopRef}
        className="bdu-header fixed top-0 left-0 right-0 z-40"
      >
        <HeaderTop onMenuToggle={onMenuToggle} />
      </div>

      {/* Spacer - HeaderTop üçün yer saxlayır */}
      <div className="h-[82px] lg:h-[110px]" />

      {/* Navbar - Sticky */}
      <div 
        ref={navbarRef}
        className="bdu-navbar w-full mx-auto sticky top-0 z-50 bg-white"
      >
        <Navbar onMenuToggle={onMenuToggle} navbarTop={navbarTop} />
      </div>
    </>
  );
}
