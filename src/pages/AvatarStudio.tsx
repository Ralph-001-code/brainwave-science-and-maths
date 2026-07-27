import { useAuth } from "../lib/AuthContext";
import AvatarBuilder from "../components/AvatarBuilder";
import { parseAvatarConfig, type AvatarConfig } from "../components/AvatarSvg";
import { supabase } from "../lib/supabase";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function AvatarStudio() {
  const { profile, user, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);

  const currentConfig = profile?.avatar_config ? parseAvatarConfig(profile.avatar_config) : null;

  const handleSave = async (config: AvatarConfig): Promise<{ error: string | null }> => {
    if (!user) return { error: "Not signed in." };
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ avatar_config: config as unknown as Record<string, unknown> })
      .eq("id", user.id);
    setSaving(false);
    if (error) return { error: error.message };
    await refreshProfile();
    return { error: null };
  };

  if (!profile) {
    return (
      <div className="section container" style={{ textAlign: "center" }}>
        <div className="spinner" style={{ margin: "40px auto" }} />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 80, maxWidth: 560 }}>
      <div className="fade-up" style={{ marginBottom: 24 }}>
        <Link to="/settings" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: 14, fontWeight: 600, marginBottom: 16, textDecoration: "none" }}>
          <ArrowLeft size={16} /> Back to settings
        </Link>
        <h1 style={{ fontSize: "clamp(26px, 4vw, 36px)", display: "flex", alignItems: "center", gap: 10 }}>
          <Sparkles size={28} style={{ color: "var(--primary-light)" }} /> Avatar Studio
        </h1>
        <p className="text-muted" style={{ fontSize: 16 }}>Create your character — pick a body, hair, costume and pose. Your avatar appears next to your name across Brainwave.</p>
      </div>

      <div className="card fade-up" style={{ padding: 24 }}>
        <AvatarBuilder initialConfig={currentConfig} onSave={handleSave} saving={saving} />
      </div>
    </div>
  );
}
