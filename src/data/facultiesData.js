/**
 * Fakültələr Data Strukturu
 * Subdomain sistemi üçün hazırlanmış mock data
 * Backend qoşulandan sonra bu data API-dən gələcək
 */

// Fakültə kateqoriyaları
export const facultyCategories = {
  natural: {
    id: "natural",
    name: {
      az: "TƏBİƏT FƏNLƏRİ FAKÜLTƏLƏRİ",
      en: "NATURAL SCIENCES FACULTIES",
    },
  },
  humanities: {
    id: "humanities",
    name: { az: "HUMANİTAR FƏNLƏR FAKÜLTƏLƏRİ", en: "HUMANITIES FACULTIES" },
  },
  social: {
    id: "social",
    name: { az: "SOSİAL FƏNLƏR FAKÜLTƏLƏRİ", en: "SOCIAL SCIENCES FACULTIES" },
  },
};

// Fakültə listesi - Mock Data
export const faculties = [
  {
    id: "math",
    subdomain: "math",
    category: "natural",
    name: {
      az: "Mexanika-riyaziyyat fakültəsi",
      en: "Faculty of Mechanics and Mathematics",
    },
    shortName: { az: "MRF", en: "FMM" },
    description: {
      az: "Fakültə 1919-cu ildə yaradılmışdır. Hazırda 7 kafedra fəaliyyət göstərir.",
      en: "The faculty was established in 1919. Currently 7 departments operate.",
    },
    logo: "/images/faculties/mexaniki-riyaziyyat.jpg",
    themeColor: "#7C4D8A", // Bənövşəyi
    accentColor: "#9B6BA8",
    menuData: {
      // Fakültəyə xas mega menu datası
      about: {
        label: { az: "Fakültə haqqında", en: "About Faculty" },
        items: [
          { label: { az: "Tarix", en: "History" }, href: "/about/history" },
          {
            label: { az: "Rəhbərlik", en: "Leadership" },
            href: "/about/leadership",
          },
          {
            label: { az: "Struktur", en: "Structure" },
            href: "/about/structure",
          },
        ],
      },
      education: {
        label: { az: "Təhsil", en: "Education" },
        items: [
          {
            label: { az: "Bakalavr", en: "Bachelor" },
            href: "/education/bachelor",
          },
          { label: { az: "Magistr", en: "Master" }, href: "/education/master" },
          { label: { az: "Doktorantura", en: "PhD" }, href: "/education/phd" },
        ],
      },
      science: {
        label: { az: "Elmi fəaliyyət", en: "Scientific Activity" },
        items: [
          {
            label: { az: "Elmi jurnallar", en: "Scientific Journals" },
            href: "/science/journals",
          },
          {
            label: { az: "Konfranslar", en: "Conferences" },
            href: "/science/conferences",
          },
        ],
      },
    },
  },
  {
    id: "bio",
    subdomain: "bio",
    category: "natural",
    name: {
      az: "Biologiya fakültəsi",
      en: "Faculty of Biology",
    },
    shortName: { az: "BF", en: "FB" },
    description: {
      az: "Fakültə 1934-cü ildə yaradılmışdır. Hazırda 6 kafedra fəaliyyət göstərir.",
      en: "The faculty was established in 1934. Currently 6 departments operate.",
    },
    logo: "/images/faculties/mexaniki-riyaziyyat.jpg", // Hələlik eyni şəkil
    themeColor: "#4A7C4D", // Yaşıl
    accentColor: "#5D9E61",
    menuData: {
      about: {
        label: { az: "Fakültə haqqında", en: "About Faculty" },
        items: [
          { label: { az: "Tarix", en: "History" }, href: "/about/history" },
          {
            label: { az: "Rəhbərlik", en: "Leadership" },
            href: "/about/leadership",
          },
        ],
      },
    },
  },
  {
    id: "physics",
    subdomain: "physics",
    category: "natural",
    name: {
      az: "Fizika fakültəsi",
      en: "Faculty of Physics",
    },
    shortName: { az: "FF", en: "FP" },
    description: {
      az: "Fakültə 1934-cü ildə yaradılmışdır. Hazırda 8 kafedra fəaliyyət göstərir.",
      en: "The faculty was established in 1934. Currently 8 departments operate.",
    },
    logo: "/images/faculties/mexaniki-riyaziyyat.jpg", // Hələlik eyni şəkil
    themeColor: "#4A5C7C", // Mavi
    accentColor: "#5E73A0",
    menuData: {
      about: {
        label: { az: "Fakültə haqqında", en: "About Faculty" },
        items: [
          { label: { az: "Tarix", en: "History" }, href: "/about/history" },
          {
            label: { az: "Rəhbərlik", en: "Leadership" },
            href: "/about/leadership",
          },
        ],
      },
    },
  },
  {
    id: "chemistry",
    subdomain: "chem",
    category: "natural",
    name: {
      az: "Kimya fakültəsi",
      en: "Faculty of Chemistry",
    },
    shortName: { az: "KF", en: "FC" },
    description: {
      az: "Fakültə 1934-cü ildə yaradılmışdır. Hazırda 5 kafedra fəaliyyət göstərir.",
      en: "The faculty was established in 1934. Currently 5 departments operate.",
    },
    logo: "/images/faculties/mexaniki-riyaziyyat.jpg", // Hələlik eyni şəkil
    themeColor: "#7C6A4A", // Qəhvəyi
    accentColor: "#9E8862",
    menuData: {
      about: {
        label: { az: "Fakültə haqqında", en: "About Faculty" },
        items: [
          { label: { az: "Tarix", en: "History" }, href: "/about/history" },
          {
            label: { az: "Rəhbərlik", en: "Leadership" },
            href: "/about/leadership",
          },
        ],
      },
    },
  },
];

// Subdomain-ə görə fakültə tap
export function getFacultyBySubdomain(subdomain) {
  return faculties.find((f) => f.subdomain === subdomain);
}

// ID-yə görə fakültə tap
export function getFacultyById(id) {
  return faculties.find((f) => f.id === id);
}

// Kateqoriyaya görə fakültələri filtrələ
export function getFacultiesByCategory(categoryId) {
  return faculties.filter((f) => f.category === categoryId);
}

// Bütün fakültələri kateqoriyalarla qruplaşdır
export function getGroupedFaculties() {
  const grouped = {};

  Object.keys(facultyCategories).forEach((catId) => {
    grouped[catId] = {
      category: facultyCategories[catId],
      faculties: getFacultiesByCategory(catId),
    };
  });

  return grouped;
}

// Subdomain URL-i yarat
export function getFacultyUrl(faculty, path = "") {
  // Production-da: `https://${faculty.subdomain}.bdu.info.az${path}`
  // Development-da hələlik mock
  return `https://${faculty.subdomain}.bdu.info.az${path}`;
}
