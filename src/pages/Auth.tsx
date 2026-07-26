import { useState, FormEvent } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { YEARS, PROGRAMMES, type YearId, type Programme, type CheckpointStage, type IgcseSubjectId } from "../lib/quizData";
import { CHANNEL } from "../lib/config";
import { ArrowRight, AlertCircle, User, Mail, Lock, GraduationCap, Youtube, Bell, Layers, Users, BookOpen, Shield } from "lucide-react";
import type { Role } from "../lib/supabase";

export default function Auth() {
  const [params] = useSearchParams();
  const initialMode = params.get("mode") === "signup" ? "signup" : "signin";
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [yearId, setYearId] = useState<YearId>("year3");
  const [programme, setProgramme] = useState<Programme>("primary");
  const [role, setRole] = useState<Role>("student");
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        if (username.trim().length < 2) {
          setError("Please choose a username of at least 2 characters.");
          setBusy(false);
          return;
        }
        if (password.length < 6) {
          setError("Password must be at least 6 characters.");
          setBusy(false);
          return;
        }
        if (firstName.trim().length < 1) {
          setError("Please enter your first name.");
          setBusy(false);
          return;
        }
        const { error: err } = await signUp(email.trim(), password, username.trim(), firstName.trim(), lastName.trim(), yearId, emailUpdates, programme, null, [], role);
        if (err) setError(translateError(err));
        else navigate(role === "teacher" ? "/teacher" : "/dashboard");
      } else {
        const { error: err } = await signIn(email.trim(), password);
        if (err) setError(translateError(err));
        else navigate("/dashboard");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="section" style={{ minHeight: "calc(100vh - 68px)", display: "flex", alignItems: "center" }}>
      <div className="container" style={{ display: "flex", justifyContent: "center" }}>
        <div className="card fade-up" style={{ width: "100%", maxWidth: 500, padding: 36 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
            <img src="/Brainwave_science_and_maths.jpeg" alt="Brainwave" style={{ width: 64, height: 64, borderRadius: 16, marginBottom: 14, border: "2px solid var(--gold)" }} />
            <h1 style={{ fontSize: 24, marginBottom: 4 }}>
              {mode === "signup" ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-muted" style={{ fontSize: 14 }}>
              {mode === "signup" ? "Start your maths journey today" : "Sign in to continue learning"}
            </p>
          </div>

          {error && (
            <div className="pop" style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "12px 14px", borderRadius: 10, background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "var(--error)", marginBottom: 16, fontSize: 14 }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {mode === "signup" && (
              <>
                <label style={{ display: "block" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <User size={14} /> First name
                  </span>
                  <input className="input" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="e.g. Aisha" autoComplete="given-name" required />
                </label>

                <label style={{ display: "block" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <User size={14} /> Last name
                  </span>
                  <input className="input" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="e.g. Khan" autoComplete="family-name" />
                </label>

                <label style={{ display: "block" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <User size={14} /> Username
                  </span>
                  <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. mathswhiz" autoComplete="username" />
                </label>

                <label style={{ display: "block" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <Users size={14} /> I am a...
                  </span>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                    {([
                      { id: "student", label: "Student", icon: GraduationCap, color: "var(--primary)" },
                      { id: "teacher", label: "Teacher", icon: BookOpen, color: "var(--gold)" },
                      { id: "guardian", label: "Guardian", icon: Shield, color: "var(--secondary)" },
                    ] as { id: Role; label: string; icon: any; color: string }[]).map((r) => {
                      const sel = role === r.id;
                      const RIcon = r.icon;
                      return (
                        <button
                          type="button"
                          key={r.id}
                          onClick={() => setRole(r.id)}
                          style={{
                            padding: "14px 6px",
                            borderRadius: 10,
                            border: `1px solid ${sel ? r.color : "var(--border)"}`,
                            background: sel ? `${r.color}1f` : "var(--bg-soft)",
                            color: sel ? r.color : "var(--text-muted)",
                            fontWeight: 600,
                            fontSize: 13,
                            transition: "all 0.18s",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <RIcon size={20} />
                          {r.label}
                        </button>
                      );
                    })}
                  </div>
                  {role === "teacher" && (
                    <p style={{ fontSize: 12, marginTop: 8, padding: "8px 12px", borderRadius: 8, background: "rgba(245,200,66,0.10)", border: "1px solid rgba(245,200,66,0.25)", color: "var(--gold)" }}>
                      As a teacher, you'll get teaching outlines and topic guides for every year and programme — no quizzes.
                    </p>
                  )}
                  {role === "guardian" && (
                    <p style={{ fontSize: 12, marginTop: 8, padding: "8px 12px", borderRadius: 8, background: "rgba(34,211,238,0.10)", border: "1px solid rgba(34,211,238,0.25)", color: "var(--secondary)" }}>
                      As a guardian, you get full access to both the student platform (to track a learner's progress) and the Teacher Hub (to help with homework).
                    </p>
                  )}
                </label>

                {role !== "teacher" && (
                <>
                <label style={{ display: "block" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <Layers size={14} /> Your programme
                  </span>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                    {PROGRAMMES.map((p) => {
                      const sel = programme === p.id;
                      return (
                        <button
                          type="button"
                          key={p.id}
                          onClick={() => setProgramme(p.id)}
                          style={{
                            padding: "10px 6px",
                            borderRadius: 10,
                            border: `1px solid ${sel ? p.color : "var(--border)"}`,
                            background: sel ? `${p.color}1f` : "var(--bg-soft)",
                            color: sel ? p.color : "var(--text-muted)",
                            fontWeight: 600,
                            fontSize: 12,
                            transition: "all 0.18s",
                          }}
                        >
                          {p.short}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-muted" style={{ fontSize: 11, marginTop: 6 }}>
                    {programme === "primary" ? "Years 1-8 general maths" : programme === "checkpoint" ? "Cambridge Y6 & Y9 Maths + Science" : "Years 10-11 exam prep with subject choice"}
                  </p>
                </label>

                <label style={{ display: "block" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <GraduationCap size={14} /> Your year group
                  </span>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                    {YEARS.map((y) => {
                      const sel = yearId === y.id;
                      return (
                        <button
                          type="button"
                          key={y.id}
                          onClick={() => setYearId(y.id)}
                          style={{
                            padding: "10px 6px",
                            borderRadius: 10,
                            border: `1px solid ${sel ? y.color : "var(--border)"}`,
                            background: sel ? `${y.color}1f` : "var(--bg-soft)",
                            color: sel ? y.color : "var(--text-muted)",
                            fontWeight: 600,
                            fontSize: 13,
                            transition: "all 0.18s",
                          }}
                        >
                          {y.name}
                          <div style={{ fontSize: 10, fontWeight: 500, opacity: 0.8 }}>{y.ageRange}</div>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-muted" style={{ fontSize: 12, marginTop: 8 }}>
                    We'll show you questions for your year group. You can change this any time in Settings.
                  </p>
                </label>
                </>
                )}

                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: 12, borderRadius: 10, background: "var(--bg-soft)", border: "1px solid var(--border)", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={emailUpdates}
                    onChange={(e) => setEmailUpdates(e.target.checked)}
                    style={{ marginTop: 2, width: 18, height: 18, accentColor: "var(--primary)" }}
                  />
                  <span style={{ fontSize: 14, color: "var(--text-muted)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text)", fontWeight: 600, marginBottom: 2 }}>
                      <Bell size={14} style={{ color: "var(--primary-light)" }} /> Email me about new topics & quizzes
                    </span>
                    Get notified when we add new content. You can turn this off any time.
                  </span>
                </label>
              </>
            )}

            <label style={{ display: "block" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <Mail size={14} /> Email
              </span>
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required />
            </label>
            <label style={{ display: "block" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <Lock size={14} /> Password
              </span>
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" autoComplete={mode === "signup" ? "new-password" : "current-password"} required />
            </label>

            <button type="submit" className="btn btn-primary btn-lg" disabled={busy} style={{ marginTop: 6 }}>
              {busy ? <span className="spinner" /> : (<>{mode === "signup" ? "Create account" : "Sign in"} <ArrowRight size={18} /></>)}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--text-muted)" }}>
            {mode === "signup" ? (
              <>Already have an account?{" "}
                <button onClick={() => { setMode("signin"); setError(null); }} style={{ color: "var(--primary-light)", fontWeight: 600 }}>Sign in</button>
              </>
            ) : (
              <>New here?{" "}
                <button onClick={() => { setMode("signup"); setError(null); }} style={{ color: "var(--primary-light)", fontWeight: 600 }}>Create an account</button>
              </>
            )}
          </div>

          {mode === "signup" && (
            <div style={{ textAlign: "center", marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
              <p className="text-muted" style={{ fontSize: 13, marginBottom: 10 }}>Don't forget to subscribe to our YouTube channel!</p>
              <a href={CHANNEL.url} target="_blank" rel="noopener noreferrer" className="btn btn-youtube" style={{ padding: "8px 16px", fontSize: 14 }}>
                <Youtube size={16} /> {CHANNEL.name}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function translateError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("already registered") || m.includes("already been registered")) return "An account with this email already exists. Try signing in instead.";
  if (m.includes("invalid login") || m.includes("invalid credentials")) return "Incorrect email or password. Please try again.";
  if (m.includes("rate limit")) return "Too many attempts. Please wait a moment and try again.";
  return msg;
}
