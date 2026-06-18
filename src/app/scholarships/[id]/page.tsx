import { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { Scholarship } from "@/models/Scholarship";
import { IScholarship } from "@/types";
import { Calendar, MapPin, BookOpen, ExternalLink, Tag, Building2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

async function getScholarship(id: string): Promise<IScholarship | null> {
  try {
    await connectDB();
    const data = await Scholarship.findById(id).lean();
    if (!data) return null;
    return JSON.parse(JSON.stringify(data));
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const s = await getScholarship(id);
  if (!s) return { title: "Scholarship Not Found" };
  return { title: s.title, description: s.description.slice(0, 160) };
}

export default async function ScholarshipDetailPage({ params }: Props) {
  const { id } = await params;
  const s = await getScholarship(id);
  if (!s) notFound();

  const deadline = new Date(s.deadline);
  const isExpired = deadline < new Date();
  const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const categoryColor = {
    Government: "blue",
    "State Government": "violet",
    Private: "green",
    International: "orange",
  }[s.category] || "violet";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link
        href="/scholarships"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-violet-600 mb-8 group transition-colors"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Scholarships
      </Link>

      {/* Header card */}
      <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 rounded-3xl p-8 mb-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 80% 20%, white 0%, transparent 50%)`,
          }}
        />
        <div className="relative">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge label={s.category} color={categoryColor as "blue" | "violet" | "green" | "orange"} />
            <Badge label={s.location} color="cyan" />
            {s.featured && <Badge label="⭐ Featured" color="orange" />}
            {isExpired && <Badge label="Expired" color="red" />}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold leading-tight mb-3">{s.title}</h1>
          <p className="text-indigo-200 text-sm">
            Provided by <span className="font-semibold text-white">{s.provider}</span>
          </p>
          {!isExpired && (
            <div className={`inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full text-sm font-bold ${
              daysLeft <= 7 ? "bg-red-500/30 text-red-100" : "bg-white/15 text-white"
            }`}>
              <Calendar size={14} />
              {daysLeft <= 7 ? `⚡ Only ${daysLeft} days left!` : `${daysLeft} days remaining`}
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Description */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-violet-600 rounded-full" /> About this Scholarship
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm">{s.description}</p>
          </div>

          {/* Eligibility */}
          <div className="bg-violet-50 rounded-2xl border border-violet-100 p-6">
            <h2 className="font-bold text-violet-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-violet-600 rounded-full" /> Eligibility Criteria
            </h2>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "Education Level", value: s.eligibility.educationLevel.join(", ") },
                { label: "Field of Study", value: s.eligibility.fieldOfStudy.join(", ") },
                { label: "Applicable States", value: s.eligibility.states.join(", ") },
                ...(s.eligibility.minPercentage ? [{ label: "Min. Percentage", value: `${s.eligibility.minPercentage}%` }] : []),
                ...(s.eligibility.incomeLimit ? [{ label: "Income Limit", value: `₹${s.eligibility.incomeLimit.toLocaleString("en-IN")}/year` }] : []),
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 size={16} className="text-violet-500 mt-0.5 shrink-0" />
                  <span>
                    <span className="font-semibold text-violet-800">{item.label}:</span>{" "}
                    <span className="text-violet-700">{item.value}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* How to Apply */}
          {s.howToApply && s.howToApply.length > 0 && (
            <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-6">
              <h2 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-emerald-600 rounded-full" /> How to Apply
              </h2>
              <ol className="flex flex-col gap-3">
                {s.howToApply.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-emerald-800 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Key info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4">
            <InfoCard icon={<Tag size={16} className="text-violet-600" />} label="Amount" value={s.amount} valueClass="text-violet-700 font-bold text-base" />
            <InfoCard
              icon={<Calendar size={16} className={isExpired ? "text-red-500" : "text-emerald-600"} />}
              label="Deadline"
              value={isExpired ? "Expired" : deadline.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              valueClass={isExpired ? "text-red-500" : daysLeft <= 7 ? "text-orange-600" : "text-emerald-700"}
            />
            <InfoCard icon={<BookOpen size={16} className="text-indigo-600" />} label="Education" value={s.eligibility.educationLevel.join(", ")} />
            <InfoCard icon={<MapPin size={16} className="text-orange-500" />} label="States" value={s.eligibility.states.slice(0, 3).join(", ") + (s.eligibility.states.length > 3 ? "..." : "")} />
            <InfoCard icon={<Building2 size={16} className="text-gray-500" />} label="Provider" value={s.provider} />
          </div>

          {/* CTA */}
          <a
            href={s.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 font-bold px-6 py-4 rounded-2xl transition-all text-center ${
              isExpired
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90 shadow-lg shadow-violet-200"
            }`}
          >
            {isExpired ? "Scholarship Expired" : <><ExternalLink size={16} /> Apply Now</>}
          </a>

          {isExpired && (
            <Link
              href="/scholarships"
              className="flex items-center justify-center gap-2 text-sm font-semibold text-violet-600 bg-violet-50 hover:bg-violet-100 px-6 py-3 rounded-2xl transition-colors"
            >
              Find Active Scholarships
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value, valueClass = "text-gray-800 font-semibold" }: {
  icon: React.ReactNode; label: string; value: string; valueClass?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className={`text-sm mt-0.5 ${valueClass}`}>{value}</p>
      </div>
    </div>
  );
}
