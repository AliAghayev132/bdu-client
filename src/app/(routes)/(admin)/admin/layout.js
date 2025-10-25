"use client";
import { useMemo } from "react";
import { Toaster } from "react-hot-toast";
import Sidebar from "./(components)/Sidebar";

export default function AdminLayout({ children }) {
    
  const toastOptions = useMemo(
    () => ({
      duration: 4000,
      style: {
        background: "#2C4B62",
        color: "#fff",
        fontWeight: "500",
        fontSize: "16px",
        padding: "12px 16px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      },
    }),
    []
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Toaster position="top-center" toastOptions={toastOptions} />
      <Sidebar />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
