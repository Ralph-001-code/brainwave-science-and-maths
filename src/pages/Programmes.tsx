import { Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { PROGRAMMES } from "../lib/quizData";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

const ICONS: Record<string, any> = {};
import { GraduationCap, Award, BookOpen } from "lucide-react";
ICONS.GraduationCap = GraduationCap;
ICONS.Award = Award;
ICONS.BookOpen = BookOpen;

export default function Programmes() {
  const { profile } = useAuth();

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
      <div className="fade-up" style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: "clamp(26px, 4vw, 36px)" }}>Choose your programme</h1>
        <p className="text-muted" style={{ fontSize: 16, maxWidth: 620 }}>
          Brainwave offers three learning programmes. Pick the one that matches your stage — you can switch any time in Settings.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
        {PROGRAMMES.map((p, i) => {
          const Icon = ICONS[p.icon] ?? GraduationCap;
          const isCurrent = profile?.programme === p.id;
          return (
            <Link
              key={p.id}
              to={`/${p.id}`}
              className="card card-hover fade-up"
              style={{ textDecoration: "none", borderTop: `3px solid ${p.color}`, animationDelay: `${i * 70}ms`, position: "relative" }}
            >
              {isCurrent && (
                <div className="badge" style={{ position: "absolute", top: 16, right: 16, background: `${p.color}22`, color: p.color }}>
                  <CheckCircle2 size={12} /> Current
                </div>
              )}
              <div style={{ width: 56, height: 56, borderRadius: 16, background: `${p.color}1f`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <Icon size={28} style={{ color: p.color }} />
              </div>
              <h2 style={{ fontSize: 22, marginBottom: 8 }}>{p.name}</h2>
              <p className="text-muted" style={{ fontSize: 15, marginBottom: 18 }}>{p.description}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: p.color, fontWeight: 600, fontSize: 14 }}>
                Enter programme <ArrowRight size={16} />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="card fade-up" style={{ marginTop: 28, display: "flex", gap: 14, alignItems: "center" }}>
        <Sparkles size={24} className="text-gold" />
        <p className="text-muted" style={{ fontSize: 15, margin: 0 }}>
          Not sure which one is right for you? Primary covers Years 1-8, Checkpoint is for Cambridge exam stages (Year 6 & 9), and IGCSE is for Years 10-11 exam preparation.
        </p>
      </div>
    </div>
  );
}
