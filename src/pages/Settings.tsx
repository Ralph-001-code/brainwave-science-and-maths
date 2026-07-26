import { useState, useEffect } from "react";
import { useAuth } from "../lib/AuthContext";
import { YEARS, getYear, type YearId } from "../lib/quizData";
import { CHANNEL } from "../lib/config";
import { GraduationCap, Bell, Youtube, CheckCircle2, AlertCircle, Send, Star, User, Timer, Pencil, Trash2, X, BookOpen, Shield, School as SchoolIcon, Search } from "lucide-react";
import type { Role } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { displayName } from "../components/Navbar";
import { supabase } from "../lib/supabase";

export default function Settings() {
  const { profile, setYear, setEmailUpdates, setTimerPrefs, setRole, joinSchool, leaveSchool, createSchool, user, session, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [roleBusy, setRoleBusy] = useState(false);
  const [roleMsg, setRoleMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [yearBusy, setYearBusy] = useState(false);
  const [emailBusy, setEmailBusy] = useState(false);
  const [yearMsg, setYearMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [emailMsg, setEmailMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [editFirst, setEditFirst] = useState(profile?.first_name ?? "");
  const [editLast, setEditLast] = useState(profile?.last_name ?? "");
  const [nameBusy, setNameBusy] = useState(false);
  const [nameMsg, setNameMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [timerBusy, setTimerBusy] = useState(false);
  const [timerMsg, setTimerMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [schoolQuery, setSchoolQuery] = useState("");
  const [schoolResults, setSchoolResults] = useState<{ id: string; name: string; city: string | null; country: string | null }[]>([]);
  const [schoolBusy, setSchoolBusy] = useState(false);
  const [schoolMsg, setSchoolMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [showCreateSchool, setShowCreateSchool] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState("");
  const [newSchoolCity, setNewSchoolCity] = useState("");
  const [newSchoolCountry, setNewSchoolCountry] = useState("");
  const [sTimerEnabled, setSTimerEnabled] = useState(profile?.timer_enabled ?? true);
  const [sTimerDuration, setSTimerDuration] = useState(profile?.timer_duration ?? 30);

  // Admin: post an update — shown on every dashboard and emailed to subscribers automatically
  const [adminSubject, setAdminSubject] = useState("");
  const [adminBody, setAdminBody] = useState("");
  const [adminBusy, setAdminBusy] = useState(false);
  const [adminMsg, setAdminMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Admin status is determined by the server, not the client, so the owner's email
  // is never exposed in the published site's code. A successful GET to the
  // post-update function proves the signed-in user is the site owner.
  const [isAdmin, setIsAdmin] = useState(false);

  // Existing updates (admin can edit / delete them)
  type Update = { id: string; title: string; body: string; created_at: string };
  const [updates, setUpdates] = useState<Update[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [listBusy, setListBusy] = useState(false);

  const loadUpdates = async () => {
    if (!session?.access_token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/post-update`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUpdates((data.updates as Update[]) ?? []);
      }
    } catch {
      /* ignore load errors */
    }
  };

  useEffect(() => {
    if (!session?.access_token) {
      setIsAdmin(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/post-update`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          setIsAdmin(true);
          const data = await res.json();
          setUpdates((data.updates as Update[]) ?? []);
        } else {
          setIsAdmin(false);
        }
      } catch {
        setIsAdmin(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.access_token]);

  const startEdit = (u: Update) => {
    setEditingId(u.id);
    setEditTitle(u.title);
    setEditBody(u.body);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditBody("");
  };

  const saveEdit = async (id: string) => {
    setListBusy(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/post-update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ id, title: editTitle, body: editBody }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      setAdminMsg({ type: "ok", text: "Update edited." });
      cancelEdit();
      await loadUpdates();
    } catch (err: any) {
      setAdminMsg({ type: "err", text: err.message || "Could not save changes." });
    } finally {
      setListBusy(false);
    }
  };

  const deleteUpdate = async (id: string) => {
    if (!confirm("Delete this update? It will be removed from every student's dashboard. This can't be undone.")) return;
    setListBusy(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/post-update`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      setAdminMsg({ type: "ok", text: "Update deleted." });
      await loadUpdates();
    } catch (err: any) {
      setAdminMsg({ type: "err", text: err.message || "Could not delete update." });
    } finally {
      setListBusy(false);
    }
  };

  // Only the project owner (a configured email) can send updates.
  // For safety, we treat the first signed-in account as admin in this simple demo,
  // but in production you'd gate this behind a real admin role.

  if (!profile) {
    return (
      <div className="section container" style={{ textAlign: "center" }}>
        <div className="spinner" style={{ margin: "40px auto" }} />
      </div>
    );
  }

  const activeYear = (profile.year_id as YearId) ?? "year1";

  const changeYear = async (y: YearId) => {
    setYearBusy(true);
    setYearMsg(null);
    const { error } = await setYear(y);
    setYearBusy(false);
    setYearMsg(error ? { type: "err", text: error } : { type: "ok", text: "Your year group has been updated." });
  };

  const toggleEmail = async (enabled: boolean) => {
    setEmailBusy(true);
    setEmailMsg(null);
    const { error } = await setEmailUpdates(enabled);
    setEmailBusy(false);
    setEmailMsg(error ? { type: "err", text: error } : { type: "ok", text: enabled ? "Email updates turned on." : "Email updates turned off." });
  };

  const saveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setNameBusy(true);
    setNameMsg(null);
    const { error } = await supabase.from("profiles").update({ first_name: editFirst.trim(), last_name: editLast.trim() }).eq("id", user.id);
    setNameBusy(false);
    if (error) {
      setNameMsg({ type: "err", text: error.message });
    } else {
      setNameMsg({ type: "ok", text: "Your name has been updated." });
      await refreshProfile();
    }
  };

  const changeRole = async (r: Role) => {
    setRoleBusy(true);
    setRoleMsg(null);
    const { error } = await setRole(r);
    setRoleBusy(false);
    if (error) {
      setRoleMsg({ type: "err", text: error });
    } else {
      setRoleMsg({ type: "ok", text: r === "teacher" ? "You are now a teacher. Redirecting to the Teacher Hub..." : r === "guardian" ? "You are now a guardian." : "You are now a student. Redirecting to your dashboard..." });
      setTimeout(() => navigate(r === "teacher" ? "/teacher" : "/dashboard"), 1000);
    }
  };

  const updateTimer = async (enabled: boolean, duration: number) => {
    setSTimerEnabled(enabled);
    setSTimerDuration(duration);
    setTimerBusy(true);
    setTimerMsg(null);
    const { error } = await setTimerPrefs(enabled, duration);
    setTimerBusy(false);
    setTimerMsg(error ? { type: "err", text: error } : { type: "ok", text: "Timer settings saved." });
  };

  const searchSchools = async () => {
    if (!schoolQuery.trim()) { setSchoolResults([]); return; }
    const q = schoolQuery.trim();
    const { data } = await supabase
      .from("schools")
      .select("id, name, city, country")
      .ilike("name", `%${q}%`)
      .limit(20);
    setSchoolResults((data ?? []) as any[]);
  };

  const joinExistingSchool = async (schoolId: string) => {
    setSchoolBusy(true);
    setSchoolMsg(null);
    const { error } = await joinSchool(schoolId);
    setSchoolBusy(false);
    setSchoolMsg(error ? { type: "err", text: error } : { type: "ok", text: "You've joined the school! You'll now appear on its leaderboard." });
  };

  const handleCreateSchool = async () => {
    if (!newSchoolName.trim()) return;
    setSchoolBusy(true);
    setSchoolMsg(null);
    const { error } = await createSchool(newSchoolName, newSchoolCountry, newSchoolCity);
    setSchoolBusy(false);
    if (error) {
      setSchoolMsg({ type: "err", text: error });
    } else {
      setSchoolMsg({ type: "ok", text: "School created! You've been added to it automatically." });
      setShowCreateSchool(false);
      setNewSchoolName("");
      setNewSchoolCity("");
      setNewSchoolCountry("");
    }
  };

  const handleLeaveSchool = async () => {
    setSchoolBusy(true);
    setSchoolMsg(null);
    const { error } = await leaveSchool();
    setSchoolBusy(false);
    setSchoolMsg(error ? { type: "err", text: error } : { type: "ok", text: "You've left the school." });
  };

  const sendUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminBusy(true);
    setAdminMsg(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/post-update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ title: adminSubject, body: adminBody }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      const data = await res.json();
      const summary = data.emailed
        ? `Posted to all dashboards and emailed to ${data.sent ?? 0} subscribed student(s).`
        : `Posted to all dashboards${data.warning ? `, but ${data.warning.toLowerCase()}` : "."}`;
      setAdminMsg({ type: "ok", text: summary });
      setAdminSubject("");
      setAdminBody("");
    } catch (err: any) {
      setAdminMsg({ type: "err", text: err.message || "Something went wrong posting the update." });
    } finally {
      setAdminBusy(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 80, maxWidth: 720 }}>
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "clamp(26px, 4vw, 36px)" }}>Settings</h1>
        <p className="text-muted" style={{ fontSize: 16 }}>Manage your name, year group, email preferences and account.</p>
      </div>

      {/* Name */}
      <div className="card fade-up" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
          <User size={20} style={{ color: "var(--primary-light)" }} /> Your name
        </h3>
        <p className="text-muted" style={{ fontSize: 14, marginBottom: 16 }}>
          Currently shown as: <span style={{ color: "var(--primary-light)", fontWeight: 600 }}>{displayName(profile) || profile?.username}</span>
        </p>
        <form onSubmit={saveName} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>First name</label>
              <input className="input" value={editFirst} onChange={(e) => setEditFirst(e.target.value)} placeholder="First name" required />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Last name</label>
              <input className="input" value={editLast} onChange={(e) => setEditLast(e.target.value)} placeholder="Last name" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={nameBusy} style={{ alignSelf: "flex-start" }}>
            {nameBusy ? <span className="spinner" /> : "Save name"}
          </button>
        </form>
        {nameMsg && <MsgBanner msg={nameMsg} />}
      </div>

      {/* Role / account type */}
      <div className="card fade-up" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
          <Shield size={20} style={{ color: "var(--primary-light)" }} /> Account type
        </h3>
        <p className="text-muted" style={{ fontSize: 14, marginBottom: 16 }}>
          Switch between Student, Teacher and Guardian. Teachers get access to the Teacher Hub with lesson outlines and topic guides instead of quizzes.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {([
            { id: "student", label: "Student", icon: GraduationCap, color: "var(--primary)" },
            { id: "teacher", label: "Teacher", icon: BookOpen, color: "var(--gold)" },
            { id: "guardian", label: "Guardian", icon: Shield, color: "var(--secondary)" },
          ] as { id: Role; label: string; icon: any; color: string }[]).map((r) => {
            const sel = profile.role === r.id;
            const RIcon = r.icon;
            return (
              <button
                key={r.id}
                onClick={() => changeRole(r.id)}
                disabled={roleBusy}
                style={{
                  padding: "16px 8px",
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
                <RIcon size={22} />
                {r.label}
              </button>
            );
          })}
        </div>
        {roleMsg && <MsgBanner msg={roleMsg} />}
      </div>

      {/* School */}
      <div className="card fade-up" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
          <SchoolIcon size={20} style={{ color: "#22d3ee" }} /> Your school
        </h3>
        <p className="text-muted" style={{ fontSize: 14, marginBottom: 16 }}>
          Join your school to compete on the school leaderboard. Your XP contributes to your school's total.
        </p>
        {profile?.school_id ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", padding: 14, borderRadius: 10, background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <CheckCircle2 size={18} style={{ color: "#22d3ee" }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>School joined</div>
                <div className="text-muted" style={{ fontSize: 13 }}>You're on the school leaderboard. Leave below if you change schools.</div>
              </div>
            </div>
            <button onClick={handleLeaveSchool} disabled={schoolBusy} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--text-muted)", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
              {schoolBusy ? "..." : "Leave school"}
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <div style={{ position: "relative", flex: 1 }}>
                <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  value={schoolQuery}
                  onChange={(e) => setSchoolQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchSchools()}
                  placeholder="Search for your school..."
                  style={{ width: "100%", padding: "10px 12px 10px 36px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-soft)", color: "var(--text)", fontSize: 14 }}
                />
              </div>
              <button onClick={searchSchools} className="btn btn-primary" style={{ padding: "10px 20px", borderRadius: 10, fontWeight: 600, fontSize: 14 }}>
                Search
              </button>
            </div>

            {schoolResults.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                {schoolResults.map((s) => (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 14px", borderRadius: 10, background: "var(--bg-soft)" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                      {s.city || s.country ? <div className="text-muted" style={{ fontSize: 12 }}>{[s.city, s.country].filter(Boolean).join(", ")}</div> : null}
                    </div>
                    <button onClick={() => joinExistingSchool(s.id)} disabled={schoolBusy} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #22d3ee", background: "rgba(34,211,238,0.1)", color: "#22d3ee", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                      {schoolBusy ? "..." : "Join"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {schoolResults.length === 0 && schoolQuery.trim() && (
              <p className="text-muted" style={{ fontSize: 13, marginBottom: 12 }}>Can't find your school? Create it below.</p>
            )}

            {showCreateSchool ? (
              <div style={{ padding: 14, borderRadius: 10, background: "var(--bg-soft)", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 10 }}>
                <input className="input" placeholder="School name" value={newSchoolName} onChange={(e) => setNewSchoolName(e.target.value)} />
                <div style={{ display: "flex", gap: 10 }}>
                  <input className="input" placeholder="City (optional)" value={newSchoolCity} onChange={(e) => setNewSchoolCity(e.target.value)} />
                  <input className="input" placeholder="Country (optional)" value={newSchoolCountry} onChange={(e) => setNewSchoolCountry(e.target.value)} />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={handleCreateSchool} disabled={schoolBusy || !newSchoolName.trim()} className="btn btn-primary" style={{ padding: "10px 20px", borderRadius: 10, fontWeight: 600, fontSize: 14 }}>
                    {schoolBusy ? "..." : "Create & join"}
                  </button>
                  <button onClick={() => setShowCreateSchool(false)} className="btn btn-ghost" style={{ padding: "10px 16px", borderRadius: 10, fontSize: 14 }}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowCreateSchool(true)} style={{ padding: "10px 16px", borderRadius: 10, border: "1px dashed var(--border)", background: "transparent", color: "var(--text-muted)", fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <SchoolIcon size={16} /> Create a new school
              </button>
            )}
          </>
        )}
        {schoolMsg && <MsgBanner msg={schoolMsg} />}
      </div>

      {/* Timer settings */}
      <div className="card fade-up" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
          <Timer size={20} style={{ color: "var(--primary-light)" }} /> Quiz timer
        </h3>
        <p className="text-muted" style={{ fontSize: 14, marginBottom: 16 }}>
          Control whether questions have a countdown timer and how long you get per question.
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>Enable timer</div>
            <div className="text-muted" style={{ fontSize: 13 }}>Turn off to answer at your own pace.</div>
          </div>
          <button
            onClick={() => updateTimer(!sTimerEnabled, sTimerDuration)}
            disabled={timerBusy}
            style={{
              width: 52, height: 28, borderRadius: 999, border: "none", cursor: "pointer", position: "relative",
              background: sTimerEnabled ? "var(--success)" : "var(--border)", transition: "background 0.2s",
            }}
            aria-label={sTimerEnabled ? "Timer on" : "Timer off"}
          >
            <span style={{ position: "absolute", top: 3, left: sTimerEnabled ? 27 : 3, width: 22, height: 22, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
          </button>
        </div>
        {sTimerEnabled && (
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Time per question: <span style={{ color: "var(--primary-light)" }}>{sTimerDuration}s</span></div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[15, 20, 30, 45, 60, 90].map((t) => (
                <button
                  key={t}
                  onClick={() => updateTimer(true, t)}
                  disabled={timerBusy}
                  style={{
                    padding: "8px 16px", borderRadius: 8, border: `1px solid ${sTimerDuration === t ? "var(--primary)" : "var(--border)"}`,
                    background: sTimerDuration === t ? "rgba(168,85,247,0.12)" : "var(--surface)",
                    color: sTimerDuration === t ? "var(--primary-light)" : "var(--text-muted)",
                    fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.18s",
                  }}
                >
                  {t}s
                </button>
              ))}
            </div>
          </div>
        )}
        {timerMsg && <MsgBanner msg={timerMsg} />}
      </div>

      {/* Year group */}
      <div className="card fade-up" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
          <GraduationCap size={20} style={{ color: "var(--primary-light)" }} /> Your year group
        </h3>
        <p className="text-muted" style={{ fontSize: 14, marginBottom: 16 }}>
          Questions are matched to your year. Currently: <span style={{ color: getYear(activeYear).color, fontWeight: 600 }}>{getYear(activeYear).name}</span> ({getYear(activeYear).ageRange}).
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10 }}>
          {YEARS.map((y) => {
            const sel = activeYear === y.id;
            return (
              <button
                key={y.id}
                onClick={() => changeYear(y.id)}
                disabled={yearBusy}
                style={{
                  padding: "12px 8px",
                  borderRadius: 10,
                  border: `1px solid ${sel ? y.color : "var(--border)"}`,
                  background: sel ? `${y.color}1f` : "var(--bg-soft)",
                  color: sel ? y.color : "var(--text-muted)",
                  fontWeight: 600,
                  fontSize: 14,
                  transition: "all 0.18s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                {sel && <Star size={14} style={{ fill: y.color }} />}
                {y.name}
              </button>
            );
          })}
        </div>
        {yearMsg && <MsgBanner msg={yearMsg} />}
      </div>

      {/* Email updates */}
      <div className="card fade-up" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
          <Bell size={20} style={{ color: "var(--primary-light)" }} /> Email notifications
        </h3>
        <p className="text-muted" style={{ fontSize: 14, marginBottom: 16 }}>
          Get an email when we add new topics, quizzes or features to Brainwave Science & Maths.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => toggleEmail(true)}
            disabled={emailBusy || profile.email_updates}
            className="btn"
            style={{
              background: profile.email_updates ? "rgba(52,211,153,0.15)" : "var(--surface-2)",
              color: profile.email_updates ? "var(--success)" : "var(--text)",
              border: `1px solid ${profile.email_updates ? "var(--success)" : "var(--border)"}`,
            }}
          >
            <CheckCircle2 size={16} /> {profile.email_updates ? "On" : "Turn on"}
          </button>
          <button
            onClick={() => toggleEmail(false)}
            disabled={emailBusy || !profile.email_updates}
            className="btn btn-ghost"
          >
            Turn off
          </button>
        </div>
        {emailMsg && <MsgBanner msg={emailMsg} />}
      </div>

      {/* YouTube */}
      <div className="card fade-up" style={{ marginBottom: 20, background: "linear-gradient(135deg, rgba(255,26,26,0.08), rgba(168,85,247,0.06))", border: "1px solid rgba(255,26,26,0.2)" }}>
        <h3 style={{ fontSize: 18, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
          <Youtube size={20} color="#ff1a1a" /> Follow our YouTube
        </h3>
        <p className="text-muted" style={{ fontSize: 14, marginBottom: 14 }}>{CHANNEL.tagline}</p>
        <a href={CHANNEL.url} target="_blank" rel="noopener noreferrer" className="btn btn-youtube">
          <Youtube size={18} /> Subscribe to {CHANNEL.name}
        </a>
      </div>

      {/* Admin: post an update (auto-emailed to subscribers) */}
      {isAdmin && (
        <div className="card fade-up" style={{ border: "1px solid var(--gold)" }}>
          <h3 style={{ fontSize: 18, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
            <Send size={20} className="text-gold" /> Post an update (Admin)
          </h3>
          <p className="text-muted" style={{ fontSize: 14, marginBottom: 16 }}>
            Write a short update — it appears on every student's dashboard and is emailed automatically to students who opted in to email updates.
          </p>
          <form onSubmit={sendUpdate} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              className="input"
              placeholder="Update title (e.g. New Cambridge questions added!)"
              value={adminSubject}
              onChange={(e) => setAdminSubject(e.target.value)}
              required
            />
            <textarea
              className="input"
              placeholder="Write your message to students..."
              value={adminBody}
              onChange={(e) => setAdminBody(e.target.value)}
              required
              rows={5}
              style={{ resize: "vertical" }}
            />
            <button type="submit" className="btn btn-gold" disabled={adminBusy}>
              {adminBusy ? <span className="spinner" /> : (<><Send size={16} /> Post update</>)}
            </button>
          </form>
          {adminMsg && <MsgBanner msg={adminMsg} />}

          {/* Manage existing updates */}
          <div style={{ marginTop: 24, borderTop: "1px solid var(--border)", paddingTop: 20 }}>
            <h4 style={{ fontSize: 15, marginBottom: 12, color: "var(--text-muted)" }}>Your existing updates</h4>
            {updates.length === 0 ? (
              <p className="text-muted" style={{ fontSize: 13 }}>No updates yet. Post one above.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {updates.map((u) => (
                  <div key={u.id} style={{ padding: "12px 14px", borderRadius: 10, background: "var(--bg-soft)", border: "1px solid var(--border)" }}>
                    {editingId === u.id ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <input className="input" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Title" />
                        <textarea className="input" value={editBody} onChange={(e) => setEditBody(e.target.value)} rows={4} style={{ resize: "vertical" }} placeholder="Message" />
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <button className="btn btn-gold" onClick={() => saveEdit(u.id)} disabled={listBusy} style={{ padding: "6px 14px", fontSize: 13 }}>
                            {listBusy ? <span className="spinner" /> : "Save changes"}
                          </button>
                          <button className="btn btn-ghost" onClick={cancelEdit} disabled={listBusy} style={{ padding: "6px 14px", fontSize: 13 }}>
                            <X size={14} /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                          <div style={{ fontWeight: 700, fontSize: 14 }}>{u.title}</div>
                          <div className="text-muted" style={{ fontSize: 12 }}>{new Date(u.created_at).toLocaleDateString()}</div>
                        </div>
                        <p style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.5, marginTop: 6, whiteSpace: "pre-line" }}>{u.body}</p>
                        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                          <button className="btn" onClick={() => startEdit(u)} disabled={listBusy} style={{ padding: "5px 12px", fontSize: 12, background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}>
                            <Pencil size={13} /> Edit
                          </button>
                          <button className="btn" onClick={() => deleteUpdate(u.id)} disabled={listBusy} style={{ padding: "5px 12px", fontSize: 12, background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "var(--error)" }}>
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MsgBanner({ msg }: { msg: { type: "ok" | "err"; text: string } }) {
  return (
    <div className="pop" style={{
      marginTop: 14,
      display: "flex",
      gap: 10,
      alignItems: "flex-start",
      padding: "10px 14px",
      borderRadius: 10,
      background: msg.type === "ok" ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
      border: `1px solid ${msg.type === "ok" ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`,
      color: msg.type === "ok" ? "var(--success)" : "var(--error)",
      fontSize: 14,
    }}>
      {msg.type === "ok" ? <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 1 }} /> : <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />}
      <span>{msg.text}</span>
    </div>
  );
}
