// SVG avatar renderer — smooth, organic Duolingo-style character.
// All body parts use bezier curves + rounded capsules (no boxy rectangles).

export type OutfitType =
  | "tshirt"
  | "hoodie"
  | "labcoat"
  | "hero"
  | "gown"
  | "astronaut"
  | "ninja"
  | "jersey";

export type Expression = "smile" | "grin" | "cool" | "surprised" | "wink" | "neutral";

export type FacialHair = "none" | "mustache" | "beard" | "goatee" | "stubble";

export type Background =
  | "glow"
  | "sky"
  | "sunset"
  | "space"
  | "mint"
  | "bubblegum"
  | "forest"
  | "none";

export type Pose =
  | "wave"
  | "stand"
  | "think"
  | "celebrate"
  | "read"
  | "point"
  | "fistpump"
  | "sit";

export type Accessory =
  | "none"
  | "cap"
  | "crown"
  | "glasses"
  | "headband"
  | "headphones"
  | "mask"
  | "bowtie"
  | "scarf"
  | "eyepatch"
  | "halo"
  | "antennae"
  | "sunglasses";

export type AvatarConfig = {
  bodyType: "male" | "female";
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  costume: string;
  costumePattern: string;
  outfit: OutfitType;
  pose: Pose;
  accessory: Accessory;
  eyeColor: string;
  expression: Expression;
  facialHair: FacialHair;
  background: Background;
};

export const DEFAULT_AVATAR: AvatarConfig = {
  bodyType: "male",
  skinTone: "#f4c2a1",
  hairStyle: "short",
  hairColor: "#3b2317",
  costume: "#a855f7",
  costumePattern: "solid",
  outfit: "tshirt",
  pose: "wave",
  accessory: "none",
  eyeColor: "#3b2317",
  expression: "smile",
  facialHair: "none",
  background: "glow",
};

export const SKIN_TONES = [
  "#fde4cc", "#f4c2a1", "#e8b88a", "#d4a373", "#c08552", "#a06a40", "#7a4f2a", "#5c3317",
];
export const HAIR_COLORS = [
  "#1a1a1a", "#3b2317", "#6b4226", "#8b5a2b", "#a0703c", "#d4a017", "#e8b400",
  "#c0392b", "#a020f0", "#7b68ee", "#ff6ec7", "#3b82f6", "#10b981", "#6b7280",
];
export const COSTUME_COLORS = [
  "#a855f7", "#d946ef", "#f5c842", "#34d399", "#22d3ee", "#f87171", "#fb923c",
  "#60a5fa", "#ec4899", "#14b8a6", "#f43f5e", "#8b5cf6", "#facc15", "#4ade80",
  "#38bdf8", "#fb7185", "#f97316", "#a78bfa",
];
export const EYE_COLORS = ["#3b2317", "#1a1a1a", "#2563eb", "#16a34a", "#7b68ee", "#c0392b", "#0891b2", "#a16207"];

export const HAIR_STYLES: { id: string; label: string; bodyType: "male" | "female" | "both" }[] = [
  { id: "short", label: "Short", bodyType: "male" },
  { id: "buzz", label: "Buzz cut", bodyType: "male" },
  { id: "spiky", label: "Spiky", bodyType: "male" },
  { id: "mohawk", label: "Mohawk", bodyType: "both" },
  { id: "sideshave", label: "Side shave", bodyType: "both" },
  { id: "curly", label: "Curly", bodyType: "both" },
  { id: "afro", label: "Afro", bodyType: "both" },
  { id: "wavy", label: "Wavy", bodyType: "female" },
  { id: "long", label: "Long", bodyType: "female" },
  { id: "ponytail", label: "Ponytail", bodyType: "female" },
  { id: "braid", label: "Braid", bodyType: "female" },
  { id: "bun", label: "Bun", bodyType: "female" },
  { id: "topknot", label: "Top knot", bodyType: "both" },
  { id: "bald", label: "Bald", bodyType: "both" },
];

export const COSTUME_PATTERNS: { id: string; label: string }[] = [
  { id: "solid", label: "Solid" },
  { id: "stripes", label: "Stripes" },
  { id: "dots", label: "Dots" },
  { id: "star", label: "Star" },
  { id: "hex", label: "Hex" },
  { id: "lightning", label: "Lightning" },
];

export const OUTFITS: { id: OutfitType; label: string; emoji: string }[] = [
  { id: "tshirt", label: "T-shirt", emoji: "👕" },
  { id: "hoodie", label: "Hoodie", emoji: "🧥" },
  { id: "jersey", label: "Jersey", emoji: "🏒" },
  { id: "labcoat", label: "Lab coat", emoji: "🥼" },
  { id: "hero", label: "Hero cape", emoji: "🦸" },
  { id: "gown", label: "Grad gown", emoji: "🎓" },
  { id: "astronaut", label: "Astronaut", emoji: "🧑‍🚀" },
  { id: "ninja", label: "Ninja", emoji: "🥷" },
];

