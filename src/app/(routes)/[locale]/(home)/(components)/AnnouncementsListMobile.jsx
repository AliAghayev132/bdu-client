import { Link } from "@/i18n/routing";
import { getLocale } from "next-intl/server";
import { getActiveAnnouncements, transformAnnouncementsArray } from "@/lib/api/announcements";

export default async function AnnouncementsListMobile() {
  const locale = await getLocale();

  // Fetch real announcements from API
  const announcementsData = await getActiveAnnouncements(locale);
  const announcements = transformAnnouncementsArray(announcementsData, locale);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'az' ? 'az-AZ' : 'en-US', {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString(locale === 'az' ? 'az-AZ' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const announcementsPath = locale === 'az' ? '/elanlar' : '/announcements';

  if (announcements.length === 0) {
    return (
      <div className="min-w-[240px] w-[240px] flex-shrink-0">
        <div className="bg-white rounded-lg p-5 border border-gray-200 h-full text-center text-gray-500 text-sm">
          {locale === 'az' ? 'Hazırda aktiv elan yoxdur' : 'No active announcements'}
        </div>
      </div>
    );
  }

  return (
    <>
      {announcements.map((item) => (
        <div key={item.id} className="min-w-[240px] w-[240px] flex-shrink-0">
          <Link
            href={`${announcementsPath}/${item.slug || item.id}`}
            className="group block bg-white rounded-lg p-5 border border-gray-200 hover:shadow-lg transition-all duration-300 h-full"
          >
            {/* Date and Time */}
            <div className="flex items-center gap-2 sm:text-xs text-[10px] text-[#B8956A] font-medium mb-3">
              <time suppressHydrationWarning>{formatDate(item.publishedAt || item.startDate)}</time>
              <span>|</span>
              <time suppressHydrationWarning>{formatTime(item.publishedAt || item.startDate)}</time>
            </div>

            {/* Title */}
            <h3 className="sm:text-sm text-xs text-gray-700 group-hover:text-primary transition-colors leading-snug line-clamp-3 mb-3">
              {item.title}
            </h3>

            {/* ELAN Badge */}
            <div className="inline-flex items-center gap-1 sm:text-xs text-[10px] text-[#B8956A] font-medium">
              <span>– {locale === 'az' ? 'ELAN' : 'ANNOUNCEMENT'}</span>
            </div>
          </Link>
        </div>
      ))}
      <div className="flex-shrink-0 w-4"></div>
    </>
  );
}
