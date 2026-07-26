import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { supabase } from "../lib/supabase";
import {
  YEARS, PROGRAMMES, getYear, TOPICS_BY_YEAR,
  type YearId, type Programme,
} from "../lib/quizData";
import { displayName } from "../components/Navbar";
import { CHECKPOINT_STAGES, CHECKPOINT_SUBJECTS, getCheckpointTopics, type CheckpointStage, type CheckpointSubject } from "../lib/checkpointData";
import { IGCSE_SUBJECTS, getIgcseSubject } from "../lib/igcseData";
import type { PathwayProgress } from "../lib/supabase";
import {
  Award, ArrowRight, CheckCircle2, Lock, Circle, Star, Trophy,
  GraduationCap, BookOpen, Sparkles, Target, ChevronRight,
} from "lucide-react";

type PathwayStep = {
  id: string;
  title: string;
  subtitle: string;
  topicId: string;
  quizLink: string;
  color: string;
};

export default function Pathway() {
  const { user, profile } = useAuth();
  const [progress, setProgress] = useState<Record<string, PathwayProgress>>({});
  const [loading, setLoading] = useState(true);
  const [activeProgramme, setActiveProgramme] = useState<Programme>(profile?.programme ?? "primary");
  const [activeStage, setActiveStage] = useState<string>(profile?.checkpoint_stage ?? "stage6");
  const [activeCpSubject, setActiveCpSubject] = useState<CheckpointSubject>("maths");
  const [activeIgcseSubject, setActiveIgcseSubject] = useState<string>(profile?.igcse_subjects?.[0] ?? "maths_core");
  const [activeYear, setActiveYear] = useState<YearId>(profile?.year_id ?? "year3");

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("pathway_progress")
        .select("*")
        .eq("user_id", user.id);
      const map: Record<string, PathwayProgress> = {};
      (data as PathwayProgress[] | null)?.forEach((p) => {
        map[p.topic_id] = p;
      });
      setProgress(map);
      setLoading(false);
    })();
  }, [user]);

  // Build pathway steps based on selected programme
  const steps: PathwayStep[] = buildPathway(activeProgramme, activeStage, activeCpSubject, activeIgcseSubject, activeYear);

  const completedCount = steps.filter((s) => progress[s.topicId]?.completed).length;
  const overallPct = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;
  const allComplete = completedCount === steps.length && steps.length > 0;

  // Find first incomplete step (next recommended)
  const nextStep = steps.find((s) => !progress[s.topicId]?.completed);

  const name = displayName(profile);

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 80, maxWidth: 920 }}>
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <Award size={26} className="text-gold" />
          <h1 style={{ fontSize: "clamp(24px, 4vw, 32px)", margin: 0 }}>Learning Pathway</h1>
        </div>
        <p className="text-muted" style={{ fontSize: 16, maxWidth: 620 }}>
          Follow your step-by-step course path, {name || "student"}. Complete each topic in order to earn your certificate.
        </p>
      </div>

      {/* Programme switcher */}
      <div className="fade-up" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {PROGRAMMES.map((p) => {
            const sel = activeProgramme === p.id;
            const Icon = p.id === "primary" ? GraduationCap : p.id === "checkpoint" ? Award : BookOpen;
            return (
              <button
                key={p.id}
                onClick={() => { setActiveProgramme(p.id); if (p.id === "checkpoint") setActiveStage(profile?.checkpoint_stage ?? "stage6"); }}
                style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10,
                  border: `1px solid ${sel ? p.color : "var(--border)"}`,
                  background: sel ? `${p.color}1a` : "var(--surface)",
                  color: sel ? p.color : "var(--text-muted)",
                  fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "all 0.18s",
                }}
              >
                <Icon size={16} /> {p.short}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-selectors for primary / checkpoint / igcse */}
      {activeProgramme === "primary" && (
        <div className="fade-up" style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Year group</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {YEARS.map((y) => (
              <button key={y.id} onClick={() => setActiveYear(y.id)} style={{
                padding: "8px 14px", borderRadius: 8, border: `1px solid ${activeYear === y.id ? y.color : "var(--border)"}`,
                background: activeYear === y.id ? `${y.color}1a` : "var(--surface)", color: activeYear === y.id ? y.color : "var(--text-muted)",
                fontWeight: 600, fontSize: 13, cursor: "pointer",
              }}>{y.short}</button>
            ))}
          </div>
        </div>
      )}

      {activeProgramme === "checkpoint" && (
        <div className="fade-up" style={{ marginBottom: 20, display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Stage</label>
            <div style={{ display: "flex", gap: 8 }}>
              {CHECKPOINT_STAGES.map((s) => (
                <button key={s.id} onClick={() => setActiveStage(s.id)} style={{
                  padding: "8px 14px", borderRadius: 8, border: `1px solid ${activeStage === s.id ? s.color : "var(--border)"}`,
                  background: activeStage === s.id ? `${s.color}1a` : "var(--surface)", color: activeStage === s.id ? s.color : "var(--text-muted)",
                  fontWeight: 600, fontSize: 13, cursor: "pointer",
                }}>{s.shortName}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Subject</label>
            <div style={{ display: "flex", gap: 8 }}>
              {CHECKPOINT_SUBJECTS.map((s) => (
                <button key={s.id} onClick={() => setActiveCpSubject(s.id)} style={{
                  padding: "8px 14px", borderRadius: 8, border: `1px solid ${activeCpSubject === s.id ? s.color : "var(--border)"}`,
                  background: activeCpSubject === s.id ? `${s.color}1a` : "var(--surface)", color: activeCpSubject === s.id ? s.color : "var(--text-muted)",
                  fontWeight: 600, fontSize: 13, cursor: "pointer",
                }}>{s.name}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeProgramme === "igcse" && (
        <div className="fade-up" style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Subject</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(profile?.igcse_subjects ?? ["maths_core", "english"]).map((sid) => {
              const subj = getIgcseSubject(sid);
              if (!subj) return null;
              return (
                <button key={sid} onClick={() => setActiveIgcseSubject(sid)} style={{
                  padding: "8px 14px", borderRadius: 8, border: `1px solid ${activeIgcseSubject === sid ? subj.color : "var(--border)"}`,
                  background: activeIgcseSubject === sid ? `${subj.color}1a` : "var(--surface)", color: activeIgcseSubject === sid ? subj.color : "var(--text-muted)",
                  fontWeight: 600, fontSize: 13, cursor: "pointer",
                }}>{subj.name}</button>
              );
            })}
          </div>
        </div>
      )}

      {/* Overall progress */}
      <div className="card fade-up" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>Course progress</div>
            <div className="text-muted" style={{ fontSize: 14 }}>{completedCount} of {steps.length} topics completed</div>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "Lexend", color: allComplete ? "var(--success)" : "var(--primary-light)" }}>{overallPct}%</div>
        </div>
        <div style={{ height: 14, borderRadius: 999, background: "var(--bg-soft)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${overallPct}%`, background: allComplete ? "linear-gradient(90deg, var(--success), var(--gold))" : "linear-gradient(90deg, var(--primary), var(--secondary))", borderRadius: 999, transition: "width 0.8s ease" }} />
        </div>
        {allComplete && (
          <div className="pop" style={{ marginTop: 16, padding: "14px 18px", borderRadius: 12, background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)", display: "flex", alignItems: "center", gap: 10 }}>
            <Trophy size={20} style={{ color: "var(--success)" }} />
            <div>
              <div style={{ fontWeight: 700, color: "var(--success)" }}>Course complete! Well done!</div>
              <Link to="/certificates" style={{ fontSize: 14, color: "var(--primary-light)", fontWeight: 600 }}>View your certificate <ArrowRight size={14} style={{ display: "inline" }} /></Link>
            </div>
          </div>
        )}
        {!allComplete && nextStep && (
          <Link to={nextStep.quizLink} className="btn btn-primary" style={{ marginTop: 16, display: "inline-flex" }}>
            <Sparkles size={16} /> Continue: {nextStep.title} <ArrowRight size={16} />
          </Link>
        )}
      </div>

      {/* Pathway steps */}
      {loading ? (
        <div className="spinner" style={{ margin: "40px auto" }} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {steps.map((step, i) => {
            const prog = progress[step.topicId];
            const isComplete = prog?.completed;
            const isLocked = i > 0 && !progress[steps[i - 1].topicId]?.completed && !isComplete;
            const isFirst = i === 0;
            const isNext = !isComplete && !isLocked && (isFirst || progress[steps[i - 1].topicId]?.completed);

            return (
              <div
                key={step.id}
                className="card fade-up"
                style={{
                  display: "flex", alignItems: "center", gap: 16, padding: 20,
                  opacity: isLocked ? 0.5 : 1,
                  borderLeft: `4px solid ${isComplete ? "var(--success)" : isNext ? step.color : "var(--border)"}`,
                  animationDelay: `${i * 40}ms`,
                }}
              >
                {/* Step number / status */}
                <div style={{ flexShrink: 0 }}>
                  {isComplete ? (
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(52,211,153,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <CheckCircle2 size={22} style={{ color: "var(--success)" }} />
                    </div>
                  ) : isLocked ? (
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--bg-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Lock size={18} style={{ color: "var(--text-dim)" }} />
                    </div>
                  ) : isNext ? (
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: `${step.color}1f`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Target size={20} style={{ color: step.color }} />
                    </div>
                  ) : (
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--bg-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Circle size={18} style={{ color: "var(--text-dim)" }} />
                    </div>
                  )}
                </div>

                {/* Step info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <span className="text-muted" style={{ fontSize: 12, fontWeight: 600 }}>Step {i + 1}</span>
                    {isComplete && <span className="badge" style={{ background: "rgba(52,211,153,0.12)", color: "var(--success)", fontSize: 11 }}>{prog.best_score}%</span>}
                    {isNext && <span className="badge" style={{ background: `${step.color}1a`, color: step.color, fontSize: 11 }}>Next up</span>}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{step.title}</div>
                  <div className="text-muted" style={{ fontSize: 13 }}>{step.subtitle}</div>
                </div>

                {/* Action */}
                {!isLocked && (
                  <Link to={step.quizLink} className="btn btn-ghost" style={{ flexShrink: 0, whiteSpace: "nowrap" }}>
                    {isComplete ? "Redo" : "Start"} <ChevronRight size={16} />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function buildPathway(programme: Programme, stage: string, cpSubject: CheckpointSubject, igcseSubject: string, activeYear?: YearId): PathwayStep[] {
  if (programme === "primary") {
    const yrId = activeYear ?? "year3";
    const topics = TOPICS_BY_YEAR[yrId];
    const yrInfo = getYear(yrId);
    return topics.map((t) => ({
      id: t.id,
      title: `${yrInfo.name}: ${t.name}`,
      subtitle: `${yrInfo.ageRange} • ${t.description}`,
      topicId: t.id,
      quizLink: `/quiz/${yrId}/${t.id}`,
      color: yrInfo.color,
    }));
  }
  if (programme === "checkpoint") {
    const topics = getCheckpointTopics(stage as CheckpointStage, cpSubject);
    const stageInfo = CHECKPOINT_STAGES.find((s) => s.id === stage);
    const subjInfo = CHECKPOINT_SUBJECTS.find((s) => s.id === cpSubject);
    return topics.map((t) => ({
      id: t.id,
      title: t.name,
      subtitle: `${stageInfo?.shortName} ${subjInfo?.name} • ${t.description}`,
      topicId: t.id,
      quizLink: `/quiz/checkpoint/${stage}/${cpSubject}/${t.id}`,
      color: subjInfo?.color ?? "#a855f7",
    }));
  }
  if (programme === "igcse") {
    const subj = getIgcseSubject(igcseSubject as any);
    if (!subj) return [];
    return subj.topics.map((t) => ({
      id: t.id,
      title: t.name,
      subtitle: `IGCSE ${subj.name} • ${t.description}`,
      topicId: t.id,
      quizLink: `/quiz/igcse/${subj.id}/${t.id}`,
      color: subj.color,
    }));
  }
  return [];
}
