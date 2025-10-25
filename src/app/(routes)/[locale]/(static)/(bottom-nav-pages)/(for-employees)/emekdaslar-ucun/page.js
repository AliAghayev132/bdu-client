import BlogPageContent from "@/components/common/BlogPageContent";
import { buildLocalizedMetadata } from "@/seo/metadata";

// Simpler, locale-based content
const content = {
  az: {
    title: "ƏMƏKDAŞLAR ÜÇÜN",
    breadcrumbs: "Əməkdaşlar üçün",
    content: {
      body: `<p class="text-container tracking-wider leading-[1.8]">&nbsp; &nbsp; BDU ali təhsil müəssisəsi olmaqla müasir təhsilin bütün növlərini əhatə edir. <br/> 
BDU yaranandan Universitetdə Kadrlar şöbəsi fəaliyyət göstərib. Kadrlar şöbəsi öz işini layiqincə yerinə yetirmiş, Universitet inkişaf etdikcə, ştatlar artdıqca işlərini düzgün qurmağı bacarmış və kollektivlə düzgün işbirliyi qurmuşlar. Bu illər ərzində Universitet əməkdaşlarının sayı 2730-a çatmışdır.<br/> <br/>
Onlar müasir dövrün tələblərinə uyğun şəraitdə çalışaraq ən son texnologiyalarla təmin edilmiş, onlara səmərəli iş üçün hər cür şərait yaradılmışdır.<br/> <br/>
Hal-hazırda Universitetdə çalışan AMEA-nın həqiqi üzvlərinin sayı 7, AMEA-nın müxbir üzvlərinin sayı 3, fakültələrin sayı 16,  kafedraların sayı 119, professor-müəllim heyətinin sayı 1296 nəfərdir.<br/><br/>
Kadrlar şöbəsi artıq İnsan resursları və hüquq şöbəsi kimi adlandırılmışdır.<br/> <br/>
İnsan resursları və hüquq şöbəsinin 3 sektoru var: İnsan resursları sektoru, Hüquq sektoru, Karyera və məzunlarla əlaqə sektoru.  Şöbəmizdə ümumilikdə 23 işçi çalışır. Onlar 2730 işçinin sənədləşmə işləri ilə, yəni işə qəbul, işdən azad olunma, müxtəlif növ məzuniyyətlər, alimlik dərəcəsinin, elmi adın təsdiqi ilə əlaqədar əmrlərin verilməsi, müqavilələrin bağlanması, verilən əmrlərin Dövlət Sosal Müdafiə Fondunun portalına və müxtəlif proqramlara işlənməsi,  hesabatların hazırlanması, Rəhbərlik tərəfindən verilən əmr və sərəncamların vaxtlı-vaxtında və düzgün yerinə yetirilməsi ilə məşğul olurlar. Onlar eləcə də Universitet əməkdaşlarının işə davamiyyətinə, universitetdaxili nizam-intizam qaydalarına düzgün riayət edilməsinə nəzarət edirlər.</p>`,
    },
  },
};

export default async function ForEmployeesPage({ params }) {
  const { locale } = await params;
  return <BlogPageContent content={content.az} locale={locale} />;
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
