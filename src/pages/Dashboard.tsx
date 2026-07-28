import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { supabase } from "../lib/supabase";
import {
  YEARS, getYear, getRankForXp, getNextRank, PROGRAMMES,
  type YearId, type Programme, type CheckpointStage,
} from "../lib/quizData";
import { CHECKPOINT_STAGES } from "../lib/checkpointData";
import { IGCSE_SUBJECTS } from "../lib/igcseData";
import { CHANNEL } from "../lib/config";
import { useSeo } from "../lib/useSeo";
import type { QuizAttempt, Certificate } from "../lib/supabase";
import { displayName } from "../components/Navbar";
import {
  Flame, Zap, ArrowRight, Calendar, GraduationCap, Pencil,
  TrendingUp, Target, Crown, Star, Medal, Sprout, Youtube, Trophy,
  Award, BookOpen, Layers, CheckCircle2, User, FileText, Bell,
  Gift, Snowflake,
} from "lucide-react";
import { getNextMilestone, STREAK_MILESTONES, type StreakMilestone } from "../lib/avatarUnlocks";

const RANK_ICONS: Record<string, any> = { Sprout, Star, Medal, Crown };
const PROG_ICONS: Record<string, any> = { GraduationCap, Award, BookOpen };

type SiteUpdate = {
  id: string;
  title: string;
  body: string;
  created_at: string;
};

