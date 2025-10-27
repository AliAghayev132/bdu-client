import Image from 'next/image';
import Link from 'next/link';
import './globals.css';

export default function NotFound() {
  const locale = 'az'; // Default locale for global 404
  
  const content = {
    az: {
      title: 'Səhifə tapılmadı',
      description: 'Bu səhifə üçün məlumat mövcud deyil.',
      homeButton: 'Ana səhifəyə qayıt',
      popularPages: 'Populyar səhifələr:'
    },
    en: {
      title: 'Page not found',
      description: 'No data available for this page.',
      homeButton: 'Back to home',
      popularPages: 'Popular pages:'
    }
  };

  const t = content[locale];

  return (
    
    <div className="min-h-screen h-full flex items-center justify-center bg-white">
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
            <h1 className="lg:text-8xl md:text-6xl text-4xl font-bold text-gray-400 mb-2">404</h1>
            <h2 className="lg:text-3xl md:text-2xl text-xl font-bold text-gray-800 mb-3">
              {t.title}
            </h2>
            <p className="lg:text-lg md:text-base text-sm text-gray-600">
              {t.description}
            </p>
          </div>

          {/* Back to Home Button */}
          <div>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-8 py-3 bg-white text-primary border border-primary hover:bg-primary hover:text-white transition-colors font-medium"
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
              {t.popularPages}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/universitet"
                className="text-sm text-primary hover:underline"
              >
                {locale === 'az' ? 'Universitet' : 'University'}
              </Link>
              <Link
                href="/tehsil"
                className="text-sm text-primary hover:underline"
              >
                {locale === 'az' ? 'Təhsil' : 'Education'}
              </Link>
              <Link
                href="/abituriyentler"
                className="text-sm text-primary hover:underline"
              >
                {locale === 'az' ? 'Abituriyentlər' : 'Applicants'}
              </Link>
              <Link
                href="/rektora-muraciet"
                className="text-sm text-primary hover:underline"
              >
                {locale === 'az' ? 'Rektora müraciət' : 'Appeal to Rector'}
              </Link>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
