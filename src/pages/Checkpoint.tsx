import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import {
  CHECKPOINT_STAGES, CHECKPOINT_SUBJECTS, getCheckpointTopics,
  type CheckpointStage, type CheckpointSubject,
} from "../lib/checkpointData";
import { Award, ArrowRight, Star, BookOpen, FlaskConical, Sigma, CheckCircle2 } from "lucide-react";

const SUBJECT_ICONS: Record<string, any> = { Sigma, FlaskConical };

export default function Checkpoint() {
  const { profile, setProgramme } = useAuth();
  const [stage, setStage] = useState<CheckpointStage>(
    (profile?.checkpoint_stage as CheckpointStage) ?? "stage6",
  );
  const [subject, setSubject] = useState<CheckpointSubject>("maths");

  const stageInfo = CHECKPOINT_STAGES.find((s) => s.id === stage)!;
  const topics = getCheckpointTopics(stage, subject);
  const subjInfo = CHECKPOINT_SUBJECTS.find((s) => s.id === subject)!;

  const onSelectStage = (s: CheckpointStage) => {
    setStage(s);
    setProgramme("checkpoint", s, profile?.igcse_subjects ?? []);
  };

  const SubjIcon = SUBJECT_ICONS[subjInfo.icon] ?? BookOpen;

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <Award size={26} className="text-gold" />
          <h1 style={{ fontSize: "clamp(24px, 4vw, 32px)", margin: 0 }}>Cambridge Checkpoint</h1>
        </div>
        <p className="text-muted" style={{ fontSize: 16, maxWidth: 620 }}>
          Prepare for your Cambridge Primary (Stage 6) or Lower Secondary (Stage 9) Checkpoint exams. Study Maths and Science with past-paper style questions.
        </p>
      </div>

      {/* Stage picker */}
      <div className="fade-up" style={{ marginBottom: 22 }}>
        <h3 style={{ fontSize: 16, marginBottom: 10, color: "var(--text-muted)" }}>1. Pick your stage</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          {CHECKPOINT_STAGES.map((s) => {
            const sel = stage === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onSelectStage(s.id)}
                className="card card-hover"
                style={{
                  textAlign: "left",
                  padding: 18,
                  cursor: "pointer",
                  border: `1px solid ${sel ? s.color : "var(--border)"}`,
                  background: sel ? `${s.color}14` : "var(--surface)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 17, color: sel ? s.color : "var(--text)" }}>{s.name}</span>
                  {sel && <Star size={16} style={{ color: s.color, fill: s.color }} />}
                </div>
                <div className="text-muted" style={{ fontSize: 12, marginBottom: 8 }}>{s.year} • {s.shortName}</div>
                <p className="text-muted" style={{ fontSize: 13 }}>{s.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subject picker */}
      <div className="fade-up" style={{ marginBottom: 22 }}>
        <h3 style={{ fontSize: 16, marginBottom: 10, color: "var(--text-muted)" }}>2. Pick a subject</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {CHECKPOINT_SUBJECTS.map((s) => {
            const sel = subject === s.id;
            const Icon = SUBJECT_ICONS[s.icon] ?? BookOpen;
            return (
              <button
                key={s.id}
                onClick={() => setSubject(s.id)}
                className="card card-hover"
                style={{
                  textAlign: "left",
                  padding: 18,
                  cursor: "pointer",
                  border: `1px solid ${sel ? s.color : "var(--border)"}`,
                  background: sel ? `${s.color}14` : "var(--surface)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <Icon size={20} style={{ color: s.color }} />
                  <span style={{ fontWeight: 700, fontSize: 17, color: sel ? s.color : "var(--text)" }}>{s.name}</span>
                </div>
                <p className="text-muted" style={{ fontSize: 13 }}>{s.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Topics */}
      <div className="fade-up" style={{ marginBottom: 18 }}>
        <h3 style={{ fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
          <SubjIcon size={20} style={{ color: subjInfo.color }} />
          {stageInfo.name} — {subjInfo.name} topics
        </h3>
        <p className="text-muted" style={{ fontSize: 14 }}>{stageInfo.description}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
        {topics.map((t, i) => {
          const pastCount = t.questions.filter((q) => q.pastPaper).length;
          return (
            <Link
              key={t.id}
              to={`/quiz/checkpoint/${stage}/${subject}/${t.id}`}
              className="card card-hover fade-up"
              style={{ padding: 20, textDecoration: "none", animationDelay: `${i * 50}ms` }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <h3 style={{ fontSize: 17 }}>{t.name}</h3>
                <ArrowRight size={18} style={{ color: "var(--primary-light)" }} />
              </div>
              <p className="text-muted" style={{ fontSize: 14, marginBottom: 12 }}>{t.description}</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <div className="badge" style={{ background: "rgba(168,85,247,0.12)", color: "var(--primary-light)" }}>
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
    </div>
  );
}
