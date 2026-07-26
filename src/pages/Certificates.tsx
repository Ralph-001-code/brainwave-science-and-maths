import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { supabase } from "../lib/supabase";
import { displayName } from "../components/Navbar";
import { PROGRAMMES } from "../lib/quizData";
import type { Certificate, PathwayProgress } from "../lib/supabase";
import {
  Award, Trophy, Download, Star, GraduationCap, BookOpen, ArrowRight,
  Sparkles, CheckCircle2, Target,
} from "lucide-react";

export default function Certificates() {
  const { user, profile } = useAuth();
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [pathwayProgress, setPathwayProgress] = useState<Record<string, PathwayProgress>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: c } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", user.id)
        .order("issued_at", { ascending: false });
      setCerts((c as Certificate[]) ?? []);

      const { data: pp } = await supabase
        .from("pathway_progress")
        .select("*")
        .eq("user_id", user.id);
      const map: Record<string, PathwayProgress> = {};
      (pp as PathwayProgress[] | null)?.forEach((p) => { map[`${p.programme}:${p.stage ?? ""}:${p.topic_id}`] = p; });
      setPathwayProgress(map);
      setLoading(false);
    })();
  }, [user]);

  const name = displayName(profile);
  const today = new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });

  const downloadCert = (cert: Certificate) => {
    const html = generateCertHTML(cert.student_name || name, cert.title, cert.score, new Date(cert.issued_at).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" }));
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `certificate-${cert.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 80, maxWidth: 920 }}>
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <Award size={26} className="text-gold" />
          <h1 style={{ fontSize: "clamp(24px, 4vw, 32px)", margin: 0 }}>Certificates</h1>
        </div>
        <p className="text-muted" style={{ fontSize: 16, maxWidth: 620 }}>
          Complete all topics in a course pathway to earn a certificate of achievement. Download and print your certificates to celebrate your success!
        </p>
      </div>

      {loading ? (
        <div className="spinner" style={{ margin: "40px auto" }} />
      ) : certs.length === 0 ? (
        <div className="card fade-up" style={{ textAlign: "center", padding: 48 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: "rgba(245,200,66,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Trophy size={36} className="text-gold" />
          </div>
          <h2 style={{ fontSize: 22, marginBottom: 10 }}>No certificates yet</h2>
          <p className="text-muted" style={{ fontSize: 15, marginBottom: 24, maxWidth: 420, margin: "0 auto 24px" }}>
            Complete all topics in a course pathway to earn your first certificate. Start by following your learning pathway.
          </p>
          <Link to="/pathway" className="btn btn-primary">
            <Target size={16} /> Go to your pathway <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <>
          {/* Earned certificates */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
            {certs.map((cert, i) => {
              const progInfo = PROGRAMMES.find((p) => p.id === cert.programme);
              const accent = progInfo?.color ?? "var(--gold)";
              return (
                <div key={cert.id} className="card fade-up cert-card" style={{
                  padding: 0, overflow: "hidden", animationDelay: `${i * 80}ms`,
                  border: `2px solid ${accent}40`,
                }}>
                  {/* Certificate visual */}
                  <div style={{
                    padding: 28, textAlign: "center",
                    background: `linear-gradient(135deg, ${accent}0a, ${accent}15)`,
                    borderBottom: `1px solid ${accent}30`,
                  }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: `${accent}1f`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                      <Award size={28} style={{ color: accent }} />
                    </div>
                    <div className="text-muted" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Certificate of Achievement</div>
                    <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6, fontFamily: "Lexend" }}>{cert.title}</div>
                    <div style={{ fontSize: 15, color: "var(--text)" }}>Awarded to</div>
                    <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "Lexend", color: accent, margin: "4px 0 12px" }}>{cert.student_name || name}</div>
                    <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "Lexend", color: "var(--success)" }}>{cert.score}%</div>
                        <div className="text-muted" style={{ fontSize: 11 }}>Average Score</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, paddingTop: 8 }}>{new Date(cert.issued_at).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" })}</div>
                        <div className="text-muted" style={{ fontSize: 11 }}>Date Issued</div>
                      </div>
                    </div>
                    {/* Seal */}
                    <div style={{ width: 50, height: 50, borderRadius: "50%", border: `2px solid ${accent}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "12px auto 0" }}>
                      <Star size={22} style={{ color: accent, fill: accent }} />
                    </div>
                  </div>
                  {/* Actions */}
                  <div style={{ padding: 16, display: "flex", gap: 10 }}>
                    <button onClick={() => downloadCert(cert)} className="btn btn-ghost" style={{ flex: 1, fontSize: 13 }}>
                      <Download size={15} /> Download
                    </button>
                    <button onClick={() => printCert(cert, name)} className="btn btn-ghost" style={{ flex: 1, fontSize: 13 }}>
                      <BookOpen size={15} /> Print
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tip */}
          <div className="card fade-up" style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 14 }}>
            <Sparkles size={22} className="text-gold" />
            <p className="text-muted" style={{ fontSize: 14, margin: 0 }}>
              Earn more certificates by completing all topics in other programmes. Visit your <Link to="/pathway" style={{ color: "var(--primary-light)", fontWeight: 600 }}>learning pathway</Link> to continue.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function printCert(cert: Certificate, fallbackName: string) {
  const html = generateCertHTML(cert.student_name || fallbackName, cert.title, cert.score, new Date(cert.issued_at).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" }));
  const w = window.open("", "_blank");
  if (w) {
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 300);
  }
}

