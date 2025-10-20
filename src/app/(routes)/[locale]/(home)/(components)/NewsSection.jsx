import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import NewsCard from "./NewsCard";
import AnnouncementsList from "./AnnouncementsList";
import AnnouncementsListMobile from "./AnnouncementsListMobile";
import newsImage from "@/assets/images/baki-dovlet-universiteti.jpg";

// Fetch news data - Server Component
async function getNews() {
  // TODO: Replace with actual API call
  // const res = await fetch('https://api.bdu.edu.az/news', {
  //   next: { revalidate: 300 } // Cache for 5 minutes
  // });
  // return res.json();

  // Mock data for now
  return [
    {
      id: 1,
      title: "BDU-da yeni tədris ili başladı",
      excerpt:
        "2024-2025 tədris ili təntənəli şəkildə açıldı. Tədbirdə universitetin rəhbərliyi və tələbələr iştirak etdilər.",
      date: "2025-01-15",
      image: newsImage,
    },
    {
      id: 2,
      title: "Beynəlxalq əməkdaşlıq müqaviləsi imzalandı",
      excerpt:
        "BDU Avropa universitetləri ilə yeni əməkdaşlıq müqaviləsi imzaladı.",
      date: "2025-01-10",
      image: newsImage,
    },
    {
      id: 3,
      title: "Yeni elmi laboratoriya açıldı",
      excerpt:
        "Universitetdə müasir avadanlıqlarla təchiz olunmuş yeni laboratoriya istifadəyə verildi.",
      date: "2025-01-05",
      image: newsImage,
    },
    {
      id: 4,
      title: "Yeni elmi laboratoriya açıldı",
      excerpt:
        "Universitetdə müasir avadanlıqlarla təchiz olunmuş yeni laboratoriya istifadəyə verildi.",
      date: "2025-01-05",
      image: newsImage,
    },
    {
      id: 5,
      title: "Yeni elmi laboratoriya açıldı",
      excerpt:
        "Universitetdə müasir avadanlıqlarla təchiz olunmuş yeni laboratoriya istifadəyə verildi.",
      date: "2025-01-05",
      image: newsImage,
    },
    {
      id: 6,
      title: "Yeni elmi laboratoriya açıldı",
      excerpt:
        "Universitetdə müasir avadanlıqlarla təchiz olunmuş yeni laboratoriya istifadəyə verildi.",
      date: "2025-01-05",
      image: newsImage,
    },
  ];
}

export default async function NewsSection() {
  const t = await getTranslations("home");
  const news = await getNews();

  return (
    <section className="news-section sm:py-16 py-8 bg-white">
      <div className="wrapper xl:bg-white bg-primary/5">
        <div className="grid xl:grid-cols-[1fr_320px] gap-4">
          {/* News Section - Left Side */}
          <div className="xl:bg-primary/5 xl:border-2 border-primary/20 sm:py-8 sm:px-8 py-6 rounded-xl overflow-hidden">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="sm:text-3xl text-2xl font-bold text-secondary">
                {t("news.title", { default: "XƏBƏRLƏR" })}
              </h2>
              <Link
                href="/news"
                className="group flex items-center gap-2 px-5 py-2.5 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary hover:text-white transition-all duration-300 text-sm font-medium"
              >
                <span>{t("news.viewAll", { default: "BÜTÜN XƏBƏRLƏR" })}</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            {/* News Grid - Desktop: 3 columns, Mobile: Horizontal Scroll */}
            <div className="hidden lg:grid lg:grid-cols-2 2xl:grid-cols-3 gap-3">
              {news.slice(0, 6).map((item) => (
                <NewsCard key={item.id} news={item} />
              ))}
            </div>

            {/* Mobile: Horizontal Scroll */}
            <div className="lg:hidden -mx-8">
              <div
                className="overflow-x-scroll scrollbar-hide px-8"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                <div className="flex gap-4 pb-2">
                  {news.slice(0, 6).map((item) => (
                    <div
                      key={item.id}
                      className="min-w-[280px] w-[280px] flex-shrink-0"
                    >
                      <NewsCard news={item} />
                    </div>
                  ))}
                  <div className="flex-shrink-0 w-4"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Announcements Sidebar - Right Side */}
          <aside className="hidden xl:block">
            <AnnouncementsList />
          </aside>
        </div>

        {/* Mobile Announcements - Horizontal Scroll */}
        <div className="xl:hidden xl:bg-primary/5 sm:py-8 sm:px-8 py-6 px-4 rounded-xl sm:mt-12 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="sm:text-3xl text-2xl font-bold text-secondary">
              {t("announcements.title", { default: "ELANLAR" })}
            </h2>
            <Link
              href="/announcements"
              className="group flex items-center gap-2 px-5 py-2.5 bg-[#B8956A]/5 text-[#B8956A] rounded-lg hover:bg-[#B8956A] hover:text-white transition-all duration-300 text-sm font-medium"
            >
              <span>
                {t("announcements.viewAll", { default: "BÜTÜN ELANLAR" })}
              </span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          <div className="-mx-8">
            <div
              className="overflow-x-scroll scrollbar-hide sm:px-8 px-4"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <div className="flex gap-4 pb-2">
                <AnnouncementsListMobile />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Separate mock data
const mockAnnouncements = [
  {
    id: 1,
    title: "Magistratura qəbulu başladı",
    date: "2025-01-20",
  },
  {
    id: 2,
    title: "Elmi konfrans elanı",
    date: "2025-01-18",
  },
  {
    id: 3,
    title: "Təqaüd müsabiqəsi",
    date: "2025-01-15",
  },
  {
    id: 4,
    title: "Yay məktəbi qeydiyyatı",
    date: "2025-01-12",
  },
];
