'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Newspaper, 
  Calendar, 
  Image, 
  Megaphone,
  Users,
  Settings,
  Mail,
  LogOut
} from 'lucide-react';
import { useLogoutMutation } from '@store/api/authApi';
import { useDispatch } from 'react-redux';
import { logout as logoutAction } from '@store/slices/authSlice';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: Newspaper, label: 'Xəbərlər', href: '/admin/dashboard/news' },
  { icon: Calendar, label: 'Tədbirlər', href: '/admin/dashboard/events' },
  { icon: Mail, label: 'Müraciətlər', href: '/admin/dashboard/contacts' },
  { icon: Image, label: 'Qalereya', href: '/admin/dashboard/gallery' },
  { icon: Megaphone, label: 'Elanlar', href: '/admin/dashboard/announcements' },
  { icon: Users, label: 'İstifadəçilər', href: '/admin/dashboard/users' },
  { icon: Settings, label: 'Parametrlər', href: '/admin/dashboard/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutAction());
      toast.success('Çıxış edildi');
      router.push('/admin/login');
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">BDU Admin</h1>
        <p className="text-sm text-gray-500 mt-1">İdarəetmə paneli</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          <LogOut size={20} />
          <span>Çıxış</span>
        </button>
      </div>
    </aside>
  );
}
