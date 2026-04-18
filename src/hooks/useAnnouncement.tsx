// src/hooks/useAnnouncement.ts
import { useState, useCallback } from "react";

export function useAnnouncement() {
  const [announcement, setAnnouncement] = useState("");

  const announce = useCallback((message: string) => {
    // Set to empty first to ensure screen readers re-announce identical messages
    setAnnouncement("");
    setTimeout(() => setAnnouncement(message), 50);
  }, []);

  /** Component to include in your stage render */
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
