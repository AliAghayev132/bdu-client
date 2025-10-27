import NewsPageContent from "../(components)/NewsPageContent";
import newsImage from "@/assets/images/baki-dovlet-universiteti.jpg";

export default async function NewsPage({ params }) {
  const { locale } = await params;

  const content = {
    en: {
      title: "NEWS",
      breadcrumbs: "News",
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
        slug: "new-education-year-started",
        title: "New education year started",
        excerpt:
          "2024-2025 education year started. The event was held in a hybrid format. The event was attended by the university leadership and students.",
        date: "2025-01-15",
        image: newsImage,
      },
      {
        id: 2,
        slug: "new-international-partnership-agreement-signed",
        title: "New international partnership agreement signed",
        excerpt:
          "BDU signed a new international partnership agreement with European universities.",
        date: "2025-01-10",
        image: newsImage,
      },
      {
        id: 3,
        slug: "new-scientific-laboratory-opened",
        title: "New scientific laboratory opened",
        excerpt:
          "A new scientific laboratory opened at the university. The laboratory is equipped with modern facilities and is ready to be used.",
        date: "2025-01-05",
        image: newsImage,
      },
      {
        id: 4,
        slug: "new-scientific-laboratory-opened",
        title: "New scientific laboratory opened",
        excerpt:
          "A new scientific laboratory opened at the university. The laboratory is equipped with modern facilities and is ready to be used.",
        date: "2025-01-05",
        image: newsImage,
      },
      {
        id: 5,
        slug: "new-scientific-laboratory-opened",
        title: "New scientific laboratory opened",
        excerpt:
          "A new scientific laboratory opened at the university. The laboratory is equipped with modern facilities and is ready to be used.",
        date: "2025-01-05",
        image: newsImage,
      },
      {
        id: 6,
        slug: "new-scientific-laboratory-opened",
        title: "New scientific laboratory opened",
        excerpt:
          "A new scientific laboratory opened at the university. The laboratory is equipped with modern facilities and is ready to be used.",
        date: "2025-01-05",
        image: newsImage,
      },
    ];
  }

  const news = await getNews();

  return <NewsPageContent content={content.en} locale={locale} news={news} />;
}