export const POSES: { id: Pose; label: string; emoji: string }[] = [
  { id: "wave", label: "Wave", emoji: "👋" },
  { id: "stand", label: "Stand", emoji: "🧍" },
  { id: "think", label: "Think", emoji: "🤔" },
  { id: "celebrate", label: "Celebrate", emoji: "🎉" },
  { id: "read", label: "Read", emoji: "📖" },
  { id: "point", label: "Point", emoji: "👉" },
  { id: "fistpump", label: "Fist pump", emoji: "✊" },
  { id: "sit", label: "Sit", emoji: "🪑" },
];

export const ACCESSORIES: { id: Accessory; label: string; emoji: string }[] = [
  { id: "none", label: "None", emoji: "—" },
  { id: "cap", label: "Cap", emoji: "🧢" },
  { id: "crown", label: "Crown", emoji: "👑" },
  { id: "glasses", label: "Glasses", emoji: "👓" },
  { id: "sunglasses", label: "Sunglasses", emoji: "🕶️" },
  { id: "headband", label: "Headband", emoji: "🎀" },
  { id: "headphones", label: "Headphones", emoji: "🎧" },
  { id: "mask", label: "Mask", emoji: "😷" },
  { id: "bowtie", label: "Bow tie", emoji: "蝴蝶" },
  { id: "scarf", label: "Scarf", emoji: "🧣" },
  { id: "eyepatch", label: "Eye patch", emoji: "🏴‍☠️" },
  { id: "halo", label: "Halo", emoji: "😇" },
  { id: "antennae", label: "Antennae", emoji: "👽" },
];

export const EXPRESSIONS: { id: Expression; label: string; emoji: string }[] = [
  { id: "smile", label: "Smile", emoji: "🙂" },
  { id: "grin", label: "Grin", emoji: "😄" },
  { id: "cool", label: "Cool", emoji: "😎" },
  { id: "surprised", label: "Surprised", emoji: "😲" },
  { id: "wink", label: "Wink", emoji: "😉" },
  { id: "neutral", label: "Neutral", emoji: "😐" },
];

export const FACIAL_HAIR: { id: FacialHair; label: string; emoji: string }[] = [
  { id: "none", label: "None", emoji: "—" },
  { id: "mustache", label: "Mustache", emoji: "👨" },
  { id: "goatee", label: "Goatee", emoji: "🐐" },
  { id: "beard", label: "Beard", emoji: "🧔" },
  { id: "stubble", label: "Stubble", emoji: " shave" },
];

export const BACKGROUNDS: { id: Background; label: string }[] = [
  { id: "glow", label: "Glow" },
  { id: "sky", label: "Sky" },
  { id: "sunset", label: "Sunset" },
  { id: "space", label: "Space" },
  { id: "mint", label: "Mint" },
  { id: "bubblegum", label: "Bubblegum" },
  { id: "forest", label: "Forest" },
  { id: "none", label: "None" },
];

const BG_DEFS: Record<Background, { stops: [string, string] }> = {
  glow: { stops: ["#a855f7", "#241338"] },
  sky: { stops: ["#38bdf8", "#0c4a6e"] },
  sunset: { stops: ["#fb923c", "#7c2d12"] },
  space: { stops: ["#3b0764", "#020617"] },
  mint: { stops: ["#6ee7b7", "#065f46"] },
  bubblegum: { stops: ["#f9a8d4", "#831843"] },
  forest: { stops: ["#86efac", "#14532d"] },
  none: { stops: ["#241338", "#1a0b2e"] },
};

// --- color helpers ---
function darken(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `#${Math.max(0, Math.round(r * (1 - amount))).toString(16).padStart(2, "0")}${Math.max(0, Math.round(g * (1 - amount))).toString(16).padStart(2, "0")}${Math.max(0, Math.round(b * (1 - amount))).toString(16).padStart(2, "0")}`;
}
function lighten(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `#${Math.min(255, Math.round(r + (255 - r) * amount)).toString(16).padStart(2, "0")}${Math.min(255, Math.round(g + (255 - g) * amount)).toString(16).padStart(2, "0")}${Math.min(255, Math.round(b + (255 - b) * amount)).toString(16).padStart(2, "0")}`;
}

export function parseAvatarConfig(raw: unknown): AvatarConfig {
  const base: AvatarConfig = { ...DEFAULT_AVATAR };
  if (!raw || typeof raw !== "object") return base;
  const o = raw as Record<string, unknown>;
  if (typeof o.bodyType === "string") base.bodyType = o.bodyType as AvatarConfig["bodyType"];
  if (typeof o.skinTone === "string") base.skinTone = o.skinTone;
  if (typeof o.hairStyle === "string") base.hairStyle = o.hairStyle;
  if (typeof o.hairColor === "string") base.hairColor = o.hairColor;
  if (typeof o.costume === "string") base.costume = o.costume;
  if (typeof o.costumePattern === "string") base.costumePattern = o.costumePattern;
  if (typeof o.outfit === "string") base.outfit = o.outfit as OutfitType;
  if (typeof o.pose === "string") base.pose = o.pose as Pose;
  if (typeof o.accessory === "string") base.accessory = o.accessory as Accessory;
  if (typeof o.eyeColor === "string") base.eyeColor = o.eyeColor;
  if (typeof o.expression === "string") base.expression = o.expression as Expression;
  if (typeof o.facialHair === "string") base.facialHair = o.facialHair as FacialHair;
  if (typeof o.background === "string") base.background = o.background as Background;
  return base;
}

