"use client";

import Image from "next/image";
import logo from "@/assets/images/bsu-logo.png";

export default function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-white to-primary/10 relative overflow-hidden">
      {/* Soft background blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative flex flex-col items-center">
        {/* Spinning ring */}
        <div className="relative">
          <div className="h-28 w-28 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={logo}
              priority
              alt="BSU Logo"
              width={72}
              height={72}
              className="drop-shadow-sm"
            />
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm font-medium text-primary">Yüklənir...</p>
          <p className="text-xs text-primary mt-1 animate-pulse">Zəhmət olmasa gözləyin</p>
        </div>
      </div>
    </div>
  );
}
