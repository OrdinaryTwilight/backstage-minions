/**
 * Custom Hooks for Data Access
 * 
 * Centralizes data lookups and case-normalization logic to prevent
 * duplication across components. Ensures consistency when searching for
 * productions, characters, and cue sheets.
 */

import { useMemo } from "react";
import { CHARACTERS, CUE_SHEETS, PRODUCTIONS } from "../data/gameData";
import { Character, Cue, Production } from "../types/game";

/**
 * useProduction: Fetch a production by ID with case-insensitive lookup
 * 
 * @param productionId - The production ID to search for
 * @returns The production object or undefined
 * 
 * @example
 * const production = useProduction(productionId);
 * if (!production) return <Navigate to="/" />;
 */
export function useProduction(productionId: string | undefined): Production | undefined {
  return useMemo(() => {
    if (!productionId) return undefined;
    return PRODUCTIONS.find(
      (p) => p.id.toLowerCase() === productionId.toLowerCase()
    );
  }, [productionId]);
}

/**
 * useCharacter: Fetch a character by ID with case-insensitive lookup
 * 
 * @param characterId - The character ID to search for
 * @returns The character object or undefined
 * 
 * @example
 * const character = useCharacter(charId);
 * if (!character) return <Navigate to="/" />;
 */
export function useCharacter(characterId: string | undefined): Character | undefined {
  return useMemo(() => {
    if (!characterId) return undefined;
    return CHARACTERS.find(
      (c) => c.id.toLowerCase() === characterId.toLowerCase()
    );
  }, [characterId]);
}

/**
 * useCueSheet: Fetch the cue sheet for a production and department
 * 
 * @param productionId - The production ID
 * @param department - The department ("lighting" or "sound")
 * @returns Array of cues or empty array if not found
 * 
 * @example
 * const cues = useCueSheet(production.id, character.department);
 */
export function useCueSheet(
  productionId: string | undefined,
  department: string | undefined
): Cue[] {
  return useMemo(() => {
    if (!productionId || !department) return [];
    return CUE_SHEETS[productionId]?.[department] || [];
  }, [productionId, department]);
}

/**
 * useProductionLevel: Fetch details about a specific production level
 * 
 * @param productionId - The production ID
 * @param difficulty - The difficulty level ("school", "community", or "professional")
 * @returns The level details or undefined if not found
 * 
 * @example
 * const levelDetails = useProductionLevel(productionId, difficulty);
 * if (!levelDetails?.unlocked) return <Locked />;
 */
export function useProductionLevel(
  productionId: string | undefined,
  difficulty: string | undefined
) {
  const production = useProduction(productionId);
  
  return useMemo(() => {
    if (!production || !difficulty) return undefined;
    return production.levels?.[difficulty as keyof typeof production.levels];
  }, [production, difficulty]);
}

/**
 * useCharacterForDepartment: Find a character by department filter
 * Useful for filtering characters in selection screens
 * 
 * @param department - The department to filter by ("lighting" or "sound")
 * @returns Array of characters in that department
 * 
 * @example
 * const lightingTeam = useCharacterForDepartment("lighting");
 */
export function useCharacterForDepartment(
  department: string | undefined
): Character[] {
  return useMemo(() => {
    if (!department) return [];
    return CHARACTERS.filter((c) => c.department === department);
  }, [department]);
}

/**
 * Custom hook to centralize technical data lookups and normalization.
 * Using a NAMED EXPORT to ensure compatibility with GameLevelPage.
 */
export function useGameData(productionId?: string, charId?: string) {
  const production = useMemo(() => {
    if (!productionId) return null;
    return PRODUCTIONS.find(p => p.id.toLowerCase() === productionId.toLowerCase());
  }, [productionId]);

  const char = useMemo(() => {
    if (!charId) return null;
    return CHARACTERS.find(c => c.id.toLowerCase() === charId.toLowerCase());
  }, [charId]);

  const departmentCues = useMemo((): Cue[] => {
    if (!production || !char) return [];
    return CUE_SHEETS[production.id]?.[char.department] || [];
  }, [production, char]);

  return { production, char, departmentCues };
}
