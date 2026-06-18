import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/lib/mongodb";
import { Scholarship } from "@/models/Scholarship";
import { User } from "@/models/User";
import ScholarshipCard from "@/components/scholarship/ScholarshipCard";
import { IScholarship } from "@/types";
import { ArrowRight, Search, BookOpen, Globe, Users, Award, Sparkles, Zap, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "ScholarHub – Find Scholarships for Indian Students",
};

async function getHomeData() {
  try {
    await connectDB();
    const [featured, totalScholarships, totalUsers, newThisWeek] = await Promise.all([
      Scholarship.find({ featured: true, deadline: { $gte: new Date() } })
        .sort({ deadline: 1 }).limit(6).lean(),
      Scholarship.countDocuments(),
      User.countDocuments({ role: "user" }),
      Scholarship.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
    ]);
    return {
      featured: JSON.parse(JSON.stringify(featured)) as IScholarship[],
      totalScholarships,
      totalUsers,
      newThisWeek,
    };
  } catch {
    return { featured: [], totalScholarships: 0, totalUsers: 0, newThisWeek: 0 };
  }
}

export default async function HomePage() {
  const { featured, totalScholarships, totalUsers, newThisWeek } = await getHomeData();

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden animated-gradient min-h-[88vh] flex items-center">
        {/* Mesh overlay */}
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 40%)`,
          }}
        />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center w-full">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-semibold px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              India&apos;s #1 Scholarship Discovery Platform
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] text-white mb-6 tracking-tight">
              Find Your Perfect{" "}
              <span className="relative">
                <span className="relative z-10">Scholarship</span>
                <span className="absolute -bottom-1 left-0 right-0 h-3 bg-yellow-400/40 rounded-full -z-0" />
              </span>
              <br />
              <span className="text-yellow-300">& Fund Your Future</span>
            </h1>

            <p className="text-indigo-100 text-lg mb-8 leading-relaxed max-w-lg">
              Discover hundreds of government, private and international scholarships for Indian students — filtered, sorted, and matched to your profile.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/scholarships"
                className="group flex items-center justify-center gap-2 bg-white text-violet-700 font-bold px-8 py-3.5 rounded-full hover:bg-yellow-50 transition-all shadow-lg shadow-black/10 hover:shadow-xl"
              >
                <Search size={18} />
                Browse Scholarships
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/auth/register"
                className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/20 transition-all"
              >
                <Sparkles size={16} /> Create Free Account
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 mt-8">
              {[
                { icon: <Shield size={14} />, text: "100% Free" },
                { icon: <Zap size={14} />, text: "AI-Powered" },
                { icon: <Award size={14} />, text: "Verified Listings" },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-1.5 text-white/70 text-xs font-medium">
                  {b.icon} {b.text}
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="hidden md:flex justify-center items-center">
            <div className="relative">
              <div className="absolute -inset-6 bg-white/10 rounded-3xl blur-2xl" />
              <Image
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=540&q=85"
                alt="Students studying"
                width={500}
                height={380}
                className="relative rounded-3xl shadow-2xl object-cover"
                priority
              />
              {/* Floating cards */}
              {newThisWeek > 0 && (
                <div className="absolute -bottom-5 -left-8 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 float-animation">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Award size={20} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">New this week</p>
                    <p className="text-sm font-bold text-gray-800">{newThisWeek} Scholarships</p>
                  </div>
                </div>
              )}
              <div className="absolute -top-5 -right-6 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 float-animation" style={{ animationDelay: "2s" }}>
                <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                  <Sparkles size={20} className="text-violet-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">AI Matched</p>
                  <p className="text-sm font-bold text-gray-800">For You</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/15 bg-black/10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { value: totalScholarships > 0 ? `${totalScholarships}+` : "500+", label: "Scholarships Listed", icon: <Award size={16} className="text-yellow-300" /> },
              { value: totalUsers > 0 ? `${totalUsers}+` : "0", label: "Students Registered", icon: <Users size={16} className="text-emerald-300" /> },
              { value: "Free", label: "Always Free to Use", icon: <Shield size={16} className="text-blue-300" /> },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2.5">
                {s.icon}
                <div>
                  <p className="text-lg font-extrabold text-white leading-none">{s.value}</p>
                  <p className="text-xs text-indigo-200">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-xs font-bold px-4 py-2 rounded-full mb-4">
            <Sparkles size={12} /> Why ScholarHub
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900">Everything you need to find your scholarship</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">From smart filters to AI-powered recommendations — we make scholarship discovery effortless.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Search size={24} className="text-violet-600" />,
              iconBg: "bg-violet-100",
              img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=75",
              title: "Smart Search & Filters",
              desc: "Filter by education level, field, category and deadline to find scholarships that match your profile instantly.",
              tag: "Instant Results",
            },
            {
              icon: <BookOpen size={24} className="text-indigo-600" />,
              iconBg: "bg-indigo-100",
              img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=75",
              title: "Save & Track Deadlines",
              desc: "Bookmark scholarships and track deadlines from your personal dashboard. Never miss an opportunity.",
              tag: "Never Miss Out",
            },
            {
              icon: <Globe size={24} className="text-emerald-600" />,
              iconBg: "bg-emerald-100",
              img: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=400&q=75",
              title: "India & Worldwide",
              desc: "Covers government, private, state-level and international scholarships open to Indian students.",
              tag: "500+ Listings",
            },
          ].map((f) => (
            <div key={f.title} className="group bg-white rounded-2xl border border-gray-100 hover:border-violet-200 overflow-hidden card-hover">
              <div className="relative h-40 w-full overflow-hidden">
                <Image src={f.img} alt={f.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute bottom-3 left-3 text-xs font-semibold text-white bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  {f.tag}
                </span>
              </div>
              <div className="p-5">
                <div className={`w-10 h-10 rounded-xl ${f.iconBg} flex items-center justify-center mb-3`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Scholarships ── */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse" />
                <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">Featured</span>
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900">Top Scholarships Right Now</h2>
            </div>
            <Link
              href="/scholarships"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 px-4 py-2 rounded-full transition-colors"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((s) => (
              <ScholarshipCard key={s._id} scholarship={s} />
            ))}
          </div>
          <div className="sm:hidden mt-6 text-center">
            <Link href="/scholarships" className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 bg-violet-50 px-6 py-2.5 rounded-full">
              View all scholarships <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      )}

      {/* ── How it works ── */}
      <section className="bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-bold px-4 py-2 rounded-full mb-4">
              <Zap size={12} /> How It Works
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900">Get your scholarship in 3 steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-violet-300 to-indigo-300" />
            {[
              { step: "01", icon: <Users size={22} className="text-violet-600" />, title: "Create Your Profile", desc: "Sign up and fill in your education level, field of study, state, and category." },
              { step: "02", icon: <Sparkles size={22} className="text-indigo-600" />, title: "Get AI Recommendations", desc: "Our algorithm matches you with scholarships you're most likely to qualify for." },
              { step: "03", icon: <Award size={22} className="text-emerald-600" />, title: "Apply & Win", desc: "Click through to the official scholarship portal and submit your application." },
            ].map((s, i) => (
              <div key={s.step} className="relative bg-white rounded-2xl border border-white shadow-sm p-6 text-center">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white text-xs font-bold flex items-center justify-center shadow-md">
                  {s.step}
                </div>
                <div className={`w-12 h-12 rounded-2xl mx-auto mb-4 mt-2 flex items-center justify-center ${i === 0 ? "bg-violet-100" : i === 1 ? "bg-indigo-100" : "bg-emerald-100"}`}>
                  {s.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative overflow-hidden min-h-[320px] flex items-center">
        <Image
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1400&q=80"
          alt="University campus"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900/90 via-indigo-900/80 to-violet-900/90" />
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />

        <div className="relative w-full max-w-3xl mx-auto px-4 py-20 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-semibold px-4 py-2 rounded-full mb-6">
            <Sparkles size={12} /> Join thousands of students
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
            Your Dream Education<br />
            <span className="text-yellow-300">Starts Here</span>
          </h2>
          <p className="text-indigo-200 text-lg mb-8 max-w-xl mx-auto">
            Free to use. No hidden fees. Just scholarships that match you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-10 py-4 rounded-full transition-colors text-base shadow-lg shadow-yellow-400/30"
            >
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link
              href="/scholarships"
              className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/20 transition-colors text-base"
            >
              <Search size={16} /> Browse Scholarships
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
