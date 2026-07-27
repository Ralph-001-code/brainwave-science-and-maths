// SVG avatar renderer — Duolingo-style flat character.
// Renders a friendly character based on a config object.

export type AvatarConfig = {
  bodyType: "male" | "female";
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  costume: string;
  costumePattern: string;
  pose: "wave" | "stand" | "think" | "celebrate" | "read";
  accessory: "none" | "cap" | "crown" | "glasses" | "headband";
  eyeColor: string;
};

export const DEFAULT_AVATAR: AvatarConfig = {
  bodyType: "male",
  skinTone: "#f4c2a1",
  hairStyle: "short",
  hairColor: "#3b2317",
  costume: "#a855f7",
  costumePattern: "solid",
  pose: "wave",
  accessory: "none",
  eyeColor: "#3b2317",
};

export const SKIN_TONES = ["#f4c2a1", "#e8b88a", "#d4a373", "#c08552", "#a06a40", "#7a4f2a"];
export const HAIR_COLORS = ["#1a1a1a", "#3b2317", "#6b4226", "#a0703c", "#d4a017", "#c0392b", "#7b68ee"];
export const COSTUME_COLORS = ["#a855f7", "#d946ef", "#f5c842", "#34d399", "#22d3ee", "#f87171", "#fb923c", "#60a5fa"];
export const EYE_COLORS = ["#3b2317", "#1a1a1a", "#2563eb", "#16a34a", "#7b68ee", "#c0392b"];

export const HAIR_STYLES: { id: string; label: string; bodyType: "male" | "female" | "both" }[] = [
  { id: "short", label: "Short", bodyType: "male" },
  { id: "buzz", label: "Buzz cut", bodyType: "male" },
  { id: "spiky", label: "Spiky", bodyType: "male" },
  { id: "curly", label: "Curly", bodyType: "both" },
  { id: "long", label: "Long", bodyType: "female" },
  { id: "ponytail", label: "Ponytail", bodyType: "female" },
  { id: "bun", label: "Bun", bodyType: "female" },
  { id: "bald", label: "Bald", bodyType: "both" },
];

export const COSTUME_PATTERNS: { id: string; label: string }[] = [
  { id: "solid", label: "Solid" },
  { id: "stripes", label: "Stripes" },
  { id: "dots", label: "Dots" },
  { id: "star", label: "Star" },
];

export const POSES: { id: AvatarConfig["pose"]; label: string; emoji: string }[] = [
  { id: "wave", label: "Wave", emoji: "👋" },
  { id: "stand", label: "Stand", emoji: "🧍" },
  { id: "think", label: "Think", emoji: "🤔" },
  { id: "celebrate", label: "Celebrate", emoji: "🎉" },
  { id: "read", label: "Read", emoji: "📖" },
];

export const ACCESSORIES: { id: AvatarConfig["accessory"]; label: string; emoji: string }[] = [
  { id: "none", label: "None", emoji: "—" },
  { id: "cap", label: "Cap", emoji: "🧢" },
  { id: "crown", label: "Crown", emoji: "👑" },
  { id: "glasses", label: "Glasses", emoji: "👓" },
  { id: "headband", label: "Headband", emoji: "🎀" },
];

// Helper to darken a hex color
function darken(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const dr = Math.max(0, Math.round(r * (1 - amount)));
  const dg = Math.max(0, Math.round(g * (1 - amount)));
  const db = Math.max(0, Math.round(b * (1 - amount)));
  return `#${dr.toString(16).padStart(2, "0")}${dg.toString(16).padStart(2, "0")}${db.toString(16).padStart(2, "0")}`;
}

