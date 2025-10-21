/**
 * Robots.txt generator
 * Google və digər search engine-lərə crawl icazəsi verir
 */
export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bdu.edu.az';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/'
        ]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
