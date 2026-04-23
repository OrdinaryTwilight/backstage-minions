/**
 * @file useKeyPress Hook
 * @description Tracks keyboard input state for detecting when specific keys are pressed.
 * Used for keyboard-driven game mechanics (e.g., cue timing in CueExecutionStage).
 */

import { useEffect, useState } from "react";

/**
 * Hook to detect if any of the target keys are currently pressed.
 *
 * Monitors keydown/keyup events and resets on window blur.
 * Useful for time-sensitive game mechanics that need real-time input state.
 *
 * @param targetKeys - Array of key strings to monitor (e.g., [" ", "Enter"])
 * @returns Boolean: true if any target key is currently pressed, false otherwise
 * @example
 * const isSpacePressed = useKeyPress([" "]);
 * useEffect(() => {
 *   if (isSpacePressed) {
 *     // Player is holding space - advance cue timing
 *   }
 * }, [isSpacePressed]);
 */
export function useKeyPress(targetKeys: string[]): boolean {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = (e: KeyboardEvent) => {
      if (targetKeys.includes(e.key)) {
        setKeyPressed(true);
      }
    };

    const upHandler = (e: KeyboardEvent) => {
      if (targetKeys.includes(e.key)) {
        setKeyPressed(false);
      }
    };

    const resetHandler = () => {
      setKeyPressed(false);
    };

    globalThis.addEventListener("keydown", downHandler);
    globalThis.addEventListener("keyup", upHandler);
    globalThis.addEventListener("blur", resetHandler);

    return () => {
      globalThis.removeEventListener("keydown", downHandler);
      globalThis.removeEventListener("keyup", upHandler);
      globalThis.removeEventListener("blur", resetHandler);
    };
  }, [targetKeys]);

  return keyPressed;
}
