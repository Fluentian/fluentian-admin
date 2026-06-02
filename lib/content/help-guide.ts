/**
 * Help & learning guide content for Fluentian Admin.
 * Written for teachers, moderators, and contributors — plain language, no jargon.
 */

export type GuideSection = {
  id: string;
  title: string;
  summary?: string;
};

export const guideNav: GuideSection[] = [
  { id: "overview", title: "How learning is organized" },
  { id: "levels", title: "Proficiency levels (A0–C2)" },
  { id: "units", title: "Unit types on the path" },
  { id: "lessons", title: "Lesson types" },
  { id: "blocks", title: "Content inside a lesson" },
  { id: "quizzes", title: "Quiz & question types" },
  { id: "learner-experience", title: "What learners see" },
  { id: "creating-content", title: "Building courses in Admin" },
  { id: "roles", title: "Who can do what" },
  { id: "faq", title: "Frequently asked questions" },
];

export const learningHierarchy = {
  title: "From course to quiz",
  steps: [
    {
      label: "Course",
      description:
        "A full learning program for one language and level range (for example, French from A1 to A2). Learners enroll in a course.",
    },
    {
      label: "Unit",
      description:
        "A chapter on the learning path — such as “Introduction & Greetings.” Units group related lessons and can be core teaching, practice, story, or a checkpoint.",
    },
    {
      label: "Lesson",
      description:
        "One focused activity: vocabulary, a dialogue, grammar, speaking practice, and so on. Each lesson has a type, estimated time, and XP reward.",
    },
    {
      label: "Content blocks",
      description:
        "The teaching material inside the lesson: explanations, word lists, sentence pairs, grammar notes, or AI hints. Learners read or listen before the quiz.",
    },
    {
      label: "Questions (quiz)",
      description:
        "Short exercises at the end (or throughout) that check understanding. Wrong answers may cost hearts on the mobile app; completing the lesson earns XP.",
    },
  ],
};

export const proficiencyLevels = [
  { level: "A0", name: "Pre-beginner", description: "Absolute starter. Basic sounds, survival phrases, and orientation to the language." },
  { level: "A1", name: "Beginner", description: "Simple everyday topics: greetings, numbers, immediate needs." },
  { level: "A2", name: "Elementary", description: "Routine tasks, shopping, family, and simple past/future ideas." },
  { level: "B1", name: "Intermediate", description: "Travel, work, and opinions on familiar subjects." },
  { level: "B2", name: "Upper intermediate", description: "Clear argument, technical discussions, and more complex grammar." },
  { level: "C1", name: "Advanced", description: "Fluent, flexible use for academic or professional contexts." },
  { level: "C2", name: "Mastery", description: "Near-native precision; nuance, idioms, and subtle meaning." },
];

export const unitKinds = [
  {
    kind: "core",
    title: "Core unit",
    description:
      "Main teaching path. New grammar, vocabulary, and skills are introduced here in sequence. Most lessons live in core units.",
    example: "Unit 1: Introduction & Greetings — Bonjour, introductions, basic responses.",
  },
  {
    kind: "practice",
    title: "Practice unit",
    description:
      "Extra repetition and mixed skills without heavy new theory. Good for consolidating what was just taught.",
    example: "Unit 4: Daily Conversations — role-plays and drills using earlier vocabulary.",
  },
  {
    kind: "story",
    title: "Story unit",
    description:
      "Narrative or themed content that ties language together in context (a trip, a café scene, a workplace story).",
    example: "A short story where a character orders food, using only vocabulary from previous units.",
  },
  {
    kind: "checkpoint",
    title: "Checkpoint unit",
    description:
      "A review gate before moving on. Often mixes question types and may feel like a mini-exam. Learners should pass checkpoints to show readiness.",
    example: "Unit 1 Checkpoint — mixed quiz on greetings, names, and polite forms from Units 1–4.",
  },
];

