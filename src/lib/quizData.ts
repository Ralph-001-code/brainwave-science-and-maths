// ===== Shared types, ranks, motivation, and PRIMARY programme content (Years 1-8) =====

export type YearId = "year1" | "year2" | "year3" | "year4" | "year5" | "year6" | "year7" | "year8" | "year9" | "year10" | "year11";

export type Programme = "primary" | "checkpoint" | "igcse";
export type CheckpointStage = "stage6" | "stage9";
export type IgcseSubjectId =
  | "maths_core" | "maths_extended"
  | "physics" | "chemistry" | "biology"
  | "english" | "economics" | "ict" | "business";

export type Question = {
  question: string;
  options?: string[];
  answer?: number;
  explanation: string;
  cambridge?: boolean;
  pastPaper?: boolean;
  /** "mcq" = multiple choice (default), "written" = typed short-answer */
  type?: "mcq" | "written";
  /** Time limit in seconds for this question (default 30). */
  timeLimit?: number;
  /** For written questions: the accepted answer(s), case-insensitive, trimmed. */
  acceptAnswers?: string[];
};

export type Topic = {
  id: string;
  name: string;
  icon: string;
  description: string;
  questions: Question[];
  /** Theory / study notes shown before the quiz begins. Markdown-free plain text. */
  theory?: string;
  /** Default time limit (seconds) for questions in this topic without their own timeLimit. */
  defaultTimeLimit?: number;
};

/** Generated examples and exam tips for a topic, derived from its questions. */
export type TopicStudy = {
  theory: string;
  examples: { question: string; solution: string; steps?: string }[];
  examTips: string[];
};

/** Build worked examples and exam tips from a topic's questions. */
export function buildTopicStudy(topic: Topic): TopicStudy {
  const theory = topic.theory ?? `${topic.name}: ${topic.description}. Read each question carefully and use what you know to find the answer.`;
  const examples: { question: string; solution: string; steps?: string }[] = [];
  // Use up to 3 questions as worked examples (prefer non-past-paper MCQs)
  const pool = topic.questions.filter((q) => q.type !== "written" && q.options && q.options.length > 0);
  for (const q of pool.slice(0, 3)) {
    const correctIdx = q.answer ?? 0;
    examples.push({
      question: q.question,
      solution: q.options?.[correctIdx] ?? "",
      steps: q.explanation,
    });
  }
  const examTips = generateExamTips(topic);
  return { theory, examples, examTips };
}

/** Generate exam tips based on the topic's content and questions. */
function generateExamTips(topic: Topic): string[] {
  const tips: string[] = [];
  const hasPastPaper = topic.questions.some((q) => q.pastPaper);
  const hasWritten = topic.questions.some((q) => q.type === "written");
  const hasCambridge = topic.questions.some((q) => q.cambridge);
  const hasDecimals = topic.questions.some((q) => /decimal|fraction|percentage|0\./i.test(q.question));
  const hasAlgebra = /algebra|equation|solve|x |linear|factor/i.test(topic.name + " " + topic.description);
  const hasGeometry = /geometry|angle|shape|area|perimeter|volume|circle|triangle|pythagor/i.test(topic.name + " " + topic.description);
  const hasNumber = /number|place value|rounding|standard form|percentage|ratio|proportion/i.test(topic.name + " " + topic.description);
  const hasData = /data|statistics|probability|mean|median|mode|chart|graph|average/i.test(topic.name + " " + topic.description);
  const hasForces = /force|motion|energy|electricity|wave|thermal|heat|magnet/i.test(topic.name + " " + topic.description);
  const hasBiology = /living|plant|cell|organ|body|animal|food|photosynthesis|ecosystem/i.test(topic.name + " " + topic.description);

  // General tips
  tips.push("Read every question twice before you answer — underline or note the key numbers and what it's asking for.");
  tips.push("Show your working clearly, step by step. Even if your final answer is wrong, you can earn method marks.");

  if (hasPastPaper) tips.push("Past-paper questions are worth extra attention — they show exactly how Cambridge phrases questions in the real exam.");
  if (hasCambridge) tips.push("For Cambridge questions, always check the units (cm, m, kg, °C) and give your answer in the units asked.");
  if (hasWritten) tips.push("For written-answer questions, spelling doesn't need to be perfect, but your answer must match the expected value. Double-check numbers and fractions.");
  if (hasDecimals) tips.push("When converting between fractions, decimals and percentages, remember: 1/2 = 0.5 = 50%, 1/4 = 0.25 = 25%, 3/4 = 0.75 = 75%.");
  if (hasAlgebra) tips.push("In algebra, always do the same operation to both sides of an equation to keep it balanced. Check your answer by substituting it back in.");
  if (hasGeometry) tips.push("For geometry, sketch a quick diagram if one isn't given — it helps you spot which formula to use and avoid missing sides or angles.");
  if (hasNumber) tips.push("For number work, estimate the answer first so you can spot if your final answer is wildly wrong.");
  if (hasData) tips.push("For statistics and probability, list all possible outcomes first — this avoids counting mistakes.");
  if (hasForces) tips.push("For physics, write down the formula you'll use before substituting numbers — it earns you marks and helps you choose the right equation.");
  if (hasBiology) tips.push("For science, use the correct key terms (e.g. 'photosynthesis', 'respiration') — examiners look for specific vocabulary.");

  tips.push("If you're stuck, move on and come back — don't waste time on one question when there are easier marks later.");
  tips.push("Manage your time: aim for about one minute per question. If you finish early, check your answers.");

  return tips;
}

export type YearInfo = {
  id: YearId;
  name: string;
  short: string;
  ageRange: string;
  description: string;
  color: string;
};

export const YEARS: YearInfo[] = [
  { id: "year1", name: "Year 1", short: "Y1", ageRange: "Ages 5-6", color: "#f472b6", description: "Counting, adding and taking away with small numbers." },
  { id: "year2", name: "Year 2", short: "Y2", ageRange: "Ages 6-7", color: "#fb923c", description: "Add/subtract to 20, times tables (2, 5, 10), shapes and money." },
  { id: "year3", name: "Year 3", short: "Y3", ageRange: "Ages 7-8", color: "#facc15", description: "Times tables to 12, simple fractions, measuring and word problems." },
  { id: "year4", name: "Year 4", short: "Y4", ageRange: "Ages 8-9", color: "#4ade80", description: "Bigger numbers, fractions, decimals, area and perimeter." },
  { id: "year5", name: "Year 5", short: "Y5", ageRange: "Ages 9-10", color: "#22d3ee", description: "Percentages, long division, angles, data handling." },
  { id: "year6", name: "Year 6", short: "Y6", ageRange: "Ages 10-11", color: "#a855f7", description: "Algebra basics, ratios, geometry, averages and problem solving." },
  { id: "year7", name: "Year 7", short: "Y7", ageRange: "Ages 11-12", color: "#60a5fa", description: "Integers, powers, sequences and an intro to algebra." },
  { id: "year8", name: "Year 8", short: "Y8", ageRange: "Ages 12-13", color: "#34d399", description: "Linear equations, percentages, Pythagoras and probability." },
];

export const RANKS = [
  { name: "Beginner", minXp: 0, icon: "Sprout" },
  { name: "Rising Star", minXp: 150, icon: "Star" },
  { name: "Maths Hero", minXp: 400, icon: "Medal" },
  { name: "Brainwave Champion", minXp: 800, icon: "Crown" },
];

export type Rank = { name: string; minXp: number; icon: string };

export function getRankForXp(xp: number): Rank {
  let r: Rank = RANKS[0];
  for (const rank of RANKS) {
    if (xp >= rank.minXp) r = rank;
  }
  return r;
}

export function getNextRank(xp: number): Rank | null {
  for (const rank of RANKS) {
    if (xp < rank.minXp) return rank;
  }
  return null;
}

// ===== Motivation messages shown during quizzes =====
const MOTIVATION_CORRECT = [
  "Brilliant! You're on fire!",
  "Yes! That's exactly right!",
  "Amazing work — keep it up!",
  "Correct! You're a maths star!",
  "Spot on! Your brain is buzzing!",
  "Fantastic! One step closer to champion!",
  "You nailed it! Confidence is growing!",
  "Perfect! Brainwave power activated!",
];

const MOTIVATION_WRONG = [
  "Not quite — but every mistake helps you learn!",
  "Close! Let's learn from this one and keep going!",
  "Don't worry, you've got the next one!",
  "Mistakes are just stepping stones. Keep going!",
  "Almost there! Read the explanation and power on!",
  "That's okay — even champions miss sometimes!",
];

const MOTIVATION_MILESTONE = [
  "Halfway there! You're doing amazing!",
  "You're flying through this quiz!",
  "Keep that streak going — you're unstoppable!",
  "Two more to go. Finish strong!",
];

export function motivate(correct: boolean, questionIndex: number, total: number): string {
  if (questionIndex > 0 && questionIndex === Math.floor(total / 2)) {
    return MOTIVATION_MILESTONE[Math.floor(Math.random() * MOTIVATION_MILESTONE.length)];
  }
  const pool = correct ? MOTIVATION_CORRECT : MOTIVATION_WRONG;
  return pool[Math.floor(Math.random() * pool.length)];
}

export const PROGRAMMES: { id: Programme; name: string; short: string; description: string; color: string; icon: string }[] = [
  { id: "primary", name: "Primary", short: "Primary", description: "Years 1 to 8 — build strong foundations in maths with fun, age-appropriate quizzes and Cambridge-style word problems.", color: "#a855f7", icon: "GraduationCap" },
  { id: "checkpoint", name: "Cambridge Checkpoint", short: "Checkpoint", description: "Cambridge Primary (Year 6) and Lower Secondary (Year 9) Checkpoint. Study Maths and Science with past-paper practice to get exam-ready.", color: "#f5c842", icon: "Award" },
  { id: "igcse", name: "IGCSE", short: "IGCSE", description: "Years 10-11. Choose your Core and Elective subjects, then practice exam-style questions to prepare for your IGCSE exams.", color: "#22d3ee", icon: "BookOpen" },
];

