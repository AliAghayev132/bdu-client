'use client';

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
  LogOut,
  BookOpen,
  FileText,
  UserCircle,
  Building2,
  Activity,
  Menu
} from 'lucide-react';
import { useLogoutMutation } from '@store/api/authApi';
import { useDispatch } from 'react-redux';
import { logout as logoutAction } from '@store/slices/authSlice';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import SidebarHeader from './sidebar/SidebarHeader';
import SidebarItem from './sidebar/SidebarItem';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: Newspaper, label: 'Xəbərlər', href: '/admin/dashboard/news' },
  { icon: BookOpen, label: 'Bloqlar', href: '/admin/dashboard/blogs' },
  { icon: Calendar, label: 'Tədbirlər', href: '/admin/dashboard/events' },
  { icon: FileText, label: 'Səhifələr', href: '/admin/dashboard/pages' },
  { icon: Menu, label: 'Menyular', href: '/admin/dashboard/menus' },
  { icon: UserCircle, label: 'Kadr', href: '/admin/dashboard/persons' },
  { icon: Mail, label: 'Müraciətlər', href: '/admin/dashboard/contacts' },
  { icon: Image, label: 'Qalereya', href: '/admin/dashboard/gallery' },
  { icon: Megaphone, label: 'Elanlar', href: '/admin/dashboard/announcements' },
  { icon: Building2, label: 'Fakültələr', href: '/admin/dashboard/faculties', superAdminOnly: true },
  { icon: Activity, label: 'Sistem Logları', href: '/admin/dashboard/logs' },
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
    <aside className="w-72 bg-white border-r border-gray-100 h-screen sticky top-0 flex flex-col shadow-sm z-40">
      <SidebarHeader />

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.href}
            {...item}
            isActive={pathname === item.href || pathname?.startsWith(item.href + '/')}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 font-medium group disabled:opacity-50"
        >
          <LogOut size={20} className="group-hover:scale-110 transition-transform" />
          <span>Çıxış</span>
        </button>
      </div>
    </aside>
  );
}
