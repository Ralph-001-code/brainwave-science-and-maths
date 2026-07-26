import { Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { YEARS, TOPICS_BY_YEAR, getYear, type YearId } from "../lib/quizData";
import {
  GraduationCap, ArrowRight, CheckCircle2, Star, BookOpen,
  Hash, Plus, Minus, Shapes, Sparkles, X, Clock, PieChart, Ruler,
  Sigma, Calculator, Atom, TrendingUp, Beaker, Atom as Science, Zap,
  Divide, Percent, Triangle, BarChart3, Scale, List, Dices, Award,
} from "lucide-react";

const TOPIC_ICONS: Record<string, any> = {
  Hash, Plus, Minus, Shapes, Sparkles, X, Clock, PieChart, Ruler,
  Sigma, Calculator, Atom, TrendingUp, Beaker, Science, Zap, BookOpen,
  Divide, Percent, Triangle, BarChart3, Scale, List, Dices, GraduationCap, Star, Award,
};

const ACCENT_COLORS = ["#a855f7", "#60a5fa", "#34d399", "#fbbf24", "#f87171", "#22d3ee"];

export default function Years() {
  const { profile, setYear } = useAuth();
  const activeYear = (profile?.year_id as YearId) ?? "year1";

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "clamp(26px, 4vw, 36px)" }}>Year Groups</h1>
        <p className="text-muted" style={{ fontSize: 16 }}>
          Your year is <span style={{ color: getYear(activeYear).color, fontWeight: 600 }}>{getYear(activeYear).name}</span>. You can change it any time — questions are matched to the year you pick.
        </p>
      </div>

      {/* Year picker */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 32 }}>
        {YEARS.map((y) => {
          const sel = activeYear === y.id;
          return (
            <button
              key={y.id}
              onClick={() => setYear(y.id)}
              className="card card-hover"
              style={{
                textAlign: "left",
                padding: 18,
                cursor: "pointer",
                border: `1px solid ${sel ? y.color : "var(--border)"}`,
                background: sel ? `${y.color}14` : "var(--surface)",
                transition: "all 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <GraduationCap size={22} style={{ color: y.color }} />
                {sel && <Star size={16} style={{ color: y.color, fill: y.color }} />}
              </div>
              <div style={{ fontWeight: 700, fontSize: 17 }}>{y.name}</div>
              <div className="text-muted" style={{ fontSize: 12 }}>{y.ageRange}</div>
            </button>
          );
        })}
      </div>

      {/* Topics in the active year */}
      <div className="fade-up" style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 22, display: "flex", alignItems: "center", gap: 8 }}>
          <GraduationCap size={22} style={{ color: getYear(activeYear).color }} />
          {getYear(activeYear).name} topics
        </h2>
        <p className="text-muted" style={{ fontSize: 14 }}>{getYear(activeYear).description}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
        {TOPICS_BY_YEAR[activeYear].map((t, i) => {
          const cambridgeCount = t.questions.filter((q) => q.cambridge).length;
          const Icon = TOPIC_ICONS[t.icon] ?? BookOpen;
          const accent = ACCENT_COLORS[i % ACCENT_COLORS.length];
          const pastCount = t.questions.filter((q) => q.pastPaper).length;
          return (
            <Link
              key={t.id}
              to={`/quiz/${activeYear}/${t.id}`}
              className="card card-hover fade-up topic-card"
              style={{
                padding: 20, textDecoration: "none", animationDelay: `${i * 50}ms`,
                position: "relative", overflow: "hidden",
                borderLeft: `3px solid ${accent}`,
              }}
            >
              <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: `${accent}0a`, transition: "transform 0.3s" }} />
              <div style={{ display: "flex", gap: 14, marginBottom: 10, position: "relative" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: `${accent}1a`, border: `1px solid ${accent}33`,
                  transition: "transform 0.25s ease",
                }}>
                  <Icon size={22} style={{ color: accent }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 17, marginBottom: 2 }}>{t.name}</h3>
                  <p className="text-muted" style={{ fontSize: 13 }}>{t.description}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12, position: "relative" }}>
                <div className="badge" style={{ background: `${accent}14`, color: accent }}>
                  <CheckCircle2 size={13} /> {t.questions.length} questions
                </div>
                {cambridgeCount > 0 && (
                  <div className="badge" style={{ background: "rgba(245,200,66,0.14)", color: "var(--gold)" }}>
                    <BookOpen size={13} /> {cambridgeCount} Cambridge
                  </div>
                )}
                {pastCount > 0 && (
                  <div className="badge" style={{ background: "rgba(52,211,153,0.14)", color: "var(--success)" }}>
                    <Star size={13} /> {pastCount} past paper
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
