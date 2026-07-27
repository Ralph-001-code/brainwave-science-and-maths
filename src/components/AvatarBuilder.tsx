import { useState, useEffect } from "react";
import AvatarSvg, {
  DEFAULT_AVATAR,
  parseAvatarConfig,
  SKIN_TONES,
  HAIR_COLORS,
  COSTUME_COLORS,
  EYE_COLORS,
  HAIR_STYLES,
  COSTUME_PATTERNS,
  POSES,
  ACCESSORIES,
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
  { id: "costume", label: "Costume" },
  { id: "pose", label: "Pose" },
  { id: "accessory", label: "Extras" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AvatarBuilder({ initialConfig, onSave, saving }: Props) {
  const [config, setConfig] = useState<AvatarConfig>(initialConfig ?? { ...DEFAULT_AVATAR });
  const [tab, setTab] = useState<TabId>("body");
  const [saveMsg, setSaveMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    if (initialConfig) setConfig(initialConfig);
  }, [initialConfig]);

  const update = (patch: Partial<AvatarConfig>) => setConfig((c) => ({ ...c, ...patch }));

  const handleSave = async () => {
    setSaveMsg(null);
    const { error } = await onSave(config);
    setSaveMsg(error ? { type: "err", text: error } : { type: "ok", text: "Your avatar has been saved!" });
  };

  const shuffle = () => {
    const hairstylesForType = HAIR_STYLES.filter(
      (h) => h.bodyType === "both" || h.bodyType === config.bodyType,
    );
    setConfig({
      bodyType: Math.random() > 0.5 ? "male" : "female",
      skinTone: SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)],
      hairStyle: hairstylesForType[Math.floor(Math.random() * hairstylesForType.length)].id,
      hairColor: HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)],
      costume: COSTUME_COLORS[Math.floor(Math.random() * COSTUME_COLORS.length)],
      costumePattern: COSTUME_PATTERNS[Math.floor(Math.random() * COSTUME_PATTERNS.length)].id,
      pose: POSES[Math.floor(Math.random() * POSES.length)].id,
      accessory: ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)].id,
      eyeColor: EYE_COLORS[Math.floor(Math.random() * EYE_COLORS.length)],
    });
  };

  const reset = () => setConfig({ ...DEFAULT_AVATAR });

  const availableHair = HAIR_STYLES.filter((h) => h.bodyType === "both" || h.bodyType === config.bodyType);

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
        <div style={{ position: "relative", transition: "transform 0.3s ease" }}>
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
          <Section title="Body type">
            <OptionRow>
              <ChoiceButton
                label="Male"
                selected={config.bodyType === "male"}
                onClick={() => update({ bodyType: "male", hairStyle: config.hairStyle === "long" || config.hairStyle === "ponytail" || config.hairStyle === "bun" ? "short" : config.hairStyle })}
              />
              <ChoiceButton
                label="Female"
                selected={config.bodyType === "female"}
                onClick={() => update({ bodyType: "female", hairStyle: config.hairStyle === "buzz" || config.hairStyle === "spiky" ? "long" : config.hairStyle })}
              />
            </OptionRow>
          </Section>
        )}

        {tab === "body" && (
          <Section title="Skin tone">
            <ColorRow>
              {SKIN_TONES.map((c) => (
                <Swatch key={c} color={c} selected={config.skinTone === c} onClick={() => update({ skinTone: c })} />
              ))}
            </ColorRow>
          </Section>
        )}

        {tab === "body" && (
          <Section title="Eye color">
            <ColorRow>
              {EYE_COLORS.map((c) => (
                <Swatch key={c} color={c} selected={config.eyeColor === c} onClick={() => update({ eyeColor: c })} />
              ))}
            </ColorRow>
          </Section>
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

        {tab === "costume" && (
          <>
            <Section title="Costume color">
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

        {tab === "accessory" && (
          <Section title="Accessories">
            <OptionRow>
              {ACCESSORIES.map((a) => (
                <ChoiceButton key={a.id} label={a.id === "none" ? a.label : `${a.emoji} ${a.label}`} selected={config.accessory === a.id} onClick={() => update({ accessory: a.id })} />
              ))}
            </OptionRow>
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
        width: 40,
        height: 40,
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

export { parseAvatarConfig };
