import { getFacultyById, faculties } from "@/data/facultiesData";
import { notFound } from "next/navigation";

/**
 * Dynamic Faculty Home Page
 * Route: /faculty-system/[facultyId]
 * Example: /faculty-system/math, /faculty-system/bio
 */

export async function generateStaticParams() {
  return faculties.map((faculty) => ({
    facultyId: faculty.id,
  }));
}

export async function generateMetadata({ params }) {
  const { facultyId } = await params;
  const faculty = getFacultyById(facultyId);

  if (!faculty) {
    return { title: "Fakültə tapılmadı" };
  }

  return {
    title: {
      default: faculty.name.az,
      template: `%s | ${faculty.name.az}`,
    },
    description: faculty.description.az,
  };
}

export default async function FacultyHomePage({ params }) {
  const { facultyId } = await params;
  const faculty = getFacultyById(facultyId);

  if (!faculty) {
    notFound();
  }

  return (
    <div className="wrapper mx-auto px-4 py-8">
      {/* Hero Section */}
      <div
        className="rounded-2xl p-8 mb-8 text-white"
        style={{ backgroundColor: faculty.themeColor }}
      >
        <h1 className="text-3xl font-bold mb-2">{faculty.name.az}</h1>
        <p className="text-white/80">{faculty.description.az}</p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* About Card */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <h2
            className="font-semibold text-lg mb-3"
            style={{ color: faculty.themeColor }}
          >
            Fakültə haqqında
          </h2>
          <p className="text-gray-600 text-sm">
            {faculty.id === "math"
              ? "Mexanika-riyaziyyat fakültəsi 1919-cu ildə yaradılmış ən qədim fakültələrdən biridir."
              : `${faculty.name.az} Bakı Dövlət Universitetinin aparıcı fakültələrindən biridir.`}
          </p>
        </div>

        {/* Departments Card */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <h2
            className="font-semibold text-lg mb-3"
            style={{ color: faculty.themeColor }}
          >
            Kafedralar
          </h2>
          <ul className="text-gray-600 text-sm space-y-1">
            <li>• Kafedra 1</li>
            <li>• Kafedra 2</li>
            <li>• Kafedra 3</li>
            <li>• Kafedra 4</li>
          </ul>
        </div>

        {/* Contact Card */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <h2
            className="font-semibold text-lg mb-3"
            style={{ color: faculty.themeColor }}
          >
            Əlaqə
          </h2>
          <div className="text-gray-600 text-sm space-y-2">
            <p>📍 BDU, Bakı</p>
            <p>📧 {faculty.id}@bsu.edu.az</p>
            <p>📞 (+994 12) 439-00-00</p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div
        className="mt-8 p-6 rounded-xl border-2 text-center"
        style={{
          borderColor: faculty.themeColor,
          backgroundColor: `${faculty.themeColor}10`,
        }}
      >
        <p className="text-gray-700">
          <strong>Demo:</strong> Bu səhifə subdomain sistemini test etmək
          üçündür. Production-da {faculty.subdomain}.bdu.info.az ünvanında
          işləyəcək.
        </p>
      </div>
    </div>
  );
}
