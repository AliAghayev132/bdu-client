import Breadcrumbs from "../../../../[category]/[...slug]/(components)/Breadcrumbs";
import StructuredData from "@/components/seo/StructuredData";
import ContactForm from "./ContactForm";
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

// Simpler, locale-based content
const CONTENT = {
  az: {
    title: "ƏLAQƏ",
    breadcrumbs: "Əlaqə",
    formTitle: "Müraciət forması",
    addressTitle: "Ünvan",
    address:
      "Bakı şəhəri, akademik Zahid Xəlilov küçəsi 33, AZ 1143 Bütün hüquqlar qorunur. Hər hansı bir lisenziyalı materialdan istifadə etmək üçün əlaqə saxlayın.",
    phone: "+994 (12) 430-32-45",
    email: "info@bsu.edu.az",
  },
  en: {
    title: "CONTACT",
    breadcrumbs: "Contact",
    formTitle: "Application form",
    addressTitle: "Address",
    address:
      "33 Academician Zahid Khalilov St., Baku AZ1143. All rights reserved. For using any licensed material, please contact us.",
    phone: "+994 (12) 430-32-45",
    email: "info@bsu.edu.az",
  },
};

export default function ContactContent({ locale }) {
  const content = CONTENT[locale];

  if (!content) return null;

  const path = locale === "az" ? "/elaqe" : "/en/contact";
  const breadcrumbs = [
    { label: locale === "az" ? "Ana səhifə" : "Home", href: "/" },
    { label: content.breadcrumbs, href: path },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Structured Data */}
      <StructuredData
        type="breadcrumb"
        data={{ breadcrumbs }}
        locale={locale}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      {/* Page Content */}
      <div className="wrapper mx-auto px-4 sm:py-8 py-3">
     <header className="w-full mx-auto laptop:mb-6 mb-3">
          <h1 className="laptop:text-3xl md:text-2xl text-xl font-bold text-primary tracking-wider uppercase">
            {content.title}
          </h1>
        </header>

        {/* Top section: Map + Form */}
        <main className="grid lg:grid-cols-2 grid-cols-1  gap-6 items-start h-full">
          {/* Map */}
          <div className="lg:order-0 order-1">
            <div className="w-full h-[260px] sm:h-[320px] md:h-[380px] rounded-md overflow-hidden border border-gray-200">
              <iframe
                title="BDU Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3039.375661436932!2d49.81591147688985!3d40.37953505705604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307da7b5b7d9f3%3A0xf4a8c2a9d9a05b3a!2sBaku%20State%20University!5e0!3m2!1sen!2saz!4v1697040000000"
              ></iframe>
            </div>
               {/* Address & Socials */}
        <div className="mt-6 rounded-xl border-2 border-primary/20 bg-white p-4 sm:p-6 h-full">
          <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
            {content.addressTitle}
          </h3>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-start gap-3">
              <MapPin className="text-primary mt-0.5 flex-shrink-0" size={18} />
              <p className="leading-relaxed text-sm sm:text-base">{content.address}</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-primary flex-shrink-0" size={18} />
              <a href={`tel:${content.phone.replace(/[^\d+]/g, '')}`} className="text-sm sm:text-base hover:text-primary transition-colors">
                {content.phone}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-primary flex-shrink-0" size={18} />
              <a href={`mailto:${content.email}`} className="text-sm sm:text-base hover:text-primary transition-colors">
                {content.email}
              </a>
            </div>

            <div className="pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <a href="#" aria-label="Facebook" className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-primary/30 text-primary hover:bg-primary hover:text-white transition-colors">
                  <Facebook size={18} />
                </a>
                <a href="#" aria-label="Instagram" className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-primary/30 text-primary hover:bg-primary hover:text-white transition-colors">
                  <Instagram size={18} />
                </a>
                <a href="#" aria-label="LinkedIn" className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-primary/30 text-primary hover:bg-primary hover:text-white transition-colors">
                  <Linkedin size={18} />
                </a>
                <a href="#" aria-label="YouTube" className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-primary/30 text-primary hover:bg-primary hover:text-white transition-colors">
                  <Youtube size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
          </div>

          {/* Form */}
          <div className="bg-white border-2 border-primary/20 rounded-xl p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-primary mb-4">
              {content.formTitle}
            </h2>
            <ContactForm locale={locale} type="contact" />
          </div>
        </main>
      </div>
    </div>
  );
}
