import { useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { useSeo } from "../lib/useSeo";
import { TEACHER_PROGRAMMES, type TeachingProgramme, type TeachingSection, type TeachingTopic } from "../lib/teacherData";
import { displayName } from "../components/Navbar";
import {
  GraduationCap, Award, BookOpen, ChevronRight, ChevronDown, Target,
  Lightbulb, Activity, AlertTriangle, Layers, ArrowLeft, Settings, LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const PROG_ICONS: Record<string, any> = { GraduationCap, Award, BookOpen };
const TOPIC_ICONS: Record<string, any> = {};

function getTopicIcon(iconName: string): any {
  return TOPIC_ICONS[iconName] ?? Target;
}

export default function TeacherDashboard() {
  useSeo({ title: "Teacher Hub | Brainwave Science & Maths", description: "Teaching outlines, topic guides and activities for every year and programme." });
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [selectedProg, setSelectedProg] = useState<TeachingProgramme | null>(null);
  const [selectedSection, setSelectedSection] = useState<TeachingSection | null>(null);
  const [openTopic, setOpenTopic] = useState<string | null>(null);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const name = displayName(profile);

  // Programme picker
  if (!selectedProg) {
    return (
      <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
        <div className="fade-up" style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(245,200,66,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen size={24} style={{ color: "var(--gold)" }} />
            </div>
            <div>
              <h1 style={{ fontSize: "clamp(24px, 4vw, 34px)" }}>Teacher Hub</h1>
              <p className="text-muted" style={{ fontSize: 15 }}>Welcome{name ? `, ${name}` : ""}. Choose a programme to start planning your lessons.</p>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 28 }}>
          {TEACHER_PROGRAMMES.map((p, idx) => {
            const Icon = PROG_ICONS[p.icon] ?? GraduationCap;
            return (
              <button
                key={p.id}
                onClick={() => { setSelectedProg(p); setSelectedSection(null); setOpenTopic(null); }}
                className="card card-hover fade-up"
                style={{
                  textAlign: "left", textDecoration: "none", cursor: "pointer",
                  borderTop: `3px solid ${p.color}`,
                  animationDelay: `${idx * 80}ms`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${p.color}1f`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={22} style={{ color: p.color }} />
                  </div>
                  <h3 style={{ fontSize: 18 }}>{p.name}</h3>
                </div>
                <p className="text-muted" style={{ fontSize: 14, marginBottom: 14 }}>{p.description}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: p.color, fontWeight: 600, fontSize: 14 }}>
                  Browse {p.sections.length} {p.sections.length === 1 ? "section" : "sections"} <ChevronRight size={16} />
                </div>
              </button>
            );
          })}
        </div>

        <TeacherFooter onSignOut={handleSignOut} />
      </div>
    );
  }

  // Section list (within a programme)
  if (selectedProg && !selectedSection) {
    return (
      <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
        <button
          onClick={() => setSelectedProg(null)}
          style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontWeight: 600, fontSize: 14, marginBottom: 20, background: "none", border: "none", cursor: "pointer" }}
        >
          <ArrowLeft size={16} /> All programmes
        </button>

        <div className="fade-up" style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${selectedProg.color}1f`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {(() => { const Icon = PROG_ICONS[selectedProg.icon] ?? GraduationCap; return <Icon size={22} style={{ color: selectedProg.color }} />; })()}
            </div>
            <div>
              <h1 style={{ fontSize: "clamp(22px, 4vw, 30px)" }}>{selectedProg.name}</h1>
              <p className="text-muted" style={{ fontSize: 14 }}>{selectedProg.description}</p>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {selectedProg.sections.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => { setSelectedSection(s); setOpenTopic(null); }}
              className="card card-hover fade-up"
              style={{
                textAlign: "left", cursor: "pointer",
                animationDelay: `${idx * 70}ms`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <h3 style={{ fontSize: 17, marginBottom: 4 }}>{s.name}</h3>
                  <div className="text-muted" style={{ fontSize: 13 }}>{s.subtitle}</div>
                </div>
                <div style={{ fontSize: 12, color: selectedProg.color, fontWeight: 700, background: `${selectedProg.color}1a`, padding: "4px 10px", borderRadius: 999 }}>
                  {s.topics.length} topics
                </div>
              </div>
              <p className="text-muted" style={{ fontSize: 13, lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {s.overview}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, color: selectedProg.color, fontWeight: 600, fontSize: 13 }}>
                View topic guides <ChevronRight size={14} />
              </div>
            </button>
          ))}
        </div>

        <TeacherFooter onSignOut={handleSignOut} />
      </div>
    );
  }

  // Topic list (within a section)
  const section = selectedSection!;
  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
      <button
        onClick={() => setSelectedSection(null)}
        style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontWeight: 600, fontSize: 14, marginBottom: 20, background: "none", border: "none", cursor: "pointer" }}
      >
        <ArrowLeft size={16} /> {selectedProg.name}
      </button>

      <div className="fade-up" style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: "clamp(22px, 4vw, 30px)", marginBottom: 6 }}>{section.name}</h1>
        <p className="text-muted" style={{ fontSize: 14, marginBottom: 14 }}>{section.subtitle}</p>
        <div className="card" style={{ background: "var(--bg-soft)", borderColor: "var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontWeight: 700, fontSize: 15 }}>
            <Layers size={18} style={{ color: selectedProg.color }} /> Programme overview
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-line" }}>{section.overview}</p>
        </div>
      </div>

      <h2 style={{ fontSize: 20, marginBottom: 16 }}>Topic teaching guides</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {section.topics.map((topic, idx) => {
          const isOpen = openTopic === topic.id;
          const TIcon = getTopicIcon(topic.icon);
          return (
            <div key={topic.id} className="card fade-up" style={{ overflow: "hidden", animationDelay: `${idx * 50}ms` }}>
              <button
                onClick={() => setOpenTopic(isOpen ? null : topic.id)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${selectedProg.color}1f`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <TIcon size={22} style={{ color: selectedProg.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 17, marginBottom: 2 }}>{topic.name}</h3>
                  <p className="text-muted" style={{ fontSize: 13 }}>{topic.description}</p>
                </div>
                {isOpen ? <ChevronDown size={20} style={{ color: "var(--text-muted)" }} /> : <ChevronRight size={20} style={{ color: "var(--text-muted)" }} />}
              </button>

              {isOpen && (
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
                  {/* Objectives */}
                  <TopicBlock icon={Target} title="Learning objectives" color="var(--success)">
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {topic.objectives.map((o, i) => <li key={i} style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 4 }}>{o}</li>)}
                    </ul>
                  </TopicBlock>

                  {/* Guidance */}
                  <TopicBlock icon={Lightbulb} title="Teaching guidance" color="var(--gold)">
                    <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0, color: "var(--text-muted)" }}>{topic.guidance}</p>
                  </TopicBlock>

                  {/* Activities */}
                  <TopicBlock icon={Activity} title="Suggested activities" color="var(--primary-light)">
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {topic.activities.map((a, i) => <li key={i} style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 4 }}>{a}</li>)}
                    </ul>
                  </TopicBlock>

                  {/* Misconceptions */}
                  <TopicBlock icon={AlertTriangle} title="Common misconceptions" color="var(--error)">
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {topic.misconceptions.map((m, i) => <li key={i} style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 4 }}>{m}</li>)}
                    </ul>
                  </TopicBlock>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <TeacherFooter onSignOut={handleSignOut} />
    </div>
  );
}

function TopicBlock({ icon: Icon, title, color, children }: { icon: any; title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontWeight: 700, fontSize: 15 }}>
        <Icon size={18} style={{ color }} /> {title}
      </div>
      <div style={{ paddingLeft: 26 }}>{children}</div>
    </div>
  );
}

function TeacherFooter({ onSignOut }: { onSignOut: () => void }) {
  return (
    <div style={{ marginTop: 36, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
      <Link to="/settings" className="btn btn-ghost" style={{ padding: "10px 20px" }}>
        <Settings size={16} /> Settings
      </Link>
      <button onClick={onSignOut} className="btn btn-ghost" style={{ padding: "10px 20px", color: "var(--error)" }}>
        <LogOut size={16} /> Sign out
      </button>
    </div>
  );
}
