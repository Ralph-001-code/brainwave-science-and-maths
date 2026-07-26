import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { IGCSE_SUBJECTS, getIgcseSubject } from "../lib/igcseData";
import type { IgcseSubjectId } from "../lib/quizData";
import {
  BookOpen, ArrowRight, CheckCircle2, Star, Sigma, FlaskConical, Leaf,
  Zap, PenLine, TrendingUp, Cpu, Briefcase, GraduationCap,
  Hash, Shapes, BarChart3, Flame, Plug, Atom, Microscope, Dna, Ruler,
} from "lucide-react";

const ICONS: Record<string, any> = {
  Sigma, FlaskConical, Leaf, Zap, PenLine, BookOpen, TrendingUp, Cpu, Briefcase,
  Hash, Shapes, BarChart3, Flame, Plug, Atom, Microscope, Dna, Ruler,
};

export default function Igcse() {
  const { profile, setProgramme } = useAuth();
  const [selected, setSelected] = useState<IgcseSubjectId[]>(
    profile?.igcse_subjects ?? ["maths_core", "english"],
  );
  const [active, setActive] = useState<IgcseSubjectId | null>(null);

  useEffect(() => {
    if (selected.length > 0 && !active) setActive(selected[0]);
  }, [selected, active]);

  const toggleSubject = (id: IgcseSubjectId) => {
    setSelected((prev) => {
      const has = prev.includes(id);
      const next = has ? prev.filter((s) => s !== id) : [...prev, id];
      setProgramme("igcse", profile?.checkpoint_stage ?? null, next);
      if (active === id && next.length > 0) setActive(next[0]);
      else if (next.length === 0) setActive(null);
      return next;
    });
  };

  const coreSubjects = IGCSE_SUBJECTS.filter((s) => s.core);
  const electiveSubjects = IGCSE_SUBJECTS.filter((s) => !s.core);
  const activeSubject = active ? getIgcseSubject(active) : null;

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <BookOpen size={26} style={{ color: "var(--secondary)" }} />
          <h1 style={{ fontSize: "clamp(24px, 4vw, 32px)", margin: 0 }}>IGCSE</h1>
        </div>
        <p className="text-muted" style={{ fontSize: 16, maxWidth: 620 }}>
          Choose your Core and Elective subjects. Tap to add or remove a subject, then pick a topic to practice exam-style questions.
        </p>
      </div>

      {/* Core subjects */}
      <div className="fade-up" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, marginBottom: 10, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 8 }}>
          <GraduationCap size={18} className="text-gold" /> Core subjects (compulsory)
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          {coreSubjects.map((s) => {
            const Icon = ICONS[s.icon] ?? BookOpen;
            const sel = selected.includes(s.id);
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => { toggleSubject(s.id); if (!sel) setActive(s.id); }}
                className="card"
                style={{
                  textAlign: "left",
                  padding: 16,
                  cursor: "pointer",
                  border: `1px solid ${isActive ? s.color : sel ? `${s.color}88` : "var(--border)"}`,
                  background: isActive ? `${s.color}1a` : sel ? `${s.color}0a` : "var(--surface)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Icon size={20} style={{ color: s.color }} />
                  {sel && <CheckCircle2 size={16} style={{ color: s.color }} />}
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: sel ? s.color : "var(--text)" }}>{s.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Elective subjects */}
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <h3 style={{ fontSize: 16, marginBottom: 10, color: "var(--text-muted)" }}>Elective subjects (optional)</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
          {electiveSubjects.map((s) => {
            const Icon = ICONS[s.icon] ?? BookOpen;
            const sel = selected.includes(s.id);
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => { toggleSubject(s.id); if (!sel) setActive(s.id); }}
                className="card"
                style={{
                  textAlign: "left",
                  padding: 14,
                  cursor: "pointer",
                  border: `1px solid ${isActive ? s.color : sel ? `${s.color}88` : "var(--border)"}`,
                  background: isActive ? `${s.color}1a` : sel ? `${s.color}0a` : "var(--surface)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <Icon size={18} style={{ color: s.color }} />
                  {sel ? <CheckCircle2 size={14} style={{ color: s.color }} /> : <Star size={14} style={{ color: "var(--text-dim)" }} />}
                </div>
                <div style={{ fontWeight: 600, fontSize: 14, color: sel ? s.color : "var(--text)" }}>{s.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Topics for active subject */}
      {activeSubject ? (
        <>
          <div className="fade-up" style={{ marginBottom: 18 }}>
            <h2 style={{ fontSize: 22, display: "flex", alignItems: "center", gap: 10 }}>
              {(() => { const Icon = ICONS[activeSubject.icon] ?? BookOpen; return <Icon size={22} style={{ color: activeSubject.color }} /> })()}
              {activeSubject.name}
            </h2>
            <p className="text-muted" style={{ fontSize: 14 }}>{activeSubject.description}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {activeSubject.topics.map((t, i) => {
              const pastCount = t.questions.filter((q) => q.pastPaper).length;
              const Icon = ICONS[t.icon] ?? BookOpen;
              const accent = activeSubject.color;
              return (
                <Link
                  key={t.id}
                  to={`/quiz/igcse/${activeSubject.id}/${t.id}`}
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
                    {pastCount > 0 && (
                      <div className="badge" style={{ background: "rgba(245,200,66,0.14)", color: "var(--gold)" }}>
                        <BookOpen size={13} /> {pastCount} past paper
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      ) : (
        <div className="card fade-up" style={{ textAlign: "center", padding: 40 }}>
          <p className="text-muted" style={{ marginBottom: 16 }}>You haven't selected any subjects yet. Pick a Core or Elective subject above to see its topics.</p>
          <p className="text-muted" style={{ fontSize: 13 }}>Tip: tap a subject card to add it to your list.</p>
        </div>
      )}
    </div>
  );
}