/* ===================== YEAR 1 (Ages 5-6) ===================== */
const YEAR1_TOPICS: Topic[] = [
  {
    id: "counting", name: "Counting", icon: "Hash", description: "Count up to 20.",
    theory: "Counting is the first step in maths. We count objects one by one, saying a number for each item.\nWhen we count, the last number we say tells us how many there are in total.\nPractice counting forwards and backwards up to 20 to get really confident.",
    defaultTimeLimit: 25,
    questions: [
      { question: "How many fingers are on one hand?", options: ["3", "5", "10", "2"], answer: 1, explanation: "One hand has 5 fingers." },
      { question: "Count the apples: 🍎🍎🍎. How many?", options: ["2", "3", "4", "5"], answer: 1, explanation: "There are 3 apples." },
      { question: "What number comes after 5?", options: ["4", "6", "7", "10"], answer: 1, explanation: "After 5 comes 6." },
      { question: "What number comes before 8?", options: ["9", "7", "6", "10"], answer: 1, explanation: "Before 8 is 7." },
      { question: "How many days are in a weekend?", options: ["1", "2", "5", "7"], answer: 1, explanation: "The weekend has 2 days: Saturday and Sunday." },
      { question: "Count: ⭐⭐⭐⭐. How many stars?", options: ["3", "4", "5", "6"], answer: 1, explanation: "There are 4 stars." },
      { question: "What number comes after 9?", options: ["8", "10", "11", "12"], answer: 1, explanation: "After 9 comes 10." },
      { question: "How many legs does a cat have?", options: ["2", "4", "6", "8"], answer: 1, explanation: "A cat has 4 legs." },
      { question: "What number is missing? 1, 2, ___, 4", options: ["1", "3", "5", "6"], answer: 1, explanation: "The missing number is 3." },
      { question: "How many wheels does a bicycle have?", options: ["1", "2", "3", "4"], answer: 1, explanation: "A bicycle has 2 wheels." },
      { question: "What number comes after 12?", options: ["11", "13", "14", "20"], answer: 1, explanation: "After 12 comes 13." },
      { question: "How many toes are on two feet?", options: ["5", "10", "15", "20"], answer: 1, explanation: "Two feet have 10 toes." },
      { question: "What number comes before 15?", options: ["13", "14", "16", "20"], answer: 1, explanation: "Before 15 is 14." },
      { question: "Count: 🔵🔵🔵🔵🔵. How many circles?", options: ["4", "5", "6", "7"], answer: 1, explanation: "There are 5 circles." },
      { question: "Write the number that comes after 7.", type: "written", acceptAnswers: ["8"], explanation: "After 7 comes 8.", timeLimit: 25 },
    ],
  },
  {
    id: "adding-small", name: "Adding Small Numbers", icon: "Plus", description: "Add numbers up to 10.",
    theory: "Adding means putting groups together to find the total. We use the '+' sign for adding.\nYou can use your fingers or draw pictures to help you add small numbers.\nAdding zero to a number doesn't change it — 3 + 0 = 3.",
    defaultTimeLimit: 25,
    questions: [
      { question: "1 + 1 = ?", options: ["1", "2", "3", "0"], answer: 1, explanation: "1 and 1 more makes 2." },
      { question: "2 + 2 = ?", options: ["3", "4", "5", "6"], answer: 1, explanation: "2 and 2 more makes 4." },
      { question: "3 + 1 = ?", options: ["2", "3", "4", "5"], answer: 2, explanation: "3 and 1 more makes 4." },
      { question: "1 + 4 = ?", options: ["3", "4", "5", "6"], answer: 2, explanation: "1 and 4 more makes 5." },
      { question: "2 + 3 = ?", options: ["4", "5", "6", "7"], answer: 1, explanation: "2 and 3 more makes 5." },
      { question: "4 + 1 = ?", options: ["3", "4", "5", "6"], answer: 2, explanation: "4 and 1 more makes 5." },
      { question: "3 + 3 = ?", options: ["5", "6", "7", "8"], answer: 1, explanation: "3 and 3 more makes 6." },
      { question: "2 + 5 = ?", options: ["6", "7", "8", "9"], answer: 1, explanation: "2 and 5 more makes 7." },
      { question: "4 + 4 = ?", options: ["6", "7", "8", "9"], answer: 2, explanation: "4 and 4 more makes 8." },
      { question: "5 + 5 = ?", options: ["8", "9", "10", "11"], answer: 2, explanation: "5 and 5 more makes 10." },
      { question: "1 + 7 = ?", options: ["7", "8", "9", "10"], answer: 1, explanation: "1 and 7 more makes 8." },
      { question: "3 + 4 = ?", options: ["6", "7", "8", "9"], answer: 1, explanation: "3 and 4 more makes 7." },
      { question: "6 + 2 = ?", options: ["7", "8", "9", "10"], answer: 1, explanation: "6 and 2 more makes 8." },
      { question: "0 + 5 = ?", options: ["0", "4", "5", "10"], answer: 2, explanation: "0 and 5 more makes 5." },
      { question: "What is 3 + 5?", type: "written", acceptAnswers: ["8"], explanation: "3 and 5 more makes 8.", timeLimit: 25 },
    ],
  },
  {
    id: "take-away-small", name: "Taking Away", icon: "Minus", description: "Subtract small numbers.",
    theory: "Taking away (subtraction) means removing some from a group. We use the '−' sign.\nWhen we take away, the answer is always smaller than what we started with, unless we take away zero.\nYou can count backwards or use pictures to help you take away.",
    defaultTimeLimit: 25,
    questions: [
      { question: "5 - 2 = ?", options: ["2", "3", "4", "5"], answer: 1, explanation: "Take 2 away from 5 leaves 3." },
      { question: "4 - 1 = ?", options: ["2", "3", "4", "5"], answer: 1, explanation: "Take 1 away from 4 leaves 3." },
      { question: "6 - 3 = ?", options: ["2", "3", "4", "5"], answer: 1, explanation: "Take 3 away from 6 leaves 3." },
      { question: "7 - 2 = ?", options: ["4", "5", "6", "7"], answer: 1, explanation: "Take 2 away from 7 leaves 5." },
      { question: "10 - 5 = ?", options: ["3", "4", "5", "6"], answer: 2, explanation: "Take 5 away from 10 leaves 5." },
      { question: "8 - 4 = ?", options: ["3", "4", "5", "6"], answer: 1, explanation: "Take 4 away from 8 leaves 4." },
      { question: "5 - 5 = ?", options: ["0", "1", "5", "10"], answer: 0, explanation: "If you take all 5 away from 5, nothing is left: 0." },
      { question: "9 - 1 = ?", options: ["7", "8", "9", "10"], answer: 1, explanation: "Take 1 away from 9 leaves 8." },
      { question: "6 - 2 = ?", options: ["3", "4", "5", "6"], answer: 1, explanation: "Take 2 away from 6 leaves 4." },
      { question: "10 - 3 = ?", options: ["6", "7", "8", "9"], answer: 1, explanation: "Take 3 away from 10 leaves 7." },
      { question: "7 - 3 = ?", options: ["3", "4", "5", "6"], answer: 1, explanation: "Take 3 away from 7 leaves 4." },
      { question: "5 - 0 = ?", options: ["0", "4", "5", "10"], answer: 2, explanation: "Take 0 away from 5 leaves 5." },
      { question: "10 - 4 = ?", options: ["5", "6", "7", "8"], answer: 1, explanation: "Take 4 away from 10 leaves 6." },
      { question: "9 - 5 = ?", options: ["3", "4", "5", "6"], answer: 1, explanation: "Take 5 away from 9 leaves 4." },
      { question: "What is 8 - 3?", type: "written", acceptAnswers: ["5"], explanation: "Take 3 away from 8 leaves 5.", timeLimit: 25 },
    ],
  },
  {
    id: "shapes-y1", name: "Shapes", icon: "Shapes", description: "Recognise simple shapes.",
    theory: "Shapes are all around us. A triangle has 3 sides and 3 corners.\nA square has 4 equal sides and 4 corners. A rectangle also has 4 sides but opposite sides are equal.\nA circle is round and has no corners at all.",
    defaultTimeLimit: 25,
    questions: [
      { question: "Which shape has 3 sides?", options: ["Square", "Triangle", "Circle", "Oval"], answer: 1, explanation: "A triangle has 3 sides." },
      { question: "Which shape is round with no corners?", options: ["Square", "Triangle", "Circle", "Rectangle"], answer: 2, explanation: "A circle is round and has no corners." },
      { question: "How many sides does a square have?", options: ["3", "4", "5", "6"], answer: 1, explanation: "A square has 4 equal sides." },
      { question: "A ball looks like which shape?", options: ["Square", "Circle", "Sphere", "Triangle"], answer: 2, explanation: "A sphere is round like a ball." },
      { question: "Which shape has 4 sides but not all equal?", options: ["Square", "Rectangle", "Triangle", "Circle"], answer: 1, explanation: "A rectangle has 4 sides — opposite sides are equal." },
      { question: "How many corners does a triangle have?", options: ["2", "3", "4", "0"], answer: 1, explanation: "A triangle has 3 corners." },
      { question: "Which of these is flat and has 4 equal sides?", options: ["Square", "Sphere", "Circle", "Triangle"], answer: 0, explanation: "A square is flat with 4 equal sides." },
      { question: "A circle is like a...?", options: ["Box", "Flat ball", "Triangle", "Line"], answer: 1, explanation: "A circle is round like a flat ball." },
      { question: "How many sides does a rectangle have?", options: ["3", "4", "5", "6"], answer: 1, explanation: "A rectangle has 4 sides." },
      { question: "Which has more sides: triangle or square?", options: ["Triangle", "Square", "Same", "Neither"], answer: 1, explanation: "A square has 4 sides, a triangle has 3." },
      { question: "A square and a rectangle both have how many sides?", options: ["3", "4", "5", "6"], answer: 1, explanation: "Both squares and rectangles have 4 sides." },
      { question: "Which shape has 3 corners?", options: ["Square", "Triangle", "Circle", "Rectangle"], answer: 1, explanation: "A triangle has 3 corners." },
      { question: "How many corners does a square have?", options: ["3", "4", "5", "0"], answer: 1, explanation: "A square has 4 corners." },
      { question: "Which of these is NOT flat?", options: ["Square", "Triangle", "Sphere", "Rectangle"], answer: 2, explanation: "A sphere is not flat — it is round like a ball." },
      { question: "How many corners does a circle have?", type: "written", acceptAnswers: ["0", "zero", "none"], explanation: "A circle has no corners.", timeLimit: 25 },
    ],
  },
  {
    id: "patterns-y1", name: "Patterns", icon: "Sparkles", description: "Spot and continue patterns.",
    theory: "A pattern is something that repeats in a predictable way. We can find patterns in colours, shapes and numbers.\nTo continue a pattern, look carefully at what comes before and find the rule.\nNumber patterns can go up by 1, 2, 5 or 10 each time.",
    defaultTimeLimit: 25,
    questions: [
      { question: "What comes next? 🔴🔵🔴🔵🔴___", options: ["🔴", "🔵", "🟢", "🟡"], answer: 0, explanation: "The pattern repeats red, blue, red, blue — so red comes next." },
      { question: "What comes next? 2, 4, 6, ___", options: ["7", "8", "9", "10"], answer: 1, explanation: "Counting up by 2: 2, 4, 6, then 8." },
      { question: "What comes next? ⬛⬜⬛⬜___", options: ["⬛", "⬜", "🟥", "🟨"], answer: 0, explanation: "Black, white, black, white — so black comes next." },
      { question: "What comes next? 1, 2, 3, ___", options: ["4", "5", "6", "10"], answer: 0, explanation: "Counting up by 1: 1, 2, 3, then 4." },
      { question: "What comes next? 🔵🔵🔴🔵🔵___", options: ["🔵", "🔴", "🟢", "🟡"], answer: 1, explanation: "Two blues, one red, repeat — so red comes next." },
      { question: "What comes next? 5, 10, 15, ___", options: ["16", "18", "20", "25"], answer: 2, explanation: "Counting up by 5: 5, 10, 15, then 20." },
      { question: "What comes next? ⭐⭐⭐ ___", options: ["⭐", "2 stars", "3 stars", "0 stars"], answer: 0, explanation: "Same pattern again — one more star." },
      { question: "What comes next? 10, 20, 30, ___", options: ["35", "40", "45", "50"], answer: 1, explanation: "Counting up by 10: 10, 20, 30, then 40." },
      { question: "What comes next? 🟠🟣🟠🟣___", options: ["🟠", "🟣", "🟢", "🟡"], answer: 0, explanation: "Orange, purple, orange, purple — so orange next." },
      { question: "What comes next? 1, 3, 5, ___", options: ["6", "7", "8", "9"], answer: 1, explanation: "Odd numbers: 1, 3, 5, then 7." },
      { question: "What comes next? 🟢🟡🟢🟡🟢___", options: ["🟢", "🟡", "🟠", "🔴"], answer: 1, explanation: "Green, yellow, green, yellow, green — so yellow comes next." },
      { question: "What comes next? 3, 6, 9, ___", options: ["10", "11", "12", "15"], answer: 2, explanation: "Counting up by 3: 3, 6, 9, then 12." },
      { question: "What comes next? 20, 18, 16, ___", options: ["14", "15", "17", "19"], answer: 0, explanation: "Counting down by 2: 20, 18, 16, then 14." },
      { question: "What comes next? ⭕⭐⭕⭐⭕___", options: ["⭕", "⭐", "🔵", "🟩"], answer: 1, explanation: "Circle, star, circle, star, circle — so star comes next." },
      { question: "What number comes next: 4, 8, 12, ___?", type: "written", acceptAnswers: ["16"], explanation: "Counting up by 4: 4, 8, 12, then 16.", timeLimit: 25 },
    ],
  },
];

/* ===================== YEAR 2 (Ages 6-7) ===================== */
const YEAR2_TOPICS: Topic[] = [
  {
    id: "add-sub-20", name: "Add & Subtract to 20", icon: "Plus", description: "Adding and taking away up to 20.",
    theory: "Adding and subtracting within 20 means working with numbers you can count on your fingers and beyond.\nThe key is to know number bonds — pairs that add to 10 (like 3+7, 4+6, 8+2) — so you can solve problems quickly.\nWhen subtracting, you can count backwards or find the difference between the two numbers.",
    defaultTimeLimit: 28,
    questions: [
      { question: "9 + 6 = ?", options: ["13", "14", "15", "16"], answer: 2, explanation: "9 + 6 = 15." },
      { question: "12 + 5 = ?", options: ["15", "16", "17", "18"], answer: 2, explanation: "12 + 5 = 17." },
      { question: "15 - 7 = ?", options: ["6", "7", "8", "9"], answer: 2, explanation: "15 - 7 = 8." },
      { question: "20 - 8 = ?", options: ["10", "11", "12", "13"], answer: 2, explanation: "20 - 8 = 12." },
      { question: "8 + 8 = ?", options: ["14", "15", "16", "17"], answer: 2, explanation: "8 + 8 = 16." },
      { question: "11 + 9 = ?", options: ["18", "19", "20", "21"], answer: 2, explanation: "11 + 9 = 20." },
      { question: "18 - 9 = ?", options: ["8", "9", "10", "11"], answer: 1, explanation: "18 - 9 = 9." },
      { question: "13 + 6 = ?", options: ["17", "18", "19", "20"], answer: 2, explanation: "13 + 6 = 19." },
      { question: "16 - 5 = ?", options: ["9", "10", "11", "12"], answer: 2, explanation: "16 - 5 = 11." },
      { question: "7 + 12 = ?", options: ["17", "18", "19", "20"], answer: 2, explanation: "7 + 12 = 19." },
      { question: "4 + 9 = ?", options: ["11", "12", "13", "14"], answer: 2, explanation: "4 + 9 = 13." },
      { question: "15 - 8 = ?", options: ["6", "7", "8", "9"], answer: 1, explanation: "15 - 8 = 7." },
      { question: "6 + 7 = ?", options: ["12", "13", "14", "15"], answer: 1, explanation: "6 + 7 = 13." },
      { question: "20 - 14 = ?", options: ["5", "6", "7", "8"], answer: 1, explanation: "20 - 14 = 6." },
      { question: "What is 14 + 5?", type: "written", acceptAnswers: ["19"], explanation: "14 + 5 = 19.", timeLimit: 28 },
    ],
  },
  {
    id: "times-2-5-10", name: "Times Tables (2, 5, 10)", icon: "X", description: "Multiplying by 2, 5 and 10.",
    theory: "Multiplication is repeated addition. The 2 times table is just doubling a number.\nThe 10 times table is the easiest — just add a zero to the end of the number.\nThe 5 times table is useful for time (minutes) and money (5p coins).",
    defaultTimeLimit: 28,
    questions: [
      { question: "2 × 3 = ?", options: ["5", "6", "7", "8"], answer: 1, explanation: "2 × 3 = 6 (two groups of 3)." },
      { question: "5 × 2 = ?", options: ["7", "10", "12", "15"], answer: 1, explanation: "5 × 2 = 10." },
      { question: "10 × 3 = ?", options: ["13", "20", "30", "33"], answer: 2, explanation: "10 × 3 = 30 (just add a 0 to 3)." },
      { question: "2 × 6 = ?", options: ["8", "10", "12", "14"], answer: 2, explanation: "2 × 6 = 12." },
      { question: "5 × 5 = ?", options: ["20", "25", "30", "35"], answer: 1, explanation: "5 × 5 = 25." },
      { question: "10 × 7 = ?", options: ["17", "70", "77", "100"], answer: 1, explanation: "10 × 7 = 70." },
      { question: "2 × 8 = ?", options: ["10", "14", "16", "18"], answer: 2, explanation: "2 × 8 = 16." },
      { question: "5 × 4 = ?", options: ["15", "20", "25", "30"], answer: 1, explanation: "5 × 4 = 20." },
      { question: "10 × 10 = ?", options: ["20", "100", "110", "1000"], answer: 1, explanation: "10 × 10 = 100." },
      { question: "5 × 10 = ?", options: ["15", "50", "55", "100"], answer: 1, explanation: "5 × 10 = 50." },
      { question: "2 × 7 = ?", options: ["12", "14", "16", "18"], answer: 1, explanation: "2 × 7 = 14." },
      { question: "5 × 6 = ?", options: ["25", "28", "30", "35"], answer: 2, explanation: "5 × 6 = 30." },
      { question: "10 × 4 = ?", options: ["14", "40", "44", "100"], answer: 1, explanation: "10 × 4 = 40." },
      { question: "2 × 9 = ?", options: ["16", "18", "20", "22"], answer: 1, explanation: "2 × 9 = 18." },
      { question: "What is 5 × 8?", type: "written", acceptAnswers: ["40"], explanation: "5 × 8 = 40.", timeLimit: 28 },
    ],
  },
  {
    id: "shapes-money-y2", name: "Shapes & Money", icon: "Shapes", description: "Recognise shapes and count coins.",
    theory: "2D shapes are flat — like triangles, squares, rectangles and circles. 3D shapes are solid, like spheres and cubes.\nWhen working with money, we add coin values together to find the total.\nUK coins include 1p, 2p, 5p, 10p, 20p, 50p, £1 and £2.",
    defaultTimeLimit: 28,
    questions: [
      { question: "How many sides does a triangle have?", options: ["2", "3", "4", "5"], answer: 1, explanation: "A triangle has 3 sides." },
      { question: "How many sides does a square have?", options: ["3", "4", "5", "6"], answer: 1, explanation: "A square has 4 equal sides." },
      { question: "A circle is round. How many corners does it have?", options: ["0", "1", "2", "4"], answer: 0, explanation: "A circle has no corners." },
      { question: "Which coin is worth the most? (UK)", options: ["1p", "2p", "10p", "50p"], answer: 3, explanation: "50p is worth more than 1p, 2p or 10p." },
      { question: "How many 1p coins make 5p?", options: ["2", "3", "4", "5"], answer: 3, explanation: "Five 1p coins make 5p." },
      { question: "How many sides does a rectangle have?", options: ["3", "4", "5", "6"], answer: 1, explanation: "A rectangle has 4 sides." },
      { question: "A square has 4 sides the same length. True or false?", options: ["True", "False", "Sometimes", "Only big squares"], answer: 0, explanation: "True — all 4 sides of a square are equal." },
      { question: "2p + 2p = ?p", options: ["2p", "3p", "4p", "5p"], answer: 2, explanation: "2p + 2p = 4p." },
      { question: "10p + 10p = ?p", options: ["10p", "20p", "100p", "2p"], answer: 1, explanation: "10p + 10p = 20p." },
      { question: "Which shape looks like a ball?", options: ["Square", "Triangle", "Sphere", "Rectangle"], answer: 2, explanation: "A sphere is round like a ball." },
      { question: "How many 2p coins make 10p?", options: ["4", "5", "8", "10"], answer: 1, explanation: "5 × 2p = 10p." },
      { question: "5p + 5p + 5p = ?p", options: ["10p", "15p", "20p", "25p"], answer: 1, explanation: "5p + 5p + 5p = 15p." },
      { question: "Which shape has 4 equal sides?", options: ["Triangle", "Square", "Circle", "Sphere"], answer: 1, explanation: "A square has 4 equal sides." },
      { question: "How many sides does a pentagon have?", options: ["4", "5", "6", "7"], answer: 1, explanation: "A pentagon has 5 sides." },
      { question: "How many 5p coins make 20p?", type: "written", acceptAnswers: ["4"], explanation: "4 × 5p = 20p.", timeLimit: 28 },
    ],
  },
  {
    id: "time-y2", name: "Telling the Time", icon: "Clock", description: "O'clock and half past.",
    theory: "We tell time using two hands on a clock. The short hand shows the hour and the long hand shows the minutes.\nWhen the long hand points to 12, we say 'o'clock'. When it points to 6, we say 'half past'.\nThere are 60 minutes in one hour, so half past means 30 minutes past the hour.",
    defaultTimeLimit: 28,
    questions: [
      { question: "If the long hand points to 12 and the short hand to 3, what time is it?", options: ["12:00", "3:00", "6:00", "9:00"], answer: 1, explanation: "Short hand on 3, long hand on 12 = 3 o'clock." },
      { question: "If the long hand points to 6, what does that mean?", options: ["O'clock", "Half past", "Quarter past", "Quarter to"], answer: 1, explanation: "Long hand on 6 = half past." },
      { question: "What is half past 4?", options: ["4:00", "4:15", "4:30", "4:45"], answer: 2, explanation: "Half past 4 = 4:30." },
      { question: "What comes after 12 o'clock?", options: ["11 o'clock", "1 o'clock", "6 o'clock", "12 o'clock again"], answer: 1, explanation: "After 12 comes 1 o'clock." },
      { question: "How many minutes are in half an hour?", options: ["15", "30", "45", "60"], answer: 1, explanation: "Half an hour = 30 minutes." },
      { question: "If the short hand points to 7 and the long hand to 12, what time?", options: ["12:00", "7:00", "6:00", "7:30"], answer: 1, explanation: "7 o'clock." },
      { question: "What is half past 2?", options: ["2:00", "2:15", "2:30", "2:45"], answer: 2, explanation: "Half past 2 = 2:30." },
      { question: "If the long hand points to 12, is it o'clock or half past?", options: ["O'clock", "Half past", "Neither", "Both"], answer: 0, explanation: "Long hand on 12 = o'clock." },
      { question: "What time is it at 'half past 9'?", options: ["9:00", "9:30", "9:15", "9:45"], answer: 1, explanation: "Half past 9 = 9:30." },
      { question: "How many hours are between 3 o'clock and 5 o'clock?", options: ["1", "2", "3", "4"], answer: 1, explanation: "From 3 to 5 is 2 hours." },
      { question: "What time is 'half past 7'?", options: ["7:00", "7:15", "7:30", "7:45"], answer: 2, explanation: "Half past 7 = 7:30." },
      { question: "If the short hand points to 10 and the long hand to 12, what time is it?", options: ["10:00", "12:00", "10:30", "2:00"], answer: 0, explanation: "Short hand on 10, long hand on 12 = 10 o'clock." },
      { question: "How many minutes are in one hour?", options: ["30", "45", "60", "100"], answer: 2, explanation: "1 hour = 60 minutes." },
      { question: "What comes after half past 5?", options: ["5:45", "6:00", "5:30", "7:00"], answer: 1, explanation: "After half past 5 comes 6 o'clock." },
      { question: "Write 'half past 11' as a digital time.", type: "written", acceptAnswers: ["11:30"], explanation: "Half past 11 = 11:30.", timeLimit: 28 },
    ],
  },
  {
    id: "word-problems-y2", name: "Word Problems", icon: "BookOpen", description: "Cambridge-style simple word problems.",
    theory: "Word problems tell a story that you need to turn into maths.\nRead carefully and decide whether you need to add, subtract, multiply or divide.\nLook for clue words: 'more' often means add, 'left' often means subtract, 'each' often means multiply.",
    defaultTimeLimit: 28,
    questions: [
      { question: "Liam has 7 sweets. His mum gives him 5 more. How many sweets does Liam have now?", options: ["10", "11", "12", "13"], answer: 2, cambridge: true, explanation: "7 + 5 = 12 sweets." },
      { question: "A basket has 15 apples. 6 are eaten. How many apples are left?", options: ["8", "9", "10", "11"], answer: 1, cambridge: true, explanation: "15 − 6 = 9 apples left." },
      { question: "There are 4 boxes. Each box has 5 crayons. How many crayons altogether?", options: ["15", "20", "25", "9"], answer: 1, cambridge: true, explanation: "4 × 5 = 20 crayons." },
      { question: "Maya has 10p. She buys a lolly for 4p. How much money does she have left?", options: ["4p", "5p", "6p", "14p"], answer: 2, cambridge: true, explanation: "10p − 4p = 6p left." },
      { question: "A bus has 9 children. 5 more get on. How many children are on the bus now?", options: ["12", "13", "14", "15"], answer: 2, cambridge: true, explanation: "9 + 5 = 14 children." },
      { question: "Tom has 12 marbles. He loses 4. How many does he have left?", options: ["6", "7", "8", "9"], answer: 2, cambridge: true, explanation: "12 − 4 = 8 marbles." },
      { question: "Each hen lays 2 eggs. There are 5 hens. How many eggs altogether?", options: ["7", "10", "12", "25"], answer: 1, cambridge: true, explanation: "5 × 2 = 10 eggs." },
      { question: "A book has 20 pages. Aisha reads 10. How many pages are left?", options: ["5", "10", "15", "30"], answer: 1, cambridge: true, explanation: "20 − 10 = 10 pages left." },
      { question: "There are 6 red balloons and 6 blue balloons. How many balloons in total?", options: ["10", "11", "12", "13"], answer: 2, cambridge: true, explanation: "6 + 6 = 12 balloons." },
      { question: "Dad bakes 18 cupcakes. The family eats 7. How many are left?", options: ["10", "11", "12", "9"], answer: 1, cambridge: true, explanation: "18 − 7 = 11 cupcakes." },
      { question: "There are 14 children on a bus. 6 get off. How many are left?", options: ["6", "7", "8", "9"], answer: 2, cambridge: true, explanation: "14 − 6 = 8 children." },
      { question: "There are 3 boxes, each with 6 eggs. How many eggs altogether?", options: ["15", "16", "17", "18"], answer: 3, cambridge: true, explanation: "3 × 6 = 18 eggs." },
      { question: "Sam has 20p. He buys a pencil for 12p. How much money is left?", options: ["6p", "7p", "8p", "9p"], answer: 2, cambridge: true, explanation: "20p − 12p = 8p." },
      { question: "Sam has 9 toy cars and gets 4 more. How many altogether?", options: ["11", "12", "13", "14"], answer: 2, cambridge: true, explanation: "9 + 4 = 13 cars." },
      { question: "There are 5 bags with 4 sweets each. How many sweets altogether?", type: "written", acceptAnswers: ["20"], explanation: "5 × 4 = 20 sweets.", timeLimit: 28, cambridge: true },
    ],
  },
];

