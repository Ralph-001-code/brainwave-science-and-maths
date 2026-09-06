import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { getRankForXp } from "../lib/quizData";
import { LogOut, LayoutDashboard, GraduationCap, Calendar, Pencil, Settings, Layers, Award, BookOpen, Menu, X, FileText, BookOpenCheck, Trophy, Users, Sparkles } from "lucide-react";
import AvatarSvg, { parseAvatarConfig, DEFAULT_AVATAR } from "./AvatarSvg";

export function displayName(p: { first_name?: string; last_name?: string; username?: string } | null): string {
  if (!p) return "";
  const full = `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim();
  if (full) return full;
  const uname = p.username ?? "";
  if (!uname) return "";
  if (uname.includes("@")) return uname.split("@")[0];
  return uname;
}

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const onLanding = location.pathname === "/";
  const onAuth = location.pathname === "/auth";

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  if (onAuth) return null;

  const isTeacher = profile?.role === "teacher";
  const isGuardian = profile?.role === "guardian";
  const { isAdmin } = useAuth();

  const studentLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/years", label: "Years", icon: GraduationCap },
    { to: "/programmes", label: "Programmes", icon: Layers },
    { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { to: "/friends", label: "Friends", icon: Users },
    { to: "/teacher", label: "Teacher Hub", icon: BookOpenCheck },
    { to: "/past-papers", label: "Past Papers", icon: FileText },
    { to: "/pathway", label: "Pathway", icon: Award },
    { to: "/certificates", label: "Certificates", icon: BookOpen },
    { to: "/daily", label: "Daily Quiz", icon: Calendar },
    { to: "/practice", label: "Practice", icon: Pencil },
    { to: "/settings", label: "Settings", icon: Settings },
    { to: "/avatar", label: "Avatar Studio", icon: Sparkles },
  ];

  const teacherLinks = [
    { to: "/teacher", label: "Teacher Hub", icon: BookOpenCheck },
    { to: "/settings", label: "Settings", icon: Settings },
    { to: "/avatar", label: "Avatar Studio", icon: Sparkles },
  ];

  // Guardians get full student access plus a Teacher Hub link
  const guardianLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/years", label: "Years", icon: GraduationCap },
    { to: "/programmes", label: "Programmes", icon: Layers },
    { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { to: "/friends", label: "Friends", icon: Users },
    { to: "/teacher", label: "Teacher Hub", icon: BookOpenCheck },
    { to: "/past-papers", label: "Past Papers", icon: FileText },
    { to: "/pathway", label: "Pathway", icon: Award },
    { to: "/certificates", label: "Certificates", icon: BookOpen },
    { to: "/daily", label: "Daily Quiz", icon: Calendar },
    { to: "/practice", label: "Practice", icon: Pencil },
    { to: "/settings", label: "Settings", icon: Settings },
    { to: "/avatar", label: "Avatar Studio", icon: Sparkles },
  ];

  const links = isAdmin ? studentLinks : isTeacher ? teacherLinks : isGuardian ? guardianLinks : studentLinks;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const rank = profile ? getRankForXp(profile.xp) : null;

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backdropFilter: "blur(12px)",
        background: "rgba(26,11,46,0.95)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <nav className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src="/Brainwave_science_and_maths.jpeg"
            alt="Brainwave"
            style={{ width: 38, height: 38, borderRadius: 10, objectFit: "cover", border: "1px solid var(--gold)" }}
          />
          <span style={{ fontFamily: "Lexend, sans-serif", fontWeight: 700, fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
            <span>Brainwave <span className="text-gold">Science &amp; Maths</span></span>
            {isAdmin && (
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.5, color: "#1a0b2e", background: "linear-gradient(135deg, var(--gold), #e08a00)", padding: "3px 8px", borderRadius: 999 }}>
                ADMIN
              </span>
            )}
          </span>
        </Link>

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="nav-current-page">
              {(() => {
                const current = links.find((l) => location.pathname.startsWith(l.to));
                if (!current) return null;
                const Icon = current.icon;
                return <><Icon size={16} />{current.label}</>;
              })()}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: 6 }}>
              {isAdmin ? (
                <div className="badge mobile-hide" style={{ background: "linear-gradient(135deg, var(--gold), #e08a00)", color: "#1a0b2e" }}>
                  Admin
                </div>
              ) : isTeacher ? (
                <div className="badge mobile-hide" style={{ background: "rgba(245,200,66,0.14)", color: "var(--gold)" }}>
                  Teacher
                </div>
              ) : isGuardian ? (
                <div className="badge mobile-hide" style={{ background: "rgba(34,211,238,0.14)", color: "#22d3ee" }}>
                  Guardian
                </div>
              ) : (
                <>
                  <div className="badge mobile-hide" style={{ background: "rgba(245,200,66,0.14)", color: "var(--gold)" }} title="Your XP">
                    {profile?.xp ?? 0} XP
                  </div>
                  {rank && (
                    <div className="badge mobile-hide" style={{ background: "rgba(168,85,247,0.14)", color: "var(--primary-light)" }}>
                      {rank.name}
                    </div>
                  )}
                </>
              )}
              <Link to="/avatar" className="nav-avatar-btn" title="Edit your avatar" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", borderRadius: 999, padding: 2, transition: "transform 0.18s" }}>
                <div style={{ position: "relative", width: 38, height: 38, borderRadius: "50%", overflow: "hidden", border: "2px solid var(--primary)", background: "var(--bg-soft)", flexShrink: 0 }}>
                  <AvatarSvg config={profile?.avatar_config ? parseAvatarConfig(profile.avatar_config) : DEFAULT_AVATAR} size={38} />
                </div>
                <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>
                  {profile ? displayName(profile) : ""}
                </span>
              </Link>
              <button
                onClick={handleSignOut}
                aria-label="Sign out"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 12px",
                  borderRadius: 10,
                  color: "var(--text-muted)",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                <LogOut size={16} />
                <span>Sign out</span>
              </button>
            </div>
            <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu" aria-expanded={menuOpen}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link to="/auth" className="btn btn-ghost" style={{ padding: "9px 18px" }}>
              Sign in
            </Link>
            <Link to="/auth?mode=signup" className="btn btn-primary" style={{ padding: "9px 18px" }}>
              Get started
            </Link>
          </div>
        )}
      </nav>

      {menuOpen && user && (
        <div className="mobile-menu">
          {links.map((l) => {
            const active = location.pathname.startsWith(l.to);
            const Icon = l.icon;
            return (
              <Link key={l.to} to={l.to} className={`mobile-menu-link ${active ? "active" : ""}`}>
                <Icon size={20} />
                {l.label}
              </Link>
            );
          })}
          <div className="mobile-menu-footer">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, padding: "0 16px" }}>
              {isAdmin ? (
                <div className="badge" style={{ background: "linear-gradient(135deg, var(--gold), #e08a00)", color: "#1a0b2e" }}>
                  Admin
                </div>
              ) : isTeacher ? (
                <div className="badge" style={{ background: "rgba(245,200,66,0.14)", color: "var(--gold)" }}>
                  Teacher
                </div>
              ) : isGuardian ? (
                <div className="badge" style={{ background: "rgba(34,211,238,0.14)", color: "#22d3ee" }}>
                  Guardian
                </div>
              ) : (
                <>
                  <div className="badge" style={{ background: "rgba(245,200,66,0.14)", color: "var(--gold)" }}>
                    {profile?.xp ?? 0} XP
                  </div>
                  {rank && (
                    <div className="badge" style={{ background: "rgba(168,85,247,0.14)", color: "var(--primary-light)" }}>
                      {rank.name}
                    </div>
                  )}
                </>
              )}
            </div>
            <button onClick={handleSignOut} className="mobile-menu-link" style={{ color: "var(--error)", background: "transparent" }}>
              <LogOut size={20} /> Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
