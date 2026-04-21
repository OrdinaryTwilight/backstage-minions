import { GameSession } from "../types/game";

/**
 * Calculates the theoretical maximum "Base Score" achievable by perfectly completing only the required minigames.
 */
function calculateMaxShowScore(
  stages: string[],
  difficulty: string,
  totalCues: number,
): number {
  let maxScore = 0;

  if (stages.includes("planning")) {
    maxScore += 100;
  }

  if (stages.includes("sound_design")) {
    const soundScores: Record<string, number> = {
      professional: 150,
      community: 120,
      school: 100,
    };
    maxScore += soundScores[difficulty] || 100;
  }

  if (stages.includes("cue_execution")) {
    maxScore += totalCues * 10;
  }

  if (stages.includes("cable_coiling")) {
    maxScore += 100;
  }

  // Failsafe in case of empty stage arrays
  return maxScore || 100;
}

/**
 * Calculates the 1-3 star rating for a completed level based on the specific stages the player attempted.
 *
 * @param session The active GameSession state
 * @param totalCues Total number of cues in the level (if any)
 * @returns 1, 2, or 3 stars
 */
export function calculateStars(
  session: GameSession | null,
  totalCues: number,
): number {
  if (!session) return 1;

  const { score, stages, cuesHit, difficulty } = session;

  const maxShowScore = calculateMaxShowScore(stages, difficulty, totalCues);
  const hitRate = totalCues > 0 ? cuesHit / totalCues : 1;

  // 3 STARS: FIX - Adjusted to >= 95% of max score to ensure perfect runs actually award 3 stars without requiring side-quests.
  if (score >= maxShowScore * 0.95 && hitRate >= 0.8) {
    return 3;
  }

  // 2 STARS: Achieved the vast majority of the base minigame objectives
  if (score >= maxShowScore * 0.7 && hitRate >= 0.6) {
    return 2;
  }

  // 1 STAR: Bare minimum completion
  return 1;
}