export const lessonKinds = [
  {
    kind: "grammar_explainer",
    title: "Grammar explainer",
    description:
      "Teaches a rule clearly: when to use it, common patterns, and short examples. Usually followed by practice questions.",
    example:
      "Lesson: “How Are You? — Responses” explains formal vs informal “you” in French, with sample sentences like Comment allez-vous? vs Comment ça va?",
    tips: "Keep explanations short. One main rule per lesson works best.",
  },
  {
    kind: "dialogue",
    title: "Dialogue",
    description:
      "A realistic conversation learners can follow, often with audio. Builds listening and everyday phrasing.",
    example:
      "Lesson: “Bonjour! — Basic Greetings” walks through meeting someone: Bonjour, Je m'appelle Marie, Enchanté.",
    tips: "Use vocabulary blocks and audio so learners hear natural speed after reading.",
  },
  {
    kind: "vocabulary",
    title: "Vocabulary",
    description:
      "Introduces new words or phrases with meanings, pronunciation, and optional images or audio.",
    example:
      "Lesson: “Hello, My Name Is…” teaches Bonjour, Salut, Au revoir with meanings and play buttons for each word.",
    tips: "Group words by theme (greetings, colors, food). Avoid more than 8–12 new items per lesson.",
  },
  {
    kind: "pronunciation",
    title: "Pronunciation",
    description:
      "Focus on sounds, stress, and mouth patterns — not full grammar. Audio replay is essential.",
    example:
      "Lesson: “Pronunciation Guide” breaks down the French “r” and nasal vowels with listen-and-repeat prompts.",
    tips: "Pair with speech-record questions when you want learners to try speaking.",
  },
  {
    kind: "listening",
    title: "Listening",
    description:
      "Learners hear French (or the target language) and answer comprehension questions. Trains ear before eye.",
    example:
      "Lesson: “Listening: Introduction” plays short clips; learners choose what was said or answer about the topic.",
    tips: "Use clear audio and one main idea per clip for lower levels.",
  },
  {
    kind: "reading",
    title: "Reading",
    description:
      "Short texts — emails, signs, messages — with questions about meaning, tone, or key words.",
    example:
      "Lesson: “Reading: Meeting People” includes a brief email opening: Bonjour, je m'appelle… and asks what the writer wants.",
    tips: "Match text length to level: A1 = a few sentences; B2 = a paragraph or two.",
  },
  {
    kind: "writing",
    title: "Writing",
    description:
      "Guided production: fill gaps, write a line or two, or compose a mini-message using taught patterns.",
    example:
      "Lesson: “Writing: Hello Email” asks learners to write a 2–3 sentence introduction using Je m'appelle and J'habite à…",
    tips: "Give a model sentence in the lesson blocks before open-ended writing tasks.",
  },
  {
    kind: "speaking",
    title: "Speaking",
    description:
      "Oral practice: repeat phrases, answer aloud, or respond to prompts. Often uses speech-record questions.",
    example:
      "Lesson: “Speaking Practice” prompts: Record yourself saying Bonjour, je m'appelle [your name].",
    tips: "Keep prompts concrete and short for beginners.",
  },
  {
    kind: "cultural_bridge",
    title: "Cultural bridge",
    description:
      "Context beyond grammar: customs, etiquette, regional differences, and “why we say it this way.”",
    example:
      "Lesson: “Cultural Bridge: French Customs” explains when to use tu vs vous, cheek kisses, and meal greetings.",
    tips: "Connect culture to language choices learners will actually make.",
  },
  {
    kind: "exam_drill",
    title: "Exam drill",
    description:
      "Focused test-style practice (DELF-style, school exam, certification prep). Higher stakes, timed feel optional.",
    example:
      "Lesson: “Exam Drill: Greetings” — mixed MCQ, translation, and fill-in under exam-like conditions.",
    tips: "Use after learners have seen the material in softer lesson types.",
  },
  {
    kind: "roleplay_simulation",
    title: "Roleplay simulation",
    description:
      "Scenario practice: ordering coffee, booking a room, a job interview. Learners play a role in a mini story.",
    example:
      "Lesson: “Practice Conversation” — You are at a café; the server asks Qu'est-ce que vous prenez? Choose or speak your line.",
    tips: "Define the setting in the first block so learners know their role immediately.",
  },
];

