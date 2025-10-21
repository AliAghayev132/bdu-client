'use client';

import { memo } from 'react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { useLocale } from 'next-intl';

const NewsCard = memo(({ news }) => {
  const locale = useLocale();

  // Format date on client side
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(locale === 'az' ? 'az-AZ' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <Link
      href={`/news/${news.slug || news.id}`}
      style={{ willChange: 'transform' }}
      className="group block bg-white rounded-2xl overflow-hidden transition-all duration-300 border-2 border-primary/20 h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
        {news.image ? (
          <Image
            src={news.image}
            alt={news.title}
            fill
            style={{willChange: 'transform'}}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Date Badge - Top Left Corner */}
        <div className="absolute top-0 rounded-br-2xl left-0 bg-white shadow-md">
          <div className="flex flex-col items-center justify-center lg:w-16 lg:h-16 md:w-14 md:h-14 w-12 h-12 p-2">
            <time className="lg:text-3xl md:text-2xl text-lg font-bold text-primary leading-none" suppressHydrationWarning>
              {new Date(news.date).getDate()}
            </time>
            <time className="md:text-[10px] text-[8px] font-medium text-gray-600 uppercase mt-0.5" suppressHydrationWarning>
              {new Date(news.date).toLocaleDateString(locale === 'az' ? 'az-AZ' : 'en-US', { month: 'short' })}
            </time>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-5 px-3 flex flex-col justify-between">
        <h3 className="font-semibold text-secondary sm:text-base text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
          {news.title}
        </h3>
        <p className="sm:text-xs text-[10px] text-gray-600 line-clamp-2 leading-relaxed">
          {news.excerpt}
        </p>
      </div>
    </Link>
  );
});

NewsCard.displayName = 'NewsCard';

export default NewsCard;