/* ===================== YEAR 3 (Ages 7-8) ===================== */
const YEAR3_TOPICS: Topic[] = [
  {
    id: "times-tables", name: "Times Tables to 12", icon: "X", description: "All times tables up to 12.",
    theory: "Knowing your times tables up to 12×12 is one of the most important skills in maths.\nEach table is just repeated addition — 4×3 means 4+4+4.\nLearning tricks helps: the 9 times table has digits that sum to 9 (9, 18, 27, 36...) and the 11 times table just repeats the digit up to 99.",
    defaultTimeLimit: 30,
    questions: [
      { question: "3 × 4 = ?", options: ["7", "12", "14", "16"], answer: 1, explanation: "3 × 4 = 12." },
      { question: "6 × 7 = ?", options: ["36", "42", "48", "54"], answer: 1, explanation: "6 × 7 = 42." },
      { question: "8 × 4 = ?", options: ["24", "28", "32", "36"], answer: 2, explanation: "8 × 4 = 32." },
      { question: "9 × 3 = ?", options: ["21", "24", "27", "30"], answer: 2, explanation: "9 × 3 = 27." },
      { question: "7 × 8 = ?", options: ["48", "54", "56", "64"], answer: 2, explanation: "7 × 8 = 56." },
      { question: "12 × 4 = ?", options: ["36", "44", "48", "52"], answer: 2, explanation: "12 × 4 = 48." },
      { question: "6 × 6 = ?", options: ["30", "32", "36", "42"], answer: 2, explanation: "6 × 6 = 36." },
      { question: "9 × 9 = ?", options: ["72", "81", "90", "99"], answer: 1, explanation: "9 × 9 = 81." },
      { question: "11 × 5 = ?", options: ["50", "55", "60", "65"], answer: 1, explanation: "11 × 5 = 55." },
      { question: "4 × 9 = ?", options: ["32", "36", "40", "44"], answer: 1, explanation: "4 × 9 = 36." },
      { question: "6 × 7 = ?", options: ["40", "42", "44", "48"], answer: 1, explanation: "6 × 7 = 42." },
      { question: "9 × 8 = ?", options: ["63", "72", "81", "88"], answer: 1, explanation: "9 × 8 = 72." },
      { question: "12 × 6 = ?", options: ["60", "66", "72", "78"], answer: 2, explanation: "12 × 6 = 72." },
      { question: "7 × 8 = ?", options: ["54", "56", "58", "64"], answer: 1, explanation: "7 × 8 = 56." },
      { question: "What is 9 × 7?", type: "written", acceptAnswers: ["63"], explanation: "9 × 7 = 63.", timeLimit: 30 },
    ],
  },
  {
    id: "fractions-easy", name: "Simple Fractions", icon: "PieChart", description: "Half, quarter and third.",
    theory: "A fraction shows part of a whole. The bottom number (denominator) tells us how many equal parts the whole is split into.\nThe top number (numerator) tells us how many of those parts we have.\nSo 3/4 means 3 out of 4 equal parts.",
    defaultTimeLimit: 30,
    questions: [
      { question: "What is half of 10?", options: ["2", "5", "4", "8"], answer: 1, explanation: "Half of 10 = 10 ÷ 2 = 5." },
      { question: "What is a quarter of 8?", options: ["2", "4", "6", "3"], answer: 0, explanation: "A quarter of 8 = 8 ÷ 4 = 2." },
      { question: "What is a third of 9?", options: ["2", "3", "4", "6"], answer: 1, explanation: "A third of 9 = 9 ÷ 3 = 3." },
      { question: "Which is bigger: 1/2 or 1/4?", options: ["1/2", "1/4", "Same", "Can't tell"], answer: 0, explanation: "1/2 (half) is bigger than 1/4 (a quarter)." },
      { question: "What is half of 12?", options: ["4", "6", "8", "10"], answer: 1, explanation: "Half of 12 = 12 ÷ 2 = 6." },
      { question: "A pizza is cut into 4 equal slices. You eat 1. What fraction did you eat?", options: ["1/2", "1/3", "1/4", "3/4"], answer: 2, explanation: "1 out of 4 slices = 1/4." },
      { question: "What is half of 20?", options: ["5", "8", "10", "15"], answer: 2, explanation: "Half of 20 = 20 ÷ 2 = 10." },
      { question: "Which fraction means the same as 1/2?", options: ["2/4", "1/3", "1/4", "2/3"], answer: 0, explanation: "2/4 = 1/2 (two quarters make a half)." },
      { question: "What is a quarter of 12?", options: ["2", "3", "4", "6"], answer: 1, explanation: "A quarter of 12 = 12 ÷ 4 = 3." },
      { question: "What is a third of 12?", options: ["3", "4", "6", "9"], answer: 1, explanation: "A third of 12 = 12 ÷ 3 = 4." },
      { question: "What is 2/3 of 9?", options: ["3", "4", "6", "8"], answer: 2, explanation: "9 ÷ 3 = 3, then 3 × 2 = 6." },
      { question: "1/2 of 20 = ?", options: ["5", "8", "10", "15"], answer: 2, explanation: "20 ÷ 2 = 10." },
      { question: "Which fraction is the same as 1/2?", options: ["2/3", "2/4", "3/4", "1/3"], answer: 1, explanation: "2/4 simplifies to 1/2." },
      { question: "What is 3/4 of 8?", options: ["4", "5", "6", "7"], answer: 2, explanation: "8 ÷ 4 = 2, then 2 × 3 = 6." },
      { question: "What is 1/4 of 16?", type: "written", acceptAnswers: ["4"], explanation: "16 ÷ 4 = 4.", timeLimit: 30 },
    ],
  },
  {
    id: "measure-c3", name: "Measuring", icon: "Ruler", description: "Length, weight and time.",
    theory: "We measure length in millimetres (mm), centimetres (cm) and metres (m). 1 cm = 10 mm, and 1 m = 100 cm.\nWeight is measured in grams (g) and kilograms (kg). 1 kg = 1000 g.\nTime is measured in seconds, minutes, hours and days: 60 seconds = 1 minute, 60 minutes = 1 hour.",
    defaultTimeLimit: 30,
    questions: [
      { question: "How many centimetres are in 1 metre?", options: ["10", "100", "1000", "12"], answer: 1, explanation: "1 metre = 100 centimetres." },
      { question: "How many minutes are in 1 hour?", options: ["30", "60", "100", "24"], answer: 1, explanation: "1 hour = 60 minutes." },
      { question: "How many hours are in 1 day?", options: ["12", "24", "48", "60"], answer: 1, explanation: "1 day = 24 hours." },
      { question: "Which is longer: 1 metre or 1 centimetre?", options: ["1 metre", "1 centimetre", "Same", "Depends"], answer: 0, explanation: "1 metre (100 cm) is much longer than 1 centimetre." },
      { question: "How many seconds are in 1 minute?", options: ["30", "60", "100", "24"], answer: 1, explanation: "1 minute = 60 seconds." },
      { question: "How many grams are in 1 kilogram?", options: ["100", "500", "1000", "10000"], answer: 2, explanation: "1 kilogram = 1000 grams." },
      { question: "If school starts at 9:00 and lunch is at 12:00, how many hours is that?", options: ["2", "3", "4", "5"], answer: 1, explanation: "From 9 to 12 is 3 hours." },
      { question: "How many days are in a week?", options: ["5", "6", "7", "10"], answer: 2, explanation: "There are 7 days in a week." },
      { question: "Which would you measure in kilograms: a pencil or a bag of rice?", options: ["Pencil", "Bag of rice", "Both", "Neither"], answer: 1, explanation: "A bag of rice is heavy, so we use kilograms." },
      { question: "How many months are in a year?", options: ["6", "10", "12", "24"], answer: 2, explanation: "There are 12 months in a year." },
      { question: "1 kg = ? g", options: ["100", "500", "1000", "10000"], answer: 2, explanation: "1 kilogram = 1000 grams." },
      { question: "3 m = ? cm", options: ["30", "100", "300", "3000"], answer: 2, explanation: "3 m × 100 = 300 cm." },
      { question: "How many seconds are in 2 minutes?", options: ["60", "100", "120", "200"], answer: 2, explanation: "2 × 60 = 120 seconds." },
      { question: "150 cm = ? m", options: ["1 m", "1.5 m", "15 m", "0.15 m"], answer: 1, explanation: "150 cm ÷ 100 = 1.5 m." },
      { question: "How many minutes are in 3 hours?", type: "written", acceptAnswers: ["180"], explanation: "3 × 60 = 180 minutes.", timeLimit: 30 },
    ],
  },
  {
    id: "division-c3", name: "Division Basics", icon: "Divide", description: "Sharing and grouping.",
    theory: "Division is splitting a number into equal groups. 12 ÷ 3 means 'how many groups of 3 are in 12?'\nDivision is the opposite of multiplication, so knowing your times tables really helps.\nWhen we divide, the answer is called the quotient.",
    defaultTimeLimit: 30,
    questions: [
      { question: "12 ÷ 3 = ?", options: ["3", "4", "5", "6"], answer: 1, explanation: "12 ÷ 3 = 4 (3 groups of 4 make 12)." },
      { question: "20 ÷ 5 = ?", options: ["3", "4", "5", "6"], answer: 2, explanation: "20 ÷ 5 = 4." },
      { question: "10 ÷ 2 = ?", options: ["4", "5", "6", "8"], answer: 1, explanation: "10 ÷ 2 = 5." },
      { question: "18 ÷ 6 = ?", options: ["2", "3", "4", "6"], answer: 1, explanation: "18 ÷ 6 = 3." },
      { question: "24 ÷ 4 = ?", options: ["4", "5", "6", "8"], answer: 2, explanation: "24 ÷ 4 = 6." },
      { question: "Share 15 sweets between 3 friends. How many each?", options: ["3", "4", "5", "6"], answer: 2, explanation: "15 ÷ 3 = 5 each." },
      { question: "30 ÷ 6 = ?", options: ["4", "5", "6", "7"], answer: 2, explanation: "30 ÷ 6 = 5." },
      { question: "16 ÷ 4 = ?", options: ["2", "3", "4", "8"], answer: 2, explanation: "16 ÷ 4 = 4." },
      { question: "50 ÷ 10 = ?", options: ["4", "5", "10", "15"], answer: 1, explanation: "50 ÷ 10 = 5." },
      { question: "27 ÷ 3 = ?", options: ["7", "8", "9", "10"], answer: 2, explanation: "27 ÷ 3 = 9." },
      { question: "36 ÷ 9 = ?", options: ["3", "4", "5", "6"], answer: 1, explanation: "36 ÷ 9 = 4." },
      { question: "100 ÷ 10 = ?", options: ["5", "10", "20", "100"], answer: 1, explanation: "100 ÷ 10 = 10." },
      { question: "48 ÷ 6 = ?", options: ["6", "7", "8", "9"], answer: 2, explanation: "48 ÷ 6 = 8." },
      { question: "72 ÷ 8 = ?", options: ["8", "9", "10", "12"], answer: 1, explanation: "72 ÷ 8 = 9." },
      { question: "What is 45 ÷ 5?", type: "written", acceptAnswers: ["9"], explanation: "45 ÷ 5 = 9.", timeLimit: 30 },
    ],
  },
  {
    id: "word-problems-y3", name: "Word Problems", icon: "BookOpen", description: "Cambridge-style worded problems.",
    theory: "Word problems test whether you can choose the right operation.\nBreak the problem into steps: what do I know, what do I need to find, and which operation gets me there?\nSometimes you need two steps — for example, multiply then add.",
    defaultTimeLimit: 30,
    questions: [
      { question: "A farmer has 8 pens. Each pen has 6 sheep. How many sheep altogether?", options: ["42", "48", "54", "56"], answer: 1, cambridge: true, explanation: "8 × 6 = 48 sheep." },
      { question: "A ribbon is 80 cm long. 35 cm is cut off. How long is the piece left?", options: ["35 cm", "40 cm", "45 cm", "55 cm"], answer: 2, cambridge: true, explanation: "80 − 35 = 45 cm." },
      { question: "A school orders 6 boxes of pencils. Each box has 12 pencils. How many pencils in total?", options: ["60", "66", "72", "84"], answer: 2, cambridge: true, explanation: "6 × 12 = 72 pencils." },
      { question: "Sara bakes 24 biscuits. She gives 1/4 to her friend. How many does she give away?", options: ["4", "6", "8", "12"], answer: 1, cambridge: true, explanation: "1/4 of 24 = 24 ÷ 4 = 6 biscuits." },
      { question: "A film starts at 3:00 pm and lasts 90 minutes. What time does it finish?", options: ["4:00 pm", "4:15 pm", "4:30 pm", "5:00 pm"], answer: 2, cambridge: true, explanation: "90 minutes = 1 hour 30 minutes. 3:00 + 1:30 = 4:30 pm." },
      { question: "A bag of flour weighs 2 kg. A cake uses 600 g. How much flour is left, in grams?", options: ["1400 g", "1200 g", "800 g", "400 g"], answer: 0, cambridge: true, explanation: "2 kg = 2000 g. 2000 − 600 = 1400 g." },
      { question: "A class has 28 children. They sit in 4 equal rows. How many children in each row?", options: ["6", "7", "8", "9"], answer: 1, cambridge: true, explanation: "28 ÷ 4 = 7 children per row." },
      { question: "A book has 120 pages. Mia reads 35 on Monday and 40 on Tuesday. How many pages are left?", options: ["35", "40", "45", "55"], answer: 2, cambridge: true, explanation: "120 − 35 − 40 = 45 pages left." },
      { question: "A pack has 9 stickers. Mrs Brown buys 7 packs. How many stickers does she have?", options: ["54", "56", "63", "72"], answer: 2, cambridge: true, explanation: "7 × 9 = 63 stickers." },
      { question: "A jug holds 1 litre. Aisha pours out 300 ml. How much is left, in millilitres?", options: ["600 ml", "700 ml", "800 ml", "750 ml"], answer: 1, cambridge: true, explanation: "1 litre = 1000 ml. 1000 − 300 = 700 ml." },
      { question: "Each box holds 6 pens. There are 7 boxes. How many pens?", options: ["36", "40", "42", "48"], answer: 2, cambridge: true, explanation: "6 × 7 = 42 pens." },
      { question: "Tom has 45p. He spends 18p. How much is left?", options: ["25p", "26p", "27p", "28p"], answer: 2, cambridge: true, explanation: "45p − 18p = 27p." },
      { question: "There are 4 bags of 5 apples. 3 apples are eaten. How many left?", options: ["15", "16", "17", "20"], answer: 2, cambridge: true, explanation: "4 × 5 = 20, then 20 − 3 = 17." },
      { question: "A ribbon is 80 cm. Cut into 4 equal pieces. How long is each?", options: ["16 cm", "18 cm", "20 cm", "25 cm"], answer: 2, cambridge: true, explanation: "80 ÷ 4 = 20 cm." },
      { question: "There are 9 boxes with 6 pencils each. How many pencils altogether?", type: "written", acceptAnswers: ["54"], explanation: "9 × 6 = 54 pencils.", timeLimit: 30, cambridge: true },
    ],
  },
];

