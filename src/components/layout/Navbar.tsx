"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { GraduationCap, Menu, X, Sparkles, LayoutDashboard, LogOut, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={`relative text-sm font-medium transition-colors hover:text-violet-600 ${
        pathname === href ? "text-violet-600" : "text-gray-600"
      }`}
    >
      {label}
      {pathname === href && (
        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-violet-600 rounded-full" />
      )}
    </Link>
  );

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-sm shadow-violet-100/50 border-b border-violet-100/60"
          : "bg-white/70 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-200 group-hover:shadow-violet-300 transition-shadow">
            <GraduationCap size={20} className="text-white" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent">
            ScholarHub
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {navLink("/scholarships", "Scholarships")}
          {session && navLink("/dashboard", "Dashboard")}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <>
              {session.user.role === "admin" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 text-sm font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-full transition-colors"
                >
                  <Shield size={14} /> Admin
                </Link>
              )}
              <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1.5">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                  {session.user.name?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                  {session.user.name?.split(" ")[0]}
                </span>
              </div>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-full transition-colors"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors px-3 py-1.5"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold px-5 py-2 rounded-full hover:opacity-90 transition-opacity shadow-md shadow-violet-200"
              >
                <Sparkles size={14} /> Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-violet-100 text-gray-600 hover:text-violet-600 transition-colors"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-violet-100 px-4 py-5 flex flex-col gap-1">
          <MobileLink href="/scholarships" icon={<Sparkles size={16} />} label="Scholarships" />
          {session && (
            <MobileLink href="/dashboard" icon={<LayoutDashboard size={16} />} label="Dashboard" />
          )}
          {session?.user.role === "admin" && (
            <MobileLink href="/admin" icon={<Shield size={16} />} label="Admin Panel" accent />
          )}
          <div className="h-px bg-gray-100 my-2" />
          {session ? (
            <button
              onClick={() => signOut()}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} /> Sign Out
            </button>
          ) : (
            <>
              <MobileLink href="/auth/login" icon={<LogOut size={16} />} label="Login" />
              <Link
                href="/auth/register"
                className="mt-1 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold px-4 py-3 rounded-xl"
              >
                <Sparkles size={15} /> Create Free Account
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

function MobileLink({ href, icon, label, accent }: { href: string; icon: React.ReactNode; label: string; accent?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
        accent
          ? "text-violet-600 hover:bg-violet-50"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      {icon} {label}
    </Link>
  );
}
