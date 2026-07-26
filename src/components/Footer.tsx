import { Link } from "react-router-dom";
import { Youtube, Mail, BookOpen, GraduationCap, Calendar, Pencil, Award, Shield, ArrowRight } from "lucide-react";
import { CHANNEL } from "../lib/config";

export default function Footer() {
  const year = new Date().getFullYear();

  const links = [
    { to: "/years", label: "Year Groups", icon: GraduationCap },
    { to: "/programmes", label: "Programmes", icon: BookOpen },
    { to: "/daily", label: "Daily Quiz", icon: Calendar },
    { to: "/practice", label: "Practice", icon: Pencil },
    { to: "/pathway", label: "Learning Pathway", icon: Award },
    { to: "/contact", label: "Contact Us", icon: Mail },
    { to: "/privacy", label: "Privacy", icon: Shield },
  ];

  return (
    <footer style={{ borderTop: "1px solid var(--border)", background: "var(--bg-soft)", marginTop: "auto" }}>
      <div className="container" style={{ paddingTop: 48, paddingBottom: 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <img
                src="/Brainwave_science_and_maths.jpeg"
                alt="Brainwave"
                style={{ width: 36, height: 36, borderRadius: 9, objectFit: "cover", border: "1px solid var(--gold)" }}
              />
              <span style={{ fontWeight: 700, fontFamily: "Lexend", fontSize: 17 }}>
                Brainwave <span className="text-gold">Science &amp; Maths</span>
              </span>
            </div>
            <p className="text-muted" style={{ fontSize: 14, marginBottom: 16, maxWidth: 280 }}>
              Maths and science for every year group. Learn, practice, and master Cambridge-style questions — from Year 1 to IGCSE.
            </p>
            <a href={CHANNEL.url} target="_blank" rel="noopener noreferrer" className="btn btn-youtube" style={{ padding: "8px 16px", fontSize: 14 }}>
              <Youtube size={16} /> Subscribe
            </a>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Explore</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {links.slice(0, 5).map((l) => (
                <Link key={l.to} to={l.to} className="text-muted footer-link">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Support</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {links.slice(5).map((l) => (
                <Link key={l.to} to={l.to} className="text-muted footer-link">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div>
            <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Get started</h4>
            <p className="text-muted" style={{ fontSize: 14, marginBottom: 14 }}>
              Free to join. Pick your year and start earning XP today.
            </p>
            <Link to="/auth?mode=signup" className="btn btn-primary" style={{ padding: "10px 20px", fontSize: 14 }}>
              Create account <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div style={{ marginTop: 36, paddingTop: 20, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p className="text-muted" style={{ fontSize: 13 }}>
            &copy; {year} Brainwave Science &amp; Maths. All rights reserved.
          </p>
          <p className="text-muted" style={{ fontSize: 13 }}>
            Made for students. Learn. Practice. Master.
          </p>
        </div>
      </div>
    </footer>
  );
}
