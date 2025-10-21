import { Link } from "@/i18n/routing";

// Fetch announcements - Server Component
async function getAnnouncements() {
  // TODO: Replace with actual API call
  return [
    {
      id: 1,
      title: "BDU tələbələri üçün kibertəhlükəsizlik təlimi",
      date: "2025-10-02",
      time: "13:24",
    },
    {
      id: 2,
      title: "BDU tələbələri üçün süni intellekt təlimi",
      date: "2025-10-01",
      time: "17:23",
    },
    {
      id: 3,
      title: "BDU tələbələrinin nəzərinə: Onlayn GNSS təlimi",
      date: "2025-09-30",
      time: "11:58",
    },
    {
      id: 4,
      title: '"BDU könüllüləri" təşkilatına qəbul elan edilir',
      date: "2025-09-29",
      time: "19:04",
    },
    {
      id: 5,
      title:
        "BDU fakültə və kafedralarında boş olan vəzifələri tutmaq üçün müsabiqə elan edir",
      date: "2025-09-18",
      time: "17:20",
    },
    {
      id: 6,
      title: "BDU Elmi Şurasının yeni tədris ili üçün",
      date: "2025-09-11",
      time: "15:39",
    },
    {
      id: 7,
      title: "BDU Elmi Şurasının yeni tədris ili üçün",
      date: "2025-09-11",
      time: "15:39",
    },
  ];
}

export default async function AnnouncementsListMobile() {
  const announcements = await getAnnouncements();

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("az-AZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <>
      {announcements.map((item) => (
        <div key={item.id} className="min-w-[240px] w-[240px] flex-shrink-0">
          <Link
            href={`/announcements/${item.id}`}
            className="group block bg-white rounded-lg p-5 border border-gray-200 hover:shadow-lg transition-all duration-300 h-full"
          >
            {/* Date and Time */}
            <div className="flex items-center gap-2 sm:text-xs text-[10px] text-[#B8956A] font-medium mb-3">
              <time suppressHydrationWarning>{formatDate(item.date)}</time>
              <span>|</span>
              <time suppressHydrationWarning>{item.time}</time>
            </div>

            {/* Title */}
            <h3 className="sm:text-sm text-xs text-gray-700 group-hover:text-primary transition-colors leading-snug line-clamp-3 mb-3">
              {item.title}
            </h3>

            {/* ELAN Badge */}
            <div className="inline-flex items-center gap-1 sm:text-xs text-[10px] text-[#B8956A] font-medium">
              <span>– ELAN</span>
            </div>
          </Link>
        </div>
      ))}
      <div className="flex-shrink-0 w-4"></div>
    </>
  );
}