/* ===================== YEAR 4 (Ages 8-9) ===================== */
const YEAR4_TOPICS: Topic[] = [
  {
    id: "big-numbers", name: "Big Numbers", icon: "Hash", description: "Place value up to thousands.",
    theory: "Place value tells us the value of each digit in a number. In 3,562, the 3 means 3,000, the 5 means 500, the 6 means 60 and the 2 means 2.\nWe can break numbers into thousands, hundreds, tens and ones. This helps us compare and round numbers.\nRounding to the nearest 10 or 100 makes big numbers easier to work with.",
    defaultTimeLimit: 33,
    questions: [
      { question: "In 3,562, what is the value of the 5?", options: ["5", "50", "500", "5000"], answer: 2, explanation: "The 5 is in the hundreds place, so it's worth 500." },
      { question: "What is 1,000 + 500 + 20 + 4?", options: ["1524", "1542", "1504", "1254"], answer: 0, explanation: "1000 + 500 + 20 + 4 = 1,524." },
      { question: "Round 47 to the nearest 10.", options: ["40", "45", "50", "47"], answer: 2, explanation: "47 rounds up to 50 (7 is closer to 10)." },
      { question: "Which is bigger: 3,450 or 3,540?", options: ["3,450", "3,540", "Same", "Can't tell"], answer: 1, explanation: "3,540 is bigger (540 > 450)." },
      { question: "In 8,914, what is the value of the 8?", options: ["8", "80", "800", "8000"], answer: 3, explanation: "The 8 is in the thousands place = 8,000." },
      { question: "Round 82 to the nearest 10.", options: ["70", "80", "90", "82"], answer: 1, explanation: "82 rounds to 80 (2 is closer to 0)." },
      { question: "What is 2,000 + 300 + 40 + 7?", options: ["2347", "2437", "2374", "2743"], answer: 0, explanation: "2,000 + 300 + 40 + 7 = 2,347." },
      { question: "How many tens are in 200?", options: ["10", "20", "100", "200"], answer: 1, explanation: "200 ÷ 10 = 20 tens." },
      { question: "Round 156 to the nearest 100.", options: ["100", "150", "200", "160"], answer: 2, explanation: "156 rounds to 200 (56 is closer to 100 than 0)." },
      { question: "In 5,090, the 0 in the hundreds place means...?", options: ["0 hundreds", "0 tens", "0 ones", "0 thousands"], answer: 0, explanation: "The middle 0 is in the hundreds place = 0 hundreds." },
      { question: "In 7,492, what is the value of the 4?", options: ["4", "40", "400", "4000"], answer: 2, explanation: "The 4 is in the hundreds place, so it's worth 400." },
      { question: "What is 3,000 + 200 + 50 + 6?", options: ["3256", "3526", "3265", "3652"], answer: 0, explanation: "3,000 + 200 + 50 + 6 = 3,256." },
      { question: "Round 349 to the nearest 100.", options: ["300", "340", "400", "350"], answer: 0, explanation: "349 is less than 350, so it rounds down to 300." },
      { question: "In 9,081, what is the value of the 0?", options: ["0 thousands", "0 hundreds", "0 tens", "0 ones"], answer: 1, explanation: "The 0 is in the hundreds place = 0 hundreds." },
      { question: "In 6,235, what is the value of the 6?", type: "written", acceptAnswers: ["6000", "6,000"], explanation: "The 6 is in the thousands place = 6,000.", timeLimit: 33 },
    ],
  },
  {
    id: "fractions-decimals", name: "Fractions & Decimals", icon: "PieChart", description: "Compare and calculate with fractions and decimals.",
    theory: "Fractions and decimals are two ways of showing parts of a whole. 1/2 = 0.5, 1/4 = 0.25 and 3/4 = 0.75.\nWhen adding fractions with the same bottom number (denominator), just add the top numbers.\nTo turn a fraction into a decimal, divide the top by the bottom: 3 ÷ 10 = 0.3.",
    defaultTimeLimit: 33,
    questions: [
      { question: "What is 1/2 as a decimal?", options: ["0.1", "0.2", "0.5", "1.2"], answer: 2, explanation: "1/2 = 0.5." },
      { question: "What is 0.25 as a fraction?", options: ["1/2", "1/4", "1/3", "2/5"], answer: 1, explanation: "0.25 = 1/4 (a quarter)." },
      { question: "Which is bigger: 0.4 or 0.04?", options: ["0.4", "0.04", "Same", "Can't tell"], answer: 0, explanation: "0.4 = 4 tenths, which is bigger than 0.04 = 4 hundredths." },
      { question: "What is 1/4 of 20?", options: ["4", "5", "10", "15"], answer: 1, explanation: "20 ÷ 4 = 5." },
      { question: "Add: 0.3 + 0.4 = ?", options: ["0.07", "0.34", "0.7", "0.12"], answer: 2, explanation: "0.3 + 0.4 = 0.7." },
      { question: "Which is bigger: 3/4 or 1/2?", options: ["3/4", "1/2", "Same", "Can't tell"], answer: 0, explanation: "3/4 = 0.75, which is bigger than 1/2 = 0.5." },
      { question: "What is 2/5 + 1/5?", options: ["3/10", "3/5", "2/5", "1/5"], answer: 1, explanation: "Same bottom number: 2/5 + 1/5 = 3/5." },
      { question: "What is 0.1 as a fraction?", options: ["1/2", "1/10", "1/100", "1/5"], answer: 1, explanation: "0.1 = 1/10 (one tenth)." },
      { question: "Which is smaller: 0.5 or 1/2?", options: ["0.5", "1/2", "Same", "Can't tell"], answer: 2, explanation: "They're the same! 0.5 = 1/2." },
      { question: "What is 3/10 as a decimal?", options: ["0.3", "0.03", "0.13", "3.0"], answer: 0, explanation: "3/10 = 0.3." },
      { question: "What is 1/4 as a decimal?", options: ["0.1", "0.25", "0.4", "0.14"], answer: 1, explanation: "1/4 = 0.25." },
      { question: "0.5 + 0.2 = ?", options: ["0.07", "0.52", "0.7", "0.25"], answer: 2, explanation: "0.5 + 0.2 = 0.7." },
      { question: "Which fraction is the same as 0.5?", options: ["1/4", "1/2", "3/4", "1/5"], answer: 1, explanation: "0.5 = 1/2." },
      { question: "What is 3/4 − 1/4?", options: ["1/2", "2/4", "1/4", "3/16"], answer: 1, explanation: "3/4 − 1/4 = 2/4, which simplifies to 1/2." },
      { question: "Write 0.7 as a fraction.", type: "written", acceptAnswers: ["7/10"], explanation: "0.7 = 7/10 (seven tenths).", timeLimit: 33 },
    ],
  },
  {
    id: "area-perimeter-y4", name: "Area & Perimeter", icon: "Ruler", description: "Measure flat shapes.",
    theory: "Perimeter is the distance all the way around a shape. For a rectangle, add all four sides: length + width + length + width.\nArea is the space inside a shape. For a rectangle, multiply length by width.\nA square has all sides equal, so its perimeter is 4 × side and its area is side × side.",
    defaultTimeLimit: 33,
    questions: [
      { question: "A rectangle is 5 cm long and 3 cm wide. What is its perimeter?", options: ["8 cm", "15 cm", "16 cm", "30 cm"], answer: 2, explanation: "Perimeter = 5+3+5+3 = 16 cm." },
      { question: "A square has a side of 4 cm. What is its area?", options: ["8 cm²", "12 cm²", "16 cm²", "20 cm²"], answer: 2, explanation: "Area = 4 × 4 = 16 cm²." },
      { question: "A rectangle is 6 cm by 2 cm. What is its area?", options: ["8 cm²", "12 cm²", "16 cm²", "24 cm²"], answer: 1, explanation: "Area = 6 × 2 = 12 cm²." },
      { question: "A square has a side of 5 cm. What is its perimeter?", options: ["10 cm", "20 cm", "25 cm", "15 cm"], answer: 1, explanation: "Perimeter = 4 × 5 = 20 cm." },
      { question: "A rectangle is 7 cm by 3 cm. What is its perimeter?", options: ["10 cm", "20 cm", "21 cm", "14 cm"], answer: 1, explanation: "Perimeter = 7+3+7+3 = 20 cm." },
      { question: "A rectangle is 8 cm by 4 cm. What is its area?", options: ["12 cm²", "24 cm²", "32 cm²", "16 cm²"], answer: 2, explanation: "Area = 8 × 4 = 32 cm²." },
      { question: "A square has area 9 cm². What is the length of one side?", options: ["2 cm", "3 cm", "4 cm", "9 cm"], answer: 1, explanation: "3 × 3 = 9, so each side is 3 cm." },
      { question: "A field is 10 m by 10 m. What is its area?", options: ["20 m²", "40 m²", "100 m²", "1000 m²"], answer: 2, explanation: "Area = 10 × 10 = 100 m²." },
      { question: "Perimeter of a 9 cm by 2 cm rectangle?", options: ["11 cm", "18 cm", "22 cm", "20 cm"], answer: 2, explanation: "9+2+9+2 = 22 cm." },
      { question: "A square has perimeter 24 cm. What is one side?", options: ["4 cm", "6 cm", "8 cm", "12 cm"], answer: 1, explanation: "24 ÷ 4 = 6 cm per side." },
      { question: "A rectangle is 10 cm by 4 cm. What is its area?", options: ["14 cm²", "28 cm²", "40 cm²", "44 cm²"], answer: 2, explanation: "Area = 10 × 4 = 40 cm²." },
      { question: "A square has a side of 7 cm. What is its perimeter?", options: ["14 cm", "21 cm", "28 cm", "49 cm"], answer: 2, explanation: "Perimeter = 4 × 7 = 28 cm." },
      { question: "A rectangle is 9 cm by 5 cm. What is its perimeter?", options: ["14 cm", "28 cm", "45 cm", "18 cm"], answer: 1, explanation: "9+5+9+5 = 28 cm." },
      { question: "A rectangle is 12 cm by 3 cm. What is its area?", options: ["15 cm²", "30 cm²", "36 cm²", "24 cm²"], answer: 2, explanation: "Area = 12 × 3 = 36 cm²." },
      { question: "A square has a side of 8 cm. What is its area?", type: "written", acceptAnswers: ["64", "64 cm²", "64cm²"], explanation: "Area = 8 × 8 = 64 cm².", timeLimit: 33 },
    ],
  },
  {
    id: "word-problems-y4", name: "Word Problems", icon: "BookOpen", description: "Cambridge-style multi-step word problems.",
    theory: "Multi-step word problems need more than one calculation. Read the problem twice and decide what steps you need.\nSometimes you need to multiply and then subtract, or convert units before calculating.\nAlways check your answer makes sense — if you're finding the area of a garden, the answer should be in square metres.",
    defaultTimeLimit: 33,
    questions: [
      { question: "A school has 256 pupils. 118 are boys. How many are girls?", options: ["118", "128", "138", "148"], answer: 2, cambridge: true, explanation: "256 − 118 = 138 girls." },
      { question: "A box holds 24 pencils. The teacher buys 9 boxes. How many pencils altogether?", options: ["196", "206", "216", "226"], answer: 2, cambridge: true, explanation: "9 × 24 = 216 pencils." },
      { question: "A playground is 18 m long and 12 m wide. What is its area?", options: ["60 m²", "180 m²", "216 m²", "120 m²"], answer: 2, cambridge: true, explanation: "18 × 12 = 216 m²." },
      { question: "A bottle holds 500 ml. Aisha drinks 0.2 of it. How much did she drink, in ml?", options: ["50 ml", "100 ml", "150 ml", "200 ml"], answer: 1, cambridge: true, explanation: "0.2 × 500 = 100 ml." },
      { question: "A rope is 4.5 m long. Tom cuts off 120 cm. How long is the rope now, in metres?", options: ["3.0 m", "3.3 m", "3.5 m", "4.3 m"], answer: 1, cambridge: true, explanation: "120 cm = 1.2 m. 4.5 − 1.2 = 3.3 m." },
      { question: "A cake is cut into 8 equal slices. 3 slices are eaten. What fraction is left?", options: ["3/8", "5/8", "1/2", "8/5"], answer: 1, cambridge: true, explanation: "8 − 3 = 5 slices left, so 5/8." },
      { question: "A train travels 240 km in 4 hours. What is its average speed?", options: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"], answer: 1, cambridge: true, explanation: "240 ÷ 4 = 60 km/h." },
      { question: "A bag of 6 oranges costs £3.60. How much does one orange cost?", options: ["40p", "50p", "60p", "70p"], answer: 2, cambridge: true, explanation: "£3.60 ÷ 6 = £0.60 = 60p." },
      { question: "A garden is 15 m by 9 m. What is its perimeter?", options: ["24 m", "36 m", "48 m", "54 m"], answer: 2, cambridge: true, explanation: "15+9+15+9 = 48 m." },
      { question: "A jar has 450 g of jam. Mrs Khan uses 0.4 of it. How many grams are left?", options: ["180 g", "240 g", "270 g", "300 g"], answer: 2, cambridge: true, explanation: "She uses 0.4 × 450 = 180 g. Left = 450 − 180 = 270 g." },
      { question: "A teacher buys 15 boxes of pencils. Each box has 8 pencils. How many pencils altogether?", options: ["100", "110", "120", "130"], answer: 2, cambridge: true, explanation: "15 × 8 = 120 pencils." },
      { question: "A plank is 2.5 m long. Tom cuts off 80 cm. How long is it now, in cm?", options: ["150 cm", "170 cm", "200 cm", "240 cm"], answer: 1, cambridge: true, explanation: "2.5 m = 250 cm. 250 − 80 = 170 cm." },
      { question: "There are 4 packs of 9 cards. 5 cards are lost. How many are left?", options: ["28", "31", "36", "41"], answer: 1, cambridge: true, explanation: "4 × 9 = 36, then 36 − 5 = 31." },
      { question: "A film lasts 360 minutes. How many hours is that?", options: ["4", "5", "6", "7"], answer: 2, cambridge: true, explanation: "360 ÷ 60 = 6 hours." },
      { question: "There are 8 packs with 12 stickers each. How many stickers altogether?", type: "written", acceptAnswers: ["96"], explanation: "8 × 12 = 96 stickers.", timeLimit: 33, cambridge: true },
    ],
  },
];

/* ===================== YEAR 5 (Ages 9-10) ===================== */
const YEAR5_TOPICS: Topic[] = [
  {
    id: "percentages-y5", name: "Percentages", icon: "Percent", description: "Percentages of amounts and conversions.",
    theory: "A percentage is a way of expressing a fraction out of 100. 'Per cent' means 'out of 100'.\nTo find 10% of a number, divide by 10. To find 1%, divide by 100. To find 50%, just halve it.\nTo convert a fraction to a percentage, divide the top by the bottom and multiply by 100.",
    defaultTimeLimit: 35,
    questions: [
      { question: "What is 50% of 80?", options: ["20", "40", "50", "60"], answer: 1, explanation: "50% = half, so 80 ÷ 2 = 40." },
      { question: "What is 25% of 100?", options: ["20", "25", "50", "75"], answer: 1, explanation: "25% = 1/4, so 100 ÷ 4 = 25." },
      { question: "What is 10% of 450?", options: ["4.5", "45", "450", "4500"], answer: 1, explanation: "10% = 1/10, so 450 ÷ 10 = 45." },
      { question: "Write 0.6 as a percentage.", options: ["6%", "60%", "0.6%", "600%"], answer: 1, explanation: "0.6 × 100 = 60%." },
      { question: "Write 75% as a fraction.", options: ["1/2", "3/4", "2/3", "7/5"], answer: 1, explanation: "75% = 75/100 = 3/4." },
      { question: "Increase 60 by 10%.", options: ["6", "60", "66", "70"], answer: 2, explanation: "10% of 60 = 6, so 60 + 6 = 66." },
      { question: "A £50 shirt has 20% off. What is the saving?", options: ["£5", "£10", "£15", "£20"], answer: 1, explanation: "20% of 50 = 10, so you save £10." },
      { question: "What is 100% of 37?", options: ["0", "37", "100", "370"], answer: 1, explanation: "100% of anything is itself." },
      { question: "Write 1/2 as a percentage.", options: ["25%", "50%", "100%", "10%"], answer: 1, explanation: "1/2 = 0.5 = 50%." },
      { question: "What is 1% of 500?", options: ["0.5", "5", "50", "100"], answer: 1, explanation: "1% = 1/100, so 500 ÷ 100 = 5." },
      { question: "What is 20% of 60?", options: ["10", "12", "15", "20"], answer: 1, explanation: "20% = 1/5, so 60 ÷ 5 = 12." },
      { question: "Write 0.35 as a percentage.", options: ["3.5%", "35%", "350%", "0.35%"], answer: 1, explanation: "0.35 × 100 = 35%." },
      { question: "Decrease 80 by 25%.", options: ["55", "60", "65", "75"], answer: 1, explanation: "25% of 80 = 20, so 80 − 20 = 60." },
      { question: "What is 15% of 200?", options: ["20", "25", "30", "35"], answer: 2, explanation: "0.15 × 200 = 30." },
      { question: "What is 10% of 250?", type: "written", acceptAnswers: ["25"], explanation: "10% = 1/10, so 250 ÷ 10 = 25.", timeLimit: 35 },
    ],
  },
  {
    id: "long-division-y5", name: "Long Division", icon: "Divide", description: "Divide bigger numbers.",
    theory: "Long division is a step-by-step method for dividing larger numbers. You divide, multiply and subtract, then bring down the next digit.\nKnowing your times tables makes long division much easier, because each step involves figuring out how many times the divisor goes in.\nAlways check your answer by multiplying the quotient by the divisor — you should get back to the original number.",
    defaultTimeLimit: 35,
    questions: [
      { question: "144 ÷ 12 = ?", options: ["10", "11", "12", "14"], answer: 2, explanation: "12 × 12 = 144, so 144 ÷ 12 = 12." },
      { question: "96 ÷ 8 = ?", options: ["11", "12", "13", "14"], answer: 1, explanation: "8 × 12 = 96, so 96 ÷ 8 = 12." },
      { question: "225 ÷ 15 = ?", options: ["12", "15", "18", "20"], answer: 1, explanation: "15 × 15 = 225, so 225 ÷ 15 = 15." },
      { question: "168 ÷ 7 = ?", options: ["22", "23", "24", "25"], answer: 2, explanation: "7 × 24 = 168, so 168 ÷ 7 = 24." },
      { question: "312 ÷ 4 = ?", options: ["68", "72", "78", "80"], answer: 2, explanation: "4 × 78 = 312, so 312 ÷ 4 = 78." },
      { question: "504 ÷ 9 = ?", options: ["54", "56", "58", "60"], answer: 1, explanation: "9 × 56 = 504, so 504 ÷ 9 = 56." },
      { question: "256 ÷ 16 = ?", options: ["14", "16", "18", "20"], answer: 1, explanation: "16 × 16 = 256, so 256 ÷ 16 = 16." },
      { question: "435 ÷ 5 = ?", options: ["77", "83", "87", "85"], answer: 2, explanation: "5 × 87 = 435, so 435 ÷ 5 = 87." },
      { question: "672 ÷ 12 = ?", options: ["54", "56", "58", "62"], answer: 1, explanation: "12 × 56 = 672, so 672 ÷ 12 = 56." },
      { question: "342 ÷ 6 = ?", options: ["47", "53", "57", "59"], answer: 2, explanation: "6 × 57 = 342, so 342 ÷ 6 = 57." },
      { question: "832 ÷ 8 = ?", options: ["101", "102", "104", "108"], answer: 2, explanation: "8 × 104 = 832, so 832 ÷ 8 = 104." },
      { question: "576 ÷ 9 = ?", options: ["58", "62", "64", "68"], answer: 2, explanation: "9 × 64 = 576, so 576 ÷ 9 = 64." },
      { question: "468 ÷ 6 = ?", options: ["72", "76", "78", "82"], answer: 2, explanation: "6 × 78 = 468, so 468 ÷ 6 = 78." },
      { question: "315 ÷ 5 = ?", options: ["60", "61", "63", "65"], answer: 2, explanation: "5 × 63 = 315, so 315 ÷ 5 = 63." },
      { question: "What is 672 ÷ 7?", type: "written", acceptAnswers: ["96"], explanation: "7 × 96 = 672, so 672 ÷ 7 = 96.", timeLimit: 35 },
    ],
  },
  {
    id: "angles-y5", name: "Angles", icon: "Triangle", description: "Types of angles and measuring turns.",
    theory: "An angle measures how much something turns, in degrees (°). Angles are named by size: acute (< 90°), right (90°), obtuse (90°–180°), straight (180°) and reflex (> 180°).\nAngles on a straight line add up to 180°, and angles around a point add up to 360°.\nAngles inside a triangle always add up to 180°, and inside a quadrilateral 360°.",
    defaultTimeLimit: 35,
    questions: [
      { question: "How many degrees in a right angle?", options: ["45°", "90°", "180°", "360°"], answer: 1, explanation: "A right angle is 90°." },
      { question: "How many degrees in a straight line?", options: ["90°", "180°", "270°", "360°"], answer: 1, explanation: "Angles on a straight line add to 180°." },
      { question: "An angle of 45° is called...?", options: ["Acute", "Right", "Obtuse", "Reflex"], answer: 0, explanation: "An angle less than 90° is acute." },
      { question: "An angle of 120° is called...?", options: ["Acute", "Right", "Obtuse", "Reflex"], answer: 2, explanation: "Between 90° and 180° is obtuse." },
      { question: "How many degrees in a full turn?", options: ["90°", "180°", "270°", "360°"], answer: 3, explanation: "A full turn is 360°." },
      { question: "Angles in a triangle add up to...?", options: ["90°", "180°", "270°", "360°"], answer: 1, explanation: "Triangle angles always add to 180°." },
      { question: "Two angles of a triangle are 60° and 70°. What is the third?", options: ["30°", "40°", "50°", "60°"], answer: 2, explanation: "180 − 60 − 70 = 50°." },
      { question: "A square corner is how many degrees?", options: ["45°", "90°", "180°", "360°"], answer: 1, explanation: "A square corner is a right angle = 90°." },
      { question: "An angle of 200° is called...?", options: ["Acute", "Obtuse", "Reflex", "Right"], answer: 2, explanation: "An angle between 180° and 360° is reflex." },
      { question: "How many right angles in a full turn?", options: ["2", "3", "4", "5"], answer: 2, explanation: "360° ÷ 90° = 4 right angles." },
      { question: "Two angles of a triangle are 50° and 80°. What is the third?", options: ["40°", "50°", "60°", "70°"], answer: 1, explanation: "180 − 50 − 80 = 50°." },
      { question: "An angle of 180° is called...?", options: ["Acute", "Right", "Straight", "Reflex"], answer: 2, explanation: "A 180° angle is a straight angle." },
      { question: "A triangle has one angle of 90°. It is a...?", options: ["Equilateral", "Right-angled", "Isosceles", "Scalene"], answer: 1, explanation: "A triangle with a 90° angle is right-angled." },
      { question: "Angles in a quadrilateral add up to...?", options: ["90°", "180°", "270°", "360°"], answer: 3, explanation: "Angles in any 4-sided shape add to 360°." },
      { question: "Two angles on a straight line are 70° and x. What is x in degrees?", type: "written", acceptAnswers: ["110", "110°"], explanation: "180 − 70 = 110°.", timeLimit: 35 },
    ],
  },
  {
    id: "data-handling-y5", name: "Data Handling", icon: "BarChart3", description: "Read charts, tables and graphs.",
    theory: "Data handling means collecting, organising and showing information. Bar charts use bars of different heights to show amounts.\nA pictogram uses pictures or symbols to represent data — each symbol stands for a certain number.\nA pie chart shows data as slices of a circle, with each slice representing a fraction of the whole.",
    defaultTimeLimit: 35,
    questions: [
      { question: "In a bar chart, the height of a bar shows...?", options: ["The colour", "The value or amount", "The width", "Nothing"], answer: 1, explanation: "The height of a bar shows how much there is." },
      { question: "5 children like red, 3 like blue, 2 like green. How many children were asked in total?", options: ["8", "10", "12", "15"], answer: 1, explanation: "5 + 3 + 2 = 10 children." },
      { question: "Which is the most popular colour: red (5), blue (3), green (2)?", options: ["Red", "Blue", "Green", "Tie"], answer: 0, explanation: "Red has the most votes (5)." },
      { question: "A pictogram uses 🍎 = 2 apples. How many apples does 🍎🍎🍎 represent?", options: ["3", "5", "6", "9"], answer: 2, explanation: "3 symbols × 2 = 6 apples." },
      { question: "A tally shows 4 marks and a diagonal (5). What number is that?", options: ["4", "5", "6", "9"], answer: 1, explanation: "A group of 4 with a diagonal slash = 5." },
      { question: "A bar chart shows 12 on Monday, 8 on Tuesday. How many more on Monday?", options: ["2", "3", "4", "5"], answer: 2, explanation: "12 − 8 = 4 more." },
      { question: "A line graph goes up over time. This means the value is...?", options: ["Staying the same", "Increasing", "Decreasing", "Zero"], answer: 1, explanation: "Going up means increasing." },
      { question: "20 children were asked their favourite fruit. 8 chose apple. How many did NOT choose apple?", options: ["8", "10", "12", "20"], answer: 2, explanation: "20 − 8 = 12 children." },
      { question: "A pie chart slice is half the circle. What fraction is that?", options: ["1/4", "1/3", "1/2", "3/4"], answer: 2, explanation: "Half a circle = 1/2." },
      { question: "If 🌟 = 5 stars, how many symbols for 25 stars?", options: ["3", "4", "5", "6"], answer: 2, explanation: "25 ÷ 5 = 5 symbols." },
      { question: "A bar shows 15 on Friday, 9 on Saturday. How many more on Friday?", options: ["4", "5", "6", "7"], answer: 2, explanation: "15 − 9 = 6 more." },
      { question: "A pictogram uses 🔑 = 4 keys. How many keys in 🔑🔑🔑🔑?", options: ["8", "12", "16", "20"], answer: 2, explanation: "4 symbols × 4 = 16 keys." },
      { question: "A pie chart has 4 equal slices. What fraction is one slice?", options: ["1/2", "1/3", "1/4", "1/8"], answer: 2, explanation: "4 equal slices means each is 1/4." },
      { question: "A bar chart shows 30, 25, 15, 10. What is the total?", options: ["60", "70", "80", "90"], answer: 2, explanation: "30 + 25 + 15 + 10 = 80." },
      { question: "A tally has three groups of 5 and two single marks. What number?", type: "written", acceptAnswers: ["17"], explanation: "3 × 5 = 15, plus 2 = 17.", timeLimit: 35 },
    ],
  },
  {
    id: "word-problems-y5", name: "Word Problems", icon: "BookOpen", description: "Cambridge-style percentage & money problems.",
    theory: "Word problems combine percentages, money and measurement in real-life situations.\nBreak each problem into steps: identify what you know, decide which operation to use, then calculate.\nAlways check that your answer is sensible — a sale price should be lower than the original, a speed should be positive.",
    defaultTimeLimit: 35,
    questions: [
      { question: "A jacket costs £80. There is 25% off in a sale. What is the sale price?", options: ["£20", "£55", "£60", "£65"], answer: 2, cambridge: true, explanation: "25% of £80 = £20. £80 − £20 = £60." },
      { question: "A school raises £600. 30% is spent on books. How much is spent on books?", options: ["£120", "£150", "£180", "£200"], answer: 2, cambridge: true, explanation: "30% of £600 = 0.30 × 600 = £180." },
      { question: "A train travels 360 km in 6 hours. How far does it travel in 1 hour?", options: ["50 km", "60 km", "70 km", "80 km"], answer: 1, cambridge: true, explanation: "360 ÷ 6 = 60 km/h." },
      { question: "A recipe needs 0.4 kg of sugar for 1 cake. How much sugar for 5 cakes, in kg?", options: ["1.5 kg", "2 kg", "200 g", "500 g"], answer: 1, cambridge: true, explanation: "0.4 × 5 = 2 kg." },
      { question: "A class of 30 pupils. 40% are girls. How many girls are there?", options: ["10", "12", "15", "18"], answer: 1, cambridge: true, explanation: "40% of 30 = 0.40 × 30 = 12 girls." },
      { question: "A water tank holds 1500 litres. 0.6 is used. How many litres are left?", options: ["600 L", "900 L", "750 L", "500 L"], answer: 0, cambridge: true, explanation: "Used = 0.6 × 1500 = 900 L. Left = 1500 − 900 = 600 L." },
      { question: "A bag of 8 apples costs £4.80. How much does one apple cost?", options: ["40p", "50p", "60p", "70p"], answer: 2, cambridge: true, explanation: "£4.80 ÷ 8 = £0.60 = 60p." },
      { question: "A rectangular field is 60 m by 40 m. What is its area?", options: ["100 m²", "200 m²", "2400 m²", "2000 m²"], answer: 2, cambridge: true, explanation: "60 × 40 = 2400 m²." },
      { question: "A book has 240 pages. Aisha reads 35% of it. How many pages has she read?", options: ["72", "84", "96", "108"], answer: 1, cambridge: true, explanation: "35% of 240 = 0.35 × 240 = 84 pages." },
      { question: "A car uses 0.8 litres of petrol for 10 km. How much for 50 km?", options: ["3 L", "4 L", "5 L", "6 L"], answer: 1, cambridge: true, explanation: "0.8 × 5 = 4 litres." },
      { question: "A coat costs £120. There is 40% off. What is the sale price?", options: ["£48", "£60", "£72", "£80"], answer: 2, cambridge: true, explanation: "40% of £120 = £48. £120 − £48 = £72." },
      { question: "A runner runs 1.5 km in 6 minutes. How far in 1 minute?", options: ["0.2 km", "0.25 km", "0.3 km", "0.5 km"], answer: 1, cambridge: true, explanation: "1.5 ÷ 6 = 0.25 km." },
      { question: "A school has 250 pupils. 20% are absent. How many are present?", options: ["50", "150", "200", "230"], answer: 2, cambridge: true, explanation: "20% of 250 = 50. 250 − 50 = 200 present." },
      { question: "A box has 36 chocolates. 1/4 are dark. How many dark chocolates?", options: ["6", "8", "9", "12"], answer: 2, cambridge: true, explanation: "36 ÷ 4 = 9 dark chocolates." },
      { question: "A recipe needs 0.25 kg of flour per cake. How much for 8 cakes, in kg?", type: "written", acceptAnswers: ["2", "2 kg"], explanation: "0.25 × 8 = 2 kg.", timeLimit: 35, cambridge: true },
    ],
  },
];

/* ===================== YEAR 6 (Ages 10-11) ===================== */
const YEAR6_TOPICS: Topic[] = [
  {
    id: "algebra-basics", name: "Algebra Basics", icon: "Sigma", description: "Simple equations with letters.",
    theory: "Algebra uses letters to represent unknown numbers. If we see x + 5 = 12, we need to find what number x stands for.\nWe can solve equations by doing the same operation to both sides — subtract, add, multiply or divide.\nSimplifying means combining like terms: 2x + 3x = 5x.",
    defaultTimeLimit: 38,
    questions: [
      { question: "If x + 5 = 12, what is x?", options: ["5", "7", "12", "17"], answer: 1, explanation: "x = 12 − 5 = 7." },
      { question: "If 3x = 21, what is x?", options: ["6", "7", "8", "9"], answer: 1, explanation: "x = 21 ÷ 3 = 7." },
      { question: "Simplify: 2x + 3x", options: ["5x", "6x", "5", "x²"], answer: 0, explanation: "2x + 3x = 5x." },
      { question: "If x = 4, what is x + 7?", options: ["10", "11", "12", "13"], answer: 1, explanation: "4 + 7 = 11." },
      { question: "If y = 10, what is 2y?", options: ["12", "20", "10", "22"], answer: 1, explanation: "2y = 2 × 10 = 20." },
      { question: "Solve: x − 6 = 9", options: ["3", "12", "15", "54"], answer: 2, explanation: "x = 9 + 6 = 15." },
      { question: "If x = 5, what is x²?", options: ["10", "15", "25", "52"], answer: 2, explanation: "5 × 5 = 25." },
      { question: "What is 4x when x = 3?", options: ["7", "12", "43", "4"], answer: 1, explanation: "4 × 3 = 12." },
      { question: "Simplify: 5x − 2x", options: ["3x", "7x", "3", "10x"], answer: 0, explanation: "5x − 2x = 3x." },
      { question: "If 2x + 1 = 9, what is x?", options: ["3", "4", "5", "8"], answer: 1, explanation: "2x = 8, so x = 4." },
      { question: "If x + 8 = 20, what is x?", options: ["10", "12", "14", "28"], answer: 1, explanation: "x = 20 − 8 = 12." },
      { question: "Simplify: 3x + 5 + 2x − 2", options: ["5x + 3", "5x + 7", "x + 3", "6x + 3"], answer: 0, explanation: "3x + 2x = 5x, 5 − 2 = 3, so 5x + 3." },
      { question: "If 4x = 32, what is x?", options: ["6", "7", "8", "9"], answer: 2, explanation: "x = 32 ÷ 4 = 8." },
      { question: "Solve: x/2 = 9", options: ["7", "11", "18", "4.5"], answer: 2, explanation: "x = 9 × 2 = 18." },
      { question: "If 3x − 5 = 16, what is x?", type: "written", acceptAnswers: ["7"], explanation: "3x = 21, so x = 7.", timeLimit: 38 },
    ],
  },
  {
    id: "ratios", name: "Ratios", icon: "Scale", description: "Share and compare with ratios.",
    theory: "A ratio compares two or more quantities. The ratio 2:3 means for every 2 of one thing, there are 3 of another.\nTo share an amount in a ratio, add the parts to find the total, divide the amount by the total, then multiply by each part.\nRatios can be simplified by dividing both sides by the same number, just like fractions.",
    defaultTimeLimit: 38,
    questions: [
      { question: "Share 20 sweets between 2 friends in the ratio 1:1. How many each?", options: ["5", "10", "15", "20"], answer: 1, explanation: "20 ÷ 2 = 10 each." },
      { question: "A ratio of 2:3 means out of every 5 parts, one gets...?", options: ["2", "3", "5", "1"], answer: 0, explanation: "The first share gets 2 out of every 5 parts." },
      { question: "Share £30 in the ratio 2:1. Largest share?", options: ["£10", "£15", "£20", "£25"], answer: 2, explanation: "2+1=3 parts. £30÷3=£10 per part. Largest = 2×£10 = £20." },
      { question: "Simplify the ratio 6:9", options: ["2:3", "3:4", "1:2", "6:9"], answer: 0, explanation: "Divide both by 3: 6:9 = 2:3." },
      { question: "In a class the ratio of boys to girls is 3:2. If there are 12 boys, how many girls?", options: ["6", "8", "10", "18"], answer: 1, explanation: "3 parts = 12, so 1 part = 4. Girls = 2 × 4 = 8." },
      { question: "Simplify 10:15", options: ["2:3", "3:5", "5:3", "10:15"], answer: 0, explanation: "Divide both by 5: 10:15 = 2:3." },
      { question: "Share 24 in ratio 1:2:3. Smallest share?", options: ["2", "4", "6", "8"], answer: 1, explanation: "1+2+3=6 parts. 24÷6=4. Smallest (1 part) = 4." },
      { question: "A recipe uses flour and sugar in ratio 4:1. For 200g flour, how much sugar?", options: ["25g", "50g", "100g", "200g"], answer: 1, explanation: "200 ÷ 4 = 50g sugar." },
      { question: "Simplify 8:12", options: ["2:3", "3:4", "4:6", "8:12"], answer: 0, explanation: "Divide by 4: 8:12 = 2:3." },
      { question: "Share £40 in ratio 3:1. Total of largest share?", options: ["£10", "£20", "£30", "£40"], answer: 2, explanation: "4 parts, £10 each. Largest = 3 × £10 = £30." },
      { question: "Share £50 in ratio 3:2. Largest share?", options: ["£15", "£20", "£30", "£35"], answer: 2, explanation: "5 parts, £10 each. Largest = 3 × £10 = £30." },
      { question: "Simplify 12:18", options: ["2:3", "3:4", "4:6", "6:9"], answer: 0, explanation: "Divide both by 6: 12:18 = 2:3." },
      { question: "In a class ratio boys:girls is 4:3. If 12 boys, how many girls?", options: ["8", "9", "12", "16"], answer: 1, explanation: "4 parts = 12, 1 part = 3. Girls = 3 × 3 = 9." },
      { question: "Share 45 in ratio 1:4. Smallest share?", options: ["5", "9", "36", "40"], answer: 1, explanation: "5 parts, 9 each. Smallest (1 part) = 9." },
      { question: "Simplify the ratio 15:25", type: "written", acceptAnswers: ["3:5"], explanation: "Divide both by 5: 15:25 = 3:5.", timeLimit: 38 },
    ],
  },
  {
    id: "averages-y6", name: "Averages", icon: "BarChart3", description: "Mean, median, mode and range.",
    theory: "The mean is the total of all values divided by how many values there are.\nThe median is the middle value when numbers are put in order. If there are two middle values, find their mean.\nThe mode is the value that appears most often, and the range is the difference between the highest and lowest.",
    defaultTimeLimit: 38,
    questions: [
      { question: "Find the mean of 4, 6, 8.", options: ["5", "6", "7", "8"], answer: 1, explanation: "Sum = 18, ÷ 3 = 6." },
      { question: "Find the median of 3, 5, 9, 11, 15.", options: ["5", "9", "11", "15"], answer: 1, explanation: "Middle of 5 sorted numbers is the 3rd: 9." },
      { question: "Find the mode of 2, 2, 4, 5, 5, 5, 6.", options: ["2", "4", "5", "6"], answer: 2, explanation: "5 appears most (3 times)." },
      { question: "Find the range of 8, 2, 15, 6.", options: ["6", "13", "15", "8"], answer: 1, explanation: "Max − min = 15 − 2 = 13." },
      { question: "Find the mean of 10, 20, 30.", options: ["15", "20", "25", "30"], answer: 1, explanation: "60 ÷ 3 = 20." },
      { question: "Find the median of 2, 4, 6, 8.", options: ["4", "5", "6", "7"], answer: 1, explanation: "Even count: middle two are 4 and 6, mean = 5." },
      { question: "If the mean of 5, 10, x is 10, what is x?", options: ["10", "15", "20", "25"], answer: 1, explanation: "10×3=30. 5+10=15, so x = 30−15 = 15." },
      { question: "Find the mode of 1, 1, 2, 3, 3, 3, 4.", options: ["1", "2", "3", "4"], answer: 2, explanation: "3 appears most." },
      { question: "Range of 5, 5, 5, 5, 5?", options: ["0", "5", "10", "25"], answer: 0, explanation: "Max = min = 5, so range = 0." },
      { question: "Find the median of 1, 2, 3, 4, 5, 6, 7.", options: ["3", "4", "5", "3.5"], answer: 1, explanation: "Middle (4th of 7) = 4." },
      { question: "Find the mean of 5, 10, 15, 20.", options: ["10", "12", "12.5", "15"], answer: 2, explanation: "50 ÷ 4 = 12.5." },
      { question: "Find the range of 12, 3, 7, 18, 1.", options: ["15", "16", "17", "18"], answer: 2, explanation: "18 − 1 = 17." },
      { question: "Find the mode of 4, 4, 4, 7, 8, 8.", options: ["4", "7", "8", "no mode"], answer: 0, explanation: "4 appears most (3 times)." },
      { question: "Find the median of 10, 20, 30, 40, 50.", options: ["20", "25", "30", "40"], answer: 2, explanation: "Middle of 5 sorted numbers = 30." },
      { question: "Find the mean of 6, 7, 8, 9, 10.", type: "written", acceptAnswers: ["8"], explanation: "40 ÷ 5 = 8.", timeLimit: 38 },
    ],
  },
  {
    id: "geometry-y6", name: "Geometry", icon: "Shapes", description: "Angles, area and volume.",
    theory: "Geometry is about shapes, angles and space. The angles in a triangle always add up to 180° and in a quadrilateral 360°.\nArea of a rectangle is length × width. Area of a triangle is ½ × base × height.\nVolume of a cuboid is length × width × height, measured in cubic units (cm³).",
    defaultTimeLimit: 38,
    questions: [
      { question: "Angles in a quadrilateral add up to...?", options: ["180°", "270°", "360°", "540°"], answer: 2, explanation: "Any 4-sided shape's interior angles add to 360°." },
      { question: "A triangle has angles 50° and 60°. What is the third angle?", options: ["60°", "70°", "80°", "90°"], answer: 1, explanation: "180 − 50 − 60 = 70°." },
      { question: "What is the area of a triangle with base 10 cm and height 6 cm?", options: ["30 cm²", "60 cm²", "16 cm²", "36 cm²"], answer: 0, explanation: "Area = ½ × base × height = ½ × 10 × 6 = 30 cm²." },
      { question: "A cube has side 5 cm. What is its volume?", options: ["25 cm³", "75 cm³", "125 cm³", "150 cm³"], answer: 2, explanation: "Volume = 5 × 5 × 5 = 125 cm³." },
      { question: "A circle has radius 7 cm. What is its diameter?", options: ["7 cm", "14 cm", "21 cm", "49 cm"], answer: 1, explanation: "Diameter = 2 × radius = 14 cm." },
      { question: "Angles on a straight line add up to...?", options: ["90°", "180°", "270°", "360°"], answer: 1, explanation: "Angles on a straight line add to 180°." },
      { question: "A rectangle is 12 cm by 8 cm. What is its area?", options: ["20 cm²", "40 cm²", "96 cm²", "120 cm²"], answer: 2, explanation: "12 × 8 = 96 cm²." },
      { question: "How many edges does a cube have?", options: ["6", "8", "12", "16"], answer: 2, explanation: "A cube has 12 edges." },
      { question: "A triangle with all sides equal is called...?", options: ["Isosceles", "Scalene", "Equilateral", "Right-angled"], answer: 2, explanation: "All sides equal = equilateral." },
      { question: "What is the volume of a box 10 cm × 5 cm × 4 cm?", options: ["50 cm³", "100 cm³", "200 cm³", "500 cm³"], answer: 2, explanation: "10 × 5 × 4 = 200 cm³." },
      { question: "Angles in a triangle add up to...?", options: ["90°", "180°", "270°", "360°"], answer: 1, explanation: "Angles in a triangle add to 180°." },
      { question: "A rectangle is 15 cm by 6 cm. What is its area?", options: ["21 cm²", "42 cm²", "90 cm²", "60 cm²"], answer: 2, explanation: "15 × 6 = 90 cm²." },
      { question: "A triangle has angles 40° and 55°. What is the third angle?", options: ["75°", "80°", "85°", "95°"], answer: 2, explanation: "180 − 40 − 55 = 85°." },
      { question: "A cuboid is 8 cm × 4 cm × 3 cm. What is its volume?", options: ["15 cm³", "32 cm³", "96 cm³", "120 cm³"], answer: 2, explanation: "8 × 4 × 3 = 96 cm³." },
      { question: "A triangle has base 14 cm and height 5 cm. What is its area in cm²?", type: "written", acceptAnswers: ["35", "35 cm²", "35cm²"], explanation: "½ × 14 × 5 = 35 cm².", timeLimit: 38 },
    ],
  },
  {
    id: "cambridge-problems-y6", name: "Cambridge Problem Solving", icon: "GraduationCap", description: "Exam-style multi-step reasoning questions.",
    theory: "Cambridge-style problems combine several maths skills in one question. You might need ratios, percentages, algebra and measurement together.\nBreak each problem into steps and show your working.\nCheck that your answer is sensible — a time should be positive, an area should be in square units.",
    defaultTimeLimit: 38,
    questions: [
      { question: "A shop sells pens at 3 for £2.40. How much would 12 pens cost?", options: ["£7.20", "£8.40", "£9.60", "£12.00"], answer: 2, cambridge: true, explanation: "12 pens = 4 sets of 3. 4 × £2.40 = £9.60." },
      { question: "The ratio of boys to girls in a class is 2:3. There are 18 girls. How many boys?", options: ["6", "9", "12", "15"], answer: 2, cambridge: true, explanation: "3 parts = 18, so 1 part = 6. Boys = 2 × 6 = 12." },
      { question: "A car travels 240 km in 3 hours. How far will it travel in 5 hours at the same speed?", options: ["300 km", "360 km", "400 km", "480 km"], answer: 2, cambridge: true, explanation: "Speed = 240 ÷ 3 = 80 km/h. In 5 hours: 80 × 5 = 400 km." },
      { question: "A jacket costs £90 after a 10% discount. What was the original price?", options: ["£99", "£100", "£110", "£81"], answer: 1, cambridge: true, explanation: "£90 is 90% of the original. Original = 90 ÷ 0.9 = £100." },
      { question: "The mean of 4 numbers is 12. A fifth number is added and the mean becomes 13. What is the fifth number?", options: ["14", "15", "16", "17"], answer: 3, cambridge: true, explanation: "First 4 sum = 48. New 5-number sum = 5 × 13 = 65. Fifth = 65 − 48 = 17." },
      { question: "A rectangular swimming pool is 25 m long and 10 m wide. It is filled to a depth of 2 m. What is the volume of water, in m³?", options: ["250 m³", "500 m³", "750 m³", "1000 m³"], answer: 1, cambridge: true, explanation: "25 × 10 × 2 = 500 m³." },
      { question: "A sum of money is shared in the ratio 2:3:5. The smallest share is £40. What is the total amount shared?", options: ["£120", "£160", "£200", "£240"], answer: 2, cambridge: true, explanation: "Smallest = 2 parts = £40, so 1 part = £20. Total = 10 parts = £200." },
      { question: "Solve: 3(x + 4) = 27. What is x?", options: ["3", "5", "7", "9"], answer: 1, cambridge: true, explanation: "3x + 12 = 27, so 3x = 15, x = 5." },
      { question: "A train leaves at 08:42 and arrives at 11:15. How long is the journey?", options: ["2 h 13 min", "2 h 23 min", "2 h 33 min", "3 h 13 min"], answer: 2, cambridge: true, explanation: "From 08:42 to 11:15 is 2 hours 33 minutes." },
      { question: "An article costs £240 after 20% VAT is added. What was the price before VAT?", options: ["£180", "£192", "£200", "£220"], answer: 2, cambridge: true, explanation: "£240 is 120% of the original. Original = 240 ÷ 1.2 = £200." },
      { question: "A shop buys mugs for £4 each and sells them for £5.50. What is the percentage profit?", options: ["30%", "35%", "37.5%", "40%"], answer: 2, cambridge: true, explanation: "Profit = £1.50. 1.50/4 = 0.375 = 37.5%." },
      { question: "A bus travels 210 km in 3.5 hours. What is its average speed?", options: ["50 km/h", "55 km/h", "60 km/h", "65 km/h"], answer: 2, cambridge: true, explanation: "210 ÷ 3.5 = 60 km/h." },
      { question: "Solve: 5(x − 2) = 20. What is x?", options: ["4", "5", "6", "7"], answer: 2, cambridge: true, explanation: "5x − 10 = 20, so 5x = 30, x = 6." },
      { question: "A bag has red and blue counters in ratio 3:5. There are 24 red counters. How many blue?", options: ["30", "35", "40", "45"], answer: 2, cambridge: true, explanation: "3 parts = 24, 1 part = 8. Blue = 5 × 8 = 40." },
      { question: "The mean of 3 numbers is 15. Two of the numbers are 12 and 18. What is the third number?", type: "written", acceptAnswers: ["15"], explanation: "Total = 45. 12 + 18 = 30. Third = 45 − 30 = 15.", timeLimit: 38, cambridge: true },
    ],
  },
];

/* ===================== YEAR 7 (Ages 11-12) ===================== */
const YEAR7_TOPICS: Topic[] = [
  {
    id: "integers-y7", name: "Integers & Negative Numbers", icon: "Plus", description: "Work with positive and negative numbers.",
    theory: "Integers include positive numbers, negative numbers and zero. They extend infinitely in both directions on a number line.\nAdding a negative is the same as subtracting: 5 + (−3) = 2. Subtracting a negative is adding: 5 − (−3) = 8.\nWhen multiplying or dividing: same signs give positive, different signs give negative.",
    defaultTimeLimit: 40,
    questions: [
      { question: "What is 5 + (−3)?", options: ["8", "2", "−8", "−2"], answer: 1, explanation: "5 + (−3) = 2." },
      { question: "What is −7 + 4?", options: ["−3", "3", "−11", "11"], answer: 0, explanation: "−7 + 4 = −3." },
      { question: "What is −6 − 5?", options: ["−1", "1", "−11", "11"], answer: 2, explanation: "−6 − 5 = −11." },
      { question: "What is −4 × −3?", options: ["−12", "12", "−7", "7"], answer: 1, explanation: "Negative × negative = positive: −4 × −3 = 12." },
      { question: "What is −10 ÷ 2?", options: ["−5", "5", "−8", "8"], answer: 0, explanation: "−10 ÷ 2 = −5." },
      { question: "Which is smaller: −5 or −2?", options: ["−5", "−2", "Same", "Can't tell"], answer: 0, explanation: "−5 is further from 0, so it's smaller than −2." },
      { question: "What is the temperature if it's 6°C and drops by 9°C?", options: ["3°C", "−3°C", "15°C", "−15°C"], answer: 1, explanation: "6 − 9 = −3°C." },
      { question: "What is |−8| (absolute value)?", options: ["−8", "8", "0", "16"], answer: 1, explanation: "Absolute value is the distance from 0, so |−8| = 8." },
      { question: "What is 3 − (−2)?", options: ["1", "5", "−5", "−1"], answer: 1, explanation: "Subtracting a negative is adding: 3 − (−2) = 3 + 2 = 5." },
      { question: "Order from smallest to largest: −3, 0, −7, 2", options: ["−3, 0, −7, 2", "−7, −3, 0, 2", "2, 0, −3, −7", "0, 2, −3, −7"], answer: 1, explanation: "−7 < −3 < 0 < 2." },
      { question: "What is −8 + 8?", options: ["0", "−16", "16", "−8"], answer: 0, explanation: "−8 + 8 = 0." },
      { question: "What is −3 × 4?", options: ["−12", "12", "−7", "7"], answer: 0, explanation: "Negative × positive = negative: −3 × 4 = −12." },
      { question: "What is 10 − (−4)?", options: ["6", "14", "−14", "−6"], answer: 1, explanation: "Subtracting a negative is adding: 10 + 4 = 14." },
      { question: "What is −20 ÷ −5?", options: ["−4", "4", "−25", "100"], answer: 1, explanation: "Negative ÷ negative = positive: −20 ÷ −5 = 4." },
      { question: "What is −7 − (−3)?", type: "written", acceptAnswers: ["-4", "−4"], explanation: "−7 + 3 = −4.", timeLimit: 40 },
    ],
  },
  {
    id: "powers-y7", name: "Powers & Roots", icon: "Zap", description: "Squares, cubes and square roots.",
    theory: "A power (or index) tells you how many times to multiply a number by itself. 5² (5 squared) = 5 × 5 = 25, and 2³ (2 cubed) = 2 × 2 × 2 = 8.\nA square root is the opposite of squaring: √25 = 5 because 5 × 5 = 25.\nKnowing your square numbers up to 12² = 144 and cube numbers up to 5³ = 125 is very useful.",
    defaultTimeLimit: 40,
    questions: [
      { question: "What is 2³?", options: ["6", "8", "9", "32"], answer: 1, explanation: "2 × 2 × 2 = 8." },
      { question: "What is 5²?", options: ["10", "15", "25", "52"], answer: 2, explanation: "5 × 5 = 25." },
      { question: "What is √49?", options: ["6", "7", "8", "9"], answer: 1, explanation: "7 × 7 = 49, so √49 = 7." },
      { question: "What is 10³?", options: ["30", "100", "1000", "10000"], answer: 2, explanation: "10 × 10 × 10 = 1000." },
      { question: "What is √100?", options: ["5", "10", "20", "50"], answer: 1, explanation: "10 × 10 = 100, so √100 = 10." },
      { question: "What is 3³?", options: ["9", "12", "27", "81"], answer: 2, explanation: "3 × 3 × 3 = 27." },
      { question: "What is 1²?", options: ["1", "2", "0", "11"], answer: 0, explanation: "1 × 1 = 1." },
      { question: "What is √16?", options: ["2", "3", "4", "5"], answer: 2, explanation: "4 × 4 = 16, so √16 = 4." },
      { question: "What is 4² + 3²?", options: ["12", "24", "25", "49"], answer: 2, explanation: "16 + 9 = 25." },
      { question: "What is 2⁴?", options: ["8", "16", "24", "32"], answer: 1, explanation: "2 × 2 × 2 × 2 = 16." },
      { question: "What is 6²?", options: ["12", "36", "42", "62"], answer: 1, explanation: "6 × 6 = 36." },
      { question: "What is √81?", options: ["8", "9", "10", "11"], answer: 1, explanation: "9 × 9 = 81, so √81 = 9." },
      { question: "What is 4³?", options: ["12", "16", "64", "128"], answer: 2, explanation: "4 × 4 × 4 = 64." },
      { question: "What is 7²?", options: ["14", "21", "49", "72"], answer: 2, explanation: "7 × 7 = 49." },
      { question: "What is √144?", type: "written", acceptAnswers: ["12"], explanation: "12 × 12 = 144, so √144 = 12.", timeLimit: 40 },
    ],
  },
  {
    id: "sequences-y7", name: "Sequences", icon: "List", description: "Find the next term and the rule.",
    theory: "A sequence is a list of numbers that follow a rule. An arithmetic sequence adds or subtracts the same amount each time.\nTo find the nth term, find the common difference and work out what to add or subtract.\nFor example, in 3, 7, 11, 15... the difference is 4, so the nth term is 4n − 1.",
    defaultTimeLimit: 40,
    questions: [
      { question: "What comes next? 3, 6, 9, 12, ___", options: ["13", "14", "15", "16"], answer: 2, explanation: "Adding 3 each time: 12 + 3 = 15." },
      { question: "What comes next? 2, 5, 8, 11, ___", options: ["12", "13", "14", "15"], answer: 2, explanation: "Adding 3 each time: 11 + 3 = 14." },
      { question: "What comes next? 1, 4, 9, 16, ___", options: ["20", "23", "25", "36"], answer: 2, explanation: "Square numbers: 5² = 25." },
      { question: "What comes next? 5, 10, 20, 40, ___", options: ["50", "60", "70", "80"], answer: 3, explanation: "Doubling each time: 40 × 2 = 80." },
      { question: "What is the rule for 4, 9, 14, 19, ...?", options: ["Add 4", "Add 5", "Multiply by 2", "Add 9"], answer: 1, explanation: "Each term adds 5." },
      { question: "What comes next? 100, 90, 80, ___", options: ["60", "70", "75", "85"], answer: 1, explanation: "Subtracting 10 each time: 80 − 10 = 70." },
      { question: "What comes next? 1, 3, 6, 10, ___", options: ["13", "14", "15", "16"], answer: 2, explanation: "Triangular numbers — add 5: 10 + 5 = 15." },
      { question: "What is the 10th term of 2, 4, 6, 8, ...?", options: ["18", "20", "22", "10"], answer: 1, explanation: "The nth term is 2n, so 2 × 10 = 20." },
      { question: "What comes next? 2, 4, 8, 16, ___", options: ["18", "20", "24", "32"], answer: 3, explanation: "Doubling each time: 16 × 2 = 32." },
      { question: "What is the nth term of 5, 8, 11, 14, ...?", options: ["3n + 2", "3n", "n + 3", "5n"], answer: 0, explanation: "Difference is 3, and the first term is 5 = 3×1 + 2, so 3n + 2." },
      { question: "What comes next? 7, 11, 15, 19, ___", options: ["21", "22", "23", "27"], answer: 2, explanation: "Adding 4 each time: 19 + 4 = 23." },
      { question: "What is the nth term of 2, 5, 8, 11, ...?", options: ["3n − 1", "3n", "n + 2", "2n + 1"], answer: 0, explanation: "Difference is 3, first term 2 = 3×1 − 1, so 3n − 1." },
      { question: "What comes next? 1, 8, 27, 64, ___", options: ["100", "125", "144", "216"], answer: 1, explanation: "Cube numbers: 5³ = 125." },
      { question: "What is the 5th term of 3n + 1?", options: ["14", "15", "16", "17"], answer: 2, explanation: "3 × 5 + 1 = 16." },
      { question: "What is the 20th term of the sequence 4, 8, 12, 16, ...?", type: "written", acceptAnswers: ["80"], explanation: "The nth term is 4n, so 4 × 20 = 80.", timeLimit: 40 },
    ],
  },
  {
    id: "algebra-y7", name: "Beginning Algebra", icon: "Sigma", description: "Letters, expressions and simple equations.",
    theory: "Algebra uses letters to stand for unknown numbers. We can simplify expressions by collecting like terms.\nExpanding means multiplying out brackets: 3(x + 4) = 3x + 12.\nTo solve an equation, do the same to both sides to isolate the unknown letter.",
    defaultTimeLimit: 40,
    questions: [
      { question: "If a = 5, what is a + 8?", options: ["10", "12", "13", "14"], answer: 2, explanation: "5 + 8 = 13." },
      { question: "Simplify 4a + 3a.", options: ["7a", "12a", "7", "a⁷"], answer: 0, explanation: "4a + 3a = 7a." },
      { question: "If 2x = 14, what is x?", options: ["6", "7", "8", "12"], answer: 1, explanation: "x = 14 ÷ 2 = 7." },
      { question: "Expand 3(x + 2).", options: ["3x + 2", "3x + 5", "3x + 6", "x + 6"], answer: 2, explanation: "3 × x = 3x, 3 × 2 = 6, so 3x + 6." },
      { question: "Solve x + 9 = 15.", options: ["4", "5", "6", "7"], answer: 2, explanation: "x = 15 − 9 = 6." },
      { question: "If b = 10, what is 3b?", options: ["13", "30", "10", "33"], answer: 1, explanation: "3 × 10 = 30." },
      { question: "Simplify 6x − 2x + 4.", options: ["4x + 4", "8x + 4", "4x − 4", "6x + 2"], answer: 0, explanation: "6x − 2x = 4x, so 4x + 4." },
      { question: "Solve 2x + 3 = 11.", options: ["3", "4", "5", "7"], answer: 1, explanation: "2x = 8, x = 4." },
      { question: "What is 5 × x when x = 6?", options: ["11", "30", "56", "6"], answer: 1, explanation: "5 × 6 = 30." },
      { question: "Factorise 4x + 8.", options: ["4(x + 2)", "2(x + 4)", "4(x + 8)", "x(4 + 8)"], answer: 0, explanation: "Common factor is 4: 4x + 8 = 4(x + 2)." },
      { question: "Simplify 5a − 2a + 7.", options: ["3a + 7", "7a + 7", "3a − 7", "7a"], answer: 0, explanation: "5a − 2a = 3a, so 3a + 7." },
      { question: "Solve 4x − 3 = 17.", options: ["4", "5", "6", "7"], answer: 1, explanation: "4x = 20, so x = 5." },
      { question: "Expand 5(x − 3).", options: ["5x − 3", "5x − 15", "5x + 15", "x − 15"], answer: 1, explanation: "5 × x = 5x, 5 × (−3) = −15, so 5x − 15." },
      { question: "If c = 4, what is 2c + 5?", options: ["9", "11", "13", "14"], answer: 2, explanation: "2 × 4 + 5 = 13." },
      { question: "Solve 3(x + 4) = 21. What is x?", type: "written", acceptAnswers: ["3"], explanation: "3x + 12 = 21, so 3x = 9, x = 3.", timeLimit: 40 },
    ],
  },
];

/* ===================== YEAR 8 (Ages 12-13) ===================== */
const YEAR8_TOPICS: Topic[] = [
  {
    id: "linear-equations-y8", name: "Linear Equations", icon: "Sigma", description: "Solve equations with unknowns on both sides.",
    theory: "A linear equation has an unknown variable (like x) and can be solved by balancing both sides.\nWhen the unknown is on both sides, move all x terms to one side and all numbers to the other.\nRemember: whatever you do to one side, you must do to the other — add, subtract, multiply or divide.",
    defaultTimeLimit: 40,
    questions: [
      { question: "Solve 3x + 2 = 17.", options: ["3", "5", "6", "7"], answer: 1, explanation: "3x = 15, so x = 5." },
      { question: "Solve 5x − 4 = 21.", options: ["3", "4", "5", "6"], answer: 2, explanation: "5x = 25, so x = 5." },
      { question: "Solve 2(x + 3) = 14.", options: ["2", "3", "4", "5"], answer: 2, explanation: "2x + 6 = 14, so 2x = 8, x = 4." },
      { question: "Solve 4x = 2x + 10.", options: ["2", "4", "5", "10"], answer: 2, explanation: "2x = 10, so x = 5." },
      { question: "Solve 3x − 5 = x + 7.", options: ["3", "5", "6", "12"], answer: 2, explanation: "2x = 12, so x = 6." },
      { question: "Solve 7x + 1 = 50.", options: ["5", "6", "7", "8"], answer: 2, explanation: "7x = 49, so x = 7." },
      { question: "Solve 10 − 2x = 4.", options: ["2", "3", "4", "6"], answer: 1, explanation: "−2x = −6, so x = 3." },
      { question: "Solve x/3 = 5.", options: ["2", "8", "15", "5"], answer: 2, explanation: "x = 5 × 3 = 15." },
      { question: "Solve 6x − 2 = 4x + 8.", options: ["3", "4", "5", "6"], answer: 2, explanation: "2x = 10, so x = 5." },
      { question: "Solve 9 = 2x + 1.", options: ["3", "4", "5", "8"], answer: 1, explanation: "2x = 8, so x = 4." },
      { question: "Solve 4(x − 2) = 16.", options: ["4", "5", "6", "8"], answer: 2, explanation: "4x − 8 = 16, so 4x = 24, x = 6." },
      { question: "Solve 5x + 3 = 2x + 15.", options: ["3", "4", "5", "6"], answer: 1, explanation: "3x = 12, so x = 4." },
      { question: "Solve 3(2x − 1) = 15.", options: ["2", "3", "4", "5"], answer: 1, explanation: "6x − 3 = 15, so 6x = 18, x = 3." },
      { question: "Solve x/4 + 2 = 7.", options: ["12", "15", "20", "28"], answer: 2, explanation: "x/4 = 5, so x = 5 × 4 = 20." },
      { question: "Solve 7x − 4 = 3x + 16. What is x?", type: "written", acceptAnswers: ["5"], explanation: "4x = 20, so x = 5.", timeLimit: 40 },
    ],
  },
  {
    id: "percentages-y8", name: "Percentages & Money", icon: "Percent", description: "Percentage change, profit and loss.",
    theory: "Percentage change compares the change to the original amount. Percentage increase = (increase ÷ original) × 100.\nProfit is when you sell for more than you bought; loss is when you sell for less. Percentage profit = (profit ÷ original) × 100.\nCompound changes (like two discounts in a row) are applied one after the other, not added together.",
    defaultTimeLimit: 40,
    questions: [
      { question: "Increase 200 by 15%.", options: ["215", "225", "230", "240"], answer: 2, explanation: "15% of 200 = 30, so 200 + 30 = 230." },
      { question: "Decrease 80 by 25%.", options: ["55", "60", "65", "70"], answer: 1, explanation: "25% of 80 = 20, so 80 − 20 = 60." },
      { question: "A £40 item is sold for £50. What is the percentage profit?", options: ["10%", "20%", "25%", "50%"], answer: 2, explanation: "Profit = £10. 10/40 = 0.25 = 25%." },
      { question: "A bike bought for £200 is sold for £170. What is the percentage loss?", options: ["10%", "15%", "20%", "30%"], answer: 1, explanation: "Loss = £30. 30/200 = 0.15 = 15%." },
      { question: "What is 35% of 240?", options: ["72", "84", "96", "108"], answer: 1, explanation: "0.35 × 240 = 84." },
      { question: "A salary of £24,000 is increased by 5%. New salary?", options: ["£24,500", "£25,000", "£25,200", "£26,000"], answer: 2, explanation: "5% of 24000 = 1200, so 24000 + 1200 = £25,200." },
      { question: "Express 18/40 as a percentage.", options: ["35%", "40%", "45%", "50%"], answer: 2, explanation: "18/40 = 0.45 = 45%." },
      { question: "A price rises from £25 to £30. Percentage increase?", options: ["15%", "20%", "25%", "30%"], answer: 1, explanation: "Increase = 5. 5/25 = 0.20 = 20%." },
      { question: "What is 12% of 550?", options: ["55", "60", "66", "72"], answer: 2, explanation: "0.12 × 550 = 66." },
      { question: "A £60 jacket is reduced by 30% then a further 10%. Final price?", options: ["£36", "£37.80", "£39", "£42"], answer: 1, explanation: "After 30% off: £42. Then 10% off £42 = £4.20, so £42 − £4.20 = £37.80." },
      { question: "Increase 150 by 20%.", options: ["160", "170", "180", "200"], answer: 2, explanation: "20% of 150 = 30, so 150 + 30 = 180." },
      { question: "A £50 item is sold for £65. What is the percentage profit?", options: ["15%", "25%", "30%", "35%"], answer: 2, explanation: "Profit = £15. 15/50 = 0.30 = 30%." },
      { question: "A price falls from £80 to £64. What is the percentage decrease?", options: ["15%", "20%", "25%", "16%"], answer: 1, explanation: "Decrease = £16. 16/80 = 0.20 = 20%." },
      { question: "What is 45% of 300?", options: ["120", "130", "135", "145"], answer: 2, explanation: "0.45 × 300 = 135." },
      { question: "A salary of £30,000 is increased by 4%. What is the new salary in £?", type: "written", acceptAnswers: ["£31,200", "31200", "31,200", "£31200"], explanation: "4% of 30000 = 1200, so 30000 + 1200 = £31,200.", timeLimit: 40 },
    ],
  },
  {
    id: "pythagoras", name: "Pythagoras' Theorem", icon: "Triangle", description: "Find missing sides in right-angled triangles.",
    theory: "Pythagoras' theorem works for right-angled triangles: a² + b² = c², where c is the longest side (hypotenuse).\nTo find the hypotenuse, square the two short sides, add them, then take the square root.\nTo find a short side, square the hypotenuse, subtract the square of the other short side, then take the square root.",
    defaultTimeLimit: 40,
    questions: [
      { question: "In a right triangle, the two short sides are 3 and 4. What is the hypotenuse?", options: ["5", "6", "7", "12"], answer: 0, explanation: "3² + 4² = 9 + 16 = 25, √25 = 5." },
      { question: "The short sides are 6 and 8. What is the hypotenuse?", options: ["10", "12", "14", "48"], answer: 0, explanation: "6² + 8² = 36 + 64 = 100, √100 = 10." },
      { question: "The hypotenuse is 13 and one side is 5. What is the other side?", options: ["8", "12", "10", "15"], answer: 1, explanation: "13² − 5² = 169 − 25 = 144, √144 = 12." },
      { question: "The short sides are 5 and 12. What is the hypotenuse?", options: ["13", "15", "17", "60"], answer: 0, explanation: "25 + 144 = 169, √169 = 13." },
      { question: "The hypotenuse is 10 and one side is 6. What is the other side?", options: ["4", "6", "8", "10"], answer: 2, explanation: "100 − 36 = 64, √64 = 8." },
      { question: "The short sides are 9 and 12. What is the hypotenuse?", options: ["15", "18", "21", "144"], answer: 0, explanation: "81 + 144 = 225, √225 = 15." },
      { question: "Pythagoras' theorem says a² + b² = ?", options: ["c", "c²", "2c", "c/2"], answer: 1, explanation: "a² + b² = c², where c is the hypotenuse." },
      { question: "The short sides are 8 and 15. What is the hypotenuse?", options: ["17", "19", "23", "225"], answer: 0, explanation: "64 + 225 = 289, √289 = 17." },
      { question: "The hypotenuse is 25 and one side is 7. What is the other side?", options: ["18", "24", "26", "32"], answer: 1, explanation: "625 − 49 = 576, √576 = 24." },
      { question: "A ladder reaches 8 m up a wall, with its base 6 m from the wall. How long is the ladder?", options: ["10 m", "12 m", "14 m", "100 m"], answer: 0, explanation: "6² + 8² = 36 + 64 = 100, √100 = 10 m." },
      { question: "The short sides are 7 and 24. What is the hypotenuse?", options: ["23", "24", "25", "26"], answer: 2, explanation: "49 + 576 = 625, √625 = 25." },
      { question: "The hypotenuse is 15 and one side is 9. What is the other side?", options: ["10", "11", "12", "13"], answer: 2, explanation: "225 − 81 = 144, √144 = 12." },
      { question: "The short sides are 9 and 40. What is the hypotenuse?", options: ["39", "40", "41", "42"], answer: 2, explanation: "81 + 1600 = 1681, √1681 = 41." },
      { question: "The hypotenuse is 17 and one side is 8. What is the other side?", options: ["13", "14", "15", "16"], answer: 2, explanation: "289 − 64 = 225, √225 = 15." },
      { question: "A right triangle has short sides 12 and 16. What is the hypotenuse?", type: "written", acceptAnswers: ["20", "20 m"], explanation: "144 + 256 = 400, √400 = 20.", timeLimit: 40 },
    ],
  },
  {
    id: "probability-y8", name: "Probability", icon: "Dices", description: "Chance, fractions and likelihood.",
    theory: "Probability measures how likely something is to happen. It is always between 0 (impossible) and 1 (certain).\nP(event) = (number of favourable outcomes) ÷ (total number of possible outcomes).\nThe probability of something NOT happening is 1 minus the probability of it happening.",
    defaultTimeLimit: 40,
    questions: [
      { question: "What is the probability of rolling a 6 on a normal die?", options: ["1/3", "1/6", "1/2", "6/6"], answer: 1, explanation: "One 6 out of 6 faces = 1/6." },
      { question: "What is the probability of flipping heads on a coin?", options: ["1/4", "1/3", "1/2", "1"], answer: 2, explanation: "Two sides, one is heads = 1/2." },
      { question: "A bag has 3 red and 7 blue marbles. P(red)?", options: ["3/10", "3/7", "7/10", "3/3"], answer: 0, explanation: "3 red out of 10 total = 3/10." },
      { question: "What is the probability of an impossible event?", options: ["0", "1", "1/2", "Can't tell"], answer: 0, explanation: "Impossible = 0 probability." },
      { question: "What is the probability of a certain event?", options: ["0", "1", "1/2", "Can't tell"], answer: 1, explanation: "Certain = probability of 1." },
      { question: "P(rain) = 0.3. P(no rain)?", options: ["0.3", "0.6", "0.7", "1.0"], answer: 2, explanation: "1 − 0.3 = 0.7." },
      { question: "A spinner has 4 equal sections: red, blue, green, yellow. P(green)?", options: ["1/2", "1/3", "1/4", "1"], answer: 2, explanation: "1 out of 4 equal sections = 1/4." },
      { question: "Two coins are flipped. P(both heads)?", options: ["1/2", "1/3", "1/4", "1/8"], answer: 2, explanation: "HH, HT, TH, TT — 1 out of 4 = 1/4." },
      { question: "A bag has 5 red and 5 blue balls. P(blue)?", options: ["1/4", "1/2", "5/10", "Both 1/2 and 5/10"], answer: 3, explanation: "5 out of 10 = 1/2 — both are correct." },
      { question: "P(rolling an even number on a die)?", options: ["1/6", "1/3", "1/2", "2/3"], answer: 2, explanation: "Even numbers are 2, 4, 6 — 3 out of 6 = 1/2." },
      { question: "A bag has 4 red, 2 blue and 4 green marbles. P(blue)?", options: ["1/10", "1/5", "1/2", "2/5"], answer: 1, explanation: "2 blue out of 10 total = 2/10 = 1/5." },
      { question: "P(rolling a number greater than 4 on a normal die)?", options: ["1/6", "1/3", "1/2", "2/3"], answer: 1, explanation: "Numbers > 4 are 5, 6 — 2 out of 6 = 1/3." },
      { question: "A bag has 6 red and 4 blue. P(not red)?", options: ["2/5", "3/5", "4/6", "1/2"], answer: 0, explanation: "Not red = blue = 4/10 = 2/5." },
      { question: "Two dice are rolled. P(both show 6)?", options: ["1/6", "1/12", "1/36", "1/18"], answer: 2, explanation: "1/6 × 1/6 = 1/36." },
      { question: "A bag has 8 marbles: 5 red and 3 blue. What is P(red) as a fraction?", type: "written", acceptAnswers: ["5/8"], explanation: "5 red out of 8 total = 5/8.", timeLimit: 40 },
    ],
  },
];

export const TOPICS_BY_YEAR: Record<YearId, Topic[]> = {
  year1: YEAR1_TOPICS,
  year2: YEAR2_TOPICS,
  year3: YEAR3_TOPICS,
  year4: YEAR4_TOPICS,
  year5: YEAR5_TOPICS,
  year6: YEAR6_TOPICS,
  year7: YEAR7_TOPICS,
  year8: YEAR8_TOPICS,
  year9: [],
  year10: [],
  year11: [],
};

export function getYear(id: YearId): YearInfo {
  return YEARS.find((y) => y.id === id)!;
}

export function getAllTopics(): Topic[] {
  return Object.values(TOPICS_BY_YEAR).flat();
}

export function getTopicById(id: string): Topic | undefined {
  return getAllTopics().find((t) => t.id === id);
}

export function findTopicYear(topicId: string): YearId | null {
  for (const [yid, topics] of Object.entries(TOPICS_BY_YEAR)) {
    if (topics.some((t) => t.id === topicId)) return yid as YearId;
  }
  return null;
}
