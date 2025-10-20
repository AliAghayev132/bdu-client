import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

// Fetch announcements - Server Component
async function getAnnouncements() {
  // TODO: Replace with actual API call
  // const res = await fetch('https://api.bdu.edu.az/announcements', {
  //   next: { revalidate: 180 }
  // });
  // return res.json();
  
  return [
    {
      id: 1,
      title: 'BDU tələbələri üçün kibertəhlükəsizlik təlimi',
      date: '2025-10-02',
      time: '13:24'
    },
    {
      id: 2,
      title: 'BDU tələbələri üçün süni intellekt təlimi',
      date: '2025-10-01',
      time: '17:23'
    },
    {
      id: 3,
      title: 'BDU tələbələrinin nəzərinə: Onlayn GNSS təlimi',
      date: '2025-09-30',
      time: '11:58'
    },
    {
      id: 4,
      title: '"BDU könüllüləri" təşkilatına qəbul elan edilir',
      date: '2025-09-29',
      time: '19:04'
    },
    {
      id: 5,
      title: 'BDU fakültə və kafedralarında boş olan vəzifələri tutmaq üçün müsabiqə elan edir',
      date: '2025-09-18',
      time: '17:20'
    },
    {
      id: 6,
      title: 'BDU Elmi Şurasının yeni tədris ili üçün',
      date: '2025-09-11',
      time: '15:39'
    }
  ];
}

export default async function AnnouncementsList() {
  const t = await getTranslations('home');
  const announcements = await getAnnouncements();

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('az-AZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-gradient-to-br from-[#B8956A]/10 to-[#B8956A]/5 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-[#B8956A] px-6 py-4 flex items-center justify-between">
        <h2 className="text-white font-bold text-lg">
          {t('announcements.title', { default: 'ELANLAR' })}
        </h2>
      </div>

      {/* Announcements List with Custom Scrollbar */}
      <div className="custom-scrollbar max-h-[700px] overflow-y-auto">
        <div className="divide-y divide-gray-200">
          {announcements.map((item) => (
            <Link
              key={item.id}
              href={`/announcements/${item.id}`}
              className="block px-6 py-4 hover:bg-white/50 transition-colors group"
            >
              {/* Date and Time */}
              <div className="flex items-center gap-2 text-xs text-[#B8956A] font-medium mb-2">
                <time suppressHydrationWarning>{formatDate(item.date)}</time>
                <span>|</span>
                <time suppressHydrationWarning>{item.time}</time>
              </div>

              {/* Title */}
              <h3 className="text-sm text-gray-700 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                {item.title}
              </h3>

              {/* ELAN Badge */}
              <div className="mt-2 inline-flex items-center gap-1 text-xs text-[#B8956A] font-medium">
                <span>– ELAN</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer Button */}
      <div className="border-t border-gray-200">
        <Link
          href="/announcements"
          className="block w-full text-center px-4 py-2.5 bg-[#B8956A] text-white  hover:bg-[#A07D54] transition-colors font-medium text-sm"
        >
          {t('announcements.viewAll', { default: 'BÜTÜN ELANLAR' })}
        </Link>
      </div>
    </div>
  );
}
