import { GraduationCap, Mail, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 mt-20 relative overflow-hidden">
      {/* Top gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />

      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-violet-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <GraduationCap size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl text-white">ScholarHub</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
            India&apos;s scholarship discovery platform — helping students find government, private, and international scholarships all in one place.
          </p>
          <div className="flex items-center gap-2 mt-5 text-sm text-gray-500">
            <Mail size={14} />
            <span>support@scholarhub.in</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <p className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Explore</p>
          <div className="flex flex-col gap-2.5 text-sm">
            {[
              { href: "/scholarships", label: "All Scholarships" },
              { href: "/scholarships?category=Government", label: "Government" },
              { href: "/scholarships?category=Private", label: "Private" },
              { href: "/scholarships?location=Abroad", label: "International" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hover:text-violet-400 transition-colors flex items-center gap-1.5 group"
              >
                <span className="w-1 h-1 rounded-full bg-violet-700 group-hover:bg-violet-400 transition-colors" />
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Account */}
        <div>
          <p className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Account</p>
          <div className="flex flex-col gap-2.5 text-sm">
            {[
              { href: "/auth/login", label: "Login" },
              { href: "/auth/register", label: "Sign Up Free" },
              { href: "/dashboard", label: "My Dashboard" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hover:text-violet-400 transition-colors flex items-center gap-1.5 group"
              >
                <span className="w-1 h-1 rounded-full bg-violet-700 group-hover:bg-violet-400 transition-colors" />
                {l.label}
              </Link>
            ))}
          </div>

          <div className="mt-6">
            <a
              href="https://scholarships.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              <ExternalLink size={12} /> NSP Portal
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800/60 text-center py-5 text-xs text-gray-600">
        © {new Date().getFullYear()} ScholarHub. Built for Indian students. All rights reserved.
      </div>
    </footer>
  );
}