const VALID: Record<string, string[]> = {
  hairStyle: HAIR_STYLES.map((h) => h.id),
  outfit: OUTFITS.map((o) => o.id),
  pose: POSES.map((p) => p.id),
  accessory: ACCESSORIES.map((a) => a.id),
  expression: EXPRESSIONS.map((e) => e.id),
  facialHair: FACIAL_HAIR.map((f) => f.id),
  background: BACKGROUNDS.map((b) => b.id),
};
export function sanitizeAvatar(c: AvatarConfig): AvatarConfig {
  const out = { ...c };
  if (!VALID.hairStyle.includes(out.hairStyle)) out.hairStyle = DEFAULT_AVATAR.hairStyle;
  if (!VALID.outfit.includes(out.outfit)) out.outfit = DEFAULT_AVATAR.outfit;
  if (!VALID.pose.includes(out.pose)) out.pose = DEFAULT_AVATAR.pose;
  if (!VALID.accessory.includes(out.accessory)) out.accessory = DEFAULT_AVATAR.accessory;
  if (!VALID.expression.includes(out.expression)) out.expression = DEFAULT_AVATAR.expression;
  if (!VALID.facialHair.includes(out.facialHair)) out.facialHair = DEFAULT_AVATAR.facialHair;
  if (!VALID.background.includes(out.background)) out.background = DEFAULT_AVATAR.background;
  return out;
}

// Pose-driven arm endpoints
function armTargets(pose: Pose): { rX: number; rY: number; lX: number; lY: number; tilt: number; sit: boolean } {
  switch (pose) {
    case "wave": return { rX: 138, rY: 70, lX: 72, lY: 116, tilt: 0, sit: false };
    case "celebrate": return { rX: 150, rY: 50, lX: 60, lY: 58, tilt: 0, sit: false };
    case "think": return { rX: 128, lX: 134, lY: 60, rY: 116, tilt: -6, sit: false };
    case "read": return { rX: 108, rY: 92, lX: 92, lY: 92, tilt: 4, sit: false };
    case "point": return { rX: 158, rY: 108, lX: 72, lY: 116, tilt: 0, sit: false };
    case "fistpump": return { rX: 130, rY: 48, lX: 70, lY: 116, tilt: 0, sit: false };
    case "sit": return { rX: 128, rY: 96, lX: 72, lY: 96, tilt: 0, sit: true };
    default: return { rX: 128, rY: 116, lX: 72, lY: 116, tilt: 0, sit: false };
  }
}

