import { useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";
import { Trophy, Users, School as SchoolIcon, Crown, Flame, Search } from "lucide-react";

type RankRow = {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  xp: number;
  streak: number;
  school_id: string | null;
};

type SchoolRow = {
  school_id: string;
  school_name: string;
  country: string | null;
  city: string | null;
  member_count: number;
  total_xp: number;
  avg_xp: number;
};

type Tab = "global" | "friends" | "school";

export default function Leaderboard() {
  const { profile, user } = useAuth();
  const [tab, setTab] = useState<Tab>("global");
  const [rows, setRows] = useState<RankRow[]>([]);
  const [schools, setSchools] = useState<SchoolRow[]>([]);
  const [friendIds, setFriendIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      if (tab === "global") {
        const { data } = await supabase
          .from("profiles")
          .select("id, username, first_name, last_name, xp, streak, school_id")
          .order("xp", { ascending: false })
          .limit(100);
        if (active && data) setRows(data as RankRow[]);
      } else if (tab === "friends") {
        if (!user) { if (active) setRows([]); setLoading(false); return; }
        const { data: f } = await supabase
          .from("friendships")
          .select("requester_id, addressee_id, status")
          .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
          .eq("status", "accepted");
        const ids = (f ?? []).map((r: any) =>
          r.requester_id === user.id ? r.addressee_id : r.requester_id
        );
        const allIds = [user.id, ...ids];
        setFriendIds(ids);
        if (allIds.length > 0) {
          const { data } = await supabase
            .from("profiles")
            .select("id, username, first_name, last_name, xp, streak, school_id")
            .in("id", allIds)
            .order("xp", { ascending: false });
          if (active && data) setRows(data as RankRow[]);
        } else {
          if (active) setRows([]);
        }
      } else if (tab === "school") {
        const { data } = await supabase
          .from("school_leaderboard")
          .select("*")
          .limit(100);
        if (active && data) setSchools(data as SchoolRow[]);
        if (profile?.school_id) {
          const { data: m } = await supabase
            .from("profiles")
            .select("id, username, first_name, last_name, xp, streak, school_id")
            .eq("school_id", profile.school_id)
            .order("xp", { ascending: false })
            .limit(100);
          if (active && m) setRows(m as RankRow[]);
        } else {
          if (active) setRows([]);
        }
      }
      if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, [tab, user, profile?.school_id]);

  const filteredRows = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) =>
      `${r.username} ${r.first_name} ${r.last_name}`.toLowerCase().includes(q)
    );
  }, [rows, query]);

  const myRank = useMemo(() => {
    const idx = rows.findIndex((r) => r.id === user?.id);
    return idx >= 0 ? idx + 1 : null;
  }, [rows, user]);

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "global", label: "Global", icon: Trophy },
    { id: "friends", label: "Friends", icon: Users },
    { id: "school", label: "Schools", icon: SchoolIcon },
  ];

  return (
    <div className="page-container">
      <div className="fade-up" style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}>
          <Trophy size={28} style={{ color: "var(--gold)" }} /> Leaderboard
        </h1>
        <p className="text-muted" style={{ fontSize: 15 }}>
          Climb the ranks by earning XP from quizzes and practice. Compete globally, with friends, and between schools.
        </p>
      </div>

      <div className="card fade-up" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  flex: 1,
                  padding: "14px 8px",
                  border: "none",
                  background: active ? "var(--bg-soft)" : "transparent",
                  color: active ? "var(--text)" : "var(--text-muted)",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  borderBottom: active ? "2px solid var(--gold)" : "2px solid transparent",
                  transition: "all 0.18s",
                }}
              >
                <Icon size={16} /> {t.label}
              </button>
            );
          })}
        </div>

        <div style={{ padding: 20 }}>
          {tab !== "school" && (
            <div style={{ position: "relative", marginBottom: 16 }}>
              <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name..."
                style={{ width: "100%", padding: "10px 12px 10px 36px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-soft)", color: "var(--text)", fontSize: 14 }}
              />
            </div>
          )}

          {loading ? (
            <p className="text-muted" style={{ textAlign: "center", padding: 40 }}>Loading rankings...</p>
          ) : tab === "school" ? (
            <SchoolLeaderboard schools={schools} mySchoolId={profile?.school_id ?? null} />
          ) : filteredRows.length === 0 ? (
            <EmptyState tab={tab} hasSchool={!!profile?.school_id} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {filteredRows.map((r, i) => (
                <RankCard key={r.id} rank={i + 1} row={r} isMe={r.id === user?.id} />
              ))}
            </div>
          )}
        </div>
      </div>

      {myRank && tab !== "school" && (
        <div className="card fade-up" style={{ marginTop: 16, padding: 16, display: "flex", alignItems: "center", gap: 12, borderColor: "var(--gold)" }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(245,200,66,0.15)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16 }}>
            {myRank}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Your position — #{myRank}</div>
            <div className="text-muted" style={{ fontSize: 13 }}>{profile?.xp ?? 0} XP • {profile?.streak ?? 0} day streak</div>
          </div>
        </div>
      )}
    </div>
  );
}

