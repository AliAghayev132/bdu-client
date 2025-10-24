'use client';

import { useEffect, useState, useCallback } from 'react';
import Header from './Header';
import Footer from './Footer';
import MobileMenu from './MobileMenu';

export default function UserLayout({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mobile check - yalnız client-side
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // İlk yoxlama
    checkMobile();

    // Resize zamanı yoxlama
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Memoize callbacks - hər render-də yeni function yaratmamaq üçün
  const handleMenuToggle = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const handleMenuClose = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <div className='flex flex-col justify-between min-h-screen min-w-[320px]'>
      <div>
      <Header 
        isScrolled={isScrolled} 
        onMenuToggle={handleMenuToggle} 
        />

      {isMobile && <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={handleMenuClose} 
        />}
        </div>
      <main className="bg-white overflow-hidden">{children}</main>
      <Footer />
    </div>
  );
}
