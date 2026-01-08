'use client';

import Link from 'next/link';

export default function SidebarItem({ icon: Icon, label, href, isActive }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        isActive
          ? 'bg-secondary text-white shadow-md'
          : 'text-secondary hover:bg-primary/10 hover:pl-5'
      }`}
    >
      <Icon 
        size={20} 
        className={`transition-colors ${isActive ? 'text-white' : 'text-secondary group-hover:text-primary'}`} 
      />
      <span className="font-medium">{label}</span>
    </Link>
  );
}