function RankCard({ rank, row, isMe }: { rank: number; row: RankRow; isMe: boolean }) {
  const medal = rank === 1 ? "#fbbf24" : rank === 2 ? "#cbd5e1" : rank === 3 ? "#f59e0b" : null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        borderRadius: 10,
        background: isMe ? "rgba(245,200,66,0.08)" : "var(--bg-soft)",
        border: isMe ? "1px solid rgba(245,200,66,0.3)" : "1px solid transparent",
        transition: "background 0.15s",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: medal ? `${medal}22` : "var(--bg)",
          color: medal ?? "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: 15,
          flexShrink: 0,
        }}
      >
        {rank <= 3 ? <Crown size={18} /> : rank}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: isMe ? "var(--gold)" : "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {row.username}{isMe && " (You)"}
        </div>
        <div className="text-muted" style={{ fontSize: 12 }}>
          {[row.first_name, row.last_name].filter(Boolean).join(" ") || row.username}
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 15, color: "var(--gold)" }}>{row.xp.toLocaleString()}</div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 3, justifyContent: "flex-end" }}>
          {row.streak > 0 && <><Flame size={11} style={{ color: "#f97316" }} />{row.streak}</>}
        </div>
      </div>
    </div>
  );
}

function SchoolLeaderboard({ schools, mySchoolId }: { schools: SchoolRow[]; mySchoolId: string | null }) {
  if (schools.length === 0) {
    return <p className="text-muted" style={{ textAlign: "center", padding: 40 }}>No schools have joined yet. Add your school in Settings to get your school on the board!</p>;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {schools.map((s, i) => {
        const isMine = s.school_id === mySchoolId;
        const medal = i === 0 ? "#fbbf24" : i === 1 ? "#cbd5e1" : i === 2 ? "#f59e0b" : null;
        return (
          <div
            key={s.school_id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 14px",
              borderRadius: 10,
              background: isMine ? "rgba(34,211,238,0.08)" : "var(--bg-soft)",
              border: isMine ? "1px solid rgba(34,211,238,0.3)" : "1px solid transparent",
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 8, background: medal ? `${medal}22` : "var(--bg)", color: medal ?? "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, flexShrink: 0 }}>
              {i <= 2 ? <Crown size={18} /> : i + 1}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: isMine ? "#22d3ee" : "var(--text)" }}>
                {s.school_name}{isMine && " (Your school)"}
              </div>
              <div className="text-muted" style={{ fontSize: 12 }}>
                {s.member_count} member{s.member_count !== 1 ? "s" : ""}{s.city ? ` • ${s.city}` : ""}{s.country ? `, ${s.country}` : ""}
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: "var(--gold)" }}>{Math.round(s.total_xp).toLocaleString()}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>total XP</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EmptyState({ tab, hasSchool }: { tab: Tab; hasSchool: boolean }) {
  const msg =
    tab === "friends"
      ? "You haven't added any friends yet. Go to the Friends page to search and add friends."
      : tab === "school" && !hasSchool
      ? "You haven't joined a school yet. Add your school in Settings to see your school's leaderboard."
      : "No users found.";
  return <p className="text-muted" style={{ textAlign: "center", padding: 40 }}>{msg}</p>;
}
