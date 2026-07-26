import { Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import {
  TOPICS_BY_YEAR, getYear, getRankForXp,
  type YearId,
} from "../lib/quizData";
import { Pencil, ArrowRight, GraduationCap, Star, Youtube, BookOpen } from "lucide-react";
import { CHANNEL } from "../lib/config";

export default function Practice() {
  const { profile } = useAuth();
  const yearId = (profile?.year_id as YearId) ?? "year1";
  const yr = getYear(yearId);
  const topics = TOPICS_BY_YEAR[yearId];
  const rank = getRankForXp(profile?.xp ?? 0);

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
      <div className="fade-up" style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: "clamp(26px, 4vw, 36px)" }}>Practice</h1>
        <p className="text-muted" style={{ fontSize: 16 }}>
          Pick any topic from your year, <span style={{ color: yr.color, fontWeight: 600 }}>{yr.name}</span> ({yr.ageRange}), and practice as much as you like. You're a {rank.name} with {profile?.xp ?? 0} XP.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
        {topics.map((t, i) => {
          const cambridgeCount = t.questions.filter((q) => q.cambridge).length;
          return (
            <Link
              key={t.id}
              to={`/quiz/${yearId}/${t.id}`}
              className="card card-hover fade-up"
              style={{ textDecoration: "none", animationDelay: `${i * 50}ms` }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(168,85,247,0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Pencil size={20} style={{ color: "var(--primary-light)" }} />
                </div>
                <ArrowRight size={18} style={{ color: "var(--primary-light)" }} />
              </div>
              <h3 style={{ fontSize: 18, marginBottom: 6 }}>{t.name}</h3>
              <p className="text-muted" style={{ fontSize: 14, marginBottom: 12 }}>{t.description}</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <div className="badge" style={{ background: `${yr.color}1f`, color: yr.color }}>
                  <GraduationCap size={12} /> {yr.name}
                </div>
                <div className="badge">{t.questions.length} questions</div>
                {cambridgeCount > 0 && (
                  <div className="badge" style={{ background: "rgba(245,200,66,0.14)", color: "var(--gold)" }}>
                    <BookOpen size={12} /> {cambridgeCount} Cambridge
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Daily + YouTube */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginTop: 28 }}>
        <div className="card fade-up" style={{ textAlign: "center", padding: 28 }}>
          <p className="text-muted" style={{ marginBottom: 16, fontSize: 15 }}>
            Want a fresh challenge every day with bonus XP?
          </p>
          <Link to="/daily" className="btn btn-gold">Take today's daily quiz <ArrowRight size={16} /></Link>
        </div>

        <div className="card fade-up" style={{ textAlign: "center", padding: 28, background: "linear-gradient(135deg, rgba(255,26,26,0.10), rgba(168,85,247,0.06))", border: "1px solid rgba(255,26,26,0.25)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10 }}>
            <Youtube size={20} color="#ff1a1a" />
            <Star size={16} className="text-gold" />
          </div>
          <p style={{ fontWeight: 600, marginBottom: 4 }}>{CHANNEL.name}</p>
          <p className="text-muted" style={{ fontSize: 13, marginBottom: 16 }}>New maths lessons every week.</p>
          <a href={CHANNEL.url} target="_blank" rel="noopener noreferrer" className="btn btn-youtube">
            <Youtube size={18} /> Subscribe
          </a>
        </div>
      </div>
    </div>
  );
}