export function parseAvatarConfig(raw: unknown): AvatarConfig {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_AVATAR };
  const obj = raw as Record<string, unknown>;
  return {
    bodyType: (obj.bodyType as AvatarConfig["bodyType"]) ?? DEFAULT_AVATAR.bodyType,
    skinTone: (obj.skinTone as string) ?? DEFAULT_AVATAR.skinTone,
    hairStyle: (obj.hairStyle as string) ?? DEFAULT_AVATAR.hairStyle,
    hairColor: (obj.hairColor as string) ?? DEFAULT_AVATAR.hairColor,
    costume: (obj.costume as string) ?? DEFAULT_AVATAR.costume,
    costumePattern: (obj.costumePattern as string) ?? DEFAULT_AVATAR.costumePattern,
    pose: (obj.pose as AvatarConfig["pose"]) ?? DEFAULT_AVATAR.pose,
    accessory: (obj.accessory as AvatarConfig["accessory"]) ?? DEFAULT_AVATAR.accessory,
    eyeColor: (obj.eyeColor as string) ?? DEFAULT_AVATAR.eyeColor,
  };
}

export default function AvatarSvg({ config, size = 200 }: { config: AvatarConfig; size?: number }) {
  const skin = config.skinTone;
  const skinShade = darken(skin, 0.15);
  const costumeShade = darken(config.costume, 0.2);
  const costume = config.costume;

  // Pose-based arm positions
  const armRightX = config.pose === "wave" ? 132 : config.pose === "celebrate" ? 148 : 125;
  const armRightY = config.pose === "wave" ? 78 : config.pose === "celebrate" ? 62 : 110;
  const armLeftX = config.pose === "think" ? 128 : 75;
  const armLeftY = config.pose === "think" ? 72 : 110;
  const headTilt = config.pose === "think" ? -6 : 0;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <defs>
        <pattern id={`stripes-${config.costume.slice(1)}`} x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="14" height="14" fill={costume} />
          <rect width="7" height="14" fill={costumeShade} />
        </pattern>
        <pattern id={`dots-${config.costume.slice(1)}`} x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
          <rect width="14" height="14" fill={costume} />
          <circle cx="7" cy="7" r="3" fill={costumeShade} />
        </pattern>
        <linearGradient id="bg-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={costume} stopOpacity="0.15" />
          <stop offset="100%" stopColor={costume} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Background glow */}
      <circle cx="100" cy="100" r="96" fill="url(#bg-glow)" />

      {/* Body / torso */}
      <g>
        {/* Legs */}
        <rect x="82" y="148" width="14" height="34" rx="6" fill="#2d1b4e" />
        <rect x="104" y="148" width="14" height="34" rx="6" fill="#2d1b4e" />
        <ellipse cx="89" cy="184" rx="10" ry="5" fill="#1a0b2e" />
        <ellipse cx="111" cy="184" rx="10" ry="5" fill="#1a0b2e" />

        {/* Torso/costume */}
        <path
          d="M70 120 Q70 112 80 110 L120 110 Q130 112 130 120 L132 152 Q132 156 128 156 L72 156 Q68 156 68 152 Z"
          fill={config.costumePattern === "stripes" ? `url(#stripes-${config.costume.slice(1)})` : config.costumePattern === "dots" ? `url(#dots-${config.costume.slice(1)})` : costume}
          stroke={costumeShade}
          strokeWidth="1.5"
        />

        {/* Star pattern on chest */}
        {config.costumePattern === "star" && (
          <text x="100" y="138" fontSize="18" fill="#fff" textAnchor="middle" style={{ paintOrder: "stroke", stroke: costumeShade, strokeWidth: 0.5 }}>★</text>
        )}

        {/* Collar */}
        <path d="M85 110 L100 118 L115 110" fill="none" stroke={costumeShade} strokeWidth="2" strokeLinecap="round" />

        {/* Left arm */}
        <path
          d={`M72 116 Q${armLeftX - 12} ${armLeftY + 10} ${armLeftX} ${armLeftY}`}
          fill="none"
          stroke={skin}
          strokeWidth="11"
          strokeLinecap="round"
        />
        {/* Left hand */}
        <circle cx={armLeftX} cy={armLeftY} r="6.5" fill={skin} />

        {/* Right arm */}
        <path
          d={`M128 116 Q${armRightX - 4} ${armRightY + 20} ${armRightX} ${armRightY}`}
          fill="none"
          stroke={skin}
          strokeWidth="11"
          strokeLinecap="round"
        />
        {/* Right hand */}
        <circle cx={armRightX} cy={armRightY} r="6.5" fill={skin} />

        {/* Book for "read" pose */}
        {config.pose === "read" && (
          <g>
            <rect x="82" y="88" width="36" height="24" rx="2" fill="#f5f5f5" stroke="#ddd" strokeWidth="1" />
            <line x1="100" y1="88" x2="100" y2="112" stroke="#ccc" strokeWidth="1" />
            <line x1="87" y1="94" x2="97" y2="94" stroke="#bbb" strokeWidth="0.8" />
            <line x1="87" y1="98" x2="97" y2="98" stroke="#bbb" strokeWidth="0.8" />
            <line x1="103" y1="94" x2="113" y2="94" stroke="#bbb" strokeWidth="0.8" />
            <line x1="103" y1="98" x2="113" y2="98" stroke="#bbb" strokeWidth="0.8" />
          </g>
        )}
      </g>

      {/* Head group with optional tilt */}
      <g transform={`rotate(${headTilt} 100 70)`}>
        {/* Neck */}
        <rect x="92" y="98" width="16" height="14" rx="4" fill={skinShade} />

        {/* Head */}
        <ellipse cx="100" cy="66" rx="28" ry="30" fill={skin} />

        {/* Ears */}
        <ellipse cx="73" cy="68" rx="4.5" ry="6" fill={skinShade} />
        <ellipse cx="127" cy="68" rx="4.5" ry="6" fill={skinShade} />

        {/* Hair */}
        {renderHair(config)}

        {/* Eyes */}
        <ellipse cx="89" cy="64" rx="5" ry="6" fill="#fff" />
        <ellipse cx="111" cy="64" rx="5" ry="6" fill="#fff" />
        <circle cx="89" cy="65" r="3.2" fill={config.eyeColor} />
        <circle cx="111" cy="65" r="3.2" fill={config.eyeColor} />
        <circle cx="90.2" cy="63.5" r="1.1" fill="#fff" />
        <circle cx="112.2" cy="63.5" r="1.1" fill="#fff" />

        {/* Eyebrows */}
        <path d="M83 57 Q89 54 95 57" fill="none" stroke={darken(config.hairColor, 0.1)} strokeWidth="2" strokeLinecap="round" />
        <path d="M105 57 Q111 54 117 57" fill="none" stroke={darken(config.hairColor, 0.1)} strokeWidth="2" strokeLinecap="round" />

        {/* Nose */}
        <path d="M100 68 Q98 73 100 75 Q102 73 100 68" fill={skinShade} opacity="0.5" />

        {/* Mouth — varies by pose */}
        {config.pose === "celebrate" ? (
          <path d="M90 80 Q100 90 110 80" fill="#c0392b" stroke="#a0281b" strokeWidth="1" />
        ) : config.pose === "think" ? (
          <path d="M95 82 Q100 80 105 82" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" />
        ) : (
          <path d="M92 80 Q100 84 108 80" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" />
        )}

        {/* Blush */}
        <circle cx="80" cy="74" r="4" fill="#ff8b8b" opacity="0.25" />
        <circle cx="120" cy="74" r="4" fill="#ff8b8b" opacity="0.25" />

        {/* Accessory */}
        {renderAccessory(config)}
      </g>

      {/* Thought bubble for "think" pose */}
      {config.pose === "think" && (
        <g>
          <circle cx="150" cy="40" r="3" fill="#fff" opacity="0.7" />
          <circle cx="158" cy="32" r="5" fill="#fff" opacity="0.7" />
          <circle cx="168" cy="22" r="9" fill="#fff" opacity="0.7" />
          <text x="168" y="26" fontSize="10" textAnchor="middle">?</text>
        </g>
      )}

      {/* Sparkles for "celebrate" pose */}
      {config.pose === "celebrate" && (
        <g>
          <text x="40" y="50" fontSize="14">✨</text>
          <text x="160" y="40" fontSize="16">✨</text>
          <text x="30" y="120" fontSize="12">⭐</text>
        </g>
      )}
    </svg>
  );
}