export default function AvatarSvg({ config, size = 200 }: { config: AvatarConfig; size?: number }) {
  const c = sanitizeAvatar(config);
  const skin = c.skinTone;
  const skinShade = darken(skin, 0.18);
  const skinLight = lighten(skin, 0.12);
  const hairShade = darken(c.hairColor, 0.12);
  const costume = c.costume;
  const costumeShade = darken(costume, 0.22);
  const costumeLight = lighten(costume, 0.15);
  const a = armTargets(c.pose);
  const uid = `${c.costume.slice(1)}-${c.outfit}-${c.background}`;

  const fillFor = (solid: string): string => {
    if (c.costumePattern === "stripes") return `url(#stripes-${uid})`;
    if (c.costumePattern === "dots") return `url(#dots-${uid})`;
    if (c.costumePattern === "hex") return `url(#hex-${uid})`;
    return solid;
  };

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BG_DEFS[c.background].stops[0]} stopOpacity={c.background === "glow" ? 0.28 : 0.95} />
          <stop offset="100%" stopColor={BG_DEFS[c.background].stops[1]} stopOpacity={c.background === "glow" ? 0.04 : 0.95} />
        </linearGradient>
        <radialGradient id={`shade-${uid}`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0%" stopColor={skinLight} />
          <stop offset="100%" stopColor={skin} />
        </radialGradient>
        <linearGradient id={`torso-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={costumeLight} />
          <stop offset="100%" stopColor={costume} />
        </linearGradient>
        <pattern id={`stripes-${uid}`} width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="12" height="12" fill={costume} />
          <rect width="6" height="12" fill={costumeShade} />
        </pattern>
        <pattern id={`dots-${uid}`} width="13" height="13" patternUnits="userSpaceOnUse">
          <rect width="13" height="13" fill={costume} />
          <circle cx="6.5" cy="6.5" r="2.6" fill={costumeShade} />
        </pattern>
        <pattern id={`hex-${uid}`} width="14" height="12" patternUnits="userSpaceOnUse">
          <rect width="14" height="12" fill={costume} />
          <path d="M7 1 L11 3.5 L11 8.5 L7 11 L3 8.5 L3 3.5 Z" fill="none" stroke={costumeShade} strokeWidth="1" />
        </pattern>
      </defs>

      {/* Background disc */}
      {c.background !== "none" && <circle cx="100" cy="100" r="96" fill={`url(#bg-${uid})`} />}
      {c.background === "space" && (
        <g fill="#fff">
          <circle cx="38" cy="50" r="1.2" opacity="0.8" />
          <circle cx="165" cy="70" r="1.5" opacity="0.7" />
          <circle cx="30" cy="150" r="1" opacity="0.6" />
          <circle cx="170" cy="140" r="1.3" opacity="0.7" />
          <circle cx="60" cy="30" r="0.8" opacity="0.5" />
        </g>
      )}

      {/* Chair for sit pose */}
      {a.sit && (
        <g>
          <rect x="64" y="150" width="72" height="10" rx="5" fill="#5b3a8c" />
          <rect x="66" y="158" width="6" height="22" rx="3" fill="#4a2d70" />
          <rect x="128" y="158" width="6" height="22" rx="3" fill="#4a2d70" />
        </g>
      )}

      {/* Cape behind body for hero outfit */}
      {c.outfit === "hero" && (
        <path d="M70 112 Q56 120 54 156 Q60 162 72 156 L72 116 Z M130 112 Q144 120 146 156 Q140 162 128 156 L128 116 Z" fill={darken(costume, 0.3)} opacity="0.9" />
      )}

      {/* Legs — rounded capsules */}
      {a.sit ? (
        <g>
          <path d="M84 154 L112 154" fill="none" stroke="#2d1b4e" strokeWidth="16" strokeLinecap="round" />
          <ellipse cx="112" cy="156" rx="10" ry="6" fill="#1a0b2e" />
        </g>
      ) : (
        <g>
          <path d="M86 152 L86 180" fill="none" stroke="#2d1b4e" strokeWidth="15" strokeLinecap="round" />
          <path d="M114 152 L114 180" fill="none" stroke="#2d1b4e" strokeWidth="15" strokeLinecap="round" />
          <ellipse cx="86" cy="184" rx="11" ry="5.5" fill="#1a0b2e" />
          <ellipse cx="114" cy="184" rx="11" ry="5.5" fill="#1a0b2e" />
        </g>
      )}

      {/* Torso — smooth rounded shape */}
      <path
        d="M74 120 Q68 112 76 107 L92 104 Q100 102 108 104 L124 107 Q132 112 126 120 L128 150 Q128 156 122 156 L78 156 Q72 156 72 150 Z"
        fill={fillFor(`url(#torso-${uid})`)}
        stroke={costumeShade}
        strokeWidth="1.2"
      />
      {/* subtle inner shading on torso */}
      <path d="M78 124 Q76 140 80 152" fill="none" stroke={costumeShade} strokeWidth="6" strokeLinecap="round" opacity="0.18" />

      {/* Outfit overlays */}
      <Outfit config={c} shade={costumeShade} light={costumeLight} fillFor={fillFor} uid={uid} />

      {/* Collar */}
      <path d="M86 106 Q100 114 114 106" fill="none" stroke={costumeShade} strokeWidth="2" strokeLinecap="round" />

      {/* Arms — organic rounded strokes */}
      <path d={`M76 116 Q${a.lX - 8} ${a.lY + 12} ${a.lX} ${a.lY}`} fill="none" stroke={`url(#shade-${uid})`} strokeWidth="11" strokeLinecap="round" />
      <path d={`M124 116 Q${a.rX + 2} ${a.rY + 16} ${a.rX} ${a.rY}`} fill="none" stroke={`url(#shade-${uid})`} strokeWidth="11" strokeLinecap="round" />
      <circle cx={a.lX} cy={a.lY} r="6.5" fill={skin} />
      <circle cx={a.rX} cy={a.rY} r="6.5" fill={skin} />

      {/* Pose props */}
      {c.pose === "read" && (
        <g>
          <path d="M80 84 L100 80 L120 84 L120 110 L100 106 L80 110 Z" fill="#fafafa" stroke="#e2e2e2" strokeWidth="1" />
          <path d="M100 80 L100 106" stroke="#d4d4d4" strokeWidth="1" />
          <g stroke="#c8c8c8" strokeWidth="0.8">
            <line x1="85" y1="90" x2="97" y2="88" /><line x1="85" y1="95" x2="97" y2="93" /><line x1="85" y1="100" x2="97" y2="98" />
            <line x1="103" y1="88" x2="115" y2="90" /><line x1="103" y1="93" x2="115" y2="95" /><line x1="103" y1="98" x2="115" y2="100" />
          </g>
        </g>
      )}
      {c.pose === "point" && (
        <g>
          <path d={`M${a.rX} ${a.rY} L168 108 L168 116 L${a.rX + 4} ${a.rY + 4}`} fill={skin} />
        </g>
      )}
      {c.pose === "fistpump" && (
        <g>
          <circle cx={a.rX} cy={a.rY} r="8" fill={skin} />
          <path d={`M${a.rX - 5} ${a.rY} q4 -6 8 0`} fill="none" stroke={skinShade} strokeWidth="1.5" />
        </g>
      )}

      {/* Head group */}
      <g transform={`rotate(${a.tilt} 100 70)`}>
        {/* Neck */}
        <path d="M92 98 Q92 106 90 112 L110 112 Q108 106 108 98 Z" fill={skinShade} />
        {/* Head — smooth egg shape */}
        <path d="M100 36 Q128 38 130 66 Q130 92 100 96 Q70 92 70 66 Q72 38 100 36 Z" fill={`url(#shade-${uid})`} />
        {/* Ears with inner detail */}
        <ellipse cx="71" cy="68" rx="4.5" ry="6.5" fill={skinShade} />
        <ellipse cx="71" cy="68" rx="2.2" ry="3.5" fill={darken(skin, 0.22)} />
        <ellipse cx="129" cy="68" rx="4.5" ry="6.5" fill={skinShade} />
        <ellipse cx="129" cy="68" rx="2.2" ry="3.5" fill={darken(skin, 0.22)} />

        {/* Face side shading */}
        <ellipse cx="76" cy="68" rx="7" ry="18" fill={skinShade} opacity="0.25" />
        <ellipse cx="124" cy="68" rx="7" ry="18" fill={skinShade} opacity="0.25" />

        {/* Hair */}
        {renderHair(c, hairShade)}

        {/* Eyes */}
        {c.expression === "wink" ? (
          <g>
            <ellipse cx="111" cy="66" rx="7" ry="8.5" fill="#fff" />
            <circle cx="111" cy="67" r="5.5" fill={c.eyeColor} />
            <circle cx="111" cy="67" r="3" fill={darken(c.eyeColor, 0.35)} />
            <circle cx="113.5" cy="63.8" r="1.6" fill="#fff" />
            <circle cx="109.5" cy="65.5" r="0.9" fill="#fff" />
            <path d="M82.5 63.5 Q89 60.5 95.5 63.5" fill="none" stroke={hairShade} strokeWidth="2.5" strokeLinecap="round" />
          </g>
        ) : c.expression === "cool" ? (
          <g fill={hairShade}>
            <path d="M82 62 Q89 60 96 63 L96 67 Q89 65 82 66 Z" />
            <path d="M104 63 Q111 60 118 62 L118 66 Q111 65 104 67 Z" />
          </g>
        ) : (
          <g>
            {/* Left eye */}
            <ellipse cx="89" cy="66" rx="7" ry="8.5" fill="#fff" />
            <circle cx="89" cy="67" r="5.5" fill={c.eyeColor} />
            <circle cx="89" cy="67" r="3" fill={darken(c.eyeColor, 0.35)} />
            <path d="M82.5 63.5 Q89 60.5 95.5 63.5" fill="none" stroke={hairShade} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="91.5" cy="63.8" r="1.6" fill="#fff" />
            <circle cx="87.5" cy="65.5" r="0.9" fill="#fff" />
            {/* Right eye */}
            <ellipse cx="111" cy="66" rx="7" ry="8.5" fill="#fff" />
            <circle cx="111" cy="67" r="5.5" fill={c.eyeColor} />
            <circle cx="111" cy="67" r="3" fill={darken(c.eyeColor, 0.35)} />
            <path d="M104.5 63.5 Q111 60.5 117.5 63.5" fill="none" stroke={hairShade} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="113.5" cy="63.8" r="1.6" fill="#fff" />
            <circle cx="109.5" cy="65.5" r="0.9" fill="#fff" />
          </g>
        )}

        {/* Eyebrows */}
        {c.expression !== "cool" && (
          <g fill="none" stroke={hairShade} strokeWidth="2.8" strokeLinecap="round">
            <path d={c.expression === "surprised" ? "M82 57 L96 57" : "M82 58 Q89 54.5 96 58"} />
            <path d={c.expression === "surprised" ? "M104 57 L118 57" : "M104 58 Q111 54.5 118 58"} />
          </g>
        )}

        {/* Nose */}
        <path d="M97.5 74 Q96 77 97.5 79 Q100 80.5 102.5 79 Q104 77 102.5 74" fill="none" stroke={skinShade} strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />

        {/* Mouth */}
        <Mouth expr={c.expression} skin={skin} />

        {/* Blush — always subtle */}
        <circle cx="80" cy="76" r="6" fill="#ff9090" opacity="0.15" />
        <circle cx="120" cy="76" r="6" fill="#ff9090" opacity="0.15" />

        {/* Facial hair */}
        {renderFacialHair(c, hairShade)}

        {/* Ninja mask covers lower face */}
        {c.outfit === "ninja" && (
          <path d="M70 72 Q70 92 100 96 Q130 92 130 72 L130 78 Q120 92 100 94 Q80 92 70 78 Z" fill={darken(costume, 0.35)} />
        )}

        {/* Accessory */}
        {renderAccessory(c, hairShade)}
      </g>

      {/* Pose effects */}
      {c.pose === "think" && (
        <g>
          <circle cx="150" cy="42" r="3" fill="#fff" opacity="0.75" />
          <circle cx="159" cy="33" r="5" fill="#fff" opacity="0.75" />
          <circle cx="170" cy="22" r="10" fill="#fff" opacity="0.85" />
          <text x="170" y="27" fontSize="12" textAnchor="middle" fill="#3b2317" fontWeight="bold">?</text>
        </g>
      )}
      {c.pose === "celebrate" && (
        <g>
          <text x="36" y="48" fontSize="15">✨</text>
          <text x="162" y="38" fontSize="17">✨</text>
          <text x="28" y="120" fontSize="13">⭐</text>
          <text x="168" y="120" fontSize="13">🎉</text>
        </g>
      )}
    </svg>
  );
}

function Mouth({ expr, skin }: { expr: Expression; skin: string }) {
  if (expr === "grin")
    return <path d="M88 78 Q100 92 112 78 Q100 86 88 78 Z" fill="#fff" stroke="#e8e8e8" strokeWidth="0.6" />;
  if (expr === "surprised")
    return <ellipse cx="100" cy="82" rx="4.5" ry="6" fill="#a0281b" />;
  if (expr === "cool")
    return <path d="M92 80 Q98 78 106 80" fill="none" stroke="#7a1f15" strokeWidth="2.2" strokeLinecap="round" />;
  if (expr === "neutral")
    return <path d="M92 81 L108 81" fill="none" stroke="#7a1f15" strokeWidth="2" strokeLinecap="round" />;
  // smile — curved smile with a thin strip of white teeth
  return (
    <g>
      <path d="M90 84 Q100 91 110 84" fill="none" stroke={darken(skin, 0.3)} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M91 84.5 Q100 89 109 84.5 L108 87 Q100 91.5 92 87 Z" fill="#fff" />
      <path d="M91 84.5 Q100 89 109 84.5" fill="none" stroke={darken(skin, 0.25)} strokeWidth="1.6" strokeLinecap="round" />
    </g>
  );
}

function Outfit({ config, shade, light, fillFor, uid }: { config: AvatarConfig; shade: string; light: string; fillFor: (s: string) => string; uid: string }) {
  const o = config.outfit;
  if (o === "hoodie") {
    return (
      <g>
        <path d="M74 104 Q100 96 126 104 L126 116 Q100 110 74 116 Z" fill={darken(config.costume, 0.1)} />
        <path d="M88 104 Q100 112 112 104 L112 108 Q100 116 88 108 Z" fill={shade} />
        <circle cx="92" cy="114" r="1.6" fill={light} />
        <circle cx="108" cy="114" r="1.6" fill={light} />
        <path d="M78 126 Q100 132 122 126 L122 146 Q100 152 78 146 Z" fill="none" stroke={shade} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
      </g>
    );
  }
  if (o === "labcoat") {
    return (
      <g>
        <path d="M72 108 L74 156 L126 156 L128 108 Q114 104 100 104 Q86 104 72 108 Z" fill="#f4f4f5" stroke="#d4d4d8" strokeWidth="1" />
        <path d="M100 104 L94 124 L100 116 L106 124 Z" fill="#e4e4e7" />
        <circle cx="100" cy="120" r="1.5" fill="#a1a1aa" />
        <circle cx="100" cy="132" r="1.5" fill="#a1a1aa" />
        <circle cx="100" cy="144" r="1.5" fill="#a1a1aa" />
      </g>
    );
  }
  if (o === "hero") {
    return (
      <g>
        <path d="M88 124 L112 124 L112 144 L100 150 L88 144 Z" fill={light} stroke={shade} strokeWidth="1" />
        <text x="100" y="139" fontSize="12" textAnchor="middle" fill="#fff" fontWeight="bold">B</text>
      </g>
    );
  }
  if (o === "gown") {
    return (
      <g>
        <path d="M66 108 Q60 130 62 158 L138 158 Q140 130 134 108 Q120 104 100 104 Q80 104 66 108 Z" fill="#1e1b3a" stroke="#0f0c24" strokeWidth="1" />
        <path d="M100 104 L92 122 L100 116 L108 122 Z" fill="#3a2566" />
        <line x1="100" y1="116" x2="100" y2="158" stroke="#0f0c24" strokeWidth="1" opacity="0.5" />
      </g>
    );
  }
  if (o === "astronaut") {
    return (
      <g>
        <path d="M72 108 L128 108 L128 156 L72 156 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.2" />
        <rect x="86" y="124" width="28" height="18" rx="3" fill="#1e293b" />
        <circle cx="93" cy="133" r="2.5" fill="#f87171" />
        <circle cx="100" cy="133" r="2.5" fill="#34d399" />
        <circle cx="107" cy="133" r="2.5" fill="#facc15" />
        <path d="M72 112 L128 112" stroke="#94a3b8" strokeWidth="1" />
      </g>
    );
  }
  if (o === "jersey") {
    return (
      <g>
        <path d="M74 108 L126 108 L126 120 L74 120 Z" fill={shade} />
        <text x="100" y="142" fontSize="20" textAnchor="middle" fill="#fff" fontWeight="bold" style={{ paintOrder: "stroke", stroke: shade, strokeWidth: 0.6 }}>7</text>
      </g>
    );
  }
  if (o === "ninja") return null; // mask handled on head
  // tshirt default: chest pattern only
  if (config.costumePattern === "star") {
    return <text x="100" y="138" fontSize="16" textAnchor="middle" fill="#fff" style={{ paintOrder: "stroke", stroke: shade, strokeWidth: 0.5 }}>★</text>;
  }
  if (config.costumePattern === "lightning") {
    return <path d="M98 122 L104 134 L100 134 L106 148 L96 136 L100 136 Z" fill={light} stroke={shade} strokeWidth="0.6" />;
  }
  return null;
}

function renderHair(c: AvatarConfig, hairShade: string): React.ReactNode {
  const h = c.hairColor;
  if (c.hairStyle === "bald") return null;
  const styles: Record<string, React.ReactNode> = {
    short: (
      <g>
        <path d="M70 62 Q70 36 100 32 Q130 36 130 62 L130 52 Q120 40 100 38 Q80 40 70 52 Z" fill={h} />
        {/* swept fringe strands */}
        <path d="M70 54 Q80 44 94 46" fill="none" stroke={hairShade} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <path d="M72 58 Q84 48 98 50" fill="none" stroke={hairShade} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        <path d="M74 62 Q88 52 102 54" fill="none" stroke={hairShade} strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
        {/* highlight */}
        <path d="M78 46 Q90 40 104 42" fill="none" stroke={lighten(h, 0.35)} strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
      </g>
    ),
    buzz: <path d="M72 60 Q72 42 100 38 Q128 42 128 60 L128 54 Q116 48 100 46 Q84 48 72 54 Z" fill={h} opacity="0.7" />,
    spiky: <path d="M70 62 L75 42 L82 54 L88 38 L95 52 L100 34 L105 52 L112 38 L118 54 L125 42 L130 62 Q118 48 100 46 Q82 48 70 62 Z" fill={h} />,
    mohawk: <g fill={h}><path d="M96 38 Q100 20 104 38 L104 52 L96 52 Z" /><path d="M88 54 Q100 50 112 54 L112 58 L88 58 Z" opacity="0.6" /></g>,
    sideshave: <path d="M70 62 Q70 40 100 36 Q130 40 130 62 L128 50 Q116 46 100 46 Q84 46 72 50 Z" fill={h} />,
    curly: <g fill={h}><circle cx="78" cy="50" r="9" /><circle cx="90" cy="44" r="9" /><circle cx="100" cy="42" r="9" /><circle cx="110" cy="44" r="9" /><circle cx="122" cy="50" r="9" /><circle cx="74" cy="60" r="8" /><circle cx="126" cy="60" r="8" /></g>,
    afro: <g fill={h}><circle cx="100" cy="40" r="22" /><circle cx="78" cy="52" r="14" /><circle cx="122" cy="52" r="14" /><circle cx="100" cy="48" r="20" fill={hairShade} opacity="0.3" /></g>,
    wavy: <path d="M68 64 Q66 38 100 34 Q134 38 132 64 Q130 70 126 66 Q120 60 112 62 Q104 64 96 62 Q88 60 82 66 Q78 70 74 66 Q70 62 68 64 Z" fill={h} />,
    long: <path d="M68 64 Q66 36 100 32 Q134 36 132 64 L132 92 Q130 96 126 94 L126 58 Q116 46 100 44 Q84 46 74 58 L74 94 Q70 96 68 92 Z" fill={h} />,
    ponytail: <g fill={h}><path d="M70 62 Q70 38 100 34 Q130 38 130 62 L130 56 Q118 46 100 44 Q82 46 70 56 Z" /><path d="M134 56 Q142 64 140 84 Q136 88 132 84 Q134 70 128 60 Z" /></g>,
    braid: <g fill={h}><path d="M70 62 Q70 38 100 34 Q130 38 130 62 L130 56 Q118 46 100 44 Q82 46 70 56 Z" /><ellipse cx="100" cy="92" rx="7" ry="6" /><ellipse cx="100" cy="104" rx="6" ry="5" /><ellipse cx="100" cy="114" rx="5" ry="4" /><circle cx="100" cy="120" r="3" fill={lighten(h, 0.2)} /></g>,
    bun: <g fill={h}><path d="M74 60 Q74 42 100 38 Q126 42 126 60 L126 54 Q114 48 100 46 Q86 48 74 54 Z" /><circle cx="100" cy="28" r="10" /></g>,
    topknot: <g fill={h}><path d="M70 62 Q70 40 100 36 Q130 40 130 62 L130 54 Q118 48 100 46 Q82 48 70 54 Z" /><ellipse cx="100" cy="28" rx="8" ry="10" /></g>,
  };
  return styles[c.hairStyle] ?? null;
}

function renderFacialHair(c: AvatarConfig, hairShade: string): React.ReactNode {
  if (c.outfit === "ninja") return null;
  const h = c.hairColor;
  switch (c.facialHair) {
    case "mustache":
      return <path d="M90 76 Q95 74 100 76 Q105 74 110 76 Q105 78 100 77 Q95 78 90 76 Z" fill={h} />;
    case "goatee":
      return <g fill={h}><path d="M94 76 Q100 74 106 76 Q104 78 100 77 Q96 78 94 76 Z" /><path d="M96 82 Q100 80 104 82 Q104 90 100 92 Q96 90 96 82 Z" /></g>;
    case "beard":
      return <path d="M78 74 Q84 92 100 96 Q116 92 122 74 Q116 84 100 88 Q84 84 78 74 Z" fill={h} opacity="0.92" />;
    case "stubble":
      return <g fill={h} opacity="0.25"><ellipse cx="100" cy="84" rx="20" ry="10" /></g>;
    default:
      return null;
  }
}

function renderAccessory(c: AvatarConfig, hairShade: string): React.ReactNode {
  switch (c.accessory) {
    case "cap":
      return <g><path d="M72 52 Q72 36 100 34 Q128 36 128 52 L128 48 L72 48 Z" fill="#e8550a" /><path d="M72 48 L56 52 L72 54 Z" fill="#c4450a" /><text x="100" y="45" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold">B</text></g>;
    case "crown":
      return <g><path d="M80 40 L80 30 L88 38 L100 24 L112 38 L120 30 L120 40 Z" fill="#f5c842" stroke="#d4a017" strokeWidth="1" /><circle cx="100" cy="28" r="2.5" fill="#ff6b6b" /><circle cx="86" cy="36" r="2" fill="#22d3ee" /><circle cx="114" cy="36" r="2" fill="#34d399" /></g>;
    case "glasses":
      return <g fill="none" stroke="#1a1a1a" strokeWidth="2.5"><circle cx="89" cy="67" r="9" /><circle cx="111" cy="67" r="9" /><line x1="98" y1="67" x2="102" y2="67" /></g>;
    case "sunglasses":
      return <g><rect x="79" y="61" width="20" height="12" rx="4" fill="#1a1a1a" /><rect x="101" y="61" width="20" height="12" rx="4" fill="#1a1a1a" /><line x1="99" y1="66" x2="101" y2="66" stroke="#1a1a1a" strokeWidth="2" /><ellipse cx="85" cy="64" rx="4" ry="2" fill="#4a4a4a" opacity="0.6" /></g>;
    case "headband":
      return <rect x="70" y="48" width="60" height="6" rx="3" fill="#f87171" />;
    case "headphones":
      return <g><path d="M72 50 Q72 30 100 30 Q128 30 128 50" fill="none" stroke="#1e293b" strokeWidth="4" /><rect x="66" y="58" width="12" height="18" rx="5" fill="#334155" /><rect x="122" y="58" width="12" height="18" rx="5" fill="#334155" /></g>;
    case "mask":
      return <path d="M78 74 Q100 88 122 74 L122 80 Q100 92 78 80 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />;
    case "bowtie":
      return <g fill="#e11d48"><path d="M88 110 L100 116 L88 122 Z" /><path d="M112 110 L100 116 L112 122 Z" /><circle cx="100" cy="116" r="2.5" fill="#9f1239" /></g>;
    case "scarf":
      return <g><path d="M76 108 Q100 116 124 108 L124 118 Q100 126 76 118 Z" fill="#0ea5e9" /><path d="M118 116 L124 138 L112 134 Z" fill="#0284c7" /></g>;
    case "eyepatch":
      return <g><ellipse cx="89" cy="67" rx="9" ry="9" fill="#1a1a1a" /><path d="M80 60 L100 52" stroke="#1a1a1a" strokeWidth="1.5" /></g>;
    case "halo":
      return <ellipse cx="100" cy="32" rx="20" ry="6" fill="none" stroke="#fde68a" strokeWidth="3" />;
    case "antennae":
      return <g stroke="#22d3ee" strokeWidth="2" fill="#22d3ee"><path d="M88 40 Q84 26 80 22" fill="none" /><circle cx="80" cy="20" r="3" /><path d="M112 40 Q116 26 120 22" fill="none" /><circle cx="120" cy="20" r="3" /></g>;
    default:
      return null;
  }
}
