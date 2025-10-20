'use client';

import React, { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';

// Format date helper - client-side only
const formatDate = (dateString) => {
  if (typeof window === 'undefined') return dateString; // Server-side
  return new Date(dateString).toLocaleDateString('az-AZ');
};

const NewsSection = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock data - backend-dən gələcək
  const news = [
    {
      id: 1,
      title: 'BDU-da yeni tədris ili başladı',
      excerpt: '2024-2025 tədris ili təntənəli şəkildə açıldı. Tədbirdə universitetin rəhbərliyi və tələbələr iştirak etdilər.',
      date: '2025-01-15',
      image: '/images/news/opening.jpg'
    },
    {
      id: 2,
      title: 'Beynəlxalq əməkdaşlıq müqaviləsi imzalandı',
      excerpt: 'BDU Avropa universitetləri ilə yeni əməkdaşlıq müqaviləsi imzaladı.',
      date: '2025-01-10',
      image: '/images/news/cooperation.jpg'
    },
    {
      id: 3,
      title: 'Yeni elmi laboratoriya açıldı',
      excerpt: 'Universitetdə müasir avadanlıqlarla təchiz olunmuş yeni laboratoriya istifadəyə verildi.',
      date: '2025-01-05',
      image: '/images/news/lab.jpg'
    }
  ];

  const announcements = [
    {
      id: 1,
      title: 'Magistratura qəbulu başladı',
      date: '2025-01-20'
    },
    {
      id: 2,
      title: 'Elmi konfrans elanı',
      date: '2025-01-18'
    },
    {
      id: 3,
      title: 'Təqaüd müsabiqəsi',
      date: '2025-01-15'
    },
    {
      id: 4,
      title: 'Yay məktəbi qeydiyyatı',
      date: '2025-01-12'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1500px] mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* News */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-secondary">XƏBƏRLƏR</h2>
              <Link 
                href="/xeberler" 
                className="text-primary hover:underline text-sm font-medium"
              >
                Hamısına bax →
              </Link>
            </div>
            
            <div className="space-y-6">
              {news.map((item) => (
                <Link
                  key={item.id}
                  href={`/xeberler/${item.id}`}
                  className="block bg-bg-light rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-4 p-6">
                    <div className="w-40 h-32 bg-gray-300 rounded flex-shrink-0 overflow-hidden">
                      {/* Image placeholder */}
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-secondary mb-2 text-lg hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {item.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {mounted ? formatDate(item.date) : item.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-secondary">ELANLAR</h2>
              <Link 
                href="/elanlar" 
                className="text-primary hover:underline text-sm font-medium"
              >
                Hamısına bax →
              </Link>
            </div>
            
            <div className="space-y-4">
              {announcements.map((item) => (
                <Link
                  key={item.id}
                  href={`/elanlar/${item.id}`}
                  className="block bg-bg-light p-5 rounded-lg hover:shadow-md transition-shadow border-l-4 border-primary"
                >
                  <p className="font-semibold text-secondary mb-2 hover:text-primary transition-colors">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {mounted ? formatDate(item.date) : item.date}
                  </div>
                </Link>
              ))}
            </div>

            {/* Quick Links */}
            <div className="mt-8 p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
              <h3 className="font-bold text-secondary mb-4">Faydalı Linklər</h3>
              <div className="space-y-2">
                <Link href="/abituriyentler" className="block text-sm text-gray-700 hover:text-primary transition-colors">
                  → Abituriyentlər üçün
                </Link>
                <Link href="/telabeler" className="block text-sm text-gray-700 hover:text-primary transition-colors">
                  → Tələbələr üçün
                </Link>
                <Link href="/emekdaslar" className="block text-sm text-gray-700 hover:text-primary transition-colors">
                  → Əməkdaşlar üçün
                </Link>
                <Link href="/elaqe" className="block text-sm text-gray-700 hover:text-primary transition-colors">
                  → Əlaqə
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