function renderHair(config: AvatarConfig): React.ReactNode {
  const hair = config.hairColor;
  if (config.hairStyle === "bald") return null;

  if (config.hairStyle === "short") {
    return <path d="M72 62 Q72 40 100 36 Q128 40 128 62 L128 56 Q120 46 100 44 Q80 46 72 56 Z" fill={hair} />;
  }
  if (config.hairStyle === "buzz") {
    return <path d="M74 60 Q74 42 100 38 Q126 42 126 60 L126 54 Q118 48 100 46 Q82 48 74 54 Z" fill={hair} opacity="0.75" />;
  }
  if (config.hairStyle === "spiky") {
    return <path d="M72 62 L76 44 L82 54 L88 40 L94 52 L100 38 L106 52 L112 40 L118 54 L124 44 L128 62 Q120 48 100 46 Q80 48 72 62 Z" fill={hair} />;
  }
  if (config.hairStyle === "curly") {
    return (
      <g fill={hair}>
        <circle cx="78" cy="50" r="9" />
        <circle cx="90" cy="44" r="9" />
        <circle cx="100" cy="42" r="9" />
        <circle cx="110" cy="44" r="9" />
        <circle cx="122" cy="50" r="9" />
        <circle cx="75" cy="60" r="8" />
        <circle cx="125" cy="60" r="8" />
      </g>
    );
  }
  if (config.hairStyle === "long") {
    return (
      <g fill={hair}>
        <path d="M70 64 Q70 38 100 34 Q130 38 130 64 L130 88 Q128 92 124 90 L124 60 Q116 48 100 46 Q84 48 76 60 L76 90 Q72 92 70 88 Z" />
      </g>
    );
  }
  if (config.hairStyle === "ponytail") {
    return (
      <g fill={hair}>
        <path d="M72 62 Q72 40 100 36 Q128 40 128 62 L128 56 Q120 46 100 44 Q80 46 72 56 Z" />
        <ellipse cx="132" cy="58" rx="6" ry="14" transform="rotate(20 132 58)" />
      </g>
    );
  }
  if (config.hairStyle === "bun") {
    return (
      <g fill={hair}>
        <path d="M74 60 Q74 42 100 38 Q126 42 126 60 L126 54 Q118 48 100 46 Q82 48 74 54 Z" />
        <circle cx="100" cy="30" r="9" />
      </g>
    );
  }
  return null;
}

