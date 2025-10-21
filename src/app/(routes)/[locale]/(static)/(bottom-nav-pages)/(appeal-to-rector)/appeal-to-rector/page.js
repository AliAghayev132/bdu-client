import PageContent from "../(components)/PageContent";

export default async function AppealToRectorPage({ params }) {
  const { locale } = await params;
  return <PageContent locale={locale} slug="appeal-to-rector" />;
}

// ISR revalidation
export const revalidate = 3600;

// Metadata
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bdu.info.az';
  
  const title = locale === 'az' ? 'Rektora müraciət' : 'Appeal to Rector';
  const description = locale === 'az'
    ? 'Hörmətli Tələbələr, Əziz Rektora hər hansı bir sualınız, təklifiniz və ya şikayətiniz varsa, müraciətinizi təqdim edə bilərsiniz.'
    : 'Dear Students, if you have any questions, suggestions or complaints for the Rector, you can submit your appeal.';
  
  return {
    title: `${title}`,
    description,
    keywords: 'BDU, Baku State University, rector, appeal, contact',
    
    alternates: {
      canonical: `${baseUrl}${locale === 'az' ? '/rektora-muraciet' : '/en/appeal-to-rector'}`,
      languages: {
        'az': `${baseUrl}/rektora-muraciet`,
        'en': `${baseUrl}/en/appeal-to-rector`,
        'x-default': `${baseUrl}/rektora-muraciet`
      }
    },
    
    openGraph: {
      title: `${title}`,
      description,
      url: `${baseUrl}${locale === 'az' ? '/rektora-muraciet' : '/en/appeal-to-rector'}`,
      siteName: 'Baku State University',
      locale: locale === 'az' ? 'az_AZ' : 'en_US',
      type: 'website'
    },
    
    twitter: {
      card: 'summary',
      title: `${title}`,
      description
    },
    
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true
      }
    }
  };
}
