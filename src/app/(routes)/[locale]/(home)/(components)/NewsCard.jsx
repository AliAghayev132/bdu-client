'use client';

import { memo } from 'react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { useLocale } from 'next-intl';

// news schema {
//     id: number;
//     slug: string;
//     title: string;
//     excerpt: string;
//     date: string;
//     image: string;
// }

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
      className="group block rounded-2xl overflow-hidden transition-all duration-300 h-full bg-white"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/9] overflow-hidden  rounded-2xl">
        {news.image ? (
          <Image
            src={news.image}
            alt={news.title}
            width={1000}
            height={1000}
             style={{willChange: 'transform',
              transition: 'all 0.3s ease',
            }}
            className="object-cover w-full h-full group-hover:scale-105"
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
        <div className="absolute top-0 rounded-br-2xl left-0 bg-white shadow-md border-l-2 border-t-2 rounded-tl-2xl border-primary/30">
          <div className="flex flex-col items-center justify-center lg:w-14 lg:h-14 md:w-12 md:h-12 w-10 h-10 p-2">
            <time className="lg:text-2xl md:text-xl sm:text-lg font-bold text-primary leading-none" suppressHydrationWarning>
              {new Date(news.date).getDate()}
            </time>
            <time className="md:text-[10px] text-[8px] font-medium text-gray-600 uppercase mt-0.5" suppressHydrationWarning>
              {new Date(news.date).toLocaleDateString(locale === 'az' ? 'az-AZ' : 'en-US', { month: 'short' })}
            </time>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-4 px-3 flex flex-col justify-between">
        <h3 className="font-semibold text-secondary sm:text-base text-[14px]  mobile:mb-2 mb-1 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
          {news.title}
        </h3>
        <article className="sm:text-sm text-xs text-gray-600 line-clamp-2  leading-relaxed font-medium">
          {news.excerpt}
        </article>
      </div>
    </Link>
  );
});

NewsCard.displayName = 'NewsCard';

export default NewsCard;
