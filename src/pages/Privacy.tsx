import { Shield, Database, Mail, Eye, Lock, CheckCircle2 } from "lucide-react";
import { useSeo } from "../lib/useSeo";

export default function Privacy() {
  useSeo({ title: "Privacy Notice", description: "How Brainwave Science & Maths handles your data — what we store, how we protect it, and your rights." });
  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 80, maxWidth: 760 }}>
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(168,85,247,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
          <Shield size={28} style={{ color: "var(--primary-light)" }} />
        </div>
        <h1 style={{ fontSize: "clamp(26px, 4vw, 36px)" }}>Privacy Notice</h1>
        <p className="text-muted" style={{ fontSize: 16 }}>How Brainwave Science &amp; Maths handles your data.</p>
      </div>

      <div className="card fade-up" style={{ padding: 28, marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <Database size={20} className="text-gold" /> What we store
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 14 }}>
          When you create an account, we save your email address, username, first and last name, year group, and programme choice on our secure servers. As you take quizzes, we also store your scores, XP, streak count, and any certificates you earn.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
          {[
            "Your name and year group — so we can greet you and show the right questions",
            "Your quiz scores and XP — so you can track your progress and earn certificates",
            "Your streak count — so your daily streak is remembered",
            "Your email — only if you opt in to email updates about new content",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10, fontSize: 14 }}>
              <CheckCircle2 size={16} style={{ color: "var(--success)", flexShrink: 0, marginTop: 3 }} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card fade-up" style={{ padding: 28, marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <Lock size={20} className="text-gold" /> How we protect your data
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.7 }}>
          Your data is stored securely using Supabase, a trusted database provider. Your password is hashed and never stored in plain text. We use row-level security so only you can see and edit your own profile, scores, and settings — no other student can access your data.
        </p>
      </div>

      <div className="card fade-up" style={{ padding: 28, marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <Mail size={20} className="text-gold" /> Email updates
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.7 }}>
          Email updates are completely optional. If you opt in during sign-up or in Settings, we'll send you an email when we add new topics, quizzes, or features. You can turn this off at any time in Settings — just toggle the email notifications switch.
        </p>
      </div>

      <div className="card fade-up" style={{ padding: 28, marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <Eye size={20} className="text-gold" /> What we don't do
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            "We don't sell or share your data with advertisers",
            "We don't track you across other websites",
            "We don't store payment information (this is a free platform)",
            "We don't use your data for anything other than running your account",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10, fontSize: 14 }}>
              <CheckCircle2 size={16} style={{ color: "var(--success)", flexShrink: 0, marginTop: 3 }} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card fade-up" style={{ padding: 28 }}>
        <h2 style={{ fontSize: 20, marginBottom: 14 }}>Your rights</h2>
        <p style={{ fontSize: 15, lineHeight: 1.7 }}>
          You can update your name, year group, and email preferences at any time in Settings. If you'd like your account and all associated data deleted, please contact us through the Contact page and we'll remove it promptly.
        </p>
      </div>

      <p className="text-muted" style={{ fontSize: 13, textAlign: "center", marginTop: 24 }}>
        Last updated: {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}
      </p>
    </div>
  );
}
