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
  type Expression,
  type FacialHair,
  type OutfitType,
  type Pose,
  type Accessory,
  type Background,
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

  const setBodyType = (id: string) => {
    const bt = id as "male" | "female";
    update({
      bodyType: bt,
      hairStyle: bt === "female" && maleHair.includes(config.hairStyle) ? "long"
               : bt === "male" && femaleHair.includes(config.hairStyle) ? "short"
               : config.hairStyle,
      facialHair: bt === "female" && config.facialHair === "beard" ? "none" : config.facialHair,
    });
  };

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
              <AvatarOptionPicker
                options={[{ id: "male", label: "Male" }, { id: "female", label: "Female" }]}
                config={config}
                getValue={(id) => ({
                  bodyType: id as "male" | "female",
                  hairStyle: id === "female" && maleHair.includes(config.hairStyle) ? "long"
                           : id === "male" && femaleHair.includes(config.hairStyle) ? "short"
                           : config.hairStyle,
                  facialHair: id === "female" && config.facialHair === "beard" ? "none" : config.facialHair,
                })}
                selected={config.bodyType}
                onSelect={setBodyType}
              />
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
              <AvatarOptionPicker
                options={availableHair}
                config={config}
                patchKey="hairStyle"
                selected={config.hairStyle}
                onSelect={(id) => update({ hairStyle: id })}
              />
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
              <AvatarOptionPicker
                options={EXPRESSIONS.map((e) => ({ id: e.id, label: e.label }))}
                config={config}
                patchKey="expression"
                selected={config.expression}
                onSelect={(id) => update({ expression: id as Expression })}
              />
            </Section>
            <Section title="Facial hair">
              <AvatarOptionPicker
                options={FACIAL_HAIR.map((f) => ({ id: f.id, label: f.label }))}
                config={config}
                patchKey="facialHair"
                selected={config.facialHair}
                onSelect={(id) => update({ facialHair: id as FacialHair })}
              />
            </Section>
          </>
        )}

        {tab === "costume" && (
          <>
            <Section title="Outfit">
              <AvatarOptionPicker
                options={OUTFITS.map((o) => ({ id: o.id, label: o.label }))}
                config={config}
                patchKey="outfit"
                selected={config.outfit}
                onSelect={(id) => update({ outfit: id as OutfitType })}
              />
            </Section>
            <Section title="Colour">
              <ColorRow>
                {COSTUME_COLORS.map((c) => (
                  <Swatch key={c} color={c} selected={config.costume === c} onClick={() => update({ costume: c })} />
                ))}
              </ColorRow>
            </Section>
            <Section title="Pattern">
              <AvatarOptionPicker
                options={COSTUME_PATTERNS}
                config={config}
                patchKey="costumePattern"
                selected={config.costumePattern}
                onSelect={(id) => update({ costumePattern: id })}
              />
            </Section>
          </>
        )}

        {tab === "pose" && (
          <Section title="Choose a pose">
            <AvatarOptionPicker
              options={POSES.map((p) => ({ id: p.id, label: p.label }))}
              config={config}
              patchKey="pose"
              selected={config.pose}
              onSelect={(id) => update({ pose: id as Pose })}
            />
          </Section>
        )}

        {tab === "extras" && (
          <Section title="Accessories">
            <AvatarOptionPicker
              options={ACCESSORIES.map((a) => ({ id: a.id, label: a.label }))}
              config={config}
              patchKey="accessory"
              selected={config.accessory}
              onSelect={(id) => update({ accessory: id as Accessory })}
            />
          </Section>
        )}

        {tab === "scene" && (
          <Section title="Background">
            <AvatarOptionPicker
              options={BACKGROUNDS}
              config={config}
              patchKey="background"
              selected={config.background}
              onSelect={(id) => update({ background: id as Background })}
            />
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

function AvatarOptionPicker({
  options,
  config,
  getValue,
  selected,
  onSelect,
  patchKey,
}: {
  options: { id: string; label: string }[];
  config: AvatarConfig;
  getValue?: (id: string) => Partial<AvatarConfig>;
  selected: string;
  onSelect: (id: string) => void;
  patchKey?: keyof AvatarConfig;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: 10 }}>
      {options.map((opt) => {
        const patch: Partial<AvatarConfig> = getValue
          ? getValue(opt.id)
          : patchKey
            ? ({ [patchKey]: opt.id } as Partial<AvatarConfig>)
            : {};
        const previewConfig: AvatarConfig = { ...config, ...patch };
        const isSelected = selected === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            style={{
              borderRadius: 12,
              border: isSelected ? "2.5px solid var(--primary-light)" : "2px solid var(--border)",
              background: isSelected ? "rgba(168,85,247,0.1)" : "var(--bg-soft)",
              cursor: "pointer",
              padding: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              transition: "all 0.18s",
              transform: isSelected ? "scale(1.04)" : "scale(1)",
              boxShadow: isSelected ? "0 0 12px rgba(168,85,247,0.3)" : "none",
            }}
          >
            <AvatarSvg config={previewConfig} size={80} />
            <span style={{ fontSize: 11, fontWeight: 600, color: isSelected ? "var(--primary-light)" : "var(--text-muted)", paddingBottom: 2 }}>
              {opt.label}
            </span>
          </button>
        );
      })}
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

export { parseAvatarConfig };
