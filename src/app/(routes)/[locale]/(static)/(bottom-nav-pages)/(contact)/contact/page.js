import ContactContent from "../(components)/ContactContent";

export default async function ContactPage({ params }) {
  const { locale } = await params;
  return <ContactContent locale={locale} slug="contact" />;
}

// ISR revalidation
export const revalidate = 3600;

// Metadata
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bdu.info.az";

  const title = locale === "az" ? "Əlaqə" : "Contact";
  const description =
    locale === "az"
      ? "Rəsmi ünvan, əlaqə nömrələri və müraciət forması ilə bizimlə əlaqə saxlayın."
      : "Get in touch with us via official address, contact numbers and the application form.";

  return {
    title: `${title}`,
    description,
    keywords: "BDU, Baku State University, contact, address",

    alternates: {
      canonical: `${baseUrl}${locale === "az" ? "/elaqe" : "/en/contact"}`,
      languages: {
        az: `${baseUrl}/elaqe`,
        en: `${baseUrl}/en/contact`,
        "x-default": `${baseUrl}/en/contact`
      }
    },

    openGraph: {
      title: `${title}`,
      description,
      url: `${baseUrl}${locale === "az" ? "/elaqe" : "/en/contact"}`,
      siteName: "Baku State University",
      locale: locale === "az" ? "az_AZ" : "en_US",
      type: "website"
    },

    twitter: {
      card: "summary",
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