function renderAccessory(config: AvatarConfig): React.ReactNode {
  if (config.accessory === "cap") {
    return (
      <g>
        <path d="M74 52 Q74 38 100 36 Q126 38 126 52 L126 48 L74 48 Z" fill="#e8550a" />
        <path d="M74 48 L60 52 L74 54 Z" fill="#c4450a" />
        <text x="100" y="45" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold">B</text>
      </g>
    );
  }
  if (config.accessory === "crown") {
    return (
      <g>
        <path d="M80 40 L80 32 L88 38 L100 28 L112 38 L120 32 L120 40 Z" fill="#f5c842" stroke="#d4a017" strokeWidth="1" />
        <circle cx="100" cy="30" r="2.5" fill="#ff6b6b" />
        <circle cx="86" cy="36" r="2" fill="#22d3ee" />
        <circle cx="114" cy="36" r="2" fill="#34d399" />
      </g>
    );
  }
  if (config.accessory === "glasses") {
    return (
      <g fill="none" stroke="#1a1a1a" strokeWidth="2.5">
        <circle cx="89" cy="64" r="8" />
        <circle cx="111" cy="64" r="8" />
        <line x1="97" y1="64" x2="103" y2="64" />
      </g>
    );
  }
  if (config.accessory === "headband") {
    return <rect x="72" y="48" width="56" height="6" rx="3" fill="#f87171" />;
  }
  return null;
}
