import { useState, useEffect } from "react";
import AvatarSvg, {
  DEFAULT_AVATAR,
  parseAvatarConfig,
  sanitizeAvatar,
  SKIN_TONES,
  HAIR_COLORS,
  COSTUME_COLORS,
  EYE_COLORS,
  HAIR_STYLES,
  COSTUME_PATTERNS,
  OUTFITS,
  POSES,
  ACCESSORIES,
  EXPRESSIONS,
  FACIAL_HAIR,
  BACKGROUNDS,
  type AvatarConfig,
} from "./AvatarSvg";
import { Check, Shuffle, RotateCcw } from "lucide-react";

type Props = {
  initialConfig: AvatarConfig | null;
  onSave: (config: AvatarConfig) => Promise<{ error: string | null }>;
  saving?: boolean;
};

const TABS = [
  { id: "body", label: "Body" },
  { id: "hair", label: "Hair" },
  { id: "face", label: "Face" },
  { id: "costume", label: "Outfit" },
  { id: "pose", label: "Pose" },
  { id: "extras", label: "Extras" },
  { id: "scene", label: "Scene" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AvatarBuilder({ initialConfig, onSave, saving }: Props) {
  const [config, setConfig] = useState<AvatarConfig>(initialConfig ? sanitizeAvatar(initialConfig) : { ...DEFAULT_AVATAR });
  const [tab, setTab] = useState<TabId>("body");
  const [saveMsg, setSaveMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    if (initialConfig) setConfig(sanitizeAvatar(initialConfig));
  }, [initialConfig]);

  const update = (patch: Partial<AvatarConfig>) => setConfig((c) => ({ ...c, ...patch }));

  const handleSave = async () => {
    setSaveMsg(null);
    const clean = sanitizeAvatar(config);
    const { error } = await onSave(clean);
    setSaveMsg(error ? { type: "err", text: error } : { type: "ok", text: "Your avatar has been saved!" });
  };

  const shuffle = () => {
    const hairstylesForType = HAIR_STYLES.filter((h) => h.bodyType === "both" || h.bodyType === config.bodyType);
    setConfig({
      bodyType: Math.random() > 0.5 ? "male" : "female",
      skinTone: SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)],
      hairStyle: hairstylesForType[Math.floor(Math.random() * hairstylesForType.length)].id,
      hairColor: HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)],
      costume: COSTUME_COLORS[Math.floor(Math.random() * COSTUME_COLORS.length)],
      costumePattern: COSTUME_PATTERNS[Math.floor(Math.random() * COSTUME_PATTERNS.length)].id,
      outfit: OUTFITS[Math.floor(Math.random() * OUTFITS.length)].id,
      pose: POSES[Math.floor(Math.random() * POSES.length)].id,
      accessory: ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)].id,
      eyeColor: EYE_COLORS[Math.floor(Math.random() * EYE_COLORS.length)],
      expression: EXPRESSIONS[Math.floor(Math.random() * EXPRESSIONS.length)].id,
      facialHair: FACIAL_HAIR[Math.floor(Math.random() * FACIAL_HAIR.length)].id,
      background: BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)].id,
    });
  };

  const reset = () => setConfig({ ...DEFAULT_AVATAR });

  const availableHair = HAIR_STYLES.filter((h) => h.bodyType === "both" || h.bodyType === config.bodyType);

  const femaleHair = ["long", "ponytail", "braid", "bun", "wavy"];
  const maleHair = ["buzz", "spiky"];

  return (
    <div>
      {/* Preview */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "28px 20px 20px",
          borderRadius: 16,
          background: "radial-gradient(circle at 50% 30%, rgba(168,85,247,0.1), transparent 70%)",
          border: "1px solid var(--border)",
          marginBottom: 20,
        }}
      >
        <div style={{ position: "relative", transition: "transform 0.3s ease" }} className="pop">
          <AvatarSvg config={config} size={200} />
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button onClick={shuffle} className="btn btn-ghost" style={{ padding: "8px 16px", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            <Shuffle size={15} /> Surprise me
          </button>
          <button onClick={reset} className="btn btn-ghost" style={{ padding: "8px 16px", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            <RotateCcw size={15} /> Reset
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, padding: 4, borderRadius: 12, background: "var(--bg-soft)", border: "1px solid var(--border)", overflowX: "auto" }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              padding: "10px 8px",
              borderRadius: 9,
              border: "none",
              background: tab === t.id ? "linear-gradient(135deg, var(--primary), var(--primary-dark))" : "transparent",
              color: tab === t.id ? "#fff" : "var(--text-muted)",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ minHeight: 120 }}>
        {tab === "body" && (
          <>
            <Section title="Body type">
              <OptionRow>
                <ChoiceButton
                  label="Male"
                  selected={config.bodyType === "male"}
                  onClick={() => update({ bodyType: "male", hairStyle: femaleHair.includes(config.hairStyle) ? "short" : config.hairStyle, facialHair: config.facialHair })}
                />
                <ChoiceButton
                  label="Female"
                  selected={config.bodyType === "female"}
                  onClick={() => update({ bodyType: "female", hairStyle: maleHair.includes(config.hairStyle) ? "long" : config.hairStyle, facialHair: config.facialHair === "beard" ? "none" : config.facialHair })}
                />
              </OptionRow>
            </Section>
            <Section title="Skin tone">
              <ColorRow>
                {SKIN_TONES.map((c) => (
                  <Swatch key={c} color={c} selected={config.skinTone === c} onClick={() => update({ skinTone: c })} />
                ))}
              </ColorRow>
            </Section>
            <Section title="Eye color">
              <ColorRow>
                {EYE_COLORS.map((c) => (
                  <Swatch key={c} color={c} selected={config.eyeColor === c} onClick={() => update({ eyeColor: c })} />
                ))}
              </ColorRow>
            </Section>
          </>
        )}

        {tab === "hair" && (
          <>
            <Section title="Hair style">
              <OptionRow>
                {availableHair.map((h) => (
                  <ChoiceButton key={h.id} label={h.label} selected={config.hairStyle === h.id} onClick={() => update({ hairStyle: h.id })} />
                ))}
              </OptionRow>
            </Section>
            <Section title="Hair color">
              <ColorRow>
                {HAIR_COLORS.map((c) => (
                  <Swatch key={c} color={c} selected={config.hairColor === c} onClick={() => update({ hairColor: c })} />
                ))}
              </ColorRow>
            </Section>
          </>
        )}

        {tab === "face" && (
          <>
            <Section title="Expression">
              <OptionRow>
                {EXPRESSIONS.map((e) => (
                  <ChoiceButton key={e.id} label={`${e.emoji} ${e.label}`} selected={config.expression === e.id} onClick={() => update({ expression: e.id })} />
                ))}
              </OptionRow>
            </Section>
            <Section title="Facial hair">
              <OptionRow>
                {FACIAL_HAIR.map((f) => (
                  <ChoiceButton key={f.id} label={f.id === "none" ? f.label : `${f.emoji} ${f.label}`} selected={config.facialHair === f.id} onClick={() => update({ facialHair: f.id })} />
                ))}
              </OptionRow>
            </Section>
          </>
        )}

        {tab === "costume" && (
          <>
            <Section title="Outfit">
              <OptionRow>
                {OUTFITS.map((o) => (
                  <ChoiceButton key={o.id} label={`${o.emoji} ${o.label}`} selected={config.outfit === o.id} onClick={() => update({ outfit: o.id })} />
                ))}
              </OptionRow>
            </Section>
            <Section title="Colour">
              <ColorRow>
                {COSTUME_COLORS.map((c) => (
                  <Swatch key={c} color={c} selected={config.costume === c} onClick={() => update({ costume: c })} />
                ))}
              </ColorRow>
            </Section>
            <Section title="Pattern">
              <OptionRow>
                {COSTUME_PATTERNS.map((p) => (
                  <ChoiceButton key={p.id} label={p.label} selected={config.costumePattern === p.id} onClick={() => update({ costumePattern: p.id })} />
                ))}
              </OptionRow>
            </Section>
          </>
        )}

        {tab === "pose" && (
          <Section title="Choose a pose">
            <OptionRow>
              {POSES.map((p) => (
                <ChoiceButton key={p.id} label={`${p.emoji} ${p.label}`} selected={config.pose === p.id} onClick={() => update({ pose: p.id })} />
              ))}
            </OptionRow>
          </Section>
        )}

        {tab === "extras" && (
          <Section title="Accessories">
            <OptionRow>
              {ACCESSORIES.map((a) => (
                <ChoiceButton key={a.id} label={a.id === "none" ? a.label : `${a.emoji} ${a.label}`} selected={config.accessory === a.id} onClick={() => update({ accessory: a.id })} />
              ))}
            </OptionRow>
          </Section>
        )}

        {tab === "scene" && (
          <Section title="Background">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {BACKGROUNDS.map((b) => (
                <BackgroundTile key={b.id} bg={b.id} label={b.label} selected={config.background === b.id} onClick={() => update({ background: b.id })} />
              ))}
            </div>
          </Section>
        )}
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="btn btn-primary"
        style={{ width: "100%", padding: "14px", fontSize: 16, fontWeight: 700, marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
      >
        {saving ? <span className="spinner" /> : (<><Check size={18} /> Save avatar</>)}
      </button>

      {saveMsg && (
        <div
          className="pop"
          style={{
            marginTop: 14,
            padding: "10px 14px",
            borderRadius: 10,
            background: saveMsg.type === "ok" ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
            border: `1px solid ${saveMsg.type === "ok" ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`,
            color: saveMsg.type === "ok" ? "var(--success)" : "var(--error)",
            fontSize: 14,
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          {saveMsg.text}
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>{title}</div>
      {children}
    </div>
  );
}

function OptionRow({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{children}</div>;
}

function ChoiceButton({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 16px",
        borderRadius: 10,
        border: `1px solid ${selected ? "var(--primary)" : "var(--border)"}`,
        background: selected ? "rgba(168,85,247,0.12)" : "var(--bg-soft)",
        color: selected ? "var(--primary-light)" : "var(--text)",
        fontWeight: 600,
        fontSize: 13,
        cursor: "pointer",
        transition: "all 0.18s",
        transform: selected ? "scale(1.03)" : "scale(1)",
      }}
    >
      {selected && <Check size={13} style={{ display: "inline", marginRight: 4, verticalAlign: -1 }} />}
      {label}
    </button>
  );
}

function ColorRow({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{children}</div>;
}

function Swatch({ color, selected, onClick }: { color: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 38,
        height: 38,
        borderRadius: "50%",
        border: selected ? "3px solid var(--primary-light)" : "3px solid transparent",
        background: color,
        cursor: "pointer",
        transition: "all 0.18s",
        transform: selected ? "scale(1.12)" : "scale(1)",
        boxShadow: selected ? "0 0 12px rgba(192,132,252,0.4)" : "0 2px 4px rgba(0,0,0,0.2)",
      }}
      aria-label={`Color ${color}`}
    />
  );
}

const BG_COLORS: Record<string, [string, string]> = {
  glow: ["#a855f7", "#241338"],
  sky: ["#38bdf8", "#0c4a6e"],
  sunset: ["#fb923c", "#7c2d12"],
  space: ["#3b0764", "#020617"],
  mint: ["#6ee7b7", "#065f46"],
  bubblegum: ["#f9a8d4", "#831843"],
  forest: ["#86efac", "#14532d"],
  none: ["#241338", "#1a0b2e"],
};

function BackgroundTile({ bg, label, selected, onClick }: { bg: string; label: string; selected: boolean; onClick: () => void }) {
  const [c1, c2] = BG_COLORS[bg] ?? ["#241338", "#1a0b2e"];
  return (
    <button
      onClick={onClick}
      style={{
        borderRadius: 12,
        border: selected ? "2px solid var(--primary-light)" : "2px solid transparent",
        background: `linear-gradient(135deg, ${c1}, ${c2})`,
        cursor: "pointer",
        transition: "all 0.18s",
        transform: selected ? "scale(1.05)" : "scale(1)",
        padding: "16px 4px 8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      {selected && <Check size={12} style={{ color: "#fff" }} />}
      <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>{label}</span>
    </button>
  );
}

export { parseAvatarConfig };
