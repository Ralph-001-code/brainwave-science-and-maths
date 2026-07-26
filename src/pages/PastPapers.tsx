import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { TOPICS_BY_YEAR, YEARS } from "../lib/quizData";
import { CHECKPOINT_CONTENT, CHECKPOINT_STAGES } from "../lib/checkpointData";
import { IGCSE_SUBJECTS } from "../lib/igcseData";
import type { Topic } from "../lib/quizData";
import {
  FileText, Search, ArrowRight, BookOpen, Hash, Sigma, Shapes, BarChart3,
  PenLine, Zap, Flame, Plug, Atom, FlaskConical, Microscope, Leaf, Dna,
  TrendingUp, Cpu, Briefcase, Ruler, Triangle, Percent, Divide, X, Clock,
  PieChart, Sparkles, Calculator, List, Dices, Scale, GraduationCap, Star,
} from "lucide-react";
import { useSeo } from "../lib/useSeo";

const ICONS: Record<string, any> = {
  Hash, Sigma, Shapes, BarChart3, PenLine, Zap, Flame, Plug, Atom,
  FlaskConical, Microscope, Leaf, Dna, TrendingUp, Cpu, Briefcase, Ruler,
  Triangle, Percent, Divide, X, Clock, PieChart, Sparkles, Calculator,
  List, Dices, Scale, GraduationCap, BookOpen, Star,
};

type PaperEntry = {
  id: string;
  title: string;
  source: string;
  sourceColor: string;
  subject: string;
  topicId: string;
  route: string;
  pastCount: number;
  writtenCount: number;
  totalCount: number;
  icon: string;
  description: string;
};

