"use client";

import { useMemo } from "react";
import FacultyHeader from "@/components/faculty/FacultyHeader";
import Footer from "@/components/layout/Footer";
import { FacultyProvider } from "@/context/FacultyContext";
import { getFacultyById } from "@/data/facultiesData";
import { useParams } from "next/navigation";

/**
 * Faculty System Client Layout
 * FacultyProvider və Header/Footer idarə edir
 */
export default function FacultySystemClientLayout({ children }) {
  const params = useParams();
  const facultyId = params?.facultyId;

  // Faculty data-nı al
  const faculty = useMemo(() => {
    if (!facultyId) return null;
    return getFacultyById(facultyId);
  }, [facultyId]);

  if (!faculty) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Fakültə tapılmadı</p>
      </div>
    );
  }

  return (
    <FacultyProvider faculty={faculty}>
      <div className="min-h-screen flex flex-col">
        <FacultyHeader />
        <main className="flex-1 bg-white overflow-auto">{children}</main>
        <Footer />
      </div>
    </FacultyProvider>
  );
}
