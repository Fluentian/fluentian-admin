/**
 * Step-by-step teacher guide for building curriculum in Fluentian Admin.
 */

export const teacherGuideIntro = {
  title: "Teacher's guide: building your first course",
  summary:
    "When your team is ready to add content, you will work top-down: create a course, add units, add lessons to each unit, then fill every lesson with teaching blocks and quiz questions. This section walks you through each click in Admin and tells you exactly what to add depending on the lesson or quiz type you chose.",
  beforeYouStart: [
    "Sign in with a teacher or admin account (students cannot use this dashboard).",
    "Know your target level (e.g. A1) and language (set when the course is created).",
    "Plan one unit at a time: title, unit type (core / practice / story / checkpoint), then its lessons in order.",
    "Keep lessons as drafts until blocks and at least one question are ready, then publish the lesson and finally the course.",
  ],
};

export const educationalVsQuizLesson = {
  title: "Educational lesson vs quiz-heavy lesson",
  body: "In Fluentian, every lesson has two parts in the editor — they are not separate items in the menu:",
  parts: [
    {
      label: "Content blocks (teaching)",
      description:
        "What learners read, hear, or study first. Use Rich Text for explanations, Grammar Note for rules, Sentence Pair for examples, AI Hint for optional help. Drag blocks to reorder them.",
      where: "Lesson editor → Content Blocks tab → Add Block",
    },
    {
      label: "Quiz questions (practice)",
      description:
        "What learners answer to finish the lesson and earn XP. Add them after (or alongside) teaching content. A lesson can be mostly teaching with a short quiz, or mostly quiz (exam drill) with only a brief intro block.",
      where: "Lesson editor → Quiz Questions tab → Add Question",
    },
  ],
  ruleOfThumb:
    "If learners need to learn something new, add blocks first, then questions that test only what you taught. If the lesson type is Exam Drill or a checkpoint review, you may use fewer blocks and more questions.",
};

export const setupWorkflow = [
  {
    step: 1,
    title: "Create a course",
    where: "Sidebar → Courses → New Course (or ask an admin to create one for your language/level).",
    actions: [
      "Set course code (e.g. FR_BEGINNER_A1A2), target language, and level range (level min → level max).",
      "Save the course. It starts unpublished — learners will not see it until you publish from the course page.",
    ],
    tip: "One course = one learning path (e.g. French beginners). Do not mix unrelated levels in one course.",
  },
  {
    step: 2,
    title: "Add units (chapters)",
    where: "Open the course → Curriculum Units → Add Unit.",
    actions: [
      "Enter unit number (1, 2, 3…), title learners will recognize, and unit type: Core (new material), Practice (review), Story (narrative), or Checkpoint (test gate).",
      "Save. Units appear in order by unit number.",
    ],
    tip: "End each major chapter with a Checkpoint unit before starting harder topics.",
  },
  {
    step: 3,
    title: "Add a lesson to a unit",
    where: "Inside the unit accordion → Add Lesson to Unit X.",
    actions: [
      "Fill in lesson title, lesson type (see playbooks below), estimated minutes, XP reward, and sequence number (order within the unit).",
      "Click Create Lesson — you are taken to the lesson editor automatically.",
    ],
    tip: "Sequence 1 is the first lesson learners unlock in that unit. Match numbers to your curriculum plan.",
  },
  {
    step: 4,
    title: "Add content blocks (teaching)",
    where: "Lesson editor → Content Blocks tab → Add Block.",
    actions: [
      "Choose block type: Rich Text, Grammar Note, Sentence Pair, or AI Hint.",
      "Fill in the fields. Turn on Read with TTS if learners should hear text without uploading audio.",
      "Drag the handle on the left to reorder blocks. Delete with the trash icon if needed.",
    ],
    tip: "Start with one Rich Text block that says what the lesson is about, then add specialized blocks.",
  },
  {
    step: 5,
    title: "Add quiz questions",
    where: "Lesson editor → Quiz Questions tab → Add Question.",
    actions: [
      "Pick question type, write the prompt, add options (for multiple choice), and set the correct answer.",
      "Save each question. Order is controlled by sequence number when editing.",
    ],
    tip: "For multiple choice, the correct answer must be exactly one of the options you listed.",
  },
  {
    step: 6,
    title: "Save lesson settings & publish",
    where: "Left sidebar on the lesson editor → Lesson Info + Status.",
    actions: [
      "Click Save Changes after editing title, type, time, XP, or sequence.",
      "Turn Published ON only when blocks and questions are complete and proofread.",
      "On the course page, publish the whole course when enough units are ready.",
    ],
    tip: "Draft lesson + published course = learners still do not see that lesson. Both lesson and course matter.",
  },
];

