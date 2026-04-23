import { GameSession } from "../types/game";

/**
 * Calculates the theoretical maximum "Base Score" achievable by perfectly completing only the required minigames.
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
 * Calculates the 1-3 star rating for a completed level.
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
