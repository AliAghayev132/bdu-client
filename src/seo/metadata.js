export function buildLocalizedMetadata({
  locale,
  slugs, // { az: '/elaqe', en: '/en/contact' }
  title, // { az: '...', en: '...' }
  description, // { az: '...', en: '...' }
  keywords, // optional { az: '...', en: '...' }
  siteName = { az: 'Bakı Dövlət Universiteti', en: 'Baku State University' },
  ogType = 'website',
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bdu.info.az';

  const t = title?.[locale] || '';
  const d = description?.[locale] || '';
  const k = keywords?.[locale];

  const azPath = slugs.az;
  const enPath = slugs.en;
  const canonical = `${baseUrl}${locale === 'az' ? azPath : enPath}`;

  return {
    title: `${t}`,
    description: d,
    ...(k ? { keywords: k } : {}),

    alternates: {
      canonical,
      languages: {
        az: `${baseUrl}${azPath}`,
        en: `${baseUrl}${enPath}`,
        'x-default': `${baseUrl}${azPath}`,
      },
    },

    openGraph: {
      title: `${t}`,
      description: d,
      url: canonical,
      siteName: siteName?.[locale] || siteName?.en || 'Baku State University',
      locale: locale === 'az' ? 'az_AZ' : 'en_US',
      type: ogType,
    },

    twitter: {
      card: 'summary',
      title: `${t}`,
      description: d,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}
