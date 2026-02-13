'use client';

import { useEffect, useState, useCallback } from 'react';
import Header from './Header';
import Footer from './Footer';
import MobileMenu from './MobileMenu';
import SearchOverlay from './SearchOverlay';
import { useIsMobile } from '@hooks/use-mobile';

export default function UserLayout({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isMobile = useIsMobile(1024);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Memoize callbacks - hər render-də yeni function yaratmamaq üçün
  const handleMenuToggle = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const handleMenuClose = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleSearchOpen = useCallback(() => {
    setSearchOpen(true);
  }, []);

  // Listen for custom event from server components (SearchTrigger)
  useEffect(() => {
    const handler = () => setSearchOpen(true);
    window.addEventListener('open-search', handler);
    return () => window.removeEventListener('open-search', handler);
  }, []);

  const handleSearchClose = useCallback(() => {
    setSearchOpen(false);
  }, []);

  return (
    <>
      <Header 
        isScrolled={isScrolled} 
        onMenuToggle={handleMenuToggle}
        onSearchOpen={handleSearchOpen}
        />

      {isMobile && <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={handleMenuClose}
        onSearchOpen={handleSearchOpen}
        />}

      <SearchOverlay isOpen={searchOpen} onClose={handleSearchClose} />
      <main className="bg-white overflow-hidden">{children}</main>
      <Footer />
    </>
  );
}
