import { useCallback, useRef, useState } from "react";
import { useGame } from "../../../context/GameContext";

export type Actor = {
  id: string;
  name: string;
  trait: string;
  requiresRoom?: string;
  avoids?: string;
};
export type Room = { id: string; name: string; capacity: number };

// UX/LOGIC FIX: Added varied puzzle requirements
const PUZZLE_VARIATIONS: Actor[][] = [
  [
    {
      id: "a_lead",
      name: "The Lead",
      trait: "Requires Star Room.",
      requiresRoom: "r_star",
    },
    {
      id: "a_villain",
      name: "The Villain",
      trait: "Refuses to room with the Hero.",
      avoids: "a_hero",
    },
    { id: "a_hero", name: "The Hero", trait: "Standard contract." },
    { id: "a_chorus1", name: "Chorus A", trait: "Standard contract." },
    { id: "a_chorus2", name: "Chorus B", trait: "Standard contract." },
  ],
  [
    {
      id: "a_lead",
      name: "The Lead",
      trait: "Refuses to share with Chorus A.",
      avoids: "a_chorus1",
    },
    { id: "a_villain", name: "The Villain", trait: "Standard contract." },
    {
      id: "a_hero",
      name: "The Hero",
      trait: "Avoids The Villain.",
      avoids: "a_villain",
    },
    { id: "a_chorus1", name: "Chorus A", trait: "Standard contract." },
    {
      id: "a_chorus2",
      name: "Chorus B",
      trait: "Requires Star Room.",
      requiresRoom: "r_star",
    },
  ],
  [
    {
      id: "a_lead",
      name: "The Lead",
      trait: "Avoids Chorus B.",
      avoids: "a_chorus2",
    },
    {
      id: "a_villain",
      name: "The Villain",
      trait: "Requires Star Room.",
      requiresRoom: "r_star",
    },
    {
      id: "a_hero",
      name: "The Hero",
      trait: "Requires Ensemble Room.",
      requiresRoom: "r_ensemble",
    },
    { id: "a_chorus1", name: "Chorus A", trait: "Standard contract." },
    { id: "a_chorus2", name: "Chorus B", trait: "Standard contract." },
  ],
];

const ROOMS: Room[] = [
  { id: "r_star", name: "Star Dressing Room", capacity: 1 },
  { id: "r_ensemble", name: "Ensemble Room", capacity: 3 },
  { id: "r_swing", name: "Swing Closet", capacity: 1 },
];

export function useCallboard(onComplete: () => void) {
  const { dispatch } = useGame();

  // Dynamically select a random puzzle on mount
  const [ACTORS] = useState(
    () =>
      PUZZLE_VARIATIONS[Math.floor(Math.random() * PUZZLE_VARIATIONS.length)],
  );

  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [activeActorId, setActiveActorId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    msg: string;
    isError: boolean;
  } | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const lastCheckedHash = useRef<string>("");

  const assignActorToRoom = useCallback(
    (roomId: string) => {
      if (!activeActorId) return;

      const roomCapacity = ROOMS.find((r) => r.id === roomId)?.capacity || 0;
      const currentOccupants = Object.values(assignments).filter(
        (id) => id === roomId,
      ).length;

      if (
        currentOccupants >= roomCapacity &&
        assignments[activeActorId] !== roomId
      ) {
        setFeedback({
          msg: "That room is at maximum capacity!",
          isError: true,
        });
        return;
      }

      setAssignments((prev) => ({ ...prev, [activeActorId]: roomId }));
      setActiveActorId(null);
      setFeedback({ msg: "Actor assigned.", isError: false });
    },
    [activeActorId, assignments],
  );

  const checkActorValid = useCallback(
    (actor: Actor, room: string, isRepeatError: boolean) => {
      if (actor.requiresRoom && room !== actor.requiresRoom) {
        const targetRoom = ROOMS.find((r) => r.id === actor.requiresRoom)?.name;
        setFeedback({
          msg: `${actor.name} must be in the ${targetRoom}.`,
          isError: true,
        });
        if (!isRepeatError) dispatch({ type: "ADD_SCORE", delta: -10 });
        return false;
      }

      if (actor.avoids) {
        const enemyRoom = assignments[actor.avoids];
        if (room === enemyRoom) {
          setFeedback({
            msg: `Conflict: ${actor.name} cannot share a room with their rival!`,
            isError: true,
          });
          if (!isRepeatError) dispatch({ type: "ADD_SCORE", delta: -10 });
          return false;
        }
      }

      return true;
    },
    [assignments, dispatch],
  );

  const validateCallboard = useCallback(() => {
    const currentHash = JSON.stringify(assignments);
    const isRepeatError = currentHash === lastCheckedHash.current;
    lastCheckedHash.current = currentHash;

    if (Object.keys(assignments).length < ACTORS.length) {
      setFeedback({
        msg: "All actors must be assigned a room before house opens.",
        isError: true,
      });
      return;
    }

    for (const actor of ACTORS) {
      if (!checkActorValid(actor, assignments[actor.id], isRepeatError)) {
        return;
      }
    }

    setFeedback({
      msg: "Callboard is perfect. House is open!",
      isError: false,
    });
    setIsSubmitted(true);
    dispatch({ type: "ADD_SCORE", delta: 50 });
    setTimeout(() => onComplete(), 2000);
  }, [assignments, ACTORS, checkActorValid, dispatch, onComplete]);

  return {
    ACTORS,
    ROOMS,
    assignments,
    activeActorId,
    setActiveActorId,
    assignActorToRoom,
    validateCallboard,
    feedback,
    isSubmitted,
  };
}