export const blockEditorGuide = [
  {
    kind: "rich_text",
    title: "Rich Text",
    fields: "Main text area + optional Read with TTS toggle.",
    useFor: "Introductions, instructions, dialogue scripts written as prose, reading passages.",
    steps: [
      "Add Block → Rich Text.",
      "Write the content learners should read.",
      "Enable TTS if the mobile app should read it aloud (no audio file needed).",
    ],
  },
  {
    kind: "grammar_note",
    title: "Grammar Note",
    fields: "Rule (textarea), Example in target language, optional TTS on the example.",
    useFor: "One clear grammar rule with a model sentence.",
    steps: [
      "Add Block → Grammar Note.",
      "Rule: short explanation (e.g. \"Use Bonjour until evening…\").",
      "Example: one sentence in French (or your target language).",
    ],
  },
  {
    kind: "sentence_pair",
    title: "Sentence Pair",
    fields: "French (target) + Translation (base language), optional TTS on French.",
    useFor: "Vocabulary lines, mini examples, bilingual comparisons.",
    steps: [
      "Add Block → Sentence Pair.",
      "Enter target language on the left, translation on the right.",
      "Add several pairs in separate blocks for word lists.",
    ],
  },
  {
    kind: "ai_hint",
    title: "AI Hint",
    fields: "Hint text only.",
    useFor: "Optional nudge when learners are stuck on a quiz (if AI features are on).",
    steps: [
      "Add Block → AI Hint.",
      "Write a hint that guides without giving the full answer (e.g. \"Think formal vs informal\").",
    ],
  },
];

export type LessonPlaybook = {
  kind: string;
  title: string;
  goal: string;
  blocks: string[];
  questions: string[];
  suggestedTypes: string;
  minutesXp: string;
};

