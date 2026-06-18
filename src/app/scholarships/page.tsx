"use client";
import { useState, useEffect, useCallback } from "react";
import ScholarshipCard from "@/components/scholarship/ScholarshipCard";
import FilterSidebar from "@/components/scholarship/FilterSidebar";
import { Spinner, EmptyState, SkeletonCard } from "@/components/ui";
import { FilterState, IScholarship } from "@/types";
import { SlidersHorizontal, X, Sparkles, Search, ChevronLeft, ChevronRight } from "lucide-react";

const defaultFilters: FilterState = {
  educationLevel: "", category: "", location: "", fieldOfStudy: "", search: "", deadline: "",
};

export default function ScholarshipsPage() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [scholarships, setScholarships] = useState<IScholarship[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMode, setAiMode] = useState(false);

  const fetchScholarships = useCallback(async (f: FilterState, p: number) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), limit: "12" });
    if (f.search) params.set("search", f.search);
    if (f.educationLevel) params.set("educationLevel", f.educationLevel);
    if (f.category) params.set("category", f.category);
    if (f.location) params.set("location", f.location);
    if (f.fieldOfStudy) params.set("fieldOfStudy", f.fieldOfStudy);
    if (f.deadline) params.set("deadline", f.deadline);
    const res = await fetch(`/api/scholarships?${params}`);
    const data = await res.json();
    setScholarships(data.scholarships || []);
    setTotal(data.total || 0);
    setPages(data.pages || 1);
    setLoading(false);
  }, []);

  useEffect(() => { setPage(1); fetchScholarships(filters, 1); }, [filters, fetchScholarships]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchScholarships(filters, page); }, [page]);

  async function handleAiSearch() {
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiMode(true);
    const res = await fetch("/api/scholarships/ai-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: aiQuery }),
    });
    const data = await res.json();
    if (data.error === "AI service unavailable") {
      setAiMode(false);
      alert("AI search is currently unavailable. Please use the filters instead.");
      setAiLoading(false);
      return;
    }
    setScholarships(data.scholarships || []);
    setTotal(data.scholarships?.length || 0);
    setPages(1);
    setAiLoading(false);
  }

  function clearAiMode() {
    setAiMode(false);
    setAiQuery("");
    fetchScholarships(filters, 1);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Page header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">All Scholarships</h1>
          {!loading && (
            <p className="text-sm text-gray-500 mt-1">
              <span className="font-semibold text-violet-600">{total}</span> scholarships found
            </p>
          )}
        </div>
        <button
          onClick={() => setShowFilter(true)}
          className="lg:hidden flex items-center gap-2 bg-white border border-violet-200 text-violet-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:bg-violet-50 transition-colors"
        >
          <SlidersHorizontal size={15} /> Filters
        </button>
      </div>

      {/* AI Search Bar */}
      <div className="mb-8 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-5 shadow-lg shadow-violet-200/50">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-yellow-300" />
          <p className="text-sm font-bold text-white">AI Natural Language Search</p>
          <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">Beta</span>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-300" />
            <input
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAiSearch()}
              placeholder='e.g. "I am a BTech student from Maharashtra with low income"'
              className="w-full pl-10 pr-4 py-3 text-sm bg-white/15 backdrop-blur-sm border border-white/25 rounded-xl text-white placeholder:text-violet-200 focus:outline-none focus:ring-2 focus:ring-white/40"
            />
          </div>
          <button
            onClick={handleAiSearch}
            disabled={aiLoading || !aiQuery.trim()}
            className="bg-white text-violet-700 font-bold px-5 py-3 rounded-xl text-sm disabled:opacity-40 transition-all hover:bg-yellow-50 flex items-center gap-2 shrink-0"
          >
            {aiLoading ? <Spinner /> : <><Sparkles size={14} /> Search</>}
          </button>
          {aiMode && (
            <button onClick={clearAiMode} className="text-white/70 hover:text-white px-3 flex items-center gap-1 text-sm">
              <X size={14} /> Clear
            </button>
          )}
        </div>
        {aiMode && (
          <p className="text-xs text-violet-200 mt-2.5 flex items-center gap-1.5">
            <Sparkles size={11} /> Showing AI-matched results.{" "}
            <button onClick={clearAiMode} className="underline hover:text-white">Back to all</button>
          </p>
        )}
      </div>

      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-20">
            <FilterSidebar filters={filters} onChange={(f) => { setFilters(f); setPage(1); }} />
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {showFilter && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setShowFilter(false)}>
            <div
              className="absolute left-0 top-0 h-full w-80 bg-gray-50 p-4 overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end mb-3">
                <button onClick={() => setShowFilter(false)} className="p-2 rounded-xl hover:bg-gray-200 transition-colors">
                  <X size={18} />
                </button>
              </div>
              <FilterSidebar
                filters={filters}
                onChange={(f) => { setFilters(f); setPage(1); setShowFilter(false); }}
                onClose={() => setShowFilter(false)}
              />
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : scholarships.length === 0 ? (
            <EmptyState message="No scholarships match your filters. Try adjusting or clearing them." />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {scholarships.map((s) => <ScholarshipCard key={s._id} scholarship={s} />)}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700 transition-colors"
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
                      const p = page <= 3 ? i + 1 : page - 2 + i;
                      if (p < 1 || p > pages) return null;
                      return (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-9 h-9 rounded-full text-sm font-semibold transition-colors ${
                            p === page
                              ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                              : "text-gray-600 hover:bg-violet-50 hover:text-violet-700"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    disabled={page === pages}
                    onClick={() => setPage((p) => p + 1)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700 transition-colors"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