export default function PastPapers() {
  useSeo({ title: "Past Paper Practice", description: "Browse and practice Cambridge-style past paper questions across all year groups, Checkpoint stages, and IGCSE subjects." });
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "primary" | "checkpoint" | "igcse">("all");

  const papers = useMemo<PaperEntry[]>(() => {
    const entries: PaperEntry[] = [];

    for (const y of YEARS) {
      for (const t of TOPICS_BY_YEAR[y.id]) {
        const pp = t.questions.filter((q) => q.pastPaper).length;
        if (pp === 0) continue;
        entries.push({
          id: `primary-${y.id}-${t.id}`,
          title: t.name,
          source: y.name,
          sourceColor: y.color,
          subject: "Maths",
          topicId: t.id,
          route: `/quiz/${y.id}/${t.id}`,
          pastCount: pp,
          writtenCount: t.questions.filter((q) => q.type === "written").length,
          totalCount: t.questions.length,
          icon: t.icon,
          description: t.description,
        });
      }
    }

    for (const stage of CHECKPOINT_STAGES) {
      for (const subject of ["maths", "science"] as const) {
        for (const t of CHECKPOINT_CONTENT[stage.id][subject]) {
          const pp = t.questions.filter((q) => q.pastPaper).length;
          if (pp === 0) continue;
          entries.push({
            id: `cp-${stage.id}-${subject}-${t.id}`,
            title: t.name,
            source: stage.shortName,
            sourceColor: stage.color,
            subject: subject === "maths" ? "Maths" : "Science",
            topicId: t.id,
            route: `/quiz/checkpoint/${stage.id}/${subject}/${t.id}`,
            pastCount: pp,
            writtenCount: t.questions.filter((q) => q.type === "written").length,
            totalCount: t.questions.length,
            icon: t.icon,
            description: t.description,
          });
        }
      }
    }

    for (const subj of IGCSE_SUBJECTS) {
      for (const t of subj.topics) {
        const pp = t.questions.filter((q) => q.pastPaper).length;
        if (pp === 0) continue;
        entries.push({
          id: `igcse-${subj.id}-${t.id}`,
          title: t.name,
          source: subj.name,
          sourceColor: subj.color,
          subject: subj.name,
          topicId: t.id,
          route: `/quiz/igcse/${subj.id}/${t.id}`,
          pastCount: pp,
          writtenCount: t.questions.filter((q) => q.type === "written").length,
          totalCount: t.questions.length,
          icon: t.icon,
          description: t.description,
        });
      }
    }

    return entries;
  }, []);

  const filtered = papers.filter((p) => {
    if (filter !== "all") {
      if (filter === "primary" && !p.id.startsWith("primary-")) return false;
      if (filter === "checkpoint" && !p.id.startsWith("cp-")) return false;
      if (filter === "igcse" && !p.id.startsWith("igcse-")) return false;
    }
    if (query) {
      const q = query.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.subject.toLowerCase().includes(q) || p.source.toLowerCase().includes(q);
    }
    return true;
  });

  const totalPast = papers.reduce((s, p) => s + p.pastCount, 0);

  const filters = [
    { id: "all" as const, label: "All Papers", count: papers.length },
    { id: "primary" as const, label: "Primary", count: papers.filter((p) => p.id.startsWith("primary-")).length },
    { id: "checkpoint" as const, label: "Checkpoint", count: papers.filter((p) => p.id.startsWith("cp-")).length },
    { id: "igcse" as const, label: "IGCSE", count: papers.filter((p) => p.id.startsWith("igcse-")).length },
  ];

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(245,200,66,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FileText size={26} className="text-gold" />
          </div>
          <div>
            <h1 style={{ fontSize: "clamp(26px, 4vw, 36px)" }}>Past Paper Practice</h1>
            <p className="text-muted" style={{ fontSize: 16 }}>Cambridge-style exam questions from every programme, all in one place.</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 16 }}>
          <div className="card" style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 10 }}>
            <FileText size={20} className="text-gold" />
            <div><div style={{ fontWeight: 700, fontSize: 18 }}>{totalPast}</div><div className="text-muted" style={{ fontSize: 12 }}>Past paper questions</div></div>
          </div>
          <div className="card" style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 10 }}>
            <BookOpen size={20} style={{ color: "var(--primary-light)" }} />
            <div><div style={{ fontWeight: 700, fontSize: 18 }}>{papers.length}</div><div className="text-muted" style={{ fontSize: 12 }}>Topics with past papers</div></div>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="fade-up" style={{ marginBottom: 24, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <Search size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            className="input"
            style={{ paddingLeft: 42 }}
            placeholder="Search topics or subjects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: "9px 16px", borderRadius: 10, border: `1px solid ${filter === f.id ? "var(--primary)" : "var(--border)"}`,
                background: filter === f.id ? "rgba(168,85,247,0.12)" : "var(--surface)",
                color: filter === f.id ? "var(--primary-light)" : "var(--text-muted)",
                fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.18s",
              }}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="card fade-up" style={{ textAlign: "center", padding: 48 }}>
          <Search size={32} className="text-muted" style={{ margin: "0 auto 12px" }} />
          <p className="text-muted">No past paper topics match your search. Try a different keyword or filter.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
          {filtered.map((p, i) => {
            const Icon = ICONS[p.icon] ?? BookOpen;
            return (
              <Link
                key={p.id}
                to={p.route}
                className="card card-hover fade-up topic-card"
                style={{
                  padding: 20, textDecoration: "none", animationDelay: `${Math.min(i, 10) * 40}ms`,
                  position: "relative", overflow: "hidden", borderLeft: `3px solid ${p.sourceColor}`,
                }}
              >
                <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: `${p.sourceColor}0a` }} />
                <div style={{ display: "flex", gap: 14, marginBottom: 10, position: "relative" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: `${p.sourceColor}1a`, border: `1px solid ${p.sourceColor}33`,
                  }}>
                    <Icon size={22} style={{ color: p.sourceColor }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 16, marginBottom: 2 }}>{p.title}</h3>
                    <p className="text-muted" style={{ fontSize: 13 }}>{p.description}</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12, position: "relative" }}>
                  <div className="badge" style={{ background: "rgba(245,200,66,0.14)", color: "var(--gold)" }}>
                    <FileText size={12} /> {p.pastCount} past paper
                  </div>
                  <div className="badge" style={{ background: `${p.sourceColor}14`, color: p.sourceColor }}>
                    {p.source}
                  </div>
                  <div className="badge" style={{ background: "rgba(96,165,250,0.12)", color: "var(--secondary)" }}>
                    {p.subject}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, color: "var(--primary-light)", fontWeight: 600, fontSize: 13 }}>
                  Start practising <ArrowRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