export const lessonPlaybooks: LessonPlaybook[] = [
  {
    kind: "vocabulary",
    title: "Vocabulary lesson",
    goal: "Teach new words/phrases learners will recognize and use.",
    blocks: [
      "Rich Text — 1–2 sentences: topic and what they will learn.",
      "Sentence Pair — one block per important word (target + translation).",
      "Optional Grammar Note — only if one pattern applies to all words.",
    ],
    questions: [
      "MCQ Single — \"Which means Hello?\" with four words.",
      "Translation — \"Translate: Good evening\" → Bonsoir.",
      "Fill in the Blank — Je m'appelle ____.",
    ],
    suggestedTypes: "3–6 questions, mostly MCQ and translation.",
    minutesXp: "~8–10 min, 15–20 XP.",
  },
  {
    kind: "grammar_explainer",
    title: "Grammar explainer lesson",
    goal: "Explain one rule and practice it.",
    blocks: [
      "Rich Text — when to use the rule.",
      "Grammar Note — rule + one model example.",
      "Sentence Pair — 2–3 more examples showing the rule.",
    ],
    questions: [
      "MCQ Single — pick the grammatically correct sentence.",
      "Fill in the Blank — complete the sentence with the right form.",
      "Reorder — if you teach word order (via import/API when mobile supports it).",
    ],
    suggestedTypes: "4–8 questions focused on the single rule.",
    minutesXp: "~10–12 min, 20–25 XP.",
  },
  {
    kind: "dialogue",
    title: "Dialogue lesson",
    goal: "Model a real conversation.",
    blocks: [
      "Rich Text — context (where, who is speaking).",
      "Sentence Pair — each line of dialogue as target + translation.",
      "Optional Rich Text with TTS — full script for listen-along.",
    ],
    questions: [
      "Listening comprehension style — MCQ: \"What did Person A say?\" (when audio is available).",
      "MCQ Single — choose the appropriate reply.",
      "Translation — translate one line from the dialogue.",
    ],
    suggestedTypes: "4–6 questions tied to lines in the dialogue.",
    minutesXp: "~8–12 min, 15–25 XP.",
  },
  {
    kind: "pronunciation",
    title: "Pronunciation lesson",
    goal: "Practice sounds and stress.",
    blocks: [
      "Rich Text — describe the sound (e.g. French \"r\").",
      "Sentence Pair — minimal pairs or practice words with TTS on.",
      "Grammar Note optional — spelling vs sound note.",
    ],
    questions: [
      "MCQ Single — \"Which word contains the nasal vowel?\"",
      "Speech record — via bulk import/API: \"Record: Bonjour\" (Admin form may add later).",
    ],
    suggestedTypes: "Short quiz; emphasis on listening/repeating in blocks.",
    minutesXp: "~12–15 min, 25–30 XP.",
  },
  {
    kind: "listening",
    title: "Listening lesson",
    goal: "Train the ear.",
    blocks: [
      "Rich Text — what to listen for.",
      "Rich Text or imported audio block — describe clip in text until audio upload is in Admin.",
    ],
    questions: [
      "MCQ Single — \"What greeting did you hear?\" (options: Bonjour, Merci, etc.).",
      "Dictation / listening types — use CSV import for audio_url + accepted answers.",
    ],
    suggestedTypes: "Mostly comprehension MCQ; 5–8 questions if clips are short.",
    minutesXp: "~10 min, 20 XP.",
  },
  {
    kind: "reading",
    title: "Reading lesson",
    goal: "Understand a short text.",
    blocks: [
      "Rich Text — the passage (email, sign, message).",
      "AI Hint — optional vocabulary help.",
    ],
    questions: [
      "MCQ Single — main idea or detail from the text.",
      "Short answer / Fill blank — via form or import.",
    ],
    suggestedTypes: "3–6 questions referencing only the passage.",
    minutesXp: "~10–12 min, 20–25 XP.",
  },
  {
    kind: "writing",
    title: "Writing lesson",
    goal: "Produce short written language.",
    blocks: [
      "Rich Text — task description and model paragraph.",
      "Sentence Pair — useful phrases to reuse.",
      "Grammar Note — structure template (e.g. email opening).",
    ],
    questions: [
      "Translation — write the target language version of a prompt.",
      "Fill in the Blank — complete a template email.",
      "Short text — import if accepting multiple phrasings.",
    ],
    suggestedTypes: "3–5 questions; include one longer translation.",
    minutesXp: "~12–15 min, 25–30 XP.",
  },
  {
    kind: "speaking",
    title: "Speaking lesson",
    goal: "Say phrases aloud confidently.",
    blocks: [
      "Rich Text — scenario and success criteria.",
      "Sentence Pair — lines to practice with TTS.",
    ],
    questions: [
      "MCQ Single — choose best spoken response (prep before record).",
      "Speech record — import/API for \"Record yourself saying…\"",
    ],
    suggestedTypes: "Fewer written questions; blocks carry the speaking practice.",
    minutesXp: "~15–20 min, 30–40 XP.",
  },
  {
    kind: "cultural_bridge",
    title: "Cultural bridge lesson",
    goal: "Explain culture linked to language choices.",
    blocks: [
      "Rich Text — story or situation (tu vs vous, greetings, meals).",
      "Grammar Note or Sentence Pair — language examples tied to culture.",
      "AI Hint — \"Why is this formal?\"",
    ],
    questions: [
      "MCQ Single — etiquette or meaning questions.",
      "Translation — appropriate phrase for a situation.",
    ],
    suggestedTypes: "2–5 lighter questions; focus on blocks.",
    minutesXp: "~10–15 min, 20–30 XP.",
  },
  {
    kind: "exam_drill",
    title: "Exam drill lesson (quiz-heavy)",
    goal: "Test-style practice without much new teaching.",
    blocks: [
      "Rich Text only — brief instructions (\"Answer all questions; no hints\").",
    ],
    questions: [
      "Mix MCQ Single, MCQ Multi, Translation, Fill in the Blank.",
      "Add 8–15 questions covering the unit topic.",
    ],
    suggestedTypes: "Quiz-first: minimal blocks, many questions.",
    minutesXp: "~15 min, 30–35 XP.",
  },
  {
    kind: "roleplay_simulation",
    title: "Roleplay simulation lesson",
    goal: "Practice a scenario (café, hotel, interview).",
    blocks: [
      "Rich Text — role, setting, and goal (\"You are the customer\").",
      "Sentence Pair — key lines for each side of the conversation.",
    ],
    questions: [
      "MCQ Single — choose your next line in the roleplay.",
      "Translation — respond in target language to a prompt.",
    ],
    suggestedTypes: "4–8 questions that continue the scenario.",
    minutesXp: "~15–20 min, 30–40 XP.",
  },
];

