/**
 * @file Scoring Engine
 * @description Calculates level performance and star ratings based on session data.
 * 
 * Star Rating System:
 * - **3 Stars**: Excellent performance (score ≥95% max, cue hit rate ≥80%)
 * - **2 Stars**: Good performance (score ≥70% max, cue hit rate ≥60%)
 * - **1 Star**: Completed level (any score/hit rate)
 * 
 * Score Calculation:
 * - Base score from minigame performance (planning, sound_design, stage_management, scenic, wardrobe)
 * - Bonus points from cue hits in cue_execution stage (10 points per hit)
 * - Bonus points from cable_coiling strike stage
 * - Penalties/bonuses from conflict resolution choices
 * - Quest completion bonuses
 * 
 * Design Note: Cable coiling is pure bonus - players who skip it aren't locked out of 3 stars.
 */

import { GameSession } from "../types/game";

/**
 * Calculates the theoretical maximum achievable score for a perfect run.
 * Used as baseline to determine star thresholds (95% for 3-star, 70% for 2-star).
 * 
 * Score Composition:
 * - Planning: +100 (if department is lighting)
 * - Sound Design: +100-150 depending on difficulty
 * - Cue Execution: +10 per base fader cue
 * - Stage Management: +50
 * - Scenic: +200
 * - Wardrobe: +120-300 depending on difficulty
 * 
 * Note: Cable coiling intentionally excluded - it's pure bonus, not required.
 * 
 * @param stages - Array of stage keys in this session
 * @param difficulty - Game difficulty (affects sound/wardrobe scoring)
 * @param baseFaderCues - Number of base cues in cue_execution stage
 * @returns Maximum possible score for this session
 */
function calculateMaxShowScore(
  stages: string[],
  difficulty: string,
  baseFaderCues: number,
): number {
  let maxScore = 0;

  if (stages.includes("planning")) maxScore += 100;

  if (stages.includes("sound_design")) {
    const soundScores: Record<string, number> = {
      professional: 150,
      community: 120,
      school: 100,
    };
    maxScore += soundScores[difficulty] || 100;
  }

  // LOGIC FIX: Isolate the expected points strictly to the Base Fader Cues, so dynamically generated hits from other stages don't inflate this!
  if (stages.includes("cue_execution")) {
    maxScore += baseFaderCues * 10;
  }

  // LOGIC FIX: "cable_coiling" is intentionally omitted from the Max Score calculation.
  // It now acts as pure bonus points, ensuring players who skip strike aren't mathematically locked out of 3 stars!

  if (stages.includes("stage_management")) maxScore += 50;
  if (stages.includes("scenic")) maxScore += 200;
  if (stages.includes("wardrobe")) {
    const laundryScores: Record<string, number> = {
      professional: 300,
      community: 200,
      school: 120,
    };
    maxScore += (laundryScores[difficulty] || 120) + 110;
  }

  return maxScore || 100;
}

/**
 * Determines 1-3 star rating based on session performance.
 * 
 * Rating Logic:
 * - **3 Stars** (excellent): Score ≥95% of max AND cue hit rate ≥80%
 * - **2 Stars** (good): Score ≥70% of max AND cue hit rate ≥60%
 * - **1 Star** (completed): Any other completion
 * - **No rating**: Null/invalid session returns 1 star
 * 
 * @param session - Completed game session with score and cue statistics
 * @param baseFaderCues - Number of base fader cues in cue_execution
 * @param totalCues - Total cues attempted (base + dynamic)
 * @returns Star rating (1, 2, or 3)
 * @example
 * const stars = calculateStars(session, 5, 8);
 * // Returns 2 if score >= 70% and hit rate >= 60%
 */
export function calculateStars(
  session: GameSession | null,
  baseFaderCues: number,
  totalCues: number,
): number {
  if (!session) return 1;

  const { score, stages, cuesHit, difficulty } = session;

  const maxShowScore = calculateMaxShowScore(stages, difficulty, baseFaderCues);
  const hitRate = totalCues > 0 ? cuesHit / totalCues : 1;

  if (score >= maxShowScore * 0.95 && hitRate >= 0.8) return 3;
  if (score >= maxShowScore * 0.7 && hitRate >= 0.6) return 2;
  return 1;
}
