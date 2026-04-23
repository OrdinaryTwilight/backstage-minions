/**
 * @file useAnnouncement Hook
 * @description Provides screen reader announcements for game state changes.
 * Essential for accessibility - announces important game events to users with visual impairments.
 * 
 * WCAG Compliance:
 * - Uses aria-live="polite" for non-urgent announcements
 * - Uses aria-atomic="true" for complete message atomicity
 * - Uses sr-only to hide from visual display
 * - Clears then re-announces to trigger screen reader re-reads of identical messages
 */

import { useState, useCallback } from "react";

/**
 * Hook to manage screen reader announcements during gameplay.
 * 
 * Usage:
 * 1. Call hook to get announce function and AnnouncementRegion component
 * 2. Include AnnouncementRegion in component render
 * 3. Call announce() whenever you need to notify players of important events
 * 
 * Technical Detail: Clears announcement and re-sets with 50ms delay to ensure
 * screen readers re-announce messages (even if identical to previous announcement).
 * 
 * @returns Object with announce function and AnnouncementRegion component
 * @example
 * const { announce, AnnouncementRegion } = useAnnouncement();
 * announce("Cue missed! Stress +5");
 */
export function useAnnouncement() {
  const [announcement, setAnnouncement] = useState("");

  const announce = useCallback((message: string) => {
    // Set to empty first to ensure screen readers re-announce identical messages
    setAnnouncement("");
    setTimeout(() => setAnnouncement(message), 50);
  }, []);

  /** Render this component in your stage to display accessibility announcements */
  const AnnouncementRegion = () => (
    <div
      className="sr-only"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: "0",
        overflow: "hidden",
        clip: "rect(0,0,0,0)",
        border: "0",
      }}
    >
      {announcement}
    </div>
  );

  return { announce, AnnouncementRegion };
}
