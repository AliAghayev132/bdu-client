import BlogPageContent from "@/components/common/BlogPageContent";
import { buildLocalizedMetadata } from "@/seo/metadata";


// Simpler, locale-based content
const content = {
  en: {
    title: "FOR EMPLOYEES",
    breadcrumbs: "For employees",
    content: {
        body:  `<p class="text-container tracking-wider leading-[1.8]">&nbsp; &nbsp;As a higher educational institution, BSU covers all types of modern education. <br/>
<br/>
Since the foundation of the university, a human resources department has been operating within it. The human resources department has successfully fulfilled its tasks, properly organizing its activities as the university developed and staffing increased, establishing proper cooperation with the staff. Over the years, the number of university employees has reached 2730. <br/>
<br/>
Working under conditions that meet modern requirements, they are provided with the latest technologies and all necessary conditions for effective work. <br/>
<br/>
Currently, the university employs 7 full members of the Azerbaijan National Academy of Sciences, 3 corresponding members, 16 faculties, 119 departments, and 1296 teaching staff. </br/>
<br/>
The human resources department has already been renamed the Department of Human Resources and Law. </br/>
<br/>
The Department of Human Resources and Law has 3 sectors: Human Resources Sector, Law Sector, Career and Alumni Relations Sector. Our department has a total of 23 employees. They deal with the documentation for 2730 employees, including hiring, dismissals, various types of leaves, issuing orders for the confirmation of academic degrees and titles, signing contracts, processing issued orders on the State Social Protection Fund portal and various programs, preparing reports, and ensuring the timely and proper execution of orders and directives from management. They also oversee compliance with labor discipline among university employees and adherence to internal regulations. </p>`
    }
  },
};

export default async function ForEmployeesPage({ params }) {
  const { locale } = await params;
  return <BlogPageContent content={content.en} locale={locale} />;
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return buildLocalizedMetadata({
    locale,
    slugs: { az: "/emekdaslar-ucun", en: "/en/for-employees" },
    title: { az: "Əməkdaşlar üçün", en: "For employees" },
    description: {
      az: "BDU-da əməkdaş həyatı, tədris prosesi və imkanlar haqqında məlumat.",
      en: "Information about employee life, education process and opportunities at BSU.",
    },
    keywords: {
      az: "BDU, emekdaşlar, təhsil, universitet, emekdaşlar üçün",
      en: "BSU, employee, education, university, for employees",
    },
  });
}