export const blockKinds = [
  {
    kind: "rich_text",
    title: "Rich text",
    description: "General explanation or instructions with formatting.",
    example: "In this lesson you will learn basic French greetings used in everyday conversations.",
  },
  {
    kind: "grammar_note",
    title: "Grammar note",
    description: "Highlighted rule or tip, often in a callout style.",
    example: "Use Bonjour until evening; after that, Bonsoir is more natural.",
  },
  {
    kind: "sentence_pair",
    title: "Sentence pair",
    description: "Side-by-side target language and translation (or base language).",
    example: "Bonjour → Hello / Good day",
  },
  {
    kind: "ai_hint",
    title: "AI hint",
    description: "Optional smart hint learners can reveal when stuck (when AI features are enabled).",
    example: "Think about formal situations — which pronoun would you use with a stranger?",
  },
  {
    kind: "explanation",
    title: "Explanation (import / seed)",
    description: "Plain intro text used in bulk imports and sample content.",
    example: "Master French numbers 1–10. These are essential for telling time, prices, and quantities.",
  },
  {
    kind: "vocabulary",
    title: "Vocabulary block (import / seed)",
    description: "Word, meaning, and optional audio URL — common in seeded French content.",
    example: "Bonjour — Hello / Good day — [audio]",
  },
];

export const questionKinds = [
  {
    kind: "mcq_single",
    title: "Multiple choice (one answer)",
    description: "Pick exactly one correct option from a list.",
    example: {
      prompt: "Which word means 'Hello' in French?",
      options: ["Bonsoir", "Bonjour", "Bonne nuit", "Au revoir"],
      answer: "Bonjour",
      note: "After answering, learners see whether they were right and often a short explanation.",
    },
  },
  {
    kind: "mcq_multi",
    title: "Multiple choice (several answers)",
    description: "Select all options that apply. Every correct option must be chosen.",
    example: {
      prompt: "Which of these are valid greetings? (Select all)",
      options: ["Bonjour", "Salut", "Bonsoir", "Merci"],
      answer: "Bonjour, Salut, and Bonsoir",
      note: "Merci means thank you — not a greeting.",
    },
  },
  {
    kind: "fill_blank",
    title: "Fill in the blank",
    description: "Type the missing word or phrase in a sentence.",
    example: {
      prompt: "Je m'appelle ____.",
      answer: "Marie (or any accepted name)",
      note: "You can allow several accepted spellings in grading settings.",
    },
  },
  {
    kind: "reorder",
    title: "Reorder words",
    description: "Drag or tap words into the correct sentence order.",
    example: {
      prompt: "Arrange in correct order: Hello / are / you / how",
      answer: "Hello, how, are, you → Hello, how are you?",
      note: "Great for word-order practice in French and English prompts.",
    },
  },
  {
    kind: "match_pairs",
    title: "Match pairs",
    description: "Connect items from two columns (French word ↔ English meaning).",
    example: {
      prompt: "Match French to English",
      pairs: [
        "Bonjour ↔ Hello",
        "Merci ↔ Thanks",
        "Au revoir ↔ Goodbye",
      ],
      note: "All pairs must be matched correctly to score full points.",
    },
  },
  {
    kind: "short_text",
    title: "Short text answer",
    description: "Learner types a brief free response (a phrase or two).",
    example: {
      prompt: "Write a short greeting in French (2–3 words)",
      answer: "Bonjour! or Salut mon ami",
      note: "Define several accepted answers for natural variation.",
    },
  },
  {
    kind: "translation",
    title: "Translation",
    description: "Translate a sentence from the base language into the target language (or the reverse).",
    example: {
      prompt: "Translate to French: 'How are you?'",
      answer: "Comment allez-vous? / Comment ça va? / Ça va?",
      note: "Accept formal and informal variants when both are valid.",
    },
  },
  {
    kind: "listening_comprehension",
    title: "Listening comprehension",
    description: "Listen to an audio clip, then answer (often multiple choice).",
    example: {
      prompt: "Listen and select what greeting you hear",
      answer: "Bonjour",
      note: "Always test audio quality before publishing.",
    },
  },
  {
    kind: "dictation",
    title: "Dictation",
    description: "Listen and type exactly what you hear — spelling and accents matter.",
    example: {
      prompt: "Listen and type what you hear (a common French greeting)",
      answer: "Bonjour",
      note: "Stricter than listening MCQ: typing must match accepted forms.",
    },
  },
  {
    kind: "speech_record",
    title: "Speech record",
    description: "Learner records themselves speaking a prompt. May be reviewed manually or by pronunciation tools when available.",
    example: {
      prompt: "Record yourself saying: 'Bonjour, je m'appelle [your name]'",
      note: "Criteria often include clarity, pace, and intelligibility.",
    },
  },
];

