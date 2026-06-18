"use client";
import { IScholarship } from "@/types";
import { Calendar, MapPin, BookOpen, Bookmark, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface Props {
  scholarship: IScholarship;
  isBookmarked?: boolean;
}

const categoryConfig: Record<string, { bg: string; text: string; dot: string }> = {
  Government: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  "State Government": { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500" },
  Private: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  International: { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
};

export default function ScholarshipCard({ scholarship, isBookmarked = false }: Props) {
  const { data: session } = useSession();
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [loading, setLoading] = useState(false);

  const deadline = new Date(scholarship.deadline);
  const isExpired = deadline < new Date();
  const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const cfg = categoryConfig[scholarship.category] || { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-400" };

  async function toggleBookmark(e: React.MouseEvent) {
    e.preventDefault();
    if (!session) return;
    setLoading(true);
    const res = await fetch("/api/user/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scholarshipId: scholarship._id }),
    });
    if (res.ok) setBookmarked((prev) => !prev);
    setLoading(false);
  }

  return (
    <Link href={`/scholarships/${scholarship._id}`} className="block group">
      <div className="relative bg-white rounded-2xl border border-gray-100 hover:border-violet-200 card-hover p-5 flex flex-col gap-3 h-full overflow-hidden">
        {/* Top glow on hover */}
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />

        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {scholarship.category}
          </span>
          {session && (
            <button
              onClick={toggleBookmark}
              disabled={loading}
              className={`p-1.5 rounded-xl transition-all ${
                bookmarked
                  ? "bg-violet-100 text-violet-600"
                  : "text-gray-300 hover:text-violet-500 hover:bg-violet-50"
              }`}
            >
              <Bookmark size={16} className={bookmarked ? "fill-violet-600" : ""} />
            </button>
          )}
        </div>

        {/* Title & description */}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-violet-700 transition-colors">
            {scholarship.title}
          </h3>
          <p className="text-gray-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">{scholarship.description}</p>
        </div>

        {/* Meta info */}
        <div className="flex flex-col gap-1.5 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <BookOpen size={12} className="text-violet-400 shrink-0" />
            <span className="truncate">{scholarship.eligibility.educationLevel.join(", ")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={12} className="text-indigo-400 shrink-0" />
            <span>{scholarship.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={12} className={`shrink-0 ${isExpired ? "text-red-400" : daysLeft <= 7 ? "text-orange-400" : "text-emerald-400"}`} />
            <span className={isExpired ? "text-red-500 font-medium" : daysLeft <= 7 ? "text-orange-500 font-medium" : ""}>
              {isExpired ? "Expired" : daysLeft <= 7 ? `⚡ ${daysLeft} days left` : `${daysLeft} days · ${deadline.toLocaleDateString("en-IN")}`}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="font-bold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            {scholarship.amount}
          </span>
          <div className="flex items-center gap-1 text-xs text-gray-400 group-hover:text-violet-500 transition-colors">
            <span className="truncate max-w-[90px]">{scholarship.provider}</span>
            <ArrowUpRight size={12} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </Link>
  );
}
