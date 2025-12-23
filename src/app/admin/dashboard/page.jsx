'use client';

import Card from '@components/admin/ui/Card';
import AdminPageHeader from '@components/admin/AdminPageHeader';
import { Newspaper, Calendar, Image, Users, TrendingUp, Eye } from 'lucide-react';

const stats = [
  { icon: Newspaper, label: 'Xəbərlər', value: '156', change: '+12%' },
  { icon: Calendar, label: 'Tədbirlər', value: '43', change: '+8%' },
  { icon: Image, label: 'Şəkillər', value: '892', change: '+23%' },
  { icon: Users, label: 'İstifadəçilər', value: '1,234', change: '+5%' },
];

const recentActivity = [
  { action: 'Yeni xəbər əlavə edildi', time: '5 dəqiqə əvvəl', user: 'Admin' },
  { action: 'Tədbir yeniləndi', time: '1 saat əvvəl', user: 'Admin' },
  { action: 'Şəkil silindi', time: '2 saat əvvəl', user: 'Admin' },
  { action: 'Yeni istifadəçi qeydiyyatdan keçdi', time: '3 saat əvvəl', user: 'System' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader 
        title="Dashboard" 
        description="İdarəetmə paneline xoş gəlmisiniz"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-secondary mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1 font-medium flex items-center gap-1">
                    <TrendingUp size={14} />
                    {stat.change}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-primary/10 text-primary">
                  <Icon size={24} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Son Fəaliyyətlər">
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-secondary">{activity.action}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Populyar Məzmun">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex-1">
                  <p className="text-sm font-medium text-secondary">Xəbər başlığı {item}</p>
                  <p className="text-xs text-gray-500 mt-1">Dərc edilib: 2 gün əvvəl</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-primary font-medium">
                  <Eye size={16} />
                  <span>{850 + item * 45}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
