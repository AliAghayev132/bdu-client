'use client';

import Card from '@components/admin/ui/Card';
import { Newspaper, Calendar, Image, Users, TrendingUp, Eye } from 'lucide-react';

const stats = [
  { icon: Newspaper, label: 'Xəbərlər', value: '156', change: '+12%', color: 'blue' },
  { icon: Calendar, label: 'Tədbirlər', value: '43', change: '+8%', color: 'green' },
  { icon: Image, label: 'Şəkillər', value: '892', change: '+23%', color: 'purple' },
  { icon: Users, label: 'İstifadəçilər', value: '1,234', change: '+5%', color: 'orange' },
];

const recentActivity = [
  { action: 'Yeni xəbər əlavə edildi', time: '5 dəqiqə əvvəl', user: 'Admin' },
  { action: 'Tədbir yeniləndi', time: '1 saat əvvəl', user: 'Admin' },
  { action: 'Şəkil silindi', time: '2 saat əvvəl', user: 'Admin' },
  { action: 'Yeni istifadəçi qeydiyyatdan keçdi', time: '3 saat əvvəl', user: 'System' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">İdarəetmə paneline xoş gəlmisiniz</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            purple: 'bg-purple-100 text-purple-600',
            orange: 'bg-orange-100 text-orange-600',
          };

          return (
            <Card key={stat.label}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
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
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
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
                  <p className="text-sm font-medium text-gray-900">Xəbər başlığı {item}</p>
                  <p className="text-xs text-gray-500 mt-1">Dərc edilib: 2 gün əvvəl</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Eye size={16} />
                  <span>{Math.floor(Math.random() * 1000) + 500}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
