"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui";
import { IScholarship } from "@/types";
import { Plus, Pencil, Trash2, BarChart3, BookOpen, Users, Star, AlertCircle, Sparkles } from "lucide-react";

interface Stats { totalScholarships: number; totalUsers: number; featured: number; expiringSoon: number; }

const emptyForm = {
  title: "", description: "", amount: "", benefits: "", deadline: "",
  category: "Government", location: "India", provider: "", link: "", featured: false,
  eligibility: { educationLevel: ["UG"], fieldOfStudy: ["All"], states: ["All India"], minPercentage: 0, incomeLimit: 0 }
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [scholarships, setScholarships] = useState<IScholarship[]>([]);
  const [tab, setTab] = useState<"overview" | "scholarships" | "add">("overview");
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [autoTagging, setAutoTagging] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated" && session?.user?.role !== "admin") router.push("/");
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      Promise.all([
        fetch("/api/admin/stats").then((r) => r.json()),
        fetch("/api/scholarships?limit=50").then((r) => r.json())
      ]).then(([s, d]) => {
        setStats(s);
        setScholarships(d.scholarships || []);
        setLoading(false);
      });
    }
  }, [status, session]);

  async function handleAutoTag() {
    if (!form.title || !form.description) return;
    setAutoTagging(true);
    const res = await fetch("/api/admin/autotag", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: form.title, description: form.description })
    });
    const data = await res.json();
    if (data.tags) {
      setForm((prev) => ({
        ...prev,
        category: data.tags.category || prev.category,
        location: data.tags.location || prev.location,
        eligibility: {
          ...prev.eligibility,
          educationLevel: data.tags.eligibility?.educationLevel || prev.eligibility.educationLevel,
          fieldOfStudy: data.tags.eligibility?.fieldOfStudy || prev.eligibility.fieldOfStudy,
          states: data.tags.eligibility?.states || prev.eligibility.states
        }
      }));
    }
    setAutoTagging(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const url = editId ? `/api/scholarships/${editId}` : "/api/scholarships";
    const method = editId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      const updated = await fetch("/api/scholarships?limit=50").then((r) => r.json());
      setScholarships(updated.scholarships || []);
      setForm(emptyForm);
      setEditId(null);
      setTab("scholarships");
    }
    setSubmitting(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this scholarship?")) return;
    await fetch(`/api/scholarships/${id}`, { method: "DELETE" });
    setScholarships((prev) => prev.filter((s) => s._id !== id));
  }

  function startEdit(s: IScholarship) {
    setForm({
      title: s.title, description: s.description, amount: s.amount,
      benefits: s.benefits || "", deadline: new Date(s.deadline).toISOString().split("T")[0],
      category: s.category, location: s.location, provider: s.provider,
      link: s.link, featured: s.featured,
      eligibility: {
        educationLevel: s.eligibility.educationLevel,
        fieldOfStudy: s.eligibility.fieldOfStudy,
        states: s.eligibility.states,
        minPercentage: s.eligibility.minPercentage || 0,
        incomeLimit: s.eligibility.incomeLimit || 0
      }
    });
    setEditId(s._id);
    setTab("add");
  }

  if (status === "loading" || loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Manage scholarships and view platform stats.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-violet-100 rounded-2xl p-1.5 w-fit mb-8 shadow-sm">
        {(["overview", "scholarships", "add"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); if (t === "add") { setForm(emptyForm); setEditId(null); } }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all capitalize ${
              tab === t ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-200" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t === "overview" && <BarChart3 size={15} />}
            {t === "scholarships" && <BookOpen size={15} />}
            {t === "add" && <Plus size={15} />}
            {t === "add" ? (editId ? "Edit" : "Add New") : t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === "overview" && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Scholarships", value: stats.totalScholarships, icon: <BookOpen size={20} className="text-violet-600" />, bg: "bg-violet-50", border: "border-violet-100" },
            { label: "Total Users", value: stats.totalUsers, icon: <Users size={20} className="text-emerald-600" />, bg: "bg-emerald-50", border: "border-emerald-100" },
            { label: "Featured", value: stats.featured, icon: <Star size={20} className="text-yellow-500" />, bg: "bg-yellow-50", border: "border-yellow-100" },
            { label: "Expiring in 7 days", value: stats.expiringSoon, icon: <AlertCircle size={20} className="text-red-500" />, bg: "bg-red-50", border: "border-red-100" }
          ].map((s) => (
            <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-5`}>
              <div className="mb-3">{s.icon}</div>
              <p className="text-3xl font-extrabold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Scholarships List */}
      {tab === "scholarships" && (
        <div className="bg-white rounded-2xl border border-violet-100/60 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-violet-50/50 border-b border-violet-100">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Title</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 hidden md:table-cell">Category</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 hidden md:table-cell">Deadline</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {scholarships.map((s) => (
                <tr key={s._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800 max-w-xs truncate">{s.title}</td>
                  <td className="px-5 py-3 text-gray-500 hidden md:table-cell">{s.category}</td>
                  <td className="px-5 py-3 text-gray-500 hidden md:table-cell">{new Date(s.deadline).toLocaleDateString("en-IN")}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(s)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(s._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Form */}
      {tab === "add" && (
        <div className="bg-white rounded-2xl border border-violet-100/60 shadow-sm p-6 max-w-2xl">
          <h2 className="font-bold text-gray-900 mb-1 flex items-center gap-2"><span className="w-1 h-5 bg-violet-600 rounded-full" />{editId ? "Edit Scholarship" : "Add New Scholarship"}</h2>
          <p className="text-xs text-gray-400 mb-6">Fill in the details below. Use AI Auto-fill to speed up tagging.</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Title">
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={input} />
            </Field>
            <Field label="Description">
              <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={input} />
            </Field>
            {/* AI Auto-Tag Button */}
            <button
              type="button"
              onClick={handleAutoTag}
              disabled={autoTagging || !form.title || !form.description}
              className="flex items-center gap-2 bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 font-semibold px-4 py-2 rounded-xl text-sm transition-colors disabled:opacity-40 w-fit"
            >
              <Sparkles size={15} />
              {autoTagging ? "AI is tagging..." : "Auto-fill with AI"}
            </button>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Amount">
                <input required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className={input} placeholder="e.g. ₹50,000/year" />
              </Field>
              <Field label="Deadline">
                <input required type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className={input} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Category">
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={input}>
                  {["Government", "State Government", "Private", "International"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Location">
                <select value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={input}>
                  {["India", "Abroad", "Both"].map((l) => <option key={l}>{l}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Provider">
              <input required value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} className={input} />
            </Field>
            <Field label="Official Link">
              <input required type="url" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className={input} />
            </Field>
            <Field label="Education Levels (comma separated)">
              <input
                value={form.eligibility.educationLevel.join(", ")}
                onChange={(e) => setForm({ ...form, eligibility: { ...form.eligibility, educationLevel: e.target.value.split(",").map((s) => s.trim()) } })}
                className={input}
              />
            </Field>
            <Field label="Fields of Study (comma separated)">
              <input
                value={form.eligibility.fieldOfStudy.join(", ")}
                onChange={(e) => setForm({ ...form, eligibility: { ...form.eligibility, fieldOfStudy: e.target.value.split(",").map((s) => s.trim()) } })}
                className={input}
              />
            </Field>
            <Field label="Applicable States (comma separated)">
              <input
                value={form.eligibility.states.join(", ")}
                onChange={(e) => setForm({ ...form, eligibility: { ...form.eligibility, states: e.target.value.split(",").map((s) => s.trim()) } })}
                className={input}
              />
            </Field>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-blue-600" />
              Mark as Featured
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-60 shadow-md shadow-violet-200"
            >
              {submitting ? "Saving..." : editId ? "Update Scholarship" : "Add Scholarship"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

const input = "mt-1 w-full border border-violet-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent bg-violet-50/20 transition-all";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}
