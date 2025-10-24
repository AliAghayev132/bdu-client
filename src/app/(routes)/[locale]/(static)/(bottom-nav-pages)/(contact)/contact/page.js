import ContactContent from "../(components)/ContactContent";
import { buildLocalizedMetadata } from "@/seo/metadata";

export default async function ContactPage({ params }) {
  const { locale } = await params;
  return <ContactContent locale={locale} />;
}

// ISR revalidation
export const revalidate = 3600;

// Metadata
export async function generateMetadata({ params }) {
  const { locale } = await params;
  return buildLocalizedMetadata({
    locale,
    slugs: { az: "/elaqe", en: "/en/contact" },
    title: { az: "Əlaqə", en: "Contact" },
    description: {
      az: "Rəsmi ünvan, əlaqə nömrələri və müraciət forması ilə bizimlə əlaqə saxlayın.",
      en: "Get in touch with us via official address, contact numbers and the application form.",
    },
    keywords: {
      az: "BDU, Bakı Dövlət Universiteti, əlaqə, ünvan",
      en: "BDU, Baku State University, contact, address",
    },
  });
}

