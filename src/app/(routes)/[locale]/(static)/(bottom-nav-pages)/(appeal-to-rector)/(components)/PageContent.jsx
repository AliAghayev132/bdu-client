
import Breadcrumbs from "../../../../[category]/[...slug]/(components)/Breadcrumbs";
import StructuredData from "@/components/seo/StructuredData";
import RectorForm from "./RectorForm";
import NotFound from "@/app/(routes)/[locale]/[category]/[...slug]/(components)/NotFound";

const CONTENT = {
  'rektora-muraciet': {
    az: {
      title: 'REKTORA MÜRACİƏT',
      description: 'Hörmətli Tələbələr, Əgər Rektora hər hansı bir sualınız, təklifiniz və ya şikayətiniz varsa, müraciətinizi təqdim edə bilərsiniz.',
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
      description: 'Hörmətli Tələbələr, Əgər Rektora hər hansı bir sualınız, təklifiniz və ya şikayətiniz varsa, müraciətinizi təqdim edə bilərsiniz.',
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
    return <NotFound/>;
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
      <div className="wrapper mx-auto px-4 sm:py-8 py-3">
      <header className="w-full mx-auto laptop:mb-6 mb-3">
          <h1 className="laptop:text-3xl md:text-2xl text-xl font-bold text-primary tracking-wider uppercase">
            {content.title}
          </h1>
        </header>
          {/* Contact Form */}
          <RectorForm locale={locale} type="rector" />
        </div>
    </div>
  );
}
