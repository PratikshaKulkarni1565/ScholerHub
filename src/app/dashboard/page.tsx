"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ScholarshipCard from "@/components/scholarship/ScholarshipCard";
import { Spinner, EmptyState } from "@/components/ui";
import { IScholarship, IUser } from "@/types";
import { User, Bookmark, Save, Sparkles, CheckCircle2 } from "lucide-react";

const educationLevels = ["10th", "12th", "Diploma", "UG", "PG"];
const fields = ["Engineering", "Medical", "Arts", "Science", "Commerce", "Law", "Other"];
const states = ["Andhra Pradesh", "Bihar", "Delhi", "Gujarat", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal", "Other"];
const castes = ["General", "OBC", "SC", "ST", "EWS", "Other"];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [tab, setTab] = useState<"profile" | "bookmarks" | "recommended">("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [recommended, setRecommended] = useState<IScholarship[]>([]);
  const [recLoading, setRecLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user").then((r) => r.json()).then((d) => { setUser(d); setLoading(false); });
    }
  }, [status]);

  useEffect(() => {
    if (tab === "recommended" && recommended.length === 0) {
      setRecLoading(true);
      fetch("/api/scholarships/recommended")
        .then((r) => r.json())
        .then((d) => { setRecommended(d.recommendations || []); setRecLoading(false); });
    }
  }, [tab, recommended.length]);

  async function saveProfile() {
    if (!user) return;
    setSaving(true);
    await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: user.name, profile: user.profile }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (status === "loading" || loading) return <Spinner />;
  if (!user) return null;

  const profileComplete = !!(user.profile?.educationLevel && user.profile?.fieldOfStudy && user.profile?.state);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Profile header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-6 mb-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `radial-gradient(circle at 90% 50%, white 0%, transparent 60%)` }}
        />
        <div className="relative flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-extrabold text-2xl border border-white/30">
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-extrabold">{user.name}</h1>
            <p className="text-indigo-200 text-sm">{user.email}</p>
            {profileComplete && (
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-300 font-medium">
                <CheckCircle2 size={13} /> Profile complete
              </div>
            )}
          </div>
          <div className="hidden sm:flex flex-col items-end gap-1 text-right">
            <p className="text-xs text-indigo-200">Bookmarks</p>
            <p className="text-2xl font-extrabold">{user.bookmarks?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-violet-100 rounded-2xl p-1.5 w-fit mb-8 shadow-sm">
        {([
          { key: "profile", icon: <User size={15} />, label: "Profile" },
          { key: "bookmarks", icon: <Bookmark size={15} />, label: `Saved (${user.bookmarks?.length || 0})` },
          { key: "recommended", icon: <Sparkles size={15} />, label: "For You" },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === t.key
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-200"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {tab === "profile" && (
        <div className="bg-white rounded-2xl border border-violet-100/60 shadow-sm p-6 max-w-lg">
          <h2 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
            <span className="w-1 h-5 bg-violet-600 rounded-full" /> My Profile
          </h2>
          <p className="text-xs text-gray-400 mb-6">Complete your profile to get personalized scholarship recommendations.</p>
          <div className="flex flex-col gap-4">
            <FormField label="Full Name">
              <input
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className={inputCls}
              />
            </FormField>
            <FormField label="Education Level">
              <select value={user.profile?.educationLevel || ""} onChange={(e) => setUser({ ...user, profile: { ...user.profile, educationLevel: e.target.value } })} className={inputCls}>
                <option value="">Select level</option>
                {educationLevels.map((l) => <option key={l}>{l}</option>)}
              </select>
            </FormField>
            <FormField label="Field of Study">
              <select value={user.profile?.fieldOfStudy || ""} onChange={(e) => setUser({ ...user, profile: { ...user.profile, fieldOfStudy: e.target.value } })} className={inputCls}>
                <option value="">Select field</option>
                {fields.map((f) => <option key={f}>{f}</option>)}
              </select>
            </FormField>
            <FormField label="State">
              <select value={user.profile?.state || ""} onChange={(e) => setUser({ ...user, profile: { ...user.profile, state: e.target.value } })} className={inputCls}>
                <option value="">Select state</option>
                {states.map((s) => <option key={s}>{s}</option>)}
              </select>
            </FormField>
            <FormField label="Caste Category">
              <select value={user.profile?.caste || ""} onChange={(e) => setUser({ ...user, profile: { ...user.profile, caste: e.target.value } })} className={inputCls}>
                <option value="">Select category</option>
                {castes.map((c) => <option key={c}>{c}</option>)}
              </select>
            </FormField>
            <button
              onClick={saveProfile}
              disabled={saving}
              className={`flex items-center gap-2 font-bold px-6 py-3 rounded-xl transition-all w-fit mt-1 ${
                saved
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
                  : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90 shadow-md shadow-violet-200 disabled:opacity-60"
              }`}
            >
              {saved ? <><CheckCircle2 size={15} /> Saved!</> : <><Save size={15} /> {saving ? "Saving..." : "Save Profile"}</>}
            </button>
          </div>
        </div>
      )}

      {/* Bookmarks tab */}
      {tab === "bookmarks" && (
        <div>
          <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span className="w-1 h-5 bg-violet-600 rounded-full" />
            Saved Scholarships
            <span className="text-sm font-normal text-gray-400">({user.bookmarks?.length || 0})</span>
          </h2>
          {!user.bookmarks?.length ? (
            <EmptyState message="No saved scholarships yet. Browse and bookmark scholarships you like!" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(user.bookmarks as unknown as IScholarship[]).map((s) => (
                <ScholarshipCard key={s._id} scholarship={s} isBookmarked />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recommended tab */}
      {tab === "recommended" && (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1 h-5 bg-violet-600 rounded-full" />
            <h2 className="font-bold text-gray-900">Recommended for You</h2>
          </div>
          <p className="text-sm text-gray-400 mb-6 ml-3">Based on your education level, field of study, and state.</p>
          {recLoading ? (
            <Spinner />
          ) : recommended.length === 0 ? (
            <EmptyState message="Complete your profile to get personalized recommendations!" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommended.map((s) => (
                <ScholarshipCard key={s._id} scholarship={s} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const inputCls = "mt-1 w-full border border-violet-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent bg-violet-50/20 transition-all";

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}
