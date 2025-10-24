import React from 'react'
import StructuredData from "@/components/seo/StructuredData";
import Breadcrumbs from '@/app/(routes)/[locale]/[category]/[...slug]/(components)/Breadcrumbs';

// Simpler, locale-based content
const CONTENT = {
  az: {
    title: "TƏLƏBƏLƏR ÜÇÜN",
    breadcrumbs: "Tələbələr üçün",
    content: {
        body: `<p class="text-container tracking-wider leading-[1.8]"> &nbsp; &nbsp;Universitetdə oxumaq - tələbənin vaxtının və diqqətinin çox hissəsini aparan çox maraqlı bir prosesdir. Bundan əlavə, təhsil almaq sonrakı həyat yolunu, peşə fəaliyyətini formalaşdırır və perspektivdə həyatın özünün keyfiyyətinə təsir göstərir. BDU-da gözəl müəllimlər var - onların peşəkarlığına yəqinliklə şübhə etməmək olar. Bilik səviyyəsini də qeyd etmək lazımdır, o, kifayət qədər yüksəkdir, bu da əmək bazarında məzunumuza tələbatı təmin edir.<br/>  
Universitetdə tədris prosesi orta məktəbdəki tədris prosesinin təşkilindən əhəmiyyətli dərəcədə fərqlənir. Universitet qarşısında duran ən mühüm vəzifələrdən biri tələbələrə gələcək həyatı boyu müstəqil şəkildə öyrənməyi, inkişaf etməyi öyrətməkdir. Universitetdəki təhsil zamanı seçilmiş istiqamət üzrə biliklərin yalnız əsası qoyulur. Universitetdəki təhsil müddətində əsas məsələ – müstəqil zehni iş üsullarına yiyələnmək, yaradıcılıq qabiliyyətlərini şüurlu şəkildə inkişaf etdirmək və yaradıcı iş bacarıqlarına yiyələnməkdir. Bunun üçün təlim və davranış intizamına ciddi riayət etmək lazımdır.</br>
Siz yeni dövrün tələbəsisiniz–artıq təhsil məkanının sərhədləri yoxdur, Azərbaycan təhsil sistemi Avropa təhsil sisteminə inteqrasiya olunaraq, pilləli təhsil sisteminə keçmişdir. Avropa Kredit Köçürməsi Sistemi (European Credit Transfer System, ECTS) - təhsil proqramının və ya kursun mənimsəməsində tələbələrin tədris işlərini qeyd etmək üçün ümumavropa sistemidir. ECTS-də tədris ili, bir qayda olaraq, 60 kreditdən ibarətdir. ECTS balları A-dan E-yə kimi qiymətlər üzrə verilir, və F – qeyri-məqbul sayılır. Kreditlər proqramın bütün nəzəri və praktiki komponentlərinə (fənlər, modullar, təcrübələr, kurs və diiplom işləri və s.) ayrılır.</br>
Hər bir tələbənin şəxsi seçiminə əsaslanan fərdi təhsil planı olacaq və onu hazırlamağa tütorunuz kömək edəcək.</br>
Tələbə həyatı üçün vacib olacaq əsas anlayışları bilməlisiniz. 
Auditoriya dərslərində - mühazirələrdə, praktiki (seminar) məşğələlərdə, laboratoriya işlərində tələbələr öyrənilən fənlər üzrə əsas məlumatları alır, bilik və bacarıqları möhkəmləndirirlər. Universitetdə auditoriya dərslərinin aparıcı növü mühazirədir. Mühazirədə müəllimlər fənnin əsas materialını tələbəyə çatdırırlar. Mühazirələrin diqqətlə dinlənilməsi və qeydlərin edilməsi tələbədən intensiv zehni fəaliyyət tələb edir. Mühazirənin konspekti üzərində işləyərkən yalnız dərslikdən deyil, həm də müəllimin tövsiyə etdiyi əlavə ədəbiyyatdan istifadə etmək lazımdır.</br>
Mühazirələrdə və müstəqil iş prosesində əldə edilmiş nəzəri bilikləri möhkəmləndirmək və dərinləşdirmək məqsədilə qrupda seminar məşğələləri keçirilir. Seminarlarda tədris materialının fənlər üzrə tələbələr tərəfindən başa düşülməsi və mənimsənilmə dərəcəsi yoxlanılır, ən mürəkkəb nəzəri məsələlər hərtərəfli təhlil edilir.</br>
Laboratoriya məşğələləri nəzəriyyə ilə təcrübəni birləşdirən praktiki məşğələ  növlərindən biridir. Laboratoriya məşğələləri nəzəri kursun əsas müddəalarına əsaslanır və müvafiq avadanlıqla təchiz olunmuş laboratoriyalarda aparılır.</br>
Müstəqil iş - mühazirə materialının öyrənilməsi, məşğələlərə hazırlıq, referatların, məruzələrin hazırlanması, kollokvium və imtahanlara hazırlıq, kurs işlərinin (layihələrinin) yazılması, elmi-tədqiqat işində iştirakı nəzərdə tutur.</br>
</br>
Tədris prosesi biliklərin mənimsənilməsinə nəzarətin aşağıdakı üsullarını əhatə edir: yoxlama işi, yazılı test, kollokvium, imtahan (yazılı və ya şifahi).  Kollokvium tələbələrin biliyini yoxlamaq və qiymətləndirmək məqsədi ilə keçirilən cari attestasiya forması, semestr ərzində keçirilən mini imtahandır. Kollokviumda toplanan ballar yekun qiymətə təsir göstərir. İmtahan semestr başa çatdıqdan sonra tələbələrin biliyinin attestasiyasının və yoxlanılmasının əsas formasıdır. Sessiyaya ciddi hazırlaşmaq və bütün imtahanlardan uğurla keçmək hər bir tələbənin vəzifəsidir.</br>
</br>
Universitetdə təhsil aldığı müddətdə tələbə müxtəlif növ təcrübələr keçməlidir. Təcrübə - müasir mütəxəssis hazırlığının tərkib hissəsidir. Onun vəzifəsi tələbələrin Universitetdə təhsil aldıqları müddətdə əldə etdikləri nəzəri bilikləri möhkəmləndirmək və ixtisas üzrə praktiki iş üçün lazımi bacarıqları aşılamaqdan ibarətdir. Yuxarı kurslarda tələbələr təcrübəni seçdikləri ixtisasa uyğun olan müəssisə, idarə və ya təşkilatlarda keçirlər.<br/>
</br>
Universitetdə təhsil prosesində Sizə elmi işlə məşğul olmaq imkanı verilir. Elmi tədqiqatların apararkən Siz nəzəri materialı daha dərindən mənimsəyir, yaradıcı axtarış vərdişlərinə yiyələnir, nəzəri və praktiki tədqiqatlarda təcrübə qazanır, və bir qayda olaraq, sessiya zamanı daha yüksək nəticə göstərirsiniz.</br>
Universitet divarları arasında tələbə həyatını necə maraqlı və faydalı etmək olar? 
Universitetdə həmişə tələbələr üçün hansısa tədbirlər keçirilir (idman yarışları, tələbə elmi konfransları, elmi ictimaiyyətin görkəmli nümayəndələri ilə görüşlər, yaradıcılıq müsabiqələri, fleşmoblar, kvestlər, dərnəklər işləyir). Beləliklə, bu tədbirlərin kiçik bir qismində fəal iştirak etsəniz, darıxmağa vaxtınız qalmayacaq.</p>`
    }
  },
  en: {
    title: "FOR STUDENTS",
    breadcrumbs: "For students",
    content: {
        body:  `<p class="text-container tracking-wider leading-[1.8]"> &nbsp; &nbsp;Universitetdə oxumaq - tələbənin vaxtının və diqqətinin çox hissəsini aparan çox maraqlı bir prosesdir. Bundan əlavə, təhsil almaq sonrakı həyat yolunu, peşə fəaliyyətini formalaşdırır və perspektivdə həyatın özünün keyfiyyətinə təsir göstərir. BDU-da gözəl müəllimlər var - onların peşəkarlığına yəqinliklə şübhə etməmək olar. Bilik səviyyəsini də qeyd etmək lazımdır, o, kifayət qədər yüksəkdir, bu da əmək bazarında məzunumuza tələbatı təmin edir.<br/>  
Universitetdə tədris prosesi orta məktəbdəki tədris prosesinin təşkilindən əhəmiyyətli dərəcədə fərqlənir. Universitet qarşısında duran ən mühüm vəzifələrdən biri tələbələrə gələcək həyatı boyu müstəqil şəkildə öyrənməyi, inkişaf etməyi öyrətməkdir. Universitetdəki təhsil zamanı seçilmiş istiqamət üzrə biliklərin yalnız əsası qoyulur. Universitetdəki təhsil müddətində əsas məsələ – müstəqil zehni iş üsullarına yiyələnmək, yaradıcılıq qabiliyyətlərini şüurlu şəkildə inkişaf etdirmək və yaradıcı iş bacarıqlarına yiyələnməkdir. Bunun üçün təlim və davranış intizamına ciddi riayət etmək lazımdır.</br>
Siz yeni dövrün tələbəsisiniz–artıq təhsil məkanının sərhədləri yoxdur, Azərbaycan təhsil sistemi Avropa təhsil sisteminə inteqrasiya olunaraq, pilləli təhsil sisteminə keçmişdir. Avropa Kredit Köçürməsi Sistemi (European Credit Transfer System, ECTS) - təhsil proqramının və ya kursun mənimsəməsində tələbələrin tədris işlərini qeyd etmək üçün ümumavropa sistemidir. ECTS-də tədris ili, bir qayda olaraq, 60 kreditdən ibarətdir. ECTS balları A-dan E-yə kimi qiymətlər üzrə verilir, və F – qeyri-məqbul sayılır. Kreditlər proqramın bütün nəzəri və praktiki komponentlərinə (fənlər, modullar, təcrübələr, kurs və diiplom işləri və s.) ayrılır.</br>
Hər bir tələbənin şəxsi seçiminə əsaslanan fərdi təhsil planı olacaq və onu hazırlamağa tütorunuz kömək edəcək.</br>
Tələbə həyatı üçün vacib olacaq əsas anlayışları bilməlisiniz. 
Auditoriya dərslərində - mühazirələrdə, praktiki (seminar) məşğələlərdə, laboratoriya işlərində tələbələr öyrənilən fənlər üzrə əsas məlumatları alır, bilik və bacarıqları möhkəmləndirirlər. Universitetdə auditoriya dərslərinin aparıcı növü mühazirədir. Mühazirədə müəllimlər fənnin əsas materialını tələbəyə çatdırırlar. Mühazirələrin diqqətlə dinlənilməsi və qeydlərin edilməsi tələbədən intensiv zehni fəaliyyət tələb edir. Mühazirənin konspekti üzərində işləyərkən yalnız dərslikdən deyil, həm də müəllimin tövsiyə etdiyi əlavə ədəbiyyatdan istifadə etmək lazımdır.</br>
Mühazirələrdə və müstəqil iş prosesində əldə edilmiş nəzəri bilikləri möhkəmləndirmək və dərinləşdirmək məqsədilə qrupda seminar məşğələləri keçirilir. Seminarlarda tədris materialının fənlər üzrə tələbələr tərəfindən başa düşülməsi və mənimsənilmə dərəcəsi yoxlanılır, ən mürəkkəb nəzəri məsələlər hərtərəfli təhlil edilir.</br>
Laboratoriya məşğələləri nəzəriyyə ilə təcrübəni birləşdirən praktiki məşğələ  növlərindən biridir. Laboratoriya məşğələləri nəzəri kursun əsas müddəalarına əsaslanır və müvafiq avadanlıqla təchiz olunmuş laboratoriyalarda aparılır.</br>
Müstəqil iş - mühazirə materialının öyrənilməsi, məşğələlərə hazırlıq, referatların, məruzələrin hazırlanması, kollokvium və imtahanlara hazırlıq, kurs işlərinin (layihələrinin) yazılması, elmi-tədqiqat işində iştirakı nəzərdə tutur.</br>
</br>
Tədris prosesi biliklərin mənimsənilməsinə nəzarətin aşağıdakı üsullarını əhatə edir: yoxlama işi, yazılı test, kollokvium, imtahan (yazılı və ya şifahi).  Kollokvium tələbələrin biliyini yoxlamaq və qiymətləndirmək məqsədi ilə keçirilən cari attestasiya forması, semestr ərzində keçirilən mini imtahandır. Kollokviumda toplanan ballar yekun qiymətə təsir göstərir. İmtahan semestr başa çatdıqdan sonra tələbələrin biliyinin attestasiyasının və yoxlanılmasının əsas formasıdır. Sessiyaya ciddi hazırlaşmaq və bütün imtahanlardan uğurla keçmək hər bir tələbənin vəzifəsidir.</br>
</br>
Universitetdə təhsil aldığı müddətdə tələbə müxtəlif növ təcrübələr keçməlidir. Təcrübə - müasir mütəxəssis hazırlığının tərkib hissəsidir. Onun vəzifəsi tələbələrin Universitetdə təhsil aldıqları müddətdə əldə etdikləri nəzəri bilikləri möhkəmləndirmək və ixtisas üzrə praktiki iş üçün lazımi bacarıqları aşılamaqdan ibarətdir. Yuxarı kurslarda tələbələr təcrübəni seçdikləri ixtisasa uyğun olan müəssisə, idarə və ya təşkilatlarda keçirlər.<br/>
</br>
Universitetdə təhsil prosesində Sizə elmi işlə məşğul olmaq imkanı verilir. Elmi tədqiqatların apararkən Siz nəzəri materialı daha dərindən mənimsəyir, yaradıcı axtarış vərdişlərinə yiyələnir, nəzəri və praktiki tədqiqatlarda təcrübə qazanır, və bir qayda olaraq, sessiya zamanı daha yüksək nəticə göstərirsiniz.</br>
Universitet divarları arasında tələbə həyatını necə maraqlı və faydalı etmək olar? 
Universitetdə həmişə tələbələr üçün hansısa tədbirlər keçirilir (idman yarışları, tələbə elmi konfransları, elmi ictimaiyyətin görkəmli nümayəndələri ilə görüşlər, yaradıcılıq müsabiqələri, fleşmoblar, kvestlər, dərnəklər işləyir). Beləliklə, bu tədbirlərin kiçik bir qismində fəal iştirak etsəniz, darıxmağa vaxtınız qalmayacaq.</p>`
    }
  },
};

const BlogPageContent = ({ locale }) => {
  const content = CONTENT[locale];

  if (!content) return null;

  const path = locale === "az" ? "/telebeler-ucun" : "/en/for-students";
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
        <header className="w-full mx-auto mb-6">
          <h1 className="laptop:text-3xl md:text-2xl text-xl font-bold text-primary tracking-wider uppercase">
            {content.title}
          </h1>
        </header>
        <div className='py-2 sm:text-base text-sm' dangerouslySetInnerHTML={{ __html: content.content.body }} />
      </div>
    </div>
  )
}

export default BlogPageContent
