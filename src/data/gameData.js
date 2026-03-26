// ─── Productions ───────────────────────────────────────────────────────────────
export const PRODUCTIONS = [
  {
    id: "phantom",
    title: "The Phantom of the Opera",
    poster: "🎭",
    description:
      "Andrew Lloyd Webber's iconic musical set in the Paris Opéra house. " +
      "A sprawling production with elaborate lighting, rigging, and pyrotechnics.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/The_Phantom_of_the_Opera_(1986_musical)",
    levels: {
      school:       { venueId: "drama_hall",     stars: 0, unlocked: true  },
      community:    { venueId: "civic_theatre",  stars: 0, unlocked: false },
      professional: { venueId: "grand_opera",    stars: 0, unlocked: false },
    },
  },
  {
    id: "midsummer",
    title: "A Midsummer Night's Dream",
    poster: "🌙",
    description:
      "Shakespeare's beloved comedy. A smaller cast but requires creative " +
      "use of gobos, coloured gels, and practical forest set pieces.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/A_Midsummer_Night%27s_Dream",
    levels: {
      school:       { venueId: "drama_hall",     stars: 0, unlocked: true  },
      community:    { venueId: "civic_theatre",  stars: 0, unlocked: false },
      professional: { venueId: "grand_opera",    stars: 0, unlocked: false },
    },
  },
];

// ─── Venues ────────────────────────────────────────────────────────────────────
export const VENUES = {
  drama_hall:    { name: "School Drama Hall",   description: "Basic fresnels and a single dimmer rack." },
  civic_theatre: { name: "Civic Theatre",       description: "Mid-sized proscenium with a digital lighting board." },
  grand_opera:   { name: "Grand Opera House",   description: "Full fly tower, automated fixtures, and a 96-channel desk." },
};

// ─── Characters ────────────────────────────────────────────────────────────────
export const CHARACTERS = [
  {
    id: "ben",
    name: "Ben",
    role: "Lighting Designer",
    department: "lighting",
    icon: "💡",
    bio: "A meticulous LD who started out rewiring practicals in his school hall. " +
         "Loves a dramatic backlight moment.",
    stats: { technical: 9, social: 6, stamina: 7 },
  },
  {
    id: "priya",
    name: "Priya",
    role: "Sound Operator",
    department: "sound",
    icon: "🎚️",
    bio: "Trained on church sound systems. Has an encyclopaedic knowledge of mic " +
         "placement and feedback prevention.",
    stats: { technical: 8, social: 7, stamina: 8 },
  },
  {
    id: "sam",
    name: "Sam",
    role: "Stage Manager",
    department: "stage_management",
    icon: "📋",
    bio: "Keeps the whole crew together with calm authority and an immaculate cue book.",
    stats: { technical: 6, social: 10, stamina: 9 },
  },
];

// ─── Cue sheets (per production + role) ───────────────────────────────────────
export const CUE_SHEETS = {
  phantom: {
    lighting: [
      { id: "LX1",  label: "Overture — house lights fade",          targetMs: 3000,  windowMs: 800 },
      { id: "LX2",  label: "Chandelier ascends — warm wash up",     targetMs: 9000,  windowMs: 600 },
      { id: "LX3",  label: "Christine enters — follow spot live",   targetMs: 15000, windowMs: 700 },
      { id: "LX4",  label: "Mirror scene — blue side light",        targetMs: 21000, windowMs: 600 },
      { id: "LX5",  label: "Phantom reveal — red special",          targetMs: 28000, windowMs: 500 },
      { id: "LX6",  label: "Masquerade — full colour blast",        targetMs: 35000, windowMs: 700 },
      { id: "LX7",  label: "Rooftop — moonlight only",              targetMs: 43000, windowMs: 800 },
      { id: "LX8",  label: "Final lair — blackout",                 targetMs: 52000, windowMs: 400 },
    ],
    sound: [
      { id: "SQ1",  label: "Organ sting — full volume",             targetMs: 4000,  windowMs: 500 },
      { id: "SQ2",  label: "Phantom mic — channel 7 open",          targetMs: 10000, windowMs: 600 },
      { id: "SQ3",  label: "Christine track — playback start",      targetMs: 16000, windowMs: 500 },
      { id: "SQ4",  label: "Chandelier crash SFX",                  targetMs: 22000, windowMs: 400 },
      { id: "SQ5",  label: "Reprise — underscore in",               targetMs: 30000, windowMs: 700 },
      { id: "SQ6",  label: "Masquerade — orchestra swell",          targetMs: 37000, windowMs: 600 },
      { id: "SQ7",  label: "Final chord — reverb tail",             targetMs: 45000, windowMs: 500 },
      { id: "SQ8",  label: "House music — post-show",               targetMs: 54000, windowMs: 800 },
    ],
  },
  midsummer: {
    lighting: [
      { id: "LX1",  label: "Preshow — warm amber wash",             targetMs: 2000,  windowMs: 800 },
      { id: "LX2",  label: "Forest appears — green gobo spin",      targetMs: 8000,  windowMs: 600 },
      { id: "LX3",  label: "Puck enters — surprise special",        targetMs: 14000, windowMs: 500 },
      { id: "LX4",  label: "Love spell — lavender wash",            targetMs: 20000, windowMs: 700 },
      { id: "LX5",  label: "Dawn — slow sky fade",                  targetMs: 27000, windowMs: 900 },
      { id: "LX6",  label: "Resolution — full bright",              targetMs: 35000, windowMs: 600 },
      { id: "LX7",  label: "Curtain call",                          targetMs: 42000, windowMs: 800 },
    ],
    sound: [
      { id: "SQ1",  label: "Opening fanfare",                       targetMs: 3000,  windowMs: 600 },
      { id: "SQ2",  label: "Forest ambience in",                    targetMs: 9000,  windowMs: 700 },
      { id: "SQ3",  label: "Fairy music — delicate bells",          targetMs: 15000, windowMs: 600 },
      { id: "SQ4",  label: "Donkey bray SFX",                       targetMs: 22000, windowMs: 400 },
      { id: "SQ5",  label: "Dawn chorus — birds in",                targetMs: 28000, windowMs: 800 },
      { id: "SQ6",  label: "Resolution fanfare",                    targetMs: 36000, windowMs: 600 },
      { id: "SQ7",  label: "Curtain call music",                    targetMs: 43000, windowMs: 800 },
    ],
  },
};