export const learnerExperience = [
  {
    title: "Learning path",
    body: "On the Fluentian mobile app, learners see units as a path. Lessons unlock in order within a unit once the previous lesson is completed.",
  },
  {
    title: "Lesson flow",
    body: "They open a lesson, read or listen to blocks, then take the quiz. Multiple-choice is the most common format today; other types are supported in the platform and roll out on mobile over time.",
  },
  {
    title: "Hearts",
    body: "Wrong quiz answers can reduce hearts (lives). When hearts run out, learners may need to wait or practice before continuing — this encourages careful learning rather than guessing.",
  },
  {
    title: "XP and streaks",
    body: "Each lesson awards XP (experience points) set by you in Admin. Daily practice builds streaks and appears on the learner profile and dashboard stats.",
  },
  {
    title: "Progress & checkpoints",
    body: "Completed lessons are saved to the server. Checkpoint units help confirm learners are ready for the next chapter before harder content.",
  },
  {
    title: "Publishing",
    body: "Only published lessons appear to learners. Draft lessons are visible in Admin for editing but hidden on the app until you turn publishing on.",
  },
];

export const adminWorkflow = [
  {
    title: "Create a course",
    body: "Set target language and level range (e.g. A1–A2). Publish the course when the first units are ready.",
  },
  {
    title: "Add units",
    body: "Choose unit type (core, practice, story, checkpoint) and order them with unit numbers. Give clear titles learners will recognize.",
  },
  {
    title: "Add lessons",
    body: "Pick a lesson type, sequence number, estimated minutes, and XP. Match the lesson type to your goal (don't label vocabulary lesson as speaking unless it includes speaking tasks).",
  },
  {
    title: "Build content blocks",
    body: "Add rich text, grammar notes, sentence pairs, or AI hints. Order blocks top to bottom — learners see them in that sequence.",
  },
  {
    title: "Add quiz questions",
    body: "Attach questions that test what the blocks taught. Use a mix of types in checkpoints; use simpler types (MCQ, fill blank) in early units.",
  },
  {
    title: "Bulk import (optional)",
    body: "Courses → Import lets you upload a CSV with courses, units, lessons, blocks, and questions. Download the template from that page for the exact column format.",
  },
];

export const rolesGuide = [
  { role: "Super admin / Admin", can: "Full access: users, analytics, courses, lessons, opportunities, notifications." },
  { role: "Teacher", can: "Create and edit courses, units, lessons, blocks, and questions. No user management." },
  { role: "Moderator", can: "Students, opportunities board, and notifications — community features, not curriculum editing." },
  { role: "Student", can: "Uses the mobile learning app only. Student accounts cannot sign in to this Admin dashboard." },
];

export const faqItems = [
  {
    q: "What is the difference between a lesson type and a question type?",
    a: "Lesson type describes the whole activity (e.g. a vocabulary lesson). Question type describes each quiz exercise inside it (e.g. multiple choice). One lesson usually has many questions.",
  },
  {
    q: "Can one lesson have no quiz?",
    a: "Yes, but learners may not earn completion credit on the app until questions are answered. For pure reading or culture, add at least one light question or mark expectations in your team guidelines.",
  },
  {
    q: "How many questions should a lesson have?",
    a: "A common range is 5–10 for a 10-minute lesson. Checkpoints may have 10–15 mixed types. Quality matters more than quantity.",
  },
  {
    q: "Why don't learners see my new lesson?",
    a: "Check that both the course and the lesson are published, and that the lesson is in the correct unit with the right sequence number.",
  },
  {
    q: "What does sequence_no mean?",
    a: "Order within the parent: unit_no orders units in a course; sequence_no orders lessons in a unit and questions in a lesson.",
  },
  {
    q: "Where do learners actually study?",
    a: "Learners use the Fluentian mobile app. This Admin site is for building and managing content, reviewing students, and running the opportunity board.",
  },
];
