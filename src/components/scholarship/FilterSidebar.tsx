"use client";
import { FilterState } from "@/types";
import { Search, X, SlidersHorizontal } from "lucide-react";

const educationLevels = ["School", "Diploma", "UG", "PG"];
const categories = ["Government", "State Government", "Private", "International"];
const locations = ["India", "Abroad", "Both"];
const fields = ["Engineering", "Medical", "Arts", "Science", "Commerce", "Law", "All"];

interface Props {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClose?: () => void;
}

export default function FilterSidebar({ filters, onChange, onClose }: Props) {
  function update(key: keyof FilterState, value: string) {
    onChange({ ...filters, [key]: value });
  }

  function reset() {
    onChange({ educationLevel: "", category: "", location: "", fieldOfStudy: "", search: "", deadline: "" });
  }

  const hasFilters = Object.values(filters).some((v) => v !== "");
  const activeCount = Object.values(filters).filter((v) => v !== "").length;

  return (
    <div className="bg-white rounded-2xl border border-violet-100/60 shadow-sm shadow-violet-50 p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
            <SlidersHorizontal size={14} className="text-violet-600" />
          </div>
          <h2 className="font-semibold text-gray-800 text-sm">Filters</h2>
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center font-bold">
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {hasFilters && (
            <button
              onClick={reset}
              className="text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg flex items-center gap-1 transition-colors"
            >
              <X size={11} /> Clear all
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-600 p-1">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400" />
        <input
          type="text"
          placeholder="Search scholarships..."
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 text-sm border border-violet-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent bg-violet-50/30 placeholder:text-gray-400"
        />
      </div>

      <FilterGroup label="Education Level" options={educationLevels} value={filters.educationLevel} onChange={(v) => update("educationLevel", v)} />
      <FilterGroup label="Category" options={categories} value={filters.category} onChange={(v) => update("category", v)} />
      <FilterGroup label="Location" options={locations} value={filters.location} onChange={(v) => update("location", v)} />
      <FilterGroup label="Field of Study" options={fields} value={filters.fieldOfStudy} onChange={(v) => update("fieldOfStudy", v)} />

      {/* Deadline */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Deadline</p>
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <div className={`w-10 h-5 rounded-full transition-colors relative ${filters.deadline === "upcoming" ? "bg-violet-600" : "bg-gray-200"}`}
            onClick={() => update("deadline", filters.deadline === "upcoming" ? "" : "upcoming")}
          >
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${filters.deadline === "upcoming" ? "translate-x-5" : "translate-x-0.5"}`} />
          </div>
          <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">Active / Upcoming only</span>
        </label>
      </div>
    </div>
  );
}

function FilterGroup({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(value === opt ? "" : opt)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
              value === opt
                ? "bg-violet-600 text-white border-violet-600 shadow-sm shadow-violet-200"
                : "bg-white text-gray-600 border-gray-200 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
