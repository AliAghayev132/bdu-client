import NewsPageContent from "../(components)/NewsPageContent";
import newsImage from "@/assets/images/baki-dovlet-universiteti.jpg";

export default async function XeberlerPage({ params }) {
  const { locale } = await params;

  const content = {
    az: {
      title: "XƏBƏRLƏR",
      breadcrumbs: "Xəbərlər",
    },
  };

  async function getNews() {
    // TODO: Replace with actual API call
    // const res = await fetch('https://api.bdu.info.az/news?locale=${locale}', {
    //   next: { revalidate: 300 } // Cache for 5 minutes
    // });
    // return res.json();

    // Mock data for now
    return [
      {
        id: 1,
        slug: "bdu-da-yeni-tdris-ili-başladı",
        title: "BDU-da yeni tədris ili başladı",
        excerpt:
          "2024-2025 tədris ili təntənəli şəkildə açıldı. Tədbirdə universitetin rəhbərliyi və tələbələr iştirak etdilər.",
        date: "2025-01-15",
        image: newsImage,
      },
      {
        id: 2,
        slug: "beynəlxalq-əməkdaşlıq-müqaviləsi-imzalandı",
        title: "Beynəlxalq əməkdaşlıq müqaviləsi imzalandı",
        excerpt:
          "BDU Avropa universitetləri ilə yeni əməkdaşlıq müqaviləsi imzaladı.",
        date: "2025-01-10",
        image: newsImage,
      },
      {
        id: 3,
        slug: "yeni-elmi-laboratoriya-açıldı",
        title: "Yeni elmi laboratoriya açıldı",
        excerpt:
          "Universitetdə müasir avadanlıqlarla təchiz olunmuş yeni laboratoriya istifadəyə verildi.",
        date: "2025-01-05",
        image: newsImage,
      },
      {
        id: 4,
        slug: "yeni-elmi-laboratoriya-açıldı",
        title: "Yeni elmi laboratoriya açıldı",
        excerpt:
          "Universitetdə müasir avadanlıqlarla təchiz olunmuş yeni laboratoriya istifadəyə verildi.",
        date: "2025-01-05",
        image: newsImage,
      },
      {
        id: 5,
        slug: "yeni-elmi-laboratoriya-açıldı",
        title: "Yeni elmi laboratoriya açıldı",
        excerpt:
          "Universitetdə müasir avadanlıqlarla təchiz olunmuş yeni laboratoriya istifadəyə verildi.",
        date: "2025-01-05",
        image: newsImage,
      },
      {
        id: 6,
        slug: "yeni-elmi-laboratoriya-açıldı",
        title: "Yeni elmi laboratoriya açıldı",
        excerpt:
          "Universitetdə müasir avadanlıqlarla təchiz olunmuş yeni laboratoriya istifadəyə verildi.",
        date: "2025-01-05",
        image: newsImage,
      },
    ];
  }

  const news = await getNews();

  return <NewsPageContent content={content.az} locale={locale} news={news} />;
}
