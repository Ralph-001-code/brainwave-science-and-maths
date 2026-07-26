import { useState } from "react";
import { Mail, Send, CheckCircle2, AlertCircle, Youtube, MessageCircle } from "lucide-react";
import { CHANNEL } from "../lib/config";
import { useSeo } from "../lib/useSeo";

export default function Contact() {
  useSeo({ title: "Contact Us", description: "Get in touch with Brainwave Science & Maths. Send us a message and we'll get back to you." });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error("Failed to send message. Please try again.");
      setMsg({ type: "ok", text: "Thanks for your message! We'll get back to you soon." });
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      setMsg({ type: "err", text: err.message || "Something went wrong. Please email us directly." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 80, maxWidth: 720 }}>
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "clamp(26px, 4vw, 36px)" }}>Contact Us</h1>
        <p className="text-muted" style={{ fontSize: 16 }}>
          Have a question, suggestion, or need help? Send us a message and we'll get back to you.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
        {/* Form */}
        <div className="card fade-up" style={{ padding: 28 }}>
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <label style={{ display: "block" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <MessageCircle size={14} /> Your name
              </span>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
            </label>
            <label style={{ display: "block" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <Mail size={14} /> Email
              </span>
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </label>
            <label style={{ display: "block" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Message</span>
              <textarea className="input" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help?" required rows={5} style={{ resize: "vertical" }} />
            </label>
            <button type="submit" className="btn btn-primary btn-lg" disabled={busy}>
              {busy ? <span className="spinner" /> : (<><Send size={18} /> Send message</>)}
            </button>
          </form>
          {msg && (
            <div className="pop" style={{ marginTop: 16, display: "flex", gap: 10, alignItems: "flex-start", padding: "12px 14px", borderRadius: 10, background: msg.type === "ok" ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)", border: `1px solid ${msg.type === "ok" ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`, color: msg.type === "ok" ? "var(--success)" : "var(--error)", fontSize: 14 }}>
              {msg.type === "ok" ? <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 1 }} /> : <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />}
              <span>{msg.text}</span>
            </div>
          )}
        </div>

        {/* Other ways to reach us */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card fade-up" style={{ padding: 24 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #ff1a1a, #cc0000)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <Youtube size={22} color="#fff" />
            </div>
            <h3 style={{ fontSize: 17, marginBottom: 6 }}>YouTube</h3>
            <p className="text-muted" style={{ fontSize: 14, marginBottom: 12 }}>{CHANNEL.tagline}</p>
            <a href={CHANNEL.url} target="_blank" rel="noopener noreferrer" className="btn btn-youtube" style={{ padding: "8px 16px", fontSize: 14 }}>
              <Youtube size={16} /> {CHANNEL.name}
            </a>
          </div>
          <div className="card fade-up" style={{ padding: 24 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(168,85,247,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <Mail size={22} style={{ color: "var(--primary-light)" }} />
            </div>
            <h3 style={{ fontSize: 17, marginBottom: 6 }}>Email us</h3>
            <p className="text-muted" style={{ fontSize: 14, marginBottom: 12 }}>Prefer email? Reach us directly:</p>
            <a href={`mailto:${CHANNEL.handle.replace("@", "")}@gmail.com`} className="btn btn-ghost" style={{ padding: "8px 16px", fontSize: 14 }}>
              <Mail size={16} /> Send email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
