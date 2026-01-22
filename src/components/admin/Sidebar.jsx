'use client';

import { useState } from 'react';
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
  Menu,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  UserCog
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
  { icon: UserCog, label: 'Şəxslər', href: '/admin/dashboard/persons' },
  { icon: Mail, label: 'Müraciətlər', href: '/admin/dashboard/contacts' },
  { icon: MessageSquare, label: 'Rektora Müraciət', href: '/admin/dashboard/rector-appeals' },
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
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    <aside className={`${isCollapsed ? 'w-20' : 'w-72'} bg-white border-r border-gray-100 h-screen sticky top-0 flex flex-col shadow-sm z-40 transition-all duration-300`}>
      <SidebarHeader isCollapsed={isCollapsed} />

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
        title={isCollapsed ? 'Genişlət' : 'Kiçilt'}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.href}
            {...item}
            isActive={pathname === item.href || pathname?.startsWith(item.href + '/')}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 font-medium group disabled:opacity-50`}
          title={isCollapsed ? 'Çıxış' : ''}
        >
          <LogOut size={20} className="group-hover:scale-110 transition-transform" />
          {!isCollapsed && <span>Çıxış</span>}
        </button>
      </div>
    </aside>
  );
}
