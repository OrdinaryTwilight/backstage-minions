/**
 * Calculates the 1-3 star rating for a completed level.
 * * @param totalCues Total number of cues in the level (if any)
 * @param cuesHit Number of cues successfully hit
 * @param currentScore Total generic points earned in the level
 * @returns 1, 2, or 3 stars
 */
export function calculateStars(
  totalCues: number,
  cuesHit: number,
  currentScore: number,
): number {
  // If the stage relies on cues (Execution/Sound)
  if (totalCues > 0) {
    const hitRate = cuesHit / totalCues;

    // Require BOTH a good hit rate AND a positive overall score to get 3 stars
    // This prevents players from bombing quests but acing the board and getting 3 stars
    if (hitRate >= 0.9 && currentScore >= 100) return 3;
    if (hitRate >= 0.65 && currentScore >= 50) return 2;
    return 1;
  }

  // If the stage relies strictly on score (Planning/Equipment)
  if (currentScore >= 100) return 3;
  if (currentScore >= 50) return 2;
  return 1;
}
