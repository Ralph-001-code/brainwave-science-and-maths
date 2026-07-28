export type UnlockItemType = "outfit" | "accessory" | "background" | "pose" | "hairStyle";

export type UnlockItem = {
  type: UnlockItemType;
  id: string;
  streakRequired: number;
};

export type StreakMilestone = {
  streak: number;
  reward: UnlockItem;
  label: string;
};

export const STREAK_MILESTONES: StreakMilestone[] = [
  { streak: 3,  reward: { type: "accessory", id: "sunglasses", streakRequired: 3 },  label: "Sunglasses" },
  { streak: 5,  reward: { type: "pose",      id: "fistpump",   streakRequired: 5 },  label: "Fist pump pose" },
  { streak: 7,  reward: { type: "outfit",    id: "jersey",     streakRequired: 7 },  label: "Jersey outfit" },
  { streak: 10, reward: { type: "accessory", id: "headphones", streakRequired: 10 }, label: "Headphones" },
  { streak: 14, reward: { type: "background",id: "space",      streakRequired: 14 }, label: "Space background" },
  { streak: 21, reward: { type: "outfit",    id: "labcoat",    streakRequired: 21 }, label: "Lab coat outfit" },
  { streak: 30, reward: { type: "outfit",    id: "hero",       streakRequired: 30 }, label: "Hero cape" },
  { streak: 45, reward: { type: "outfit",    id: "astronaut",  streakRequired: 45 }, label: "Astronaut suit" },
  { streak: 60, reward: { type: "accessory", id: "crown",      streakRequired: 60 }, label: "Crown" },
];

export const FREEZE_MILESTONE_INTERVAL = 7;
export const FREEZE_MAX = 2;

export type UnlockEntry = {
  item_type: UnlockItemType;
  item_id: string;
};

export type UnlockedMap = Map<string, boolean>;

export function unlockKey(type: UnlockItemType, id: string): string {
  return `${type}:${id}`;
}

export function buildUnlockMap(entries: UnlockEntry[]): UnlockedMap {
  const map = new Map<string, boolean>();
  for (const e of entries) map.set(unlockKey(e.item_type, e.item_id), true);
  return map;
}

export function isItemUnlocked(
  map: UnlockedMap,
  type: UnlockItemType,
  id: string,
): boolean {
  return map.has(unlockKey(type, id));
}

export function streakRequiredFor(type: UnlockItemType, id: string): number | null {
  const m = STREAK_MILESTONES.find(
    (m) => m.reward.type === type && m.reward.id === id,
  );
  return m ? m.streak : null;
}

export function getNextMilestone(currentStreak: number): StreakMilestone | null {
  return STREAK_MILESTONES.find((m) => m.streak > currentStreak) ?? null;
}

export function getMilestonesReached(streak: number): StreakMilestone[] {
  return STREAK_MILESTONES.filter((m) => m.streak <= streak);
}

export function checkNewUnlocks(prevStreak: number, newStreak: number): StreakMilestone[] {
  return STREAK_MILESTONES.filter(
    (m) => m.streak > prevStreak && m.streak <= newStreak,
  );
}

export function freezesEarned(prevStreak: number, newStreak: number): number {
  let earned = 0;
  for (let s = prevStreak + 1; s <= newStreak; s++) {
    if (s > 0 && s % FREEZE_MILESTONE_INTERVAL === 0) earned++;
  }
  return earned;
}
