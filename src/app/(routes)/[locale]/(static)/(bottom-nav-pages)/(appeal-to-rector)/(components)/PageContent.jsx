
import Breadcrumbs from "../../../../[category]/[...slug]/(components)/Breadcrumbs";
import StructuredData from "@/components/seo/StructuredData";
import ContactForm from "./ContactForm";

const CONTENT = {
  'rektora-muraciet': {
    az: {
      title: 'REKTORA MÜRACİƏT',
      description: 'Hörmətli Tələbələr, Əziz Rektora hər hansı bir sualınız, təklifiniz və ya şikayətiniz varsa, müraciətinizi təqdim edə bilərsiniz.',
      breadcrumbs: "Rektora müraciət"
    },
    en: {
      title: 'APPEAL TO RECTOR',
      description: 'Dear Students, if you have any questions, suggestions or complaints for the Rector, you can submit your appeal.',
      breadcrumbs: "Appeal to Rector"   
    }
  },
  'appeal-to-rector': {
    az: {
      title: 'REKTORA MÜRACİƏT',
      description: 'Hörmətli Tələbələr, Əziz Rektora hər hansı bir sualınız, təklifiniz və ya şikayətiniz varsa, müraciətinizi təqdim edə bilərsiniz.',
      breadcrumbs: "Rektora müraciət"
    },
    en: {
      title: 'APPEAL TO RECTOR',
      description: 'Dear Students, if you have any questions, suggestions or complaints for the Rector, you can submit your appeal.',
      breadcrumbs: "Appeal to Rector"   
    }
  }
};

export default function PageContent({ locale, slug }) {
  const content = CONTENT[slug]?.[locale];
  
  if (!content) {
    return null;
  }
  
  const breadcrumbs = [
    { 
      label: locale === 'az' ? 'Ana səhifə' : 'Home', 
      href: '/' 
    },
    { 
      label: content.breadcrumbs, 
      href: `/${slug}` 
    }
  ];
  
  return (
    <div className="min-h-screen bg-white">
      {/* Structured Data */}
      <StructuredData type="breadcrumb" data={{ breadcrumbs }} locale={locale} />
      
      {/* Breadcrumbs */}
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      
      {/* Page Content */}
      <div className="wrapper mx-auto px-4 sm:py-12 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <header className="mb-8">
            <h1 className="md:text-3xl sm:text-2xl text-xl font-bold text-primary tracking-wider uppercase mb-4">
              {content.title}
            </h1>
            {/* <p className="md:text-lg sm:text-base text-sm text-gray-600">
              {content.description}
            </p> */}
          </header>
          
          {/* Contact Form */}
          <ContactForm locale={locale} type="rector" />
        </div>
      </div>
    </div>
  );
}
