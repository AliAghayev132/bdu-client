import Image from "next/image";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { ChevronRight } from "lucide-react";

const RAW_ITEMS = [
  {
    key: "faculties",
    href: { az: "/fakulteler", en: "/faculties" },
    image:
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1600&auto=format&fit=crop",
    span: "col-span-12 lg:col-span-6",
  },
  {
    key: "bachelor",
    href: "/bachelor",
    image:
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1600&auto=format&fit=crop",
    span: "col-span-6 lg:col-span-3",
  },
  {
    key: "lyceum",
    href: "/lyceum",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1600&auto=format&fit=crop",
    span: "col-span-6 lg:col-span-3",
  },
  {
    key: "master",
    href: "/master",
    image:
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1600&auto=format&fit=crop",
    span: "col-span-6 lg:col-span-3",
  },
  {
    key: "college",
    href: "/college",
    image:
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1600&auto=format&fit=crop",
    span: "col-span-6 lg:col-span-3",
  },
  {
    key: "phd",
    href: "/phd",
    image:
      "https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?q=80&w=1600&auto=format&fit=crop",
    span: "col-span-6 lg:col-span-3",
  },
  {
    key: "branch",
    href: "/branch",
    image:
      "https://images.unsplash.com/photo-1503676382389-4809596d5290?q=80&w=1600&auto=format&fit=crop",
    span: "col-span-6 lg:col-span-3",
  },
];

// Helper function to resolve href (string or object)
const resolveHref = (href, locale) => {
  if (typeof href === 'object') {
    return href[locale] || href.az;
  }
  return href;
};

export default async function EducationSection() {
  const t = await getTranslations("home.education");
  const locale = (await import('next-intl/server')).getLocale ?
    await (await import('next-intl/server')).getLocale() : 'az';

  const ITEMS = RAW_ITEMS.map((i) => ({
    ...i,
    title: t(`items.${i.key}`),
    resolvedHref: resolveHref(i.href, locale)
  }));

  return (
    <section className="wrapper sm:py-10 py-4">
      <div className="bg-primary/5 xl:border-2 border-primary/20 sm:py-8 sm:px-8 py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="md:text-2xl sm:text-xl text-lg font-bold text-secondary">
            {t("title")}
          </h2>
          {/* <Link
            href="/education"
            className="group md:flex hidden items-center gap-2 px-5 py-2.5 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary hover:text-white transition-all duration-300 text-sm font-medium"
          >
            {t("viewAll")}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          </Link> */}
        </div>

        {/* Left 1 big card, Right 6 compact cards */}
        <div className="grid grid-cols-12 sm:gap-4 gap-2">
          {/* Left big card */}
          {(() => {
            const item = ITEMS[0];
            return (
              <Link
                key={item.key}
                href={item.resolvedHref}
                className="group relative overflow-hidden col-span-12 lg:col-span-6"
              >
                <div className="aspect-[16/9] lg:aspect-[4/3] w-full h-full">
                  <div className="relative w-full h-full">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover w-full h-full transition duration-500 ease-in-out will-change-transform group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 flex items-end">
                  <div className="w-full p-3 sm:p-4">
                    <div className="inline-flex items-center gap-2  bg-white/90 text-secondary px-3 sm:px-4 py-2 shadow-sm backdrop-blur group-hover:bg-white transition-colors">
                      <span className="font-bold tracking-wide text-[10px] sm:text-xs laptop:text-sm">
                        {item.title}
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
                    </div>
                  </div>
                </div>
              </Link>
            );
          })()}

          {/* Right grid with 6 items (50%) */}
          <div className="col-span-12 lg:col-span-6 grid grid-cols-2 sm:gap-4 gap-2">
            {ITEMS.slice(1).map((item) => (
              <Link
                key={item.key}
                href={item.resolvedHref}
                className="group relative overflow-hidden"
              >
                <div className="aspect-square lg:aspect-[16/9] w-full">
                  <div className="relative w-full h-full">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 flex items-end">
                  <div className="w-full p-2 sm:p-3 laptop:p-4">
                    <div className="inline-flex items-center gap-2 bg-white/90 text-secondary px-3 sm:px-4 py-2 shadow-sm backdrop-blur group-hover:bg-white transition-colors">
                      <span className="font-bold tracking-wide text-[10px] sm:text-xs laptop:text-sm">
                        {item.title}
                      </span>
                      <ChevronRight className="sm:w-4 sm:h-4 w-3 h-3" />{" "}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
