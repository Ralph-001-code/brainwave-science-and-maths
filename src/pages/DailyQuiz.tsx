import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { supabase } from "../lib/supabase";
import {
  TOPICS_BY_YEAR, getYear, getRankForXp,
  type YearId, type Question, type Topic,
} from "../lib/quizData";
import { Calendar, Flame, CheckCircle2, XCircle, ArrowRight, Zap, Trophy } from "lucide-react";

type Phase = "intro" | "playing" | "finished";

function dailySeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type DailyQuestion = Question & { topicName: string };

function buildDailyQuiz(yearId: YearId): DailyQuestion[] {
  const seed = dailySeed();
  const topics: Topic[] = TOPICS_BY_YEAR[yearId];
  const picked = seededShuffle(topics, seed).slice(0, Math.min(5, topics.length));
  const out: DailyQuestion[] = [];
  picked.forEach((t, ti) => {
    const qs = seededShuffle(t.questions, seed + ti + 1).slice(0, 2);
    qs.forEach((q) => out.push({ ...q, topicName: t.name }));
  });
  return seededShuffle(out, seed + 99).slice(0, Math.min(10, out.length));
}

export default function DailyQuiz() {
  const { user, profile, refreshProfile } = useAuth();
  const [phase, setPhase] = useState<Phase>("intro");
  const [todayKey, setTodayKey] = useState("");
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [questions, setQuestions] = useState<DailyQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [saving, setSaving] = useState(false);

  const yearId = (profile?.year_id as YearId) ?? "year1";
  const yr = getYear(yearId);
  const daily = useMemo(() => buildDailyQuiz(yearId), [yearId]);

  useEffect(() => {
    if (!user) return;
    const key = new Date().toISOString().slice(0, 10);
    setTodayKey(key);
    (async () => {
      const { data } = await supabase
        .from("quiz_attempts")
        .select("id")
        .eq("user_id", user.id)
        .eq("topic", "daily")
        .gte("completed_at", `${key}T00:00:00`)
        .lte("completed_at", `${key}T23:59:59`)
        .maybeSingle();
      if (data) setAlreadyDone(true);
    })();
  }, [user]);

  const start = () => {
    setQuestions(daily);
    setPhase("playing");
    setCurrent(0);
    setSelected(null);
    setRevealed(false);
    setScore(0);
  };

  if (phase === "intro") {
    return (
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 620 }}>
        <div className="card fade-up" style={{ textAlign: "center", padding: 44 }}>
          <div style={{ width: 76, height: 76, borderRadius: 22, background: "rgba(245,200,66,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }} className="pulse-glow">
            <Calendar size={38} style={{ color: "var(--gold)" }} />
          </div>
          <h1 style={{ fontSize: 30, marginBottom: 8 }}>Daily Quiz</h1>
          <p className="text-muted" style={{ fontSize: 16, maxWidth: 420, margin: "0 auto 14px" }}>
            A fresh quiz every day from your <span style={{ color: yr.color, fontWeight: 600 }}>{yr.name}</span> topics. Earn double XP and keep your streak alive.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 24, flexWrap: "wrap" }}>
            <div className="badge" style={{ background: "rgba(251,191,36,0.15)", color: "var(--warning)" }}>
              <Flame size={14} /> Streak: {profile?.streak ?? 0}
            </div>
            <div className="badge" style={{ background: "rgba(245,200,66,0.15)", color: "var(--gold)" }}>
              <Zap size={14} /> Double XP today
            </div>
            <div className="badge">{todayKey || "—"}</div>
          </div>

          {alreadyDone ? (
            <div className="pop" style={{ padding: 18, borderRadius: 12, background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", marginBottom: 20 }}>
              <CheckCircle2 size={22} style={{ color: "var(--success)", marginBottom: 6 }} />
              <p style={{ fontWeight: 600, color: "var(--success)", marginBottom: 4 }}>You've done today's quiz!</p>
              <p className="text-muted" style={{ fontSize: 14 }}>Come back tomorrow for a new one, or practice a topic below.</p>
            </div>
          ) : null}

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={start} className="btn btn-gold btn-lg" disabled={alreadyDone}>
              {alreadyDone ? "Already done today" : "Start today's quiz"} <ArrowRight size={18} />
            </button>
            <Link to="/practice" className="btn btn-ghost btn-lg">Practice topics</Link>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "finished") {
    const pct = Math.round((score / questions.length) * 100);
    const xpEarned = score * 20;
    const newRank = getRankForXp(profile?.xp ?? 0);
    return (
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 620 }}>
        <div className="card fade-up" style={{ textAlign: "center", padding: 40 }}>
          <div className="pop" style={{ width: 80, height: 80, borderRadius: 24, background: pct >= 70 ? "rgba(52,211,153,0.15)" : pct >= 40 ? "rgba(251,191,36,0.15)" : "rgba(248,113,113,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
            <Trophy size={40} style={{ color: pct >= 70 ? "var(--success)" : pct >= 40 ? "var(--warning)" : "var(--error)" }} />
          </div>
          <h1 style={{ fontSize: 28, marginBottom: 8 }}>Daily quiz done!</h1>
          <p className="text-muted" style={{ fontSize: 14, marginBottom: 18 }}>You're now a {newRank.name} with {profile?.xp ?? 0} XP.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, margin: "18px 0" }}>
            <div className="card" style={{ padding: 18 }}>
              <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "Lexend", color: "var(--primary-light)" }}>{score}/{questions.length}</div>
              <div className="text-muted" style={{ fontSize: 12 }}>Correct</div>
            </div>
            <div className="card" style={{ padding: 18 }}>
              <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "Lexend", color: "var(--success)" }}>{pct}%</div>
              <div className="text-muted" style={{ fontSize: 12 }}>Score</div>
            </div>
            <div className="card" style={{ padding: 18 }}>
              <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "Lexend", color: "var(--gold)" }}>+{xpEarned}</div>
              <div className="text-muted" style={{ fontSize: 12 }}>XP earned</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/dashboard" className="btn btn-primary">Dashboard <ArrowRight size={16} /></Link>
            <Link to="/practice" className="btn btn-ghost">Practice a topic</Link>
          </div>
        </div>
      </div>
    );
  }

  // PLAYING
  const q = questions[current];
  const progress = (current / questions.length) * 100;

  const confirm = () => {
    if (selected === null || revealed) return;
    if (selected === q.answer) setScore((s) => s + 1);
    setRevealed(true);
  };

  const nextQ = async () => {
    if (current + 1 >= questions.length) {
      setPhase("finished");
      await saveDaily(score);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  const saveDaily = async (finalScore: number) => {
    if (!user) return;
    setSaving(true);
    const xpEarned = finalScore * 20;
    const today = new Date().toISOString().slice(0, 10);
    const newStreak = bumpStreak(profile?.last_active, profile?.streak ?? 0, today);
    const newXp = (profile?.xp ?? 0) + xpEarned;

    await supabase.from("quiz_attempts").insert({
      user_id: user.id,
      topic: "daily",
      year_id: yearId,
      score: finalScore,
      total_questions: questions.length,
    });
    await supabase.from("profiles").update({ xp: newXp, streak: newStreak, last_active: today }).eq("id", user.id);
    await refreshProfile();
    setSaving(false);
  };

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 80, maxWidth: 760 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <div className="text-muted" style={{ fontSize: 13 }}>Daily Quiz • {q.topicName}</div>
          <h1 style={{ fontSize: 22 }}>Question {current + 1} of {questions.length}</h1>
        </div>
        <div className="badge" style={{ background: "rgba(245,200,66,0.15)", color: "var(--gold)" }}>
          <Zap size={14} /> Score: {score}
        </div>
      </div>
      <div style={{ height: 8, borderRadius: 999, background: "var(--bg-soft)", overflow: "hidden", marginBottom: 28 }}>
        <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, var(--gold), var(--warning))", borderRadius: 999, transition: "width 0.4s ease" }} />
      </div>

      <div className="card fade-up" key={current}>
        <h2 style={{ fontSize: 22, marginBottom: 22, lineHeight: 1.35 }}>{q.question}</h2>
        <div style={{ display: "grid", gap: 10 }}>
          {(q.options ?? []).map((opt, idx) => {
            const isSel = selected === idx;
            const isCorrect = idx === (q.answer ?? 0);
            let style: React.CSSProperties = { padding: "14px 18px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg-soft)", textAlign: "left", fontSize: 16, transition: "all 0.18s", display: "flex", alignItems: "center", gap: 12 };
            if (!revealed && isSel) style = { ...style, borderColor: "var(--gold)", background: "rgba(245,200,66,0.12)" };
            if (revealed && isCorrect) style = { ...style, borderColor: "var(--success)", background: "rgba(52,211,153,0.12)" };
            else if (revealed && isSel && !isCorrect) style = { ...style, borderColor: "var(--error)", background: "rgba(248,113,113,0.12)" };
            else if (revealed) style = { ...style, opacity: 0.6 };
            return (
              <button key={idx} style={style} onClick={() => !revealed && setSelected(idx)} disabled={revealed}>
                <span style={{ width: 26, height: 26, borderRadius: 8, background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{String.fromCharCode(65 + idx)}</span>
                {opt}
                {revealed && isCorrect && <CheckCircle2 size={18} style={{ color: "var(--success)", marginLeft: "auto" }} />}
                {revealed && isSel && !isCorrect && <XCircle size={18} style={{ color: "var(--error)", marginLeft: "auto" }} />}
              </button>
            );
          })}
        </div>
        {revealed && (
          <div className="pop" style={{ marginTop: 18, padding: 14, borderRadius: 10, background: "rgba(245,200,66,0.1)", border: "1px solid rgba(245,200,66,0.25)", fontSize: 14 }}>
            <span style={{ fontWeight: 600, color: "var(--gold)" }}>Explanation: </span>
            <span className="text-muted">{q.explanation}</span>
          </div>
        )}
        <div style={{ marginTop: 22 }}>
          {!revealed ? (
            <button className="btn btn-gold btn-lg" onClick={confirm} disabled={selected === null} style={{ width: "100%" }}>Confirm answer</button>
          ) : (
            <button className="btn btn-gold btn-lg" onClick={nextQ} disabled={saving} style={{ width: "100%" }}>
              {saving ? <span className="spinner" /> : (<>{current + 1 >= questions.length ? "Finish quiz" : "Next question"} <ArrowRight size={18} /></>)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function bumpStreak(last: string | null | undefined, streak: number, today: string): number {
  if (!last) return 1;
  const diff = Math.round((new Date(today).getTime() - new Date(last).getTime()) / 86400000);
  if (diff === 0) return Math.max(streak, 1);
  if (diff === 1) return streak + 1;
  return 1;
}
