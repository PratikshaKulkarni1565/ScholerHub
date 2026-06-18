export function Spinner() {
  return (
    <div className="flex flex-col justify-center items-center py-20 gap-3">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-violet-100" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-600 animate-spin" />
        <div className="absolute inset-2 rounded-full bg-violet-50 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-violet-600 animate-pulse" />
        </div>
      </div>
      <p className="text-sm text-violet-400 font-medium animate-pulse">Loading...</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-violet-100/60 p-5 flex flex-col gap-3 overflow-hidden">
      <div className="flex justify-between">
        <div className="h-5 w-24 rounded-full shimmer" />
        <div className="h-5 w-5 rounded-full shimmer" />
      </div>
      <div className="h-4 w-3/4 rounded-lg shimmer" />
      <div className="h-3 w-full rounded shimmer" />
      <div className="h-3 w-5/6 rounded shimmer" />
      <div className="flex flex-col gap-1.5 mt-2">
        <div className="h-3 w-1/2 rounded shimmer" />
        <div className="h-3 w-2/5 rounded shimmer" />
        <div className="h-3 w-3/5 rounded shimmer" />
      </div>
      <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between">
        <div className="h-4 w-20 rounded shimmer" />
        <div className="h-4 w-16 rounded shimmer" />
      </div>
    </div>
  );
}

export function Badge({ label, color = "violet" }: { label: string; color?: string }) {
  const colors: Record<string, string> = {
    violet: "bg-violet-100 text-violet-700 border border-violet-200/60",
    blue: "bg-blue-100 text-blue-700 border border-blue-200/60",
    indigo: "bg-indigo-100 text-indigo-700 border border-indigo-200/60",
    green: "bg-emerald-100 text-emerald-700 border border-emerald-200/60",
    orange: "bg-orange-100 text-orange-700 border border-orange-200/60",
    purple: "bg-purple-100 text-purple-700 border border-purple-200/60",
    red: "bg-red-100 text-red-700 border border-red-200/60",
    cyan: "bg-cyan-100 text-cyan-700 border border-cyan-200/60",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colors[color] || colors.violet}`}>
      {label}
    </span>
  );
}

export function EmptyState({ message = "No scholarships found." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="w-20 h-20 rounded-2xl bg-violet-50 flex items-center justify-center mb-5">
        <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-violet-300">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
      <p className="text-gray-700 font-semibold mb-1">Nothing found</p>
      <p className="text-sm text-gray-400 max-w-xs">{message}</p>
    </div>
  );
}
