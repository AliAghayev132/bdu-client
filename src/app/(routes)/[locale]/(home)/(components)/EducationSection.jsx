import Image from "next/image";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

const RAW_ITEMS = [
  { key: "faculties", href: "/faculties", image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1600&auto=format&fit=crop", span: "col-span-12 lg:col-span-6" },
  { key: "bachelor", href: "/bachelor", image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1600&auto=format&fit=crop", span: "col-span-6 lg:col-span-3" },
  { key: "lyceum", href: "/lyceum", image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1600&auto=format&fit=crop", span: "col-span-6 lg:col-span-3" },
  { key: "master", href: "/master", image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1600&auto=format&fit=crop", span: "col-span-6 lg:col-span-3" },
  { key: "college", href: "/college", image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1600&auto=format&fit=crop", span: "col-span-6 lg:col-span-3" },
  { key: "phd", href: "/phd", image: "https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?q=80&w=1600&auto=format&fit=crop", span: "col-span-6 lg:col-span-3" },
  { key: "branch", href: "/branch", image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?q=80&w=1600&auto=format&fit=crop", span: "col-span-6 lg:col-span-3" },
];

export default async function EducationSection() {
  const t = await getTranslations("home.education");
  const ITEMS = RAW_ITEMS.map((i) => ({ ...i, title: t(`items.${i.key}`) }));

  return (
    <section className="wrapper lg:py-10 md:py-8 sm:py-6 py-4">
      <div className="bg-primary/5 rounded-3xl xl:border-2 border-primary/20 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="md:text-2xl sm:text-xl text-lg font-bold text-secondary">{t("title")}</h2>
          {/* <Link
            href="/education"
            className="group md:flex hidden items-center gap-2 px-5 py-2.5 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary hover:text-white transition-all duration-300 text-sm font-medium"
          >
            {t("viewAll")}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          </Link> */}
        </div>

        {/* Left 1 big card, Right 6 compact cards */}
        <div className="grid grid-cols-12 gap-4">
          {/* Left big card */}
          {(() => {
            const item = ITEMS[0];
            return (
              <Link
                key={item.key}
                href={item.href}
                className="group relative overflow-hidden rounded-3xl col-span-12 lg:col-span-6"
              >
                <div className="aspect-[16/9] lg:aspect-[4/3] w-full h-full">
                  <div className="relative w-full h-full">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 flex items-end">
                  <div className="w-full p-3 sm:p-4">
                    <div className="inline-flex items-center gap-2 rounded-xl bg-white/90 text-secondary px-3 sm:px-4 py-2 shadow-sm backdrop-blur group-hover:bg-white transition-colors">
                      <span className="font-bold tracking-wide text-xs sm:text-sm">{item.title}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })()}

          {/* Right grid with 6 items (50%) */}
          <div className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-4">
            {ITEMS.slice(1).map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="group relative overflow-hidden rounded-3xl"
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
                  <div className="w-full p-3 sm:p-4">
                    <div className="inline-flex items-center gap-2 rounded-xl bg-white/90 text-secondary px-3 sm:px-4 py-2 shadow-sm backdrop-blur group-hover:bg-white transition-colors">
                      <span className="font-bold tracking-wide text-xs sm:text-sm">{item.title}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
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
