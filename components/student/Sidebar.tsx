"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut, User } from "firebase/auth";
import { studentDb, StudentProfile } from "@/lib/studentDb";
import { 
  BookOpen, LayoutDashboard, LogOut, Award, CreditCard, 
  User as UserIcon, MessageSquare, Settings, Menu, X 
} from "lucide-react";

export default function StudentSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const p = await studentDb.getProfile(currentUser.uid);
        setProfile(p);
      } else {
        router.push("/student/login");
      }
    });
    return () => unsub();
  }, [router]);

  // Close sidebar on path change (mobile navigation)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Listen for hamburger menu toggle events from the header
  useEffect(() => {
    const handleToggle = () => setIsOpen(open => !open);
    window.addEventListener("toggle-student-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-student-sidebar", handleToggle);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/student/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { name: "Cours & Catalogue", href: "/student/courses", icon: BookOpen },
    { name: "Certificats", href: "/student/certificates", icon: Award },
    { name: "Paiements", href: "/student/billing", icon: CreditCard },
  ];

  return (
    <>


      {/* Backdrop overlay for mobile menu */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Panel Container */}
      <div 
        className={`fixed md:sticky top-0 left-0 z-40 w-64 bg-white text-gray-800 flex flex-col justify-between h-screen border-r border-gray-100 shrink-0 font-sans transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col">
          {/* Brand Logo - mockup style */}
          <div className="p-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-blue-500/20">
                C
              </div>
              <Link href="/" className="text-base font-bold text-gray-900 tracking-tight">
                CFIG Academy
              </Link>
            </div>
            {/* Close button inside sidebar on mobile */}
            <button 
              onClick={() => setIsOpen(false)}
              className="md:hidden text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="px-4 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/student/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3.5 px-4.5 py-3 text-xs font-bold uppercase tracking-wider rounded-2xl transition-all ${
                    isActive
                      ? "bg-blue-50/70 text-blue-600 shadow-none"
                      : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile Settings & Logout */}
        <div className="p-4 space-y-1">
          <Link
            href="/student/profile"
            className={`flex items-center gap-3.5 px-4.5 py-3 text-xs font-bold uppercase tracking-wider rounded-2xl transition-all ${
              pathname === "/student/profile"
                ? "bg-blue-50/70 text-blue-600"
                : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Settings className="w-4.5 h-4.5 shrink-0 text-gray-400" />
            <span>Réglages</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4.5 py-3 text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all"
          >
            <LogOut className="w-4.5 h-4.5 shrink-0 text-red-400" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </div>
    </>
  );
}
