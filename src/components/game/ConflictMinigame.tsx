import { useState } from "react";
import { useGame } from "../../context/GameContext";
import { NPC_ICONS } from "../../data/gameData";
import { Conflict, ConflictChoice } from "../../types/game";
import Button from "../ui/Button";
import HardwarePanel from "../ui/HardwarePanel";
import DialogueBox from "./DialogueBox";

interface ConflictMinigameProps {
  conflict: Conflict;
  onResolved: (outcome: string) => void;
}

export default function ConflictMinigame({ conflict, onResolved }: ConflictMinigameProps) {
  const { dispatch } = useGame();
  const [selectedChoice, setSelectedChoice] = useState<ConflictChoice | null>(null);

  const handleChoice = (choice: ConflictChoice) => {
    dispatch({ type: "MARK_CONFLICT_SEEN", conflictId: conflict.id });
    dispatch({ type: "ADD_SCORE", delta: choice.pointDelta });

    if (choice.sideEffect === "ally_gained") {
      dispatch({ type: "ADD_CONTACT", name: conflict.npc });
    }
    setSelectedChoice(choice);
  };

  return (
    <div className="page-container content-reveal">
      <HardwarePanel style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ color: 'var(--bui-fg-warning)' }}>⚡ Technical Conflict</h2>
        
        {!selectedChoice ? (
          <DialogueBox
            speaker={conflict.npc}
            icon={NPC_ICONS[conflict.npc as keyof typeof NPC_ICONS]}
            text={conflict.description}
            choices={conflict.choices}
            onChoice={handleChoice}
          />
        ) : (
          <div className="animate-pop">
            <h3 style={{ 
              color: selectedChoice.outcome === 'escalated' ? 'var(--bui-fg-danger)' : 'var(--bui-fg-success)',
              marginBottom: '1rem'
            }}>
              RESULT: {selectedChoice.outcome.toUpperCase()}
            </h3>
            <p style={{ lineHeight: 1.6, marginBottom: '2rem', opacity: 0.9 }}>
              {selectedChoice.aftermathText}
            </p>
            <Button variant="accent" onClick={() => onResolved(selectedChoice.outcome)}>
              Resume Technical Operations →
            </Button>
          </div>
        )}
      </HardwarePanel>
    </div>
  );
}