export type QuestionPlaybook = {
  kind: string;
  title: string;
  whenToUse: string;
  inAdminNow: boolean;
  steps: string[];
  fields: string;
  example: { prompt: string; setup: string; answer: string };
};

export const questionPlaybooks: QuestionPlaybook[] = [
  {
    kind: "mcq_single",
    title: "Multiple choice (one answer)",
    whenToUse: "Default for vocabulary, grammar, reading detail, listening (with text prompt).",
    inAdminNow: true,
    steps: [
      "Quiz Questions → Add Question → Multiple Choice (Single).",
      "Write the prompt.",
      "Add at least two options (use Add option for more).",
      "Select the correct answer from the dropdown (must match an option exactly).",
      "Save Question.",
    ],
    fields: "Prompt, Options (list), Correct Answer (dropdown).",
    example: {
      prompt: "Which word means 'Hello' in French?",
      setup: "Options: Bonsoir | Bonjour | Merci | Au revoir",
      answer: "Bonjour",
    },
  },
  {
    kind: "mcq_multi",
    title: "Multiple choice (several answers)",
    whenToUse: "When more than one option is correct (e.g. all greetings).",
    inAdminNow: true,
    steps: [
      "Choose Multiple Choice (Multiple).",
      "Prompt: say \"Select all that apply\".",
      "List options; for correct answer field use the primary accepted form your team agrees on (confirm with import/API for multiple indices on mobile).",
      "Prefer CSV import for full multi-answer grading if the simple form is limiting.",
    ],
    fields: "Same as MCQ Single; clarify in prompt that multiple answers are allowed.",
    example: {
      prompt: "Which are greetings? (Select all)",
      setup: "Bonjour, Salut, Bonsoir, Merci",
      answer: "Bonjour (and Salut, Bonsoir — use import for full grading)",
    },
  },
  {
    kind: "fill_blank",
    title: "Fill in the blank",
    whenToUse: "One missing word in a sentence.",
    inAdminNow: true,
    steps: [
      "Choose Fill in the Blank.",
      "Prompt: include ____ where the blank is (e.g. Je m'appelle ____).",
      "Correct Answer: exact word(s) learners should type.",
    ],
    fields: "Prompt, Correct Answer (typed).",
    example: {
      prompt: "Je m'appelle ____.",
      setup: "No options list.",
      answer: "Marie",
    },
  },
  {
    kind: "translation",
    title: "Translation",
    whenToUse: "Learner produces target-language text from English (or base language).",
    inAdminNow: true,
    steps: [
      "Choose Translation.",
      "Prompt: \"Translate to French: …\"",
      "Correct Answer: best answer; add alternate accepted forms via CSV import if needed.",
    ],
    fields: "Prompt, Correct Answer.",
    example: {
      prompt: "Translate to French: 'How are you?'",
      setup: "Free text answer.",
      answer: "Comment ça va?",
    },
  },
  {
    kind: "reorder",
    title: "Reorder words",
    whenToUse: "Word order practice.",
    inAdminNow: false,
    steps: [
      "Use Courses → Import CSV with question kind reorder, words array, and correct_order in grading_payload.",
      "Or ask an admin to add via API until the form is available.",
    ],
    fields: "text, words[], correct_order in CSV.",
    example: {
      prompt: "Arrange: Hello / are / you / how",
      setup: "CSV row kind=reorder",
      answer: "Hello, how, are, you",
    },
  },
  {
    kind: "match_pairs",
    title: "Match pairs",
    whenToUse: "Vocabulary matching (word ↔ meaning).",
    inAdminNow: false,
    steps: ["Add via CSV import with pairs in prompt_payload and matches in grading_payload."],
    fields: "pairs[], matches{} in import file.",
    example: {
      prompt: "Match French to English",
      setup: "Bonjour–Hello, Merci–Thanks",
      answer: "All pairs linked",
    },
  },
  {
    kind: "short_text",
    title: "Short text",
    whenToUse: "Brief free response (2–3 words or a phrase).",
    inAdminNow: false,
    steps: ["CSV import with accepted_answers array in grading_payload."],
    fields: "text prompt, accepted_answers[].",
    example: {
      prompt: "Write a short greeting in French",
      setup: "Import",
      answer: "Bonjour! / Salut!",
    },
  },
  {
    kind: "listening_comprehension",
    title: "Listening comprehension",
    whenToUse: "After an audio clip.",
    inAdminNow: false,
    steps: ["CSV import with audio_url in prompt; accepted_answers in grading."],
    fields: "audio_url, text, accepted_answers.",
    example: {
      prompt: "Listen and select the greeting you hear",
      setup: "audio_url + MCQ-style answers in import",
      answer: "Bonjour",
    },
  },
  {
    kind: "dictation",
    title: "Dictation",
    whenToUse: "Type exactly what was heard.",
    inAdminNow: false,
    steps: ["CSV import with audio_url and strict accepted_answers."],
    fields: "audio_url, hint optional, accepted_answers.",
    example: {
      prompt: "Listen and type what you hear",
      setup: "Import with audio",
      answer: "Bonjour",
    },
  },
  {
    kind: "speech_record",
    title: "Speech record",
    whenToUse: "Speaking lessons — learner records audio.",
    inAdminNow: false,
    steps: ["CSV import with instruction text and evaluation_criteria in grading_payload."],
    fields: "text, instruction; grading: criteria list.",
    example: {
      prompt: "Record: Bonjour, je m'appelle [name]",
      setup: "Import",
      answer: "Reviewed for clarity (not auto-graded in all builds)",
    },
  },
];

