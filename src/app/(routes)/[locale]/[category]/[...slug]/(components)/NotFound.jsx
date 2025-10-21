import React from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';

const NotFound = ({ locale = 'az' }) => {

  const content = {
    az: {
      title: 'Səhifə tapılmadı',
      description: 'Bu səhifə üçün məlumat mövcud deyil.',
      homeButton: 'Ana səhifəyə qayıt',
      searchPlaceholder: 'Axtarış...'
    },
    en: {
      title: 'Page not found',
      description: 'No data available for this page.',
      homeButton: 'Back to home',
      searchPlaceholder: 'Search...'
    }
  };

  const t = content[locale] || content.az;

  return (
    <div className="min-h-[600px] flex items-center justify-center py-16 px-4">
      <div className="max-w-2xl w-full text-center">
        {/* BDU Building Illustration */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-64 h-64 opacity-40">
            <Image
              src="/bsu-building.svg"
              alt="BDU Building"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* 404 Text */}
        <div className="mb-6">
          <h1 className="text-8xl font-bold text-gray-400 mb-2">404</h1>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            {t.title}
          </h2>
          <p className="text-lg text-gray-600">
            {t.description}
          </p>
        </div>

        {/* Search Box */}
        {/* <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <input
              type="search"
              placeholder={t.searchPlaceholder}
              className="w-full px-6 py-3 pr-12 rounded-lg border-2 border-gray-300 focus:border-primary focus:outline-none text-gray-700"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div> */}

        {/* Back to Home Button */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary border border-primary hover:bg-primary hover:text-white transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t.homeButton}
          </Link>
        </div>

        {/* Quick Links */}
        {/* <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            {locale === 'az' ? 'Populyar səhifələr:' : 'Popular pages:'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={locale === 'az' ? '/universitet' : '/university'}
              className="text-sm text-primary hover:underline"
            >
              {locale === 'az' ? 'Universitet' : 'University'}
            </Link>
            <Link
              href={locale === 'az' ? '/tehsil' : '/education'}
              className="text-sm text-primary hover:underline"
            >
              {locale === 'az' ? 'Təhsil' : 'Education'}
            </Link>
            <Link
              href={locale === 'az' ? '/abituriyentler' : '/applicants'}
              className="text-sm text-primary hover:underline"
            >
              {locale === 'az' ? 'Abituriyentlər' : 'Applicants'}
            </Link>
            <Link
              href={locale === 'az' ? '/elaqe' : '/contact'}
              className="text-sm text-primary hover:underline"
            >
              {locale === 'az' ? 'Əlaqə' : 'Contact'}
            </Link>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default NotFound;
