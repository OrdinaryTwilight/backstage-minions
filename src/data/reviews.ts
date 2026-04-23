/**
 * @file Post-Show Reviews & Feedback
 * @description Performance review text and scoring feedback.
 *
 * Review System:
 * - **Star Ratings**: 1-4 stars based on session performance
 * - **Success Text**: Post-show review dialogue (varies by performance level)
 * - **Failure Text**: Specific failure scenarios for each department
 * - **UI Text**: Labels and button text for wrap-up scene
 *
 * Narrative: Reviews provide narrative closure and feedback to player about their performance.
 * Failure scenarios explain what went wrong specifically to help player learn.
 */

export const POST_SHOW_REVIEWS = {
  success: {
    4: "A truly transcendent run. The director cried, the cues were impossibly tight, and not a single piece of gaff tape peeled. The holy grail of live theatre. The SM bought pizza for the whole crew.",
    3: "Flawless execution! The director is thrilled, and the crew is buying you drinks tonight. A few microscopic bobbles, but you recovered so fast nobody out front noticed.",
    2: "Solid show. You hit the 'Must-Haves' but missed a few of the 'Nice-to-Haves'. The audience got their money's worth, but we have notes to go over tomorrow at 10 AM.",
    1: "Rough night. Half the cues were late, the designer was screaming on comms, and the lead actor tripped over an uncoiled cable. Drink some water and do better tomorrow.",
    0: "An absolute disaster. The production manager is looking for you, and it's not to give you a raise. Actors were wandering in the dark, microphones fed back, and a patron asked for a refund.",
  },
  short_header: {
    4: "THEATRICAL PERFECTION!",
    3: "FLAWLESS EXECUTION!",
    2: "SOLID RUN!",
    1: "ROUGH NIGHT...",
    0: "ABSOLUTE TRAINWRECK...",
  },
  failure: {
    lighting:
      "The stage went completely dark during the climax. The actors had to use their phones. The lighting designer walked out of the theater in disgust.",
    sound:
      "Feedback deafened the front row, and the lead's mic dropped out during their emotional solo. You could hear the audience groaning.",
    costumes:
      "A massive wardrobe malfunction stopped the show dead in its tracks. A zipper jam led to an actor entering wearing half a Victorian dress and sweatpants.",
    scenic:
      "The Act 1 drop didn't fly out in time, causing the actors to perform an entire scene cramped in a three-foot sliver of downstage space.",
    default:
      "Critical technical failure. The stage manager called 'Stop the Show' over the god mic. The ultimate embarrassment.",
  },
};

export const WRAP_UP_UI_TEXT = {
  dialogue_title: "Stage Manager's Notes",
  dialogue_btn: "Read Show Report →",
  report_title: "Show Report",
  report_subtitle:
    "The house is clear. The ghost light is on. Let's see how we did.",
  score_label: "Professionalism Score",
  cues_label: "Cues Hit / Missed",
  sign_out_btn: "Power Down Console & Go Home",
};

// UX ADDITION: Decoupled praise quotes from the NPCs to display on the HomePage for perfect runs!
export const COMMENDATION_PRAISE = [
  "Des (SM): 'I didn't have to yell over headset once. Unprecedented.'",
  "Bryan (Rigger): 'I'll admit it... you didn't mess up. Good job.'",
  "Zainab (Costumes): 'The lighting actually made my fabrics look good!'",
  "YG (Director): 'A visionary execution of my masterpiece!'",
  "Elara (PM): 'Under budget and perfectly timed. Take tomorrow off.'",
  "Leo (Flyman): 'Smooth as butter on the rail today.'",
  "Richmond (FOH): 'Not a single audience complaint. A miracle.'",
  "Jay (A2): 'Crisp audio, zero feedback. I'm crying tears of joy.'",
];