export default function Dashboard() {
  useSeo({ title: "Dashboard", description: "Your learning dashboard — track your XP, streak, rank and quiz history." });
  const { user, profile } = useAuth();
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [updates, setUpdates] = useState<SiteUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: att } = await supabase
        .from("quiz_attempts")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false })
        .limit(10);
      setAttempts((att as QuizAttempt[]) ?? []);

      const { data: certs } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", user.id)
        .order("issued_at", { ascending: false });
      setCertificates((certs as Certificate[]) ?? []);

      const { data: ups } = await supabase
        .from("site_updates")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      setUpdates((ups as SiteUpdate[]) ?? []);

      setLoading(false);
    })();
  }, [user]);

  if (!profile) {
    return (
      <div className="section container" style={{ textAlign: "center" }}>
        <div className="spinner" style={{ margin: "40px auto" }} />
      </div>
    );
  }

  const yr = getYear(profile.year_id as YearId);
  const isPrimary = profile.programme === "primary";
  const isCheckpoint = profile.programme === "checkpoint";
  const isIgcse = profile.programme === "igcse";
  const checkpointStageInfo = CHECKPOINT_STAGES.find((s) => s.id === (profile.checkpoint_stage as CheckpointStage));
  const igcseCount = profile.igcse_subjects?.length ?? 0;
  const rank = getRankForXp(profile.xp);
  const nextRank = getNextRank(profile.xp);
  const RankIcon = RANK_ICONS[rank.icon] ?? Sprout;
  const xpInRank = profile.xp - rank.minXp;
  const xpForNext = nextRank ? nextRank.minXp - rank.minXp : 0;
  const rankProgress = nextRank ? Math.min(100, Math.round((xpInRank / xpForNext) * 100)) : 100;

  const totalQuizzes = attempts.length;
  const avgScore = totalQuizzes
    ? Math.round((attempts.reduce((s, a) => s + (a.score / a.total_questions) * 100, 0) / totalQuizzes))
    : 0;

  const name = displayName(profile);

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "clamp(26px, 4vw, 36px)" }}>
          Welcome back, <span className="gradient-text">{name}</span>
        </h1>
        <p className="text-muted" style={{ fontSize: 16 }}>
          {isPrimary ? (
            <>You're in <span style={{ color: yr.color, fontWeight: 600 }}>{yr.name}</span> ({yr.ageRange}). Here's your progress.</>
          ) : isCheckpoint ? (
            <>You're studying <span style={{ color: checkpointStageInfo?.color ?? "var(--gold)", fontWeight: 600 }}>{checkpointStageInfo?.name ?? "Checkpoint"}</span>. Here's your progress.</>
          ) : (
            <>You're preparing for your <span style={{ color: "var(--secondary)", fontWeight: 600 }}>IGCSE</span> exams{igcseCount > 0 ? ` · ${igcseCount} subject${igcseCount === 1 ? "" : "s"}` : ""}. Here's your progress.</>
          )}
        </p>
        {!name && (
          <div style={{ marginTop: 12, padding: "10px 16px", borderRadius: 10, background: "rgba(168,85,247,0.10)", border: "1px solid rgba(168,85,247,0.25)", fontSize: 14, display: "flex", alignItems: "center", gap: 10 }}>
            <User size={16} style={{ color: "var(--primary-light)" }} />
            <span>Add your first and last name in <Link to="/settings" style={{ color: "var(--primary-light)", fontWeight: 600 }}>Settings</Link> so we can greet you properly.</span>
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 16, marginBottom: 28 }}>
        <StatCard icon={Zap} label="Total XP" value={profile.xp} color="var(--gold)" />
        <StatCard icon={Flame} label="Day streak" value={profile.streak} color="var(--warning)" />
        {isPrimary && <StatCard icon={GraduationCap} label="Year" value={yr.name} color={yr.color} />}
        {isCheckpoint && <StatCard icon={Award} label="Stage" value={checkpointStageInfo?.shortName ?? "Checkpoint"} color={checkpointStageInfo?.color ?? "var(--gold)"} />}
        {isIgcse && <StatCard icon={BookOpen} label="Subjects" value={igcseCount} color="var(--secondary)" />}
        <StatCard icon={RankIcon} label="Rank" value={rank.name} color="var(--primary-light)" />
        <StatCard icon={Target} label="Quizzes taken" value={totalQuizzes} color="var(--secondary)" />
        <StatCard icon={TrendingUp} label="Avg score" value={`${avgScore}%`} color="var(--success)" />
      </div>

      {/* Rank progress bar */}
      <div className="card fade-up" style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <RankIcon size={22} style={{ color: "var(--primary-light)" }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{rank.name}</div>
              <div className="text-muted" style={{ fontSize: 13 }}>{rank.minXp}+ XP</div>
            </div>
          </div>
          {nextRank ? (
            <div className="text-muted" style={{ fontSize: 14 }}>
              {nextRank.minXp - profile.xp} XP to <span style={{ color: "var(--primary-light)", fontWeight: 600 }}>{nextRank.name}</span>
            </div>
          ) : (
            <div className="badge" style={{ background: "rgba(245,200,66,0.15)", color: "var(--gold)" }}>
              <Crown size={14} /> Top rank!
            </div>
          )}
        </div>
        <div style={{ height: 12, borderRadius: 999, background: "var(--bg-soft)", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${rankProgress}%`,
            background: "linear-gradient(90deg, var(--primary), var(--gold))",
            borderRadius: 999,
            transition: "width 0.8s ease",
          }} />
        </div>
      </div>

      {/* Streak milestones & unlocks */}
      <div className="card fade-up" style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Gift size={22} style={{ color: "var(--primary-light)" }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>Streak Rewards</div>
              <div className="text-muted" style={{ fontSize: 13 }}>Keep your streak going to unlock avatar items</div>
            </div>
          </div>
          {(profile.streak_freezes ?? 0) > 0 && (
            <div className="badge" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8", display: "flex", alignItems: "center", gap: 4 }}>
              <Snowflake size={14} /> {profile.streak_freezes} freeze{profile.streak_freezes > 1 ? "s" : ""}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6 }}>
          {STREAK_MILESTONES.map((m) => {
            const reached = profile.streak >= m.streak;
            const next = !reached && getNextMilestone(profile.streak)?.streak === m.streak;
            return (
              <div key={`${m.reward.type}:${m.reward.id}`} style={{
                flex: "0 0 auto",
                padding: "12px 16px",
                borderRadius: 12,
                border: reached ? "1.5px solid var(--success)" : next ? "1.5px solid var(--primary-light)" : "1px solid var(--border)",
                background: reached ? "rgba(34,197,94,0.08)" : next ? "rgba(168,85,247,0.08)" : "var(--bg-soft)",
                display: "flex",
                flexDirection: "column",
                gap: 4,
                minWidth: 120,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {reached ? <CheckCircle2 size={16} style={{ color: "var(--success)" }} /> : <Flame size={16} style={{ color: next ? "var(--primary-light)" : "var(--text-muted)" }} />}
                  <span style={{ fontWeight: 700, fontSize: 14, color: reached ? "var(--success)" : "var(--text)" }}>{m.streak} days</span>
                </div>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{m.label}</span>
              </div>
            );
          })}
        </div>
        {getNextMilestone(profile.streak) && (
          <div style={{ marginTop: 12, fontSize: 14, color: "var(--text-muted)" }}>
            <Flame size={14} style={{ verticalAlign: "middle", marginRight: 4, color: "var(--warning)" }} />
            {getNextMilestone(profile.streak)!.streak - profile.streak} day{(getNextMilestone(profile.streak)!.streak - profile.streak) > 1 ? "s" : ""} to unlock <span style={{ color: "var(--primary-light)", fontWeight: 600 }}>{getNextMilestone(profile.streak)!.label}</span>
            <Link to="/daily" style={{ marginLeft: 10, color: "var(--gold)", fontWeight: 600, textDecoration: "none" }}>Take today's quiz <ArrowRight size={12} style={{ verticalAlign: "middle" }} /></Link>
          </div>
        )}
      </div>

      {/* Programmes */}
      <h2 style={{ fontSize: 20, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
        <Layers size={20} className="text-gold" /> Your programmes
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
        {PROGRAMMES.map((p) => {
          const Icon = PROG_ICONS[p.icon] ?? GraduationCap;
          const isCurrent = profile.programme === p.id;
          return (
            <Link key={p.id} to={`/${p.id}`} className="card card-hover fade-up" style={{ textDecoration: "none", borderTop: `3px solid ${p.color}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${p.color}1f`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={20} style={{ color: p.color }} />
                </div>
                <div>
                  <h3 style={{ fontSize: 16 }}>{p.name}</h3>
                  {isCurrent && <div className="badge" style={{ background: `${p.color}1a`, color: p.color, fontSize: 11 }}>Current</div>}
                </div>
              </div>
              <p className="text-muted" style={{ fontSize: 13, marginBottom: 12 }}>{p.description}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: p.color, fontWeight: 600, fontSize: 13 }}>
                {p.id === "primary" ? "Browse year topics" : p.id === "checkpoint" ? "Practice Checkpoint" : "Choose IGCSE subjects"} <ArrowRight size={14} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Certificates */}
      {certificates.length > 0 && (
        <>
          <h2 style={{ fontSize: 20, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <Award size={20} className="text-gold" /> Your certificates
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 28 }}>
            {certificates.map((c) => (
              <Link key={c.id} to="/certificates" className="card card-hover fade-up" style={{ textDecoration: "none" }}>
                <Award size={24} className="text-gold" style={{ marginBottom: 10 }} />
                <h3 style={{ fontSize: 15, marginBottom: 6 }}>{c.title}</h3>
                <p className="text-muted" style={{ fontSize: 13, marginBottom: 8 }}>Score: {c.score}%</p>
                <div className="text-muted" style={{ fontSize: 12 }}>{new Date(c.issued_at).toLocaleDateString()}</div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Quick actions */}
      <h2 style={{ fontSize: 20, marginBottom: 14 }}>Quick actions</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 28 }}>
        <ActionCard to="/pathway" icon={Award} title="Learning Pathway" body="Follow your step-by-step course path and track your progress." cta="View pathway" accent="var(--success)" />
        <ActionCard to="/daily" icon={Calendar} title="Daily Quiz" body="Take today's quiz and keep your streak going." cta="Start daily quiz" accent="var(--gold)" />
        {isPrimary && <ActionCard to="/years" icon={GraduationCap} title="Your Year Topics" body="Jump into a topic in your year group." cta="Browse topics" accent="var(--primary)" />}
        {isCheckpoint && <ActionCard to="/checkpoint" icon={Award} title="Checkpoint Topics" body="Pick your stage and subject, then practice." cta="Browse topics" accent="var(--gold)" />}
        {isIgcse && <ActionCard to="/igcse" icon={BookOpen} title="Your Subjects" body="Manage your IGCSE subjects and start a topic." cta="Choose subjects" accent="var(--secondary)" />}
        <ActionCard to="/practice" icon={Pencil} title="Practice" body="Drill any topic from your year, any time." cta="Practice now" accent="var(--secondary)" />
        <ActionCard to="/past-papers" icon={FileText} title="Past Papers" body="Cambridge-style exam questions from every programme." cta="Browse past papers" accent="var(--gold)" />
      </div>

      {/* YouTube follow card */}
      <div className="card fade-up" style={{ marginBottom: 28, background: "linear-gradient(135deg, rgba(255,26,26,0.10), rgba(168,85,247,0.08))", border: "1px solid rgba(255,26,26,0.25)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #ff1a1a, #cc0000)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Youtube size={26} color="#fff" />
          </div>
          <div>
            <h3 style={{ fontSize: 17, marginBottom: 2 }}>Follow {CHANNEL.name}</h3>
            <p className="text-muted" style={{ fontSize: 13 }}>Subscribe for new science and maths lessons every week.</p>
          </div>
        </div>
        <a href={CHANNEL.url} target="_blank" rel="noopener noreferrer" className="btn btn-youtube">
          <Youtube size={18} /> Subscribe
        </a>
      </div>

      {/* Announcements from the site owner */}
      {updates.length > 0 && (
        <div className="card fade-up" style={{ marginBottom: 28, borderColor: "var(--primary)" }}>
          <h3 style={{ fontSize: 19, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Bell size={20} style={{ color: "var(--primary-light)" }} /> Latest updates
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {updates.map((u) => (
              <div key={u.id} style={{ padding: "14px 16px", borderRadius: 10, background: "var(--bg-soft)", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>{u.title}</div>
                  <div className="text-muted" style={{ fontSize: 12 }}>{new Date(u.created_at).toLocaleDateString()}</div>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6, marginTop: 8, whiteSpace: "pre-line" }}>{u.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent activity */}
      <div className="card fade-up">
        <h3 style={{ fontSize: 19, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <Trophy size={20} style={{ color: "var(--gold)" }} /> Recent quizzes
        </h3>
        {loading ? (
          <div className="spinner" />
        ) : attempts.length === 0 ? (
          <div style={{ textAlign: "center", padding: 30 }}>
            <p className="text-muted" style={{ marginBottom: 16 }}>You haven't taken any quizzes yet.</p>
            <Link to="/daily" className="btn btn-primary">Take your first quiz <ArrowRight size={16} /></Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {attempts.map((a) => {
              const pct = Math.round((a.score / a.total_questions) * 100);
              const yrInfo = YEARS.find((y) => y.id === a.year_id);
              return (
                <div key={a.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 10, background: "var(--bg-soft)", border: "1px solid var(--border)", flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, textTransform: "capitalize" }}>{a.topic === "daily" ? "Daily Quiz" : a.topic.replace(/-/g, " ")}</div>
                    <div className="text-muted" style={{ fontSize: 13 }}>
                      {yrInfo ? yrInfo.name : a.year_id} • {new Date(a.completed_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ fontSize: 14, color: "var(--text-muted)" }}>{a.score}/{a.total_questions}</span>
                    <span style={{ fontWeight: 700, color: pct >= 70 ? "var(--success)" : pct >= 40 ? "var(--warning)" : "var(--error)" }}>{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: any; color: string }) {
  return (
    <div className="card fade-up" style={{ padding: 20 }}>
      <Icon size={22} style={{ color, marginBottom: 10 }} />
      <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "Lexend" }}>{value}</div>
      <div className="text-muted" style={{ fontSize: 13 }}>{label}</div>
    </div>
  );
}

function ActionCard({ to, icon: Icon, title, body, cta, accent }: { to: string; icon: any; title: string; body: string; cta: string; accent: string }) {
  return (
    <Link to={to} className="card card-hover fade-up" style={{ display: "flex", flexDirection: "column", textDecoration: "none" }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${accent}1f`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
        <Icon size={22} style={{ color: accent }} />
      </div>
      <h3 style={{ fontSize: 18, marginBottom: 6 }}>{title}</h3>
      <p className="text-muted" style={{ fontSize: 14, flex: 1 }}>{body}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14, color: accent, fontWeight: 600, fontSize: 14 }}>
        {cta} <ArrowRight size={16} />
      </div>
    </Link>
  );
}
