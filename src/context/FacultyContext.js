"use client";

import { createContext, useContext, useMemo } from "react";

/**
 * FacultyContext - Fakültə theme və data management
 * Bu context hər fakültə subdomain-ində istifadə olunur
 */

const FacultyContext = createContext(null);

export function FacultyProvider({ faculty, children }) {
  // CSS dəyişənlərini hesabla
  const themeStyles = useMemo(() => {
    if (!faculty) return {};

    return {
      "--faculty-primary": faculty.themeColor,
      "--faculty-accent": faculty.accentColor,
    };
  }, [faculty]);

  const value = useMemo(
    () => ({
      faculty,
      themeColor: faculty?.themeColor || "#2C4B62",
      accentColor: faculty?.accentColor || "#AA9674",
      logo: faculty?.logo || "/bsu-logo.png",
      name: faculty?.name || {
        az: "Bakı Dövlət Universiteti",
        en: "Baku State University",
      },
      menuData: faculty?.menuData || {},
    }),
    [faculty]
  );

  return (
    <FacultyContext.Provider value={value}>
      <div style={themeStyles}>{children}</div>
    </FacultyContext.Provider>
  );
}

export function useFaculty() {
  const context = useContext(FacultyContext);
  if (!context) {
    // Əgər context yoxdursa, default BDU dəyərlərini qaytar
    return {
      faculty: null,
      themeColor: "#2C4B62",
      accentColor: "#AA9674",
      logo: "/bsu-logo.png",
      name: { az: "Bakı Dövlət Universiteti", en: "Baku State University" },
      menuData: {},
    };
  }
  return context;
}

export default FacultyContext;
