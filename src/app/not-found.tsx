import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl" />

      <div className="relative">
        <p className="text-[120px] md:text-[160px] font-extrabold leading-none bg-gradient-to-br from-violet-200 to-indigo-200 bg-clip-text text-transparent select-none">
          404
        </p>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-violet-200">
            <Search size={32} className="text-white" />
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-extrabold text-gray-900 mt-4 mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back to finding scholarships.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity shadow-md shadow-violet-200"
        >
          Go Home <ArrowRight size={16} />
        </Link>
        <Link
          href="/scholarships"
          className="flex items-center gap-2 bg-white border border-violet-200 text-violet-700 font-semibold px-6 py-3 rounded-full hover:bg-violet-50 transition-colors"
        >
          Browse Scholarships
        </Link>
      </div>
    </div>
  );
}
