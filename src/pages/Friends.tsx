import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";
import { Users, UserPlus, Search, Check, X, Flame, Clock } from "lucide-react";

type FriendRow = {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  xp: number;
  streak: number;
};

type RequestRow = {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: string;
  created_at: string;
  profile: FriendRow;
};

export default function Friends() {
  const { user, profile, sendFriendRequest, acceptFriendRequest, declineFriendRequest, removeFriend } = useAuth();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FriendRow[]>([]);
  const [searching, setSearching] = useState(false);
  const [friends, setFriends] = useState<FriendRow[]>([]);
  const [incoming, setIncoming] = useState<RequestRow[]>([]);
  const [outgoing, setOutgoing] = useState<RequestRow[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<Set<string>>(new Set());
  const [msg, setMsg] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!user) return;
    const { data: f } = await supabase
      .from("friendships")
      .select("id, requester_id, addressee_id, status, created_at")
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

    const all = (f ?? []) as any[];
    const accepted = all.filter((r) => r.status === "accepted");
    const friendIdList = accepted.map((r) => (r.requester_id === user.id ? r.addressee_id : r.requester_id));
    if (friendIdList.length > 0) {
      const { data: p } = await supabase
        .from("profiles")
        .select("id, username, first_name, last_name, xp, streak")
        .in("id", friendIdList)
        .order("xp", { ascending: false });
      setFriends((p ?? []) as FriendRow[]);
    } else {
      setFriends([]);
    }

    const incomingIds = all.filter((r) => r.addressee_id === user.id && r.status === "pending").map((r) => r.requester_id);
    if (incomingIds.length > 0) {
      const { data: p } = await supabase
        .from("profiles")
        .select("id, username, first_name, last_name, xp, streak")
        .in("id", incomingIds);
      const profiles = (p ?? []) as FriendRow[];
      setIncoming(
        all
          .filter((r) => r.addressee_id === user.id && r.status === "pending")
          .map((r) => ({
            id: r.id,
            requester_id: r.requester_id,
            addressee_id: r.addressee_id,
            status: r.status,
            created_at: r.created_at,
            profile: profiles.find((p) => p.id === r.requester_id)!,
          }))
          .filter((r) => r.profile)
      );
    } else {
      setIncoming([]);
    }

    const outgoingIds = all.filter((r) => r.requester_id === user.id && r.status === "pending").map((r) => r.addressee_id);
    if (outgoingIds.length > 0) {
      const { data: p } = await supabase
        .from("profiles")
        .select("id, username, first_name, last_name, xp, streak")
        .in("id", outgoingIds);
      const profiles = (p ?? []) as FriendRow[];
      setOutgoing(
        all
          .filter((r) => r.requester_id === user.id && r.status === "pending")
          .map((r) => ({
            id: r.id,
            requester_id: r.requester_id,
            addressee_id: r.addressee_id,
            status: r.status,
            created_at: r.created_at,
            profile: profiles.find((p) => p.id === r.addressee_id)!,
          }))
          .filter((r) => r.profile)
      );
    } else {
      setOutgoing([]);
    }

    const pendingSent = new Set<string>(
      all.filter((r) => r.requester_id === user.id && r.status === "pending").map((r) => r.addressee_id)
    );
    setSentTo(pendingSent);
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const doSearch = async () => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    const q = query.trim();
    const { data } = await supabase
      .from("profiles")
      .select("id, username, first_name, last_name, xp, streak")
      .or(`username.ilike.%${q}%,first_name.ilike.%${q}%,last_name.ilike.%${q}%`)
      .neq("id", user?.id ?? "")
      .limit(20);
    setSearchResults((data ?? []) as FriendRow[]);
    setSearching(false);
  };

  const handleSend = async (addresseeId: string) => {
    setBusy(addresseeId);
    setMsg(null);
    const { error } = await sendFriendRequest(addresseeId);
    setBusy(null);
    if (error) {
      setMsg(error);
    } else {
      setSentTo((prev) => new Set(prev).add(addresseeId));
      setMsg("Friend request sent!");
    }
    setTimeout(() => setMsg(null), 3000);
  };

  const handleAccept = async (id: string) => {
    setBusy(id);
    const { error } = await acceptFriendRequest(id);
    setBusy(null);
    if (error) setMsg(error);
    else { setMsg("You are now friends!"); setTimeout(() => setMsg(null), 2000); loadData(); }
  };

  const handleDecline = async (id: string) => {
    setBusy(id);
    const { error } = await declineFriendRequest(id);
    setBusy(null);
    if (error) setMsg(error);
    else loadData();
  };

  const handleRemove = async (id: string) => {
    setBusy(id);
    const { error } = await removeFriend(id);
    setBusy(null);
    if (error) setMsg(error);
    else loadData();
  };

  return (
    <div className="page-container">
      <div className="fade-up" style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}>
          <Users size={28} style={{ color: "var(--primary-light)" }} /> Friends
        </h1>
        <p className="text-muted" style={{ fontSize: 15 }}>
          Search for other learners by name or username, send friend requests, and compete on the friends leaderboard.
        </p>
      </div>

      {msg && (
        <div className="card fade-up" style={{ marginBottom: 16, padding: 12, borderColor: msg.includes("error") || msg.includes("Error") ? "var(--error)" : "var(--success)" }}>
          <p style={{ fontSize: 14, fontWeight: 600 }}>{msg}</p>
        </div>
      )}

      <div className="card fade-up" style={{ marginBottom: 16, padding: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <Search size={18} /> Find friends
        </h3>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && doSearch()}
            placeholder="Search by name or username..."
            style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-soft)", color: "var(--text)", fontSize: 14 }}
          />
          <button onClick={doSearch} disabled={searching} className="btn btn-primary" style={{ padding: "10px 20px", borderRadius: 10, fontWeight: 600, fontSize: 14 }}>
            {searching ? "..." : "Search"}
          </button>
        </div>

        {searchResults.length > 0 && (
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
            {searchResults.map((r) => {
              const alreadyFriend = friends.some((f) => f.id === r.id);
              const sent = sentTo.has(r.id);
              return (
                <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, background: "var(--bg-soft)" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{r.username}</div>
                    <div className="text-muted" style={{ fontSize: 12 }}>{[r.first_name, r.last_name].filter(Boolean).join(" ") || r.username} • {r.xp} XP</div>
                  </div>
                  {alreadyFriend ? (
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--success)", display: "flex", alignItems: "center", gap: 4 }}>
                      <Check size={15} /> Friends
                    </span>
                  ) : sent ? (
                    <span style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={14} /> Requested
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSend(r.id)}
                      disabled={busy === r.id}
                      style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid var(--primary)", background: "rgba(99,102,241,0.1)", color: "var(--primary-light)", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
                    >
                      <UserPlus size={14} /> {busy === r.id ? "..." : "Add"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {searchResults.length === 0 && query.trim() && !searching && (
          <p className="text-muted" style={{ fontSize: 13, marginTop: 12 }}>No users found. Try a different name or username.</p>
        )}
      </div>

      {incoming.length > 0 && (
        <div className="card fade-up" style={{ marginBottom: 16, padding: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
            Friend requests ({incoming.length})
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {incoming.map((r) => (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, background: "var(--bg-soft)" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{r.profile.username}</div>
                  <div className="text-muted" style={{ fontSize: 12 }}>{[r.profile.first_name, r.profile.last_name].filter(Boolean).join(" ") || r.profile.username} • {r.profile.xp} XP</div>
                </div>
                <button onClick={() => handleAccept(r.id)} disabled={busy === r.id} style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: "var(--success)", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                  <Check size={14} /> {busy === r.id ? "..." : "Accept"}
                </button>
                <button onClick={() => handleDecline(r.id)} disabled={busy === r.id} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--text-muted)", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                  <X size={14} /> Decline
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card fade-up" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          Your friends {friends.length > 0 && <span className="badge" style={{ background: "rgba(99,102,241,0.14)", color: "var(--primary-light)" }}>{friends.length}</span>}
        </h3>
        {friends.length === 0 ? (
          <p className="text-muted" style={{ fontSize: 14, textAlign: "center", padding: 24 }}>
            You don't have any friends yet. Search above to find and add friends!
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {friends.map((f) => {
              const friendshipRow = outgoing.find((o) => o.profile?.id === f.id) || incoming.find((i) => i.profile?.id === f.id);
              return (
                <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, background: "var(--bg-soft)" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(99,102,241,0.14)", color: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                    {f.username.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{f.username}</div>
                    <div className="text-muted" style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}>
                      {[f.first_name, f.last_name].filter(Boolean).join(" ") || f.username}
                      <span>• {f.xp} XP</span>
                      {f.streak > 0 && <span style={{ display: "flex", alignItems: "center", gap: 2 }}><Flame size={11} style={{ color: "#f97316" }} />{f.streak}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove((outgoing.find((o) => o.profile?.id === f.id) || incoming.find((i) => i.profile?.id === f.id) || {} as any).id)}
                    disabled={busy === f.id}
                    style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--text-muted)", fontWeight: 600, fontSize: 12, cursor: "pointer" }}
                  >
                    {busy === f.id ? "..." : "Remove"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {profile && (
        <div className="card fade-up" style={{ marginTop: 16, padding: 16, textAlign: "center" }}>
          <p className="text-muted" style={{ fontSize: 13 }}>
            Your username is <strong style={{ color: "var(--text)" }}>{profile.username}</strong>. Share it so friends can find you!
          </p>
        </div>
      )}
    </div>
  );
}
