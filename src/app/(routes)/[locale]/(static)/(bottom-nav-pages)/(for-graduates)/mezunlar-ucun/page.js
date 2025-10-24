import BlogPageContent from "@/components/common/BlogPageContent";
import { buildLocalizedMetadata } from "@/seo/metadata";


// Simpler, locale-based content
const content = {
  en: {
    title: "MƏZUNLAR ÜÇÜN",
    breadcrumbs: "Məzunlar üçün",
    content: {
        body:  `<div class="text-container tracking-wider leading-[1.8]">&nbsp; &nbsp;Bakı Dövlət Universitetinin karyera və məzunlarla əlaqə sektoru tələbələri və məzunları gələcək iş həyatına hazırlamağa, onların kreativ potensialının reallaşmasına, Universitetin müvafiq qurumunun koordinasiyası ilə məzunlararası əlaqənin qurulması və saxlanmasına xidmət edir. Karyera sahəsi üzrə mütəxəssislər universitetin tələbə və məzunlarını gələcək karyera inkişafında dəstəkləmək məqsədilə fəaliyyət göstərir. Karyera və məzunlarla əlaqə sektorunun fəaliyyəti aşağıdakı istiqamətlərdə həyata keçirilir:
<br/>
- Universitetdə təhsil alan tələbələrin və ilkin olaraq universitetin uğur qazanmış məzunlarının  məlumat bazasını yaratmaq və həmin bazanın daim yenilənməsini təmin etmək;
<br/>
- Tələbələrin, məzunların karyera planlaşdırmasını daha da dolğunlaşdırmaq və onları maraqlandıqları sahələrlə daha yaxından tanış etmək;
<br/>
- Müsabiqələr keçirməklə istedadlı və perspektivli tələbələri müəyyən etmək və onların karyera inkişafına dəstək olmaq;
<br/>
- Tələbə və məzunların karyerasına dəstək ola biləcək resurs və seçimlərin araşdırılması istiqamətində işlər aparmaq;
<br/>
- Karyera inkişafına həsr olunmuş tədbirlər – karyera sərgiləri, əmək yarmarkaları, karyera quruculuğuna həsr olunmuş təlimlər, karyera istiqamətində ixtisas forumları, işə qəbul simulyasiyası və s. – təşkil etmək;
<br/>
- Tələbə və məzunları məşğulluğa dair bilik və bacarıqlarla təmin etmək və onlara əmək bazarında öz ixtisaslarına uyğun iş tapmağa yönləndirmək;
<br/>
- İşəgötürən təşkilatlar tərəfindən işçi qüvvəsinin qarşısında qoyulan peşəkar və ixtisas tələblərini təhlil etmək;
<br/>
- Tələbələrin və məzunların işə hazırlıq səviyyəsinin əmək bazarının  tələblərinə uyğunluğunu  müəyyənləşdirmək məqsədi ilə sorğular həyata keçirmək;
<br/>
- Universitetdəki ixtisasların əmək bazarının tələblərinə uyğunlaşdırılması məqsədilə tədris planlarında dəyişiklik etməklə bağlı təkliflər irəli sürmək;
<br/>
- Ölkədə fəaliyyət göstərən yerli və xarici şirkətlərdə vakant iş yerləri haqqında məlumatları mütəmadi şəkildə toplamaq və onların tələbələr və məzunlar arasında yayılmasını təmin etmək;
<br/>
- Karyera inkişafındakı fəaliyyəti təkmilləşdirmək məqsədilə təcrübə mübadiləsini həyata keçirmək;
<br/>
- Universitetin müvafiq qurumunun koordinasiyası ilə məzunlararası əlaqələri qurmaq və virtual şəbəkələşməni təşkil etmək;
<br/>
- Məzunlarla tərəfdaşlığı daha da inkişaf etdirmək, onların karyera inkişafını izləmək, karyeraları ilə əlaqəli tədbirlərə cəlb etmək; 
<br/>
- Karyera sahəsində universitetin uğur qazanmış məzunlarının öz uğur hekayələrini tələbələrə çatdırmaları üçün görüşlər təşkil etmək. </div>`
    }
  },
};

export default async function MezunlarUcunPage({ params }) {
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

