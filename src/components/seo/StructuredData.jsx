/**
 * JSON-LD Structured Data Component
 * Google üçün structured data (schema.org)
 */

export default function StructuredData({ type = 'organization', data, locale }) {
  let structuredData = {};

  if (type === 'organization') {
    structuredData = {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: locale === 'az' ? 'Bakı Dövlət Universiteti' : 'Baku State University',
      alternateName: 'BDU',
      url: 'https://bdu.info.az',
      logo: 'https://bdu.info.az/bsu-icon.svg',
      description: locale === 'az' 
        ? 'Azərbaycanın ən qədim və nüfuzlu ali təhsil müəssisəsi'
        : 'The oldest and most prestigious higher education institution in Azerbaijan',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Z. Xəlilov küç. 23',
        addressLocality: 'Bakı',
        addressCountry: 'AZ'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+994-12-539-03-45',
        contactType: 'customer service'
      },
      sameAs: [
        'https://www.facebook.com/bsu.edu.az',
        'https://www.instagram.com/bsu.edu.az',
        'https://twitter.com/bsu_edu_az'
      ]
    };
  } else if (type === 'breadcrumb' && data?.breadcrumbs) {
    structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: data.breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.label,
        item: `https://bdu.info.az${crumb.href}`
      }))
    };
  } else if (type === 'person' && data?.person) {
    structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: data.person.name?.[locale],
      jobTitle: data.person.position?.[locale],
      email: data.person.email,
      telephone: data.person.phone,
      image: data.person.image ? `https://bdu.info.az${data.person.image}` : undefined,
      worksFor: {
        '@type': 'EducationalOrganization',
        name: 'Bakı Dövlət Universiteti'
      }
    };
  } else if (type === 'article' && data?.article) {
    structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.article.title,
      description: data.article.description,
      author: data.article.author ? {
        '@type': 'Person',
        name: data.article.author.name?.[locale]
      } : undefined,
      publisher: {
        '@type': 'EducationalOrganization',
        name: 'Bakı Dövlət Universiteti',
        logo: {
          '@type': 'ImageObject',
          url: 'https://bdu.info.az/bsu-icon.svg'
        }
      },
      datePublished: data.article.publishedAt,
      dateModified: data.article.updatedAt,
      inLanguage: locale === 'az' ? 'az-AZ' : 'en-US'
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
