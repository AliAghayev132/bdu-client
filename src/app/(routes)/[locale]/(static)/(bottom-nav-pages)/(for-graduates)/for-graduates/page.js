import BlogPageContent from "@/components/common/BlogPageContent";
import { buildLocalizedMetadata } from "@/seo/metadata";


// Simpler, locale-based content
const content = {
  en: {
    title: "FOR EMPLOYEES",
    breadcrumbs: "For employees",
    content: {
        body:  `<div class="text-container tracking-wider leading-[1.8]">&nbsp; &nbsp;The Career and Alumni Relations Sector of Baku State University aims to prepare students and graduates for future professional life, realizing their creative potential, and establishing and maintaining inter-alumni relations in coordination with the university's relevant department. Career specialists work to support students and graduates of the university in their future career development. The activities of the Career and Alumni Relations Sector are carried out in the following areas: 
<br/>
- Creating a database of students studying at the university, as well as successful graduates, and ensuring the constant updating of this database; 
<br/>
- Further developing career planning for students and graduates, familiarizing them with the fields of interest; 
<br/>
- Conducting competitions to identify talented and promising students and support their career development; 
<br/>
- Conducting research on resources and options that can support students' and graduates' careers; 
<br/>
- Organizing career development events — job fairs, career exhibitions, career-building workshops, career-focused forums, interview simulations, etc.; 
<br/>
- Providing students and graduates with the knowledge and skills necessary for employment, as well as directing them to find jobs that match their specialties in the labor market; 
<br/>
- Analyzing the professional and specialized requirements set by employers for the workforce; 
<br/>
- Conducting surveys to determine the employment readiness level of students and graduates in accordance with labor market requirements; 
<br/>
- Proposing changes to curricula to adapt university specialties to labor market demands; 
<br/>
- Collecting information about vacancies in local and international companies and disseminating this information among students and graduates; 
<br/>
- Conducting exchanges of experiences to improve career activities; 
<br/>
- Establishing inter-alumni relations in coordination with relevant departments of the university and organizing virtual networking; 
<br/>
- Further developing partnerships with graduates, monitoring their career development, and involving them in career-related events; 
<br/>
- Organizing meetings for successful graduates of the university to share their success stories with students.  </div>`
    }
  },
};

export default async function ForGraduatesPage({ params }) {
  const { locale } = await params;
  return <BlogPageContent content={content.en} locale={locale} />;
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return buildLocalizedMetadata({
    locale,
    slugs: { az: "/mezunlar-ucun", en: "/en/for-graduates" },
    title: { az: "Məzunlar üçün", en: "For graduates" },
    description: {
      az: "BDU-da məzun , tədris prosesi və imkanlar haqqında məlumat.",
      en: "Information about graduate, education process and opportunities at BSU.",
    },
    keywords: {
      az: "BDU, məzunlar, təhsil, universitet, məzunlar üçün",
      en: "BSU, graduate, education, university, for graduates",
    },
  });
}

