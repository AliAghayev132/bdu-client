"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/bsu-icon.svg"
import { X } from "lucide-react";
// import { useAdminLogoutMutation } from "@/store/admin/auth/adminAuthApi";
// import { Loader2 } from "lucide-react";
// import { useDispatch } from "react-redux";
// import { clearCredentials } from "@/store/admin/auth/adminAuthSlice";

const navItems = [
  {label: "Xəbərlər", href: "/admin/dashboard", icon: Newspaper},

];

const Sidebar = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  // const dispatch = useDispatch();

  const router = useRouter();

//   const [logout, { isLoading: isLoggingOut }] = useAdminLogoutMutation();

//   const handleLogout = async () => {
//     try {
//       const result = await confirmAction("Çıxış", "Çıxış etməyə əminsiniz?");
//       if (!result.isConfirmed) return;
//       dispatch(clearCredentials());
//       router.push("/");
//     } catch (e) {
//       console.error(e);
//     }
//   };

  const renderNav = () => (
    <nav className="flex flex-col gap-2">
      {navItems.map(({ label, href, icon: Icon }) => {
        const active = pathname === href;
        return (
          <div
            key={href}
          >
            <Link
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`group  font-medium flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-all ${
                active ? "bg-primary text-white" : "bg-black/5 text-gray-700 hover:text-primary group-hover:bg-[#3966b0]/10"
              }`}
            >
              <Icon 
                size={18}
                className={`${active ? "text-white" : "text-gray-500 group-hover:text-primary"} transition-colors`}
              />
              <span>{label}</span>
            </Link>
          </div>
        );
      })}
    </nav>
  );

  return (
    <div className="sticky inset-0 min-h-screen max-h-screen z-50">
      {/* Mobile hamburger button */}
      <button
        type="button"
        aria-label="Open sidebar"
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 inline-flex items-center justify-center rounded-md border border-gray-200 bg-white/90 p-2 shadow-sm hover:bg-white"
      >
        <Menu size={20} className="text-gray-700" />
      </button>

      {/* Desktop sidebar */}
      <aside className="w-64 h-full bg-white/80 backdrop-blur border-r border-gray-200/70 px-4 py-8 hidden md:flex md:flex-col">
      <Link href="/" className="mx-auto block">
        <div
          className="text-xl w-16 mx-auto font-semibold text-primary mb-8"
          >
          <Image src={logo} alt="Unikal Logo" width={140} height={140} />
        </div>
        </Link>
        {renderNav()}
        {/* <button disabled={isLoggingOut} onClick={handleLogout} className="w-full mt-auto py-2 px-4 rounded-md bg-red-500 text-white">
          {isLoggingOut ? "Çıxış edilir..." : "Çıxış et"}
        </button> */}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <aside
            className="fixed left-0 top-0 z-50  h-full w-72 bg-white px-4 py-6 shadow-xl flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-6 ">
              <Image src={logo} alt="Unikal Logo" width={120} height={120} />
              <button
                type="button"
                aria-label="Close sidebar"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white/90 p-2 shadow-sm hover:bg-white"
              >
                <X size={18} className="text-gray-700" />
              </button>
            </div>
            {renderNav()}
            {/* <button disabled={isLoggingOut} onClick={handleLogout} className="w-full mt-auto py-2 px-4 rounded-md bg-red-500 text-white">
          {isLoggingOut ? "Çıxış edilir..." : "Çıxış et"}
        </button> */}
          </aside>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
