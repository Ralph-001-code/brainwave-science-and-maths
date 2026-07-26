import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { supabase } from "../lib/supabase";
import {
  TOPICS_BY_YEAR, YEARS, getYear, getTopicById, getRankForXp, motivate, buildTopicStudy,
  type YearId, type Topic, type Question,
} from "../lib/quizData";
import { getCheckpointTopics, type CheckpointStage, type CheckpointSubject } from "../lib/checkpointData";
import { getIgcseSubject } from "../lib/igcseData";
import { CHECKPOINT_STAGES, CHECKPOINT_SUBJECTS } from "../lib/checkpointData";
import { IGCSE_SUBJECTS } from "../lib/igcseData";
import {
  Trophy, CheckCircle2, XCircle, ArrowRight, RotateCcw, Zap, Home,
  GraduationCap, Sparkles, Flame, Clock, BookOpen, Timer, PenLine, Lightbulb, Award,
} from "lucide-react";

type Phase = "study" | "playing" | "finished";
type RouteKind = "primary" | "checkpoint" | "igcse";

const DEFAULT_TIME = 30;
const TIMER_OPTIONS = [15, 20, 30, 45, 60, 90];

export default function Quiz() {
  const params = useParams();
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();

  const kind: RouteKind =
    params.yearId ? "primary" :
    params.stage ? "checkpoint" :
    "igcse";

  const yearId = params.yearId as YearId | undefined;
  const stage = params.stage as CheckpointStage | undefined;
  const cpSubject = params.subject as CheckpointSubject | undefined;
  const igcseSubjectId = params.igcseSubject as any;
  const topicId = params.topicId!;

  const resolved = useMemo(() => {
    if (kind === "primary" && yearId) {
      const yr = getYear(yearId);
      const topic = getTopicById(topicId);
      if (!yr || !topic) return null;
      return {
        topic,
        headerLabel: `${yr.name} • ${topic.name}`,
        headerColor: yr.color,
        programme: "primary" as const,
        subject: "maths",
        backLink: "/years",
        backLabel: "All year topics",
      };
    }
    if (kind === "checkpoint" && stage && cpSubject) {
      const topics = getCheckpointTopics(stage, cpSubject);
      const topic = topics.find((t) => t.id === topicId);
      if (!topic) return null;
      const stageNames: Record<string, string> = { stage6: "Primary Checkpoint", stage9: "Lower Secondary Checkpoint" };
      const subjNames: Record<string, string> = { maths: "Maths", science: "Science" };
      return {
        topic,
        headerLabel: `${stageNames[stage]} • ${subjNames[cpSubject]} • ${topic.name}`,
        headerColor: stage === "stage6" ? "#f5c842" : "#22d3ee",
        programme: "checkpoint" as const,
        subject: cpSubject,
        backLink: "/checkpoint",
        backLabel: "All Checkpoint topics",
      };
    }
    if (kind === "igcse" && igcseSubjectId) {
      const subj = getIgcseSubject(igcseSubjectId);
      const topic = subj?.topics.find((t) => t.id === topicId);
      if (!subj || !topic) return null;
      return {
        topic,
        headerLabel: `IGCSE ${subj.name} • ${topic.name}`,
        headerColor: subj.color,
        programme: "igcse" as const,
        subject: igcseSubjectId,
        backLink: "/igcse",
        backLabel: "All IGCSE subjects",
      };
    }
    return null;
  }, [kind, yearId, stage, cpSubject, igcseSubjectId, topicId]);

  const [phase, setPhase] = useState<Phase>("study");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [writtenAnswer, setWrittenAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ correct: boolean; chosen: number | string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [motivation, setMotivation] = useState<string | null>(null);

  // Timer
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [timedOut, setTimedOut] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [totalTimeUsed, setTotalTimeUsed] = useState(0);
  const questionStartRef = useRef<number>(Date.now());

  // Timer settings (user-controlled, persisted to profile)
  const [timerEnabled, setTimerEnabled] = useState(profile?.timer_enabled ?? true);
  const [timerDuration, setTimerDuration] = useState(profile?.timer_duration ?? DEFAULT_TIME);

  const updateTimerEnabled = (enabled: boolean) => {
    setTimerEnabled(enabled);
    if (user) supabase.from("profiles").update({ timer_enabled: enabled }).eq("id", user.id).then(() => refreshProfile());
  };
  const updateTimerDuration = (duration: number) => {
    setTimerDuration(duration);
    if (user) supabase.from("profiles").update({ timer_duration: duration }).eq("id", user.id).then(() => refreshProfile());
  };

  // Build study content (theory, examples, exam tips)
  const study = useMemo(() => resolved ? buildTopicStudy(resolved.topic) : null, [resolved]);

  const questions = useMemo(() => {
    if (!resolved) return [];
    return shuffle(resolved.topic.questions).slice(0, 10);
  }, [resolved]);

  useEffect(() => {
    if (!resolved) {
      navigate(kind === "primary" ? "/years" : kind === "checkpoint" ? "/checkpoint" : "/igcse");
    }
  }, [resolved, kind, navigate]);

  const q = questions[current];
  const qTimeLimit = timerEnabled ? (q?.timeLimit ?? resolved?.topic.defaultTimeLimit ?? timerDuration) : 9999;

  // Start the timer when a new question appears
  useEffect(() => {
    if (phase !== "playing" || !q) return;
    setTimeLeft(qTimeLimit);
    setTimedOut(false);
    questionStartRef.current = Date.now();
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setTimedOut(true);
          setRevealed(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, current, qTimeLimit, q]);

  if (!resolved) return null;

  const progress = q ? (current / questions.length) * 100 : 100;
  const timePct = Math.max(0, Math.min(100, (timeLeft / qTimeLimit) * 100));

  const checkWritten = (): boolean => {
    if (!q.acceptAnswers || q.acceptAnswers.length === 0) return false;
    const norm = writtenAnswer.trim().toLowerCase().replace(/\s+/g, " ");
    return q.acceptAnswers.some((a) => a.trim().toLowerCase().replace(/\s+/g, " ") === norm);
  };

  const confirm = () => {
    if (revealed) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const elapsed = Math.round((Date.now() - questionStartRef.current) / 1000);
    setTotalTimeUsed((t) => t + elapsed);

    let correct: boolean;
    let chosen: number | string;
    if (q.type === "written") {
      correct = checkWritten();
      chosen = writtenAnswer;
    } else {
      if (selected === null && !timedOut) return;
      correct = selected === (q.answer ?? 0);
      chosen = selected ?? -1;
    }

    setWasCorrect(correct);
    setRevealed(true);
    setAnswers((a) => [...a, { correct, chosen }]);
    if (correct) setScore((s) => s + 1);
    setMotivation(motivate(correct, current, questions.length));
  };

  const nextQuestion = async () => {
    setMotivation(null);
    if (current + 1 >= questions.length) {
      setPhase("finished");
      await saveAttempt(score);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setWrittenAnswer("");
      setRevealed(false);
      setWasCorrect(false);
    }
  };

  const saveAttempt = async (finalScore: number) => {
    if (!user) return;
    setSaving(true);
    const pct = Math.round((finalScore / questions.length) * 100);
    const { error } = await supabase.from("quiz_attempts").insert({
      user_id: user.id,
      topic: resolved.topic.id,
      year_id: (yearId ?? "year6") as string,
      score: finalScore,
      total_questions: questions.length,
      subject: resolved.subject,
      programme: resolved.programme,
    });
    if (error) console.error("saveAttempt", error);

    // Record pathway progress
    const stageVal = kind === "checkpoint" ? stage : kind === "igcse" ? resolved.subject : (yearId ?? "year6");
    const { data: existing } = await supabase
      .from("pathway_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("programme", resolved.programme)
      .eq("stage", stageVal)
      .eq("topic_id", resolved.topic.id)
      .maybeSingle();

    const completed = pct >= 70;
    if (existing) {
      const newBest = Math.max(existing.best_score, pct);
      await supabase
        .from("pathway_progress")
        .update({ best_score: newBest, completed: existing.completed || completed, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
    } else {
      await supabase.from("pathway_progress").insert({
        user_id: user.id,
        programme: resolved.programme,
        stage: stageVal,
        topic_id: resolved.topic.id,
        best_score: pct,
        completed,
      });
    }

    // Check if all topics in this pathway are complete → issue certificate
    await maybeIssueCertificate(user.id, resolved.programme, stageVal, resolved.subject);

    const xpEarned = finalScore * 10;
    const today = new Date().toISOString().slice(0, 10);
    const newStreak = bumpStreak(profile?.last_active, profile?.streak ?? 0, today);
    const newXp = (profile?.xp ?? 0) + xpEarned;

    const { error: pErr } = await supabase
      .from("profiles")
      .update({ xp: newXp, streak: newStreak, last_active: today })
      .eq("id", user.id);
    if (pErr) console.error("update profile", pErr);

    await refreshProfile();
    setSaving(false);
  };

  const startQuiz = () => {
    setPhase("playing");
    setCurrent(0);
    setSelected(null);
    setWrittenAnswer("");
    setRevealed(false);
    setScore(0);
    setAnswers([]);
    setMotivation(null);
    setTotalTimeUsed(0);
  };

  const restart = () => {
    setPhase("study");
    setCurrent(0);
    setSelected(null);
    setWrittenAnswer("");
    setRevealed(false);
    setScore(0);
    setAnswers([]);
    setMotivation(null);
    setTotalTimeUsed(0);
  };

  // ===== Study / Theory phase =====
  if (phase === "study") {
    const hasTheory = !!study?.theory && !!resolved.topic.theory;
    const pastCount = questions.filter((qq) => qq.pastPaper).length;
    const writtenCount = questions.filter((qq) => qq.type === "written").length;
    const avgTime = Math.round(questions.reduce((s, qq) => s + (qq.timeLimit ?? qTimeLimit), 0) / questions.length);
    return (
      <div className="container" style={{ paddingTop: 32, paddingBottom: 80, maxWidth: 760 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, color: "var(--text-muted)", fontSize: 13, textTransform: "capitalize" }}>
          <GraduationCap size={13} style={{ color: resolved.headerColor }} /> {resolved.headerLabel}
        </div>
        <div className="card fade-up" style={{ padding: 32 }}>
          <h1 style={{ fontSize: 28, marginBottom: 12 }}>{resolved.topic.name}</h1>
          <p className="text-muted" style={{ fontSize: 16, marginBottom: 24 }}>{resolved.topic.description}</p>

          {/* Quick stats */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
            <div className="badge" style={{ background: "rgba(168,85,247,0.12)", color: "var(--primary-light)" }}>
              <Zap size={13} /> {questions.length} questions
            </div>
            {pastCount > 0 && (
              <div className="badge" style={{ background: "rgba(245,200,66,0.14)", color: "var(--gold)" }}>
                <BookOpen size={13} /> {pastCount} past paper
              </div>
            )}
            {writtenCount > 0 && (
              <div className="badge" style={{ background: "rgba(52,211,153,0.14)", color: "var(--success)" }}>
                <PenLine size={13} /> {writtenCount} written
              </div>
            )}
            <div className="badge" style={{ background: "rgba(248,113,113,0.12)", color: "var(--error)" }}>
              <Timer size={13} /> {timerEnabled ? `${avgTime}s avg per question` : "No timer"}
            </div>
          </div>

          {/* Study Notes */}
          {hasTheory && (
            <div style={{ background: "var(--bg-soft)", border: "1px solid var(--border)", borderRadius: 14, padding: 22, marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <BookOpen size={18} className="text-gold" /> Study Notes
              </h3>
              <div style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text)", whiteSpace: "pre-line" }}>
                {study?.theory}
              </div>
            </div>
          )}

          {/* Worked Examples */}
          {study && study.examples.length > 0 && (
            <div style={{ background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.25)", borderRadius: 14, padding: 22, marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <Lightbulb size={18} style={{ color: "var(--secondary)" }} /> Worked Examples
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {study.examples.map((ex, i) => (
                  <div key={i} style={{ padding: 16, borderRadius: 10, background: "var(--surface)", border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                      <span style={{ width: 24, height: 24, borderRadius: 6, background: "rgba(96,165,250,0.15)", color: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                      <span style={{ fontWeight: 600, fontSize: 15 }}>{ex.question}</span>
                    </div>
                    <div style={{ marginLeft: 34, fontSize: 14 }}>
                      <div style={{ marginBottom: 4 }}><span style={{ color: "var(--text-muted)" }}>Answer: </span><span style={{ color: "var(--success)", fontWeight: 700 }}>{ex.solution}</span></div>
                      {ex.steps && <div className="text-muted" style={{ fontSize: 13, marginTop: 4 }}><span style={{ color: "var(--primary-light)", fontWeight: 600 }}>Why: </span>{ex.steps}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exam Tips */}
          {study && study.examTips.length > 0 && (
            <div style={{ background: "rgba(245,200,66,0.08)", border: "1px solid rgba(245,200,66,0.25)", borderRadius: 14, padding: 22, marginBottom: 24 }}>
              <h3 style={{ fontSize: 17, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <Award size={18} className="text-gold" /> Exam Tips
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {study.examTips.map((tip, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, fontSize: 14, lineHeight: 1.5 }}>
                    <CheckCircle2 size={16} style={{ color: "var(--gold)", flexShrink: 0, marginTop: 3 }} />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timer Settings */}
          <div style={{ background: "var(--bg-soft)", border: "1px solid var(--border)", borderRadius: 14, padding: 22, marginBottom: 28 }}>
            <h3 style={{ fontSize: 17, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <Timer size={18} style={{ color: "var(--primary-light)" }} /> Timer Settings
            </h3>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>Enable question timer</div>
                <div className="text-muted" style={{ fontSize: 13 }}>Turn off if you prefer to answer at your own pace.</div>
              </div>
              <button
                onClick={() => updateTimerEnabled(!timerEnabled)}
                style={{
                  width: 52, height: 28, borderRadius: 999, border: "none", cursor: "pointer", position: "relative",
                  background: timerEnabled ? "var(--success)" : "var(--border)", transition: "background 0.2s",
                }}
                aria-label={timerEnabled ? "Timer on" : "Timer off"}
              >
                <span style={{ position: "absolute", top: 3, left: timerEnabled ? 27 : 3, width: 22, height: 22, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
              </button>
            </div>
            {timerEnabled && (
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Time per question: <span style={{ color: "var(--primary-light)" }}>{timerDuration}s</span></div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {TIMER_OPTIONS.map((t) => (
                    <button
                      key={t}
                      onClick={() => updateTimerDuration(t)}
                      style={{
                        padding: "8px 16px", borderRadius: 8, border: `1px solid ${timerDuration === t ? "var(--primary)" : "var(--border)"}`,
                        background: timerDuration === t ? "rgba(168,85,247,0.12)" : "var(--surface)",
                        color: timerDuration === t ? "var(--primary-light)" : "var(--text-muted)",
                        fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.18s",
                      }}
                    >
                      {t}s
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button className="btn btn-primary btn-lg" onClick={startQuiz} style={{ width: "100%" }}>
            Start quiz <ArrowRight size={18} />
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link to={resolved.backLink} className="btn btn-ghost"><Home size={16} /> {resolved.backLabel}</Link>
        </div>
      </div>
    );
  }

  // ===== Finished screen =====
  if (phase === "finished") {
    const pct = Math.round((score / questions.length) * 100);
    const xpEarned = score * 10;
    const newRank = getRankForXp(profile?.xp ?? 0);
    const avgTime = questions.length > 0 ? Math.round(totalTimeUsed / questions.length) : 0;
    return (
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 680 }}>
        <div className="card fade-up" style={{ textAlign: "center", padding: 40 }}>
          <div className="pop" style={{ width: 80, height: 80, borderRadius: 24, background: pct >= 70 ? "rgba(52,211,153,0.15)" : pct >= 40 ? "rgba(251,191,36,0.15)" : "rgba(248,113,113,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Trophy size={40} style={{ color: pct >= 70 ? "var(--success)" : pct >= 40 ? "var(--warning)" : "var(--error)" }} />
          </div>
          <h1 style={{ fontSize: 30, marginBottom: 8 }}>Quiz complete!</h1>
          <p className="text-muted" style={{ fontSize: 16, marginBottom: 24 }}>{resolved.headerLabel}</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12, marginBottom: 28 }}>
            <div className="card" style={{ padding: 18 }}>
              <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "Lexend", color: "var(--primary-light)" }}>{score}/{questions.length}</div>
              <div className="text-muted" style={{ fontSize: 12 }}>Correct</div>
            </div>
            <div className="card" style={{ padding: 18 }}>
              <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "Lexend", color: "var(--success)" }}>{pct}%</div>
              <div className="text-muted" style={{ fontSize: 12 }}>Score</div>
            </div>
            <div className="card" style={{ padding: 18 }}>
              <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "Lexend", color: "var(--gold)" }}>+{xpEarned}</div>
              <div className="text-muted" style={{ fontSize: 12 }}>XP earned</div>
            </div>
            <div className="card" style={{ padding: 18 }}>
              <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "Lexend", color: "var(--secondary)" }}>{avgTime}s</div>
              <div className="text-muted" style={{ fontSize: 12 }}>Avg time / question</div>
            </div>
          </div>

          <p style={{ fontSize: 16, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Sparkles size={18} className="text-gold" />
            {pct >= 80 ? "Outstanding! You're a true Brainwave champion!" :
             pct >= 60 ? "Great work! You're getting stronger every quiz." :
             pct >= 40 ? "Good effort — keep practising and you'll master this!" :
             "Don't give up! Every question makes you smarter. Try again!"}
          </p>
          <p className="text-muted" style={{ fontSize: 13, marginBottom: 24 }}>
            You're now a <span style={{ color: "var(--primary-light)", fontWeight: 600 }}>{newRank.name}</span> with {profile?.xp ?? 0} XP.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={restart} className="btn btn-ghost"><RotateCcw size={16} /> Try again</button>
            <Link to={resolved.backLink} className="btn btn-ghost"><Home size={16} /> {resolved.backLabel}</Link>
            <Link to="/dashboard" className="btn btn-primary">Dashboard <ArrowRight size={16} /></Link>
          </div>
        </div>

        {/* Review */}
        <div className="card fade-up" style={{ marginTop: 20 }}>
          <h3 style={{ fontSize: 18, marginBottom: 16 }}>Review your answers</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {questions.map((qq, i) => {
              const a = answers[i];
              return (
                <div key={i} style={{ padding: 14, borderRadius: 10, background: "var(--bg-soft)", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
                    {a?.correct ? <CheckCircle2 size={18} style={{ color: "var(--success)", flexShrink: 0, marginTop: 2 }} /> : <XCircle size={18} style={{ color: "var(--error)", flexShrink: 0, marginTop: 2 }} />}
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{qq.question}</span>
                  </div>
                  {!a?.correct && (
                    <div style={{ fontSize: 13, color: "var(--text-muted)", marginLeft: 28 }}>
                      {qq.type === "written" ? (
                        <>Correct answer: <span style={{ color: "var(--success)", fontWeight: 600 }}>{qq.acceptAnswers?.[0]}</span></>
                      ) : (
                        <>Correct answer: <span style={{ color: "var(--success)", fontWeight: 600 }}>{(qq.options ?? [])[qq.answer ?? 0]}</span></>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ===== Playing screen =====
  const isWritten = q.type === "written";

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 80, maxWidth: 760 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
        <div>
          <div className="text-muted" style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6, textTransform: "capitalize" }}>
            <GraduationCap size={13} style={{ color: resolved.headerColor }} /> {resolved.headerLabel}
            {q.cambridge && <span className="badge" style={{ background: "rgba(245,200,66,0.14)", color: "var(--gold)", fontSize: 10, padding: "2px 7px", textTransform: "none" }}>Cambridge</span>}
            {q.pastPaper && <span className="badge" style={{ background: "rgba(217,70,239,0.14)", color: "var(--secondary)", fontSize: 10, padding: "2px 7px", textTransform: "none" }}>Past paper</span>}
            {isWritten && <span className="badge" style={{ background: "rgba(52,211,153,0.14)", color: "var(--success)", fontSize: 10, padding: "2px 7px", textTransform: "none" }}>Written</span>}
          </div>
          <h1 style={{ fontSize: 22 }}>Question {current + 1} of {questions.length}</h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div className="badge" style={{ background: "rgba(245,200,66,0.15)", color: "var(--gold)" }}>
            <Zap size={14} /> Score: {score}
          </div>
          <div className="badge" style={{
            background: timeLeft <= 5 ? "rgba(248,113,113,0.15)" : "rgba(96,165,250,0.12)",
            color: timeLeft <= 5 ? "var(--error)" : "var(--secondary)",
            fontFamily: "Lexend",
            fontWeight: 700,
          }}>
            <Clock size={14} /> {timerEnabled ? `${timeLeft}s` : "No timer"}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 8, borderRadius: 999, background: "var(--bg-soft)", overflow: "hidden", marginBottom: 8 }}>
        <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, var(--primary), var(--gold))", borderRadius: 999, transition: "width 0.4s ease" }} />
      </div>
      {/* Timer bar */}
      {timerEnabled && (
        <div style={{ height: 4, borderRadius: 999, background: "var(--bg-soft)", overflow: "hidden", marginBottom: 28 }}>
          <div style={{
            height: "100%", width: `${timePct}%`,
            background: timeLeft <= 5 ? "var(--error)" : timeLeft <= 10 ? "var(--warning)" : "var(--secondary)",
            borderRadius: 999, transition: "width 1s linear",
          }} />
        </div>
      )}
      {!timerEnabled && <div style={{ marginBottom: 20 }} />}

      {/* Question */}
      <div className="card fade-up" key={current}>
        <h2 style={{ fontSize: 22, marginBottom: 22, lineHeight: 1.35 }}>{q.question}</h2>

        {isWritten ? (
          /* Written answer input */
          <div>
            <input
              className="input"
              value={writtenAnswer}
              onChange={(e) => setWrittenAnswer(e.target.value)}
              placeholder="Type your answer here..."
              disabled={revealed}
              style={{ fontSize: 17, padding: "14px 18px" }}
              onKeyDown={(e) => { if (e.key === "Enter" && !revealed && writtenAnswer.trim()) confirm(); }}
            />
            <p className="text-muted" style={{ fontSize: 12, marginTop: 8 }}>Type your answer and press Enter or click Confirm. Spacing doesn't matter.</p>
          </div>
        ) : (
          /* Multiple choice */
          <div style={{ display: "grid", gap: 10 }}>
            {(q.options ?? []).map((opt, idx) => {
              const isSel = selected === idx;
              const isCorrect = idx === q.answer;
              let style: React.CSSProperties = {
                padding: "14px 18px", borderRadius: 12, border: "1px solid var(--border)",
                background: "var(--bg-soft)", textAlign: "left", fontSize: 16,
                transition: "all 0.18s ease", display: "flex", alignItems: "center", gap: 12,
              };
              if (!revealed && isSel) style = { ...style, borderColor: "var(--primary)", background: "rgba(168,85,247,0.12)" };
              else if (!revealed) style = { ...style, cursor: "pointer" };
              if (revealed && isCorrect) style = { ...style, borderColor: "var(--success)", background: "rgba(52,211,153,0.12)" };
              else if (revealed && isSel && !isCorrect) style = { ...style, borderColor: "var(--error)", background: "rgba(248,113,113,0.12)" };
              else if (revealed) style = { ...style, opacity: 0.6 };
              return (
                <button key={idx} style={style} onClick={() => choose(idx)} disabled={revealed}>
                  <span style={{ width: 26, height: 26, borderRadius: 8, background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                  {revealed && isCorrect && <CheckCircle2 size={18} style={{ color: "var(--success)", marginLeft: "auto" }} />}
                  {revealed && isSel && !isCorrect && <XCircle size={18} style={{ color: "var(--error)", marginLeft: "auto" }} />}
                </button>
              );
            })}
          </div>
        )}

        {revealed && (
          <>
            {/* Motivation */}
            <div className="pop" style={{ marginTop: 16, padding: "12px 16px", borderRadius: 12, background: wasCorrect ? "rgba(52,211,153,0.12)" : timedOut ? "rgba(248,113,113,0.12)" : "rgba(251,191,36,0.12)", border: `1px solid ${wasCorrect ? "rgba(52,211,153,0.3)" : timedOut ? "rgba(248,113,113,0.3)" : "rgba(251,191,36,0.3)"}`, display: "flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 600 }}>
              {wasCorrect ? <Sparkles size={18} style={{ color: "var(--success)" }} /> : timedOut ? <Timer size={18} style={{ color: "var(--error)" }} /> : <Flame size={18} style={{ color: "var(--warning)" }} />}
              <span style={{ color: wasCorrect ? "var(--success)" : timedOut ? "var(--error)" : "var(--warning)" }}>
                {timedOut && !wasCorrect ? "Time's up! Don't worry — read the explanation and keep going!" : motivation}
              </span>
            </div>
            {/* Explanation */}
            <div className="pop" style={{ marginTop: 12, padding: 14, borderRadius: 10, background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)", fontSize: 14 }}>
              <span style={{ fontWeight: 600, color: "var(--primary-light)" }}>Explanation: </span>
              <span className="text-muted">{q.explanation}</span>
            </div>
          </>
        )}

        <div style={{ marginTop: 22 }}>
          {!revealed ? (
            <button className="btn btn-primary btn-lg" onClick={confirm} disabled={isWritten ? !writtenAnswer.trim() : selected === null} style={{ width: "100%" }}>
              Confirm answer
            </button>
          ) : (
            <button className="btn btn-primary btn-lg" onClick={nextQuestion} disabled={saving} style={{ width: "100%" }}>
              {saving ? <span className="spinner" /> : (<>{current + 1 >= questions.length ? "Finish quiz" : "Next question"} <ArrowRight size={18} /></>)}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  function choose(idx: number) {
    if (revealed) return;
    setSelected(idx);
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function bumpStreak(last: string | null | undefined, streak: number, today: string): number {
  if (!last) return 1;
  const diff = Math.round((new Date(today).getTime() - new Date(last).getTime()) / 86400000);
  if (diff === 0) return Math.max(streak, 1);
  if (diff === 1) return streak + 1;
  return 1;
}

async function maybeIssueCertificate(userId: string, programme: string, stage: string, subject: string): Promise<void> {
  // Gather all topic IDs for this pathway
  let allTopicIds: string[] = [];
  let certTitle = "";
  if (programme === "checkpoint") {
    const cpStage = stage as CheckpointStage;
    const cpSubj = subject as CheckpointSubject;
    const topics = getCheckpointTopics(cpStage, cpSubj);
    allTopicIds = topics.map((t) => t.id);
    const stageInfo = CHECKPOINT_STAGES.find((s) => s.id === cpStage);
    const subjInfo = CHECKPOINT_SUBJECTS.find((s) => s.id === cpSubj);
    certTitle = `${stageInfo?.name ?? "Checkpoint"} — ${subjInfo?.name ?? "Course"}`;
  } else if (programme === "igcse") {
    const subj = getIgcseSubject(subject as any);
    if (!subj) return;
    allTopicIds = subj.topics.map((t) => t.id);
    certTitle = `IGCSE ${subj.name}`;
  } else {
    // Primary pathway: certificate per year
    const yrId = stage as YearId;
    const topics = TOPICS_BY_YEAR[yrId];
    if (!topics || topics.length === 0) return;
    allTopicIds = topics.map((t) => t.id);
    const yrInfo = YEARS.find((y) => y.id === yrId);
    certTitle = `${yrInfo?.name ?? "Year"} Maths Course`;
  }

  if (allTopicIds.length === 0) return;

  // Check all are completed
  const { data: progRows } = await supabase
    .from("pathway_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("programme", programme)
    .eq("stage", stage);

  const completedMap: Record<string, boolean> = {};
  (progRows as any[] | null)?.forEach((r) => {
    if (r.completed) completedMap[r.topic_id] = true;
  });

  const allComplete = allTopicIds.every((id) => completedMap[id]);
  if (!allComplete) return;

  // Check if certificate already issued
  const { data: existing } = await supabase
    .from("certificates")
    .select("id")
    .eq("user_id", userId)
    .eq("programme", programme)
    .eq("stage", stage)
    .maybeSingle();
  if (existing) return; // already issued

  // Calculate average score
  const scores = (progRows as any[] | null)?.map((r) => r.best_score) ?? [];
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length) : 0;

  // Get student name
  const { data: prof } = await supabase
    .from("profiles")
    .select("first_name, last_name, username")
    .eq("id", userId)
    .maybeSingle();
  const studentName = `${prof?.first_name ?? ""} ${prof?.last_name ?? ""}`.trim() || prof?.username || "";

  await supabase.from("certificates").insert({
    user_id: userId,
    programme,
    stage,
    title: certTitle,
    student_name: studentName,
    score: avgScore,
  });
}