export const publishingChecklist = [
  "Lesson has a clear title and the correct lesson type selected.",
  "At least one content block explains or teaches the topic.",
  "At least one quiz question tests the lesson objective.",
  "Sequence number places the lesson in the right order in the unit.",
  "Estimated minutes and XP are reasonable (learners see these on the app).",
  "Lesson Published toggle is ON.",
  "Parent course is published when you want learners to access the path.",
  "Proofread prompts and correct answers (especially MCQ — typo in an option breaks the key).",
];

export const teacherFaq = [
  {
    q: "I created a lesson but only see the form — where are blocks?",
    a: "After creating a lesson you should land on the lesson editor. Open the Content Blocks tab at the top. If you left the page, go to Courses → your course → unit → Edit on the lesson.",
  },
  {
    q: "Can I add a lesson with only quiz and no teaching?",
    a: "Yes. Use lesson type Exam Drill, add one short Rich Text block with instructions, then add all questions in the Quiz Questions tab.",
  },
  {
    q: "Why does my multiple choice question not save?",
    a: "You need at least two non-empty options, and the correct answer must be selected from that list (exact spelling match).",
  },
  {
    q: "How do I add question types not in the dropdown?",
    a: "Use Courses → Curriculum Import and the CSV template, or coordinate with an admin for API/import. The mobile app supports more types than the current question form.",
  },
  {
    q: "What order should I build in?",
    a: "Course → units (by unit number) → lessons (by sequence) → blocks top to bottom → questions. Publish only when the full lesson is ready.",
  },
];
