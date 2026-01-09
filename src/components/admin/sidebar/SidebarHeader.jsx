'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function SidebarHeader({ isCollapsed }) {
  return (
    <div className={`p-6 border-b border-gray-100 flex flex-col items-center text-center ${isCollapsed ? 'space-y-0' : 'space-y-3'} transition-all duration-300`}>
       <Link href="/" className={`relative ${isCollapsed ? 'w-10 h-10' : 'w-20 h-20'} transition-all duration-300 hover:scale-105`}>
        <Image
          src="/bsu-logo.png"
          alt="BDU Logo"
          fill
          className="object-contain"
          priority
        />
      </Link>
      {!isCollapsed && (
        <div>
          {/* <h1 className="text-xl font-bold text-secondary font-montserrat">BDU Admin</h1> */}
          <p className="text-sm text-primary font-medium tracking-wide">İDARƏETMƏ PANELİ</p>
        </div>
      )}
    </div>
  );
}
