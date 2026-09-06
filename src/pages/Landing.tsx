import { Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { YEARS } from "../lib/quizData";
import { CHANNEL } from "../lib/config";
import { useSeo } from "../lib/useSeo";
import {
  ArrowRight, Sparkles, GraduationCap, Calendar, Pencil, Mail,
  Brain, Target, TrendingUp, CheckCircle2, Youtube, Star, LayoutDashboard,
} from "lucide-react";

export default function Landing() {
  const { user } = useAuth();
  useSeo({
    title: "Brainwave Science & Maths | Learn, Practice & Master Maths",
    description: "Free maths and science learning for Year 1 to IGCSE. Daily quizzes, Cambridge-style past paper practice, XP, ranks and certificates. Built for students.",
  });

  return (
    <>
      {/* HERO */}
      <section className="section" style={{ paddingTop: 20 }}>
        <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div className="badge fade-up" style={{ marginBottom: 24, background: "rgba(245,200,66,0.14)", color: "var(--gold)" }}>
            <Sparkles size={14} /> Learn maths the Brainwave way
          </div>
          <h1 className="fade-up" style={{ fontSize: "clamp(36px, 6vw, 64px)", maxWidth: 900, letterSpacing: "-0.02em" }}>
            Science &amp; Maths for every year. <span className="gradient-text">Made simple.</span>
          </h1>
          <p className="fade-up text-muted" style={{ fontSize: 20, maxWidth: 640, marginTop: 20 }}>
            Pick your year group, learn at your own pace, take daily quizzes and earn XP. From counting in Year 1 to Cambridge-style problem solving at IGCSE — built for students by Brainwave Science & Maths.
          </p>
          <div className="fade-up" style={{ display: "flex", gap: 14, marginTop: 32, flexWrap: "wrap", justifyContent: "center" }}>
            <Link to={user ? "/dashboard" : "/auth?mode=signup"} className="btn btn-primary btn-lg">
              {user ? "Go to dashboard" : "Start learning free"} <ArrowRight size={18} />
            </Link>
            <Link to="/years" className="btn btn-ghost btn-lg">
              <GraduationCap size={18} /> Pick your year
            </Link>
          </div>

          <div className="fade-up" style={{ marginTop: 56 }}>
            <img
              src="/Brainwave_science_and_maths.jpeg"
              alt="Brainwave Science and Maths"
              className="float"
              style={{
                width: 130,
                height: 130,
                borderRadius: 28,
                objectFit: "cover",
                boxShadow: "0 24px 60px -20px var(--purple-glow)",
                border: "2px solid var(--gold)",
              }}
            />
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section style={{ padding: "30px 0" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          {[
            { icon: GraduationCap, value: "6", label: "Year groups (Y1-Y6)" },
            { icon: Brain, value: "60+", label: "Topics across all programmes" },
            { icon: Target, value: "700+", label: "Practice questions" },
            { icon: Calendar, value: "Daily", label: "Quizzes & streaks" },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="card fade-up" style={{ textAlign: "center", padding: 22 }}>
                <Icon size={26} style={{ color: "var(--gold)", marginBottom: 8 }} />
                <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "Lexend" }}>{s.value}</div>
                <div className="text-muted" style={{ fontSize: 14 }}>{s.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURES */}
      <section className="section">
        <div className="container">
          <h2 className="text-center fade-up" style={{ fontSize: "clamp(28px, 4vw, 40px)" }}>
            Everything you need to <span className="text-gold">level up</span>
          </h2>
          <p className="text-center text-muted fade-up" style={{ maxWidth: 560, margin: "14px auto 48px" }}>
            A complete learning loop — pick your year, learn, practice, get quizzed, earn XP, repeat.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {[
              { icon: LayoutDashboard, title: "Student Dashboard", body: "See your XP, streak, rank and quiz history all in one place." },
              { icon: GraduationCap, title: "Year 1 to Year 6", body: "Questions matched to your year group. Younger learners get simpler questions." },
              { icon: Calendar, title: "Daily Quizzes", body: "A fresh quiz every day from your year's topics. Keep your streak alive." },
              { icon: Pencil, title: "Topic Practice", body: "Drill any topic in your year — fractions, times tables, algebra and more." },
              { icon: TrendingUp, title: "Earn XP & Ranks", body: "Every correct answer earns XP. Climb from Beginner to Brainwave Champion." },
              { icon: Mail, title: "Email Updates", body: "Opt in to get notified by email when new topics and quizzes are added." },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="card card-hover fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(168,85,247,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    <Icon size={24} style={{ color: "var(--primary-light)" }} />
                  </div>
                  <h3 style={{ fontSize: 19, marginBottom: 8 }}>{f.title}</h3>
                  <p className="text-muted" style={{ fontSize: 15 }}>{f.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* YEARS PREVIEW */}
      <section className="section" style={{ background: "var(--bg-soft)" }}>
        <div className="container">
          <h2 className="text-center fade-up" style={{ fontSize: "clamp(28px, 4vw, 40px)" }}>
            Pick your <span className="text-gold">year group</span>
          </h2>
          <p className="text-center text-muted fade-up" style={{ maxWidth: 560, margin: "14px auto 48px" }}>
            Each year has its own topics and questions, suited to that age group — including Cambridge-style word problems.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
            {YEARS.map((y, i) => (
              <div key={y.id} className="card card-hover fade-up" style={{ borderTop: `3px solid ${y.color}`, animationDelay: `${i * 60}ms` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <GraduationCap size={22} style={{ color: y.color }} />
                  <h3 style={{ fontSize: 20 }}>{y.name}</h3>
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: y.color, marginBottom: 8 }}>{y.ageRange}</p>
                <p className="text-muted" style={{ fontSize: 14 }}>{y.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YOUTUBE CTA */}
      <section className="section">
        <div className="container">
          <div className="card fade-up" style={{ textAlign: "center", padding: 48, background: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(245,200,66,0.10))", border: "1px solid var(--border)" }}>
            <div style={{ width: 70, height: 70, borderRadius: 20, background: "linear-gradient(135deg, #ff1a1a, #cc0000)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
              <Youtube size={36} color="#fff" />
            </div>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 34px)", marginBottom: 10 }}>
              Follow <span className="text-gold">{CHANNEL.name}</span>
            </h2>
            <p className="text-muted" style={{ maxWidth: 520, margin: "0 auto 24px", fontSize: 16 }}>
              {CHANNEL.tagline}
            </p>
            <a href={CHANNEL.url} target="_blank" rel="noopener noreferrer" className="btn btn-youtube btn-lg">
              <Youtube size={20} /> Subscribe on YouTube
            </a>
            <p className="text-muted" style={{ marginTop: 14, fontSize: 13 }}>Find us as {CHANNEL.handle}</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="container">
          <h2 className="text-center fade-up" style={{ fontSize: "clamp(28px, 4vw, 40px)" }}>How it works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginTop: 48 }}>
            {[
              { n: "1", title: "Create your account", body: "Sign up free, pick your username and choose your year group." },
              { n: "2", title: "Take quizzes & practice", body: "Complete daily quizzes and practice topics to earn XP." },
              { n: "3", title: "Climb the ranks", body: "Hit XP milestones to rise from Beginner to Brainwave Champion." },
              { n: "4", title: "Keep your streak", body: "Come back every day, take a quiz, and grow your streak." },
            ].map((s) => (
              <div key={s.n} className="card fade-up" style={{ position: "relative" }}>
                <div style={{ fontSize: 40, fontWeight: 800, fontFamily: "Lexend", color: "rgba(168,85,247,0.2)", position: "absolute", top: 12, right: 18 }}>{s.n}</div>
                <h3 style={{ fontSize: 18, marginBottom: 8 }}>{s.title}</h3>
                <p className="text-muted" style={{ fontSize: 14 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="card fade-up" style={{ textAlign: "center", padding: 60, background: "linear-gradient(135deg, rgba(168,85,247,0.14), rgba(217,70,239,0.08))", border: "1px solid rgba(168,85,247,0.35)" }}>
            <CheckCircle2 size={36} style={{ color: "var(--success)", marginBottom: 16 }} />
            <h2 style={{ fontSize: "clamp(26px, 4vw, 36px)", marginBottom: 12 }}>Ready to start your maths journey?</h2>
            <p className="text-muted" style={{ maxWidth: 480, margin: "0 auto 28px", fontSize: 17 }}>
              Free to join. Pick your year and start earning XP today.
            </p>
            <Link to={user ? "/dashboard" : "/auth?mode=signup"} className="btn btn-primary btn-lg">
              {user ? "Go to dashboard" : "Create your free account"} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

    </>
  );
}
