// components/HomeNav.tsx
"use client";
import { useState, useEffect } from "react";
import { FaUserCircle, FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { signOut } from "next-auth/react";

type Props = { children: React.ReactNode };

export default function HomeNav({ children }: Props) {
  const [dateTime, setDateTime] = useState(new Date());
  const [showSearch, setShowSearch] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Optional: Close modal with ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowLogoutConfirm(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await signOut({ callbackUrl: "/login" }); 
    // this clears session cookie + redirects to /login
  };

  { /* Sidebar icons */}
  const items = [
    { href: "/dashboard", label: "Dashboard", icon: "/SidebarIcons/dashboard.svg" },
    { href: "/dashboard/addhom/addinv", label: "Invoices", icon: "/SidebarIcons/fileinv.svg" },
    { href: "/dashboard/viewanalytics", label: "Analytics", icon: "/SidebarIcons/analyti.svg" },
    { href: "/dashboard/clientdash/viewclient", label: "View Clients", icon: "/SidebarIcons/client.svg" },
    { href: "/dashboard/viewhome/viewinv", label: "View Saved", icon: "/SidebarIcons/viewsaved.svg" },
    { href: "/underconst", label: "View Report", icon: "/SidebarIcons/report.svg" },
  ];

  return (
    <>
    <div className="flex h-screen">
      {/* Fixed Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-18 bg-gray-800 text-white p-4 border-r border-gray-700">
        <div className="mt-3 mb-15">
    <Image src="/SidebarIcons/Invprologo.svg" alt="App Logo" width={110} height={110} />
  </div>

  {/* Nav icons */}
  <nav className=" flex-1 flex flex-col gap-8">
    {items.map(({ href, label, icon }) => (
      <Link
        key={href}
        href={href}
        className="relative group flex flex-col items-center text-gray-400 hover:text-white"
      >
        <Image src={icon} alt={label} width={40} height={40} />
        {/* Tooltip */}
        <span className="absolute left-16 top-1/2 -translate-y-1/2 
                         px-2 py-1 rounded bg-gray-900 text-xs text-white opacity-0 
                         group-hover:opacity-100 group-hover:translate-x-0 transition 
                         whitespace-nowrap pointer-events-none">
          {label}
        </span>
      </Link>
    ))}
  </nav>

  {/* Footer (settings/logout shortcut) */}
  <div className="mt-10">
    <Link
      href="/underconst"
      className="relative group flex flex-col items-center text-gray-400 hover:text-white"
    >
      <Image src="/SidebarIcons/settings.svg" alt="Settings" width={40} height={40} />
      <span className="absolute left-16 top-1/2 -translate-y-1/2 
                       px-2 py-1 rounded bg-gray-900 text-xs text-white opacity-0 
                       group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
        Settings
      </span>
    </Link>
  </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-20">
        {/* Top Navbar */}
        <nav className="fixed top-0 left-18 right-0 h-14 bg-gray-900 text-white px-6 py-3 flex justify-between items-center border-b border-gray-700 z-10">
          <div suppressHydrationWarning className="text-lg font-medium">
            {dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()}
          </div>

          <div className="flex items-center gap-6 relative">
            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 rounded-md hover:bg-gray-700 transition"
                aria-label="Toggle search"
              >
                <FaSearch size={18} />
              </button>
              <div
                className={`absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md overflow-hidden transition-all duration-300 ${
                  showSearch ? "max-h-16 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <input
                  type="text"
                  placeholder="Quick Search"
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
                />
              </div>
            </div>

            {/* Home button */}
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center gap-2"
            >
              Home
            </button>

            {/* Profile + Dropdown */}
            <div className="relative group">
              <FaUserCircle size={32} className="cursor-pointer" aria-hidden />
              <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition duration-200">
                <a href="viewpro" className="block px-4 py-2 hover:bg-gray-100">
                  View Profile
                </a>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Routed Page Content */}
        <main className="flex-1 mt-14 p-6 overflow-y-auto">{children}</main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <h2 id="logout-title" className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to quit the session?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