function generateCertHTML(studentName: string, title: string, score: number, dateStr: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Certificate - ${title}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; background: #f4f0fa; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
  .cert { width: 800px; max-width: 100%; background: #fff; border: 3px solid #a855f7; border-radius: 16px; padding: 60px 50px; position: relative; box-shadow: 0 20px 60px rgba(0,0,0,0.1); }
  .cert::before { content: ""; position: absolute; inset: 12px; border: 1px solid #a855f740; border-radius: 10px; pointer-events: none; }
  .corner { position: absolute; width: 60px; height: 60px; }
  .corner-tl { top: 20px; left: 20px; border-top: 2px solid #f5c842; border-left: 2px solid #f5c842; border-radius: 8px 0 0 0; }
  .corner-tr { top: 20px; right: 20px; border-top: 2px solid #f5c842; border-right: 2px solid #f5c842; border-radius: 0 8px 0 0; }
  .corner-bl { bottom: 20px; left: 20px; border-bottom: 2px solid #f5c842; border-left: 2px solid #f5c842; border-radius: 0 0 0 8px; }
  .corner-br { bottom: 20px; right: 20px; border-bottom: 2px solid #f5c842; border-right: 2px solid #f5c842; border-radius: 0 0 8px 0; }
  .logo { text-align: center; margin-bottom: 30px; }
  .logo .brand { font-size: 28px; font-weight: 700; color: #a855f7; letter-spacing: -0.5px; }
  .logo .brand span { color: #f5c842; }
  .label { text-align: center; font-size: 13px; letter-spacing: 3px; text-transform: uppercase; color: #888; margin-bottom: 8px; }
  .title { text-align: center; font-size: 36px; color: #1a1a2e; margin-bottom: 30px; }
  .awarded { text-align: center; font-size: 16px; color: #666; }
  .name { text-align: center; font-size: 42px; font-weight: 700; color: #a855f7; margin: 10px 0 30px; border-bottom: 2px solid #f5c84240; display: inline-block; padding: 0 40px 8px; }
  .name-wrap { text-align: center; }
  .desc { text-align: center; font-size: 17px; color: #444; max-width: 500px; margin: 0 auto 30px; line-height: 1.6; }
  .stats { display: flex; justify-content: center; gap: 50px; margin-bottom: 40px; }
  .stat { text-align: center; }
  .stat .val { font-size: 32px; font-weight: 700; color: #34d399; }
  .stat .lbl { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px; }
  .seal { width: 80px; height: 80px; border: 3px solid #f5c842; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 32px; }
  .footer { display: flex; justify-content: space-between; padding-top: 20px; border-top: 1px solid #eee; }
  .footer .field { font-size: 13px; color: #666; }
  .footer .field strong { display: block; font-size: 15px; color: #1a1a2e; margin-top: 4px; }
  @media print { body { background: #fff; padding: 0; } .cert { box-shadow: none; } }
</style>
</head>
<body>
  <div class="cert">
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>
    <div class="logo"><div class="brand">Brainwave <span>Science &amp; Maths</span></div></div>
    <div class="label">Certificate of Achievement</div>
    <div class="title">${title}</div>
    <div class="awarded">This certificate is proudly presented to</div>
    <div class="name-wrap"><div class="name">${studentName}</div></div>
    <div class="desc">For successfully completing all topics in the course pathway with dedication and excellence.</div>
    <div class="stats">
      <div class="stat"><div class="val">${score}%</div><div class="lbl">Average Score</div></div>
      <div class="stat"><div class="val">${dateStr}</div><div class="lbl">Date Issued</div></div>
    </div>
    <div class="seal">&#11088;</div>
    <div class="footer">
      <div class="field">Issued by<strong>Brainwave Science &amp; Maths</strong></div>
      <div class="field">Verify at<strong>brainwave.science</strong></div>
    </div>
  </div>
</body>
</html>`;
}
