'use client';

import React from 'react';
import NewsCard from '../../../(home)/(components)/NewsCard';
import SectionTitle from '@/components/common/SectionTitle';

const RecommendedNews = ({ news, locale }) => {
  if (!news || news.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-gray-200">
      <SectionTitle>
        {locale === 'az' ? 'TÖVSİYƏ EDİLƏN XƏBƏRLƏR' : 'RECOMMENDED NEWS'}
      </SectionTitle>
      <div className="grid laptop:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-5 py-4">
        {news.map((item) => (
          <div key={item.id}>
            <NewsCard news={item} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecommendedNews;
