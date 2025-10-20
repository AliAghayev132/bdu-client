'use client';

import { memo } from 'react';
import { Link } from '@/i18n/routing';
import { useLocale } from 'next-intl';

const AnnouncementCard = memo(({ announcement }) => {
  const locale = useLocale();

  // Format date on client side
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(locale === 'az' ? 'az-AZ' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Link
      href={`/announcements/${announcement.slug || announcement.id}`}
      className="group block bg-bg-light p-5 rounded-xl hover:shadow-lg transition-all duration-300 border-l-4 border-primary hover:border-secondary hover:-translate-x-1"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="font-semibold text-secondary mb-2 group-hover:text-primary transition-colors leading-snug">
            {announcement.title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <time suppressHydrationWarning>{formatDate(announcement.date)}</time>
          </div>
        </div>
        
        {/* Arrow Icon */}
        <svg 
          className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
});

AnnouncementCard.displayName = 'AnnouncementCard';

export default AnnouncementCard;
