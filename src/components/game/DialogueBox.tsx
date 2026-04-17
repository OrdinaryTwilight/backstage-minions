import { ConflictChoice } from "../../types/game";
import Button from "../ui/Button";

/**
 * Base interface for any choice used in a DialogueBox.
 * Ensures the component can at least render the text and track the key.
 */
export interface DialogueBoxChoice {
  id: string;
  text: string;
}

interface DialogueBoxProps {
  speaker: string;
  text: string;
  choices: ConflictChoice[];
  onChoice: (choice: ConflictChoice) => void;
  icon?: string;
}

/**
 * DialogueBox: A generic technical terminal for NPC interactions.
 * Uses <T> to allow specialized choice objects to pass through.
 */
export default function DialogueBox({ speaker, text, choices, onChoice, icon }: DialogueBoxProps) {
  return (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      <div style={{ fontSize: '4rem', background: 'var(--glass-bg)', padding: '1.5rem', borderRadius: '12px' }}>
        {icon || "👤"}
      </div>
      
      <div style={{ flex: 1 }}>
        <h3 style={{ color: 'var(--bui-fg-info)', marginBottom: '0.5rem' }}>{speaker}</h3>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', fontStyle: 'italic' }}>"{text}"</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {choices.map((choice) => (
            <Button 
              key={choice.id} 
              onClick={() => onChoice(choice)}
              style={{ textAlign: 'left', justifyContent: 'flex-start' }}
            >
              {choice.text}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}