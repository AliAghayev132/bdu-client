'use client';

import { Bell, Search, Menu } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function Header() {
  const user = useSelector((state) => state.auth.user);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
            <input
              type="text"
              placeholder="Axtarış..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-secondary placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button className="relative p-2.5 text-secondary hover:bg-gray-50 rounded-xl transition-colors">
            <Bell size={22} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>

          <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-secondary">{user?.username || 'Admin'}</p>
              <p className="text-xs text-gray-500 font-medium capitalize">{user?.role || 'Administrator'}</p>
            </div>
            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-secondary/20">
              {user?.username?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