// ─── Lighting plot grid ────────────────────────────────────────────────────────
export const LIGHT_TYPES = [
  { id: "fresnel",    label: "Fresnel",     icon: "◉", color: "#EF9F27" },
  { id: "profile",   label: "Profile",     icon: "◈", color: "#378ADD" },
  { id: "par",       label: "PAR can",     icon: "●", color: "#1D9E75" },
  { id: "followspot",label: "Follow spot", icon: "◎", color: "#D85A30" },
];

export const PLOT_GRID_COLS = 6;
export const PLOT_GRID_ROWS = 4;

// ─── Conflicts ─────────────────────────────────────────────────────────────────
export const CONFLICTS = [
  {
    id: "costume_vs_lighting",
    trigger: "planning",
    npc: "Costume Designer",
    scenario:
      "The Costume Designer storms in: \"Your warm amber wash is going to make the " +
      "white dresses look YELLOW on stage. Did you even think about us?\"",
    choices: [
      {
        id: "diplomatic",
        text: "\"You're right — let's look at the plot together and find a fix.\"",
        outcome: "resolved",
        pointDelta: +50,
        sideEffect: "costume_contact_unlocked",
      },
      {
        id: "defensive",
        text: "\"I'm the LD here. The wash stays.\"",
        outcome: "escalated",
        pointDelta: -30,
        sideEffect: "sm_warning",
      },
    ],
  },
  {
    id: "late_cue",
    trigger: "rehearsal",
    npc: "Stage Manager",
    scenario:
      "Over headset the SM says: \"LX2 was 4 bars late again. The cast is losing " +
      "confidence. What's happening at the board?\"",
    choices: [
      {
        id: "honest",
        text: "\"Sorry — I miscounted. Can we take it from the top of that section?\"",
        outcome: "resolved",
        pointDelta: +30,
        sideEffect: null,
      },
      {
        id: "blame",
        text: "\"The conductor changed the tempo without telling me.\"",
        outcome: "escalated",
        pointDelta: -20,
        sideEffect: "conductor_friction",
      },
    ],
  },
  {
    id: "newcomer_hazing",
    trigger: "wrapup",
    npc: "Senior Technician",
    scenario:
      "A senior tech says loudly to a colleague: \"New crew always bottle the big " +
      "shows. No experience, no business being here.\"",
    choices: [
      {
        id: "stand_up",
        text: "\"That's not fair — everyone starts somewhere. Let's focus on the debrief.\"",
        outcome: "resolved",
        pointDelta: +40,
        sideEffect: "ally_gained",
      },
      {
        id: "ignore",
        text: "Say nothing and move on.",
        outcome: "neutral",
        pointDelta: 0,
        sideEffect: null,
      },
    ],
  },
];

// ─── Stories (unlockable lore) ──────────────────────────────────────────────────
export const STORIES = [
  {
    id: "story_jargon",
    title: "Speaking in Cues: Theatre Jargon 101",
    unlockedBy: { productionId: "phantom", difficulty: "school", minStars: 1 },
    content:
      "Backstage has its own language. 'LX' is short for electrics (lighting). " +
      "'SQ' denotes a sound cue. 'Barn doors' aren't on a farm — they're the metal " +
      "flaps that shape a Fresnel beam. 'Check' means lower the intensity slightly, " +
      "while 'kill' means cut it entirely. And if the SM says 'places', drop everything — " +
      "the show is about to start.",
  },
  {
    id: "story_hierarchy",
    title: "Who's the Boss Backstage?",
    unlockedBy: { productionId: "phantom", difficulty: "school", minStars: 2 },
    content:
      "The Stage Manager runs the show once it opens. They call every cue over headset " +
      "and are the final authority in the building during a performance. Above them in " +
      "pre-production sits the Director. The Production Manager oversees budgets and " +
      "logistics. Designers (lighting, sound, set, costume) report to the director " +
      "creatively but coordinate with the PM on resources.",
  },
  {
    id: "story_women_in_tech_theatre",
    title: "Women Behind the Board",
    unlockedBy: { productionId: "phantom", difficulty: "community", minStars: 1 },
    content:
      "Research by Nidweski (2021) found that while many women participate in " +
      "technical theatre at school level, professional crews remain male-dominated. " +
      "Interviewees cited casual assumptions that technical work is 'masculine' as a " +
      "persistent barrier. Networking — exchanging contacts after shows, joining industry " +
      "associations — was identified as the key strategy for women building sustainable careers.",
  },
];
