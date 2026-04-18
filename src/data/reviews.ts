// src/data/reviews.ts

export const POST_SHOW_REVIEWS = {
  // Detailed feedback spoken by the Senior Technician
  success: {
    3: "Flawless execution! The director is thrilled, and the crew is buying you drinks tonight.",
    2: "Solid show. A few minor hiccups, but nothing the audience noticed. Good work.",
    1: "Rough night. Half the cues were late and the designer was screaming on comms. Do better tomorrow.",
    0: "An absolute disaster. The production manager is looking for you, and it's not to give you a raise.",
  },
  // Short header text displayed in the Post-Mortem Report
  short_header: {
    3: "FLAWLESS EXECUTION!",
    2: "SOLID RUN!",
    1: "ROUGH NIGHT...",
    0: "ABSOLUTE TRAINWRECK...",
  },
  // Failure text (used by LevelFailedPage)
  failure: {
    lighting:
      "The stage went completely dark during the climax. The actors had to use their phones.",
    sound:
      "Feedback deafened the front row, and the lead's mic dropped out. Unacceptable.",
    costumes:
      "A massive wardrobe malfunction stopped the show dead in its tracks.",
    default: "Critical technical failure. The show had to be halted.",
  },
};

// Extracted UI Text for the Wrap-Up Scene
export const WRAP_UP_UI_TEXT = {
  dialogue_title: "Senior Technician",
  dialogue_btn: "Review Post-Mortem Report →",
  report_title: "Post-Mortem Report",
  report_subtitle: "Strike is complete. How did the show go?",
  score_label: "Total Score",
  cues_label: "Cues Hit",
  sign_out_btn: "Sign Out & Return to Dashboard",
};
