import { useEffect, useState } from "react";
import HardwarePanel from "./HardwarePanel";

interface FaderTrackProps {
  label: string;
  color: string;
  onLevelChange: (level: number) => void;
  currentLevel: number;
}

/**
 * FaderTrack: A professional-grade channel strip.
 * Fixes alignment by using a vertical container with a relative fader slot.
 */
function FaderTrack({ label, color, onLevelChange, currentLevel }: FaderTrackProps) {
  // Simulate active signal flicker for realism
  const [flicker, setFlicker] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFlicker(Math.random() * (currentLevel / 10));
    }, 100);
    return () => clearInterval(interval);
  }, [currentLevel]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      width: '70px', 
      height: '350px', 
      gap: '12px',
      padding: '10px 0',
      background: 'rgba(0,0,0,0.2)',
      borderRadius: '4px',
      border: '1px solid var(--glass-border)'
    }}>
      {/* VU Meter: Indicates signal intensity */}
      <div style={{ width: '8px', height: '50px', background: '#000', border: '1px solid #333', position: 'relative' }}>
        <div style={{ 
          position: 'absolute', 
          bottom: 0, 
          width: '100%', 
          height: `${Math.min(currentLevel + flicker, 100)}%`, 
          background: currentLevel > 90 ? '#ef4444' : '#22c55e',
          transition: 'height 0.1s ease'
        }} />
      </div>

      {/* Fader Track: Fixed alignment logic */}
      <div style={{ 
        position: 'relative', 
        height: '220px', 
        width: '6px', 
        background: '#111', 
        border: '1px solid #444', 
        borderRadius: '3px' 
      }}>
        <input 
          type="range" 
          min="0" max="100" 
          value={currentLevel} 
          onChange={(e) => onLevelChange(parseInt(e.target.value))}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '220px', // Matches track height
            transform: 'translate(-50%, -50%) rotate(-90deg)', // Perfect vertical rotation
            cursor: 'ns-resize',
            appearance: 'none',
            background: 'transparent',
            zIndex: 10,
            touchAction: "none", // CRITICAL: Prevents browser scroll during drag
            WebkitUserSelect: "none",
            userSelect: "none"
          }}
          onTouchStart={(e) => e.stopPropagation()}
        />
        {/* Visual Fader Cap Overlay */}
        <div style={{
          position: 'absolute',
          left: '50%',
          bottom: `${currentLevel}%`,
          width: '30px',
          height: '40px',
          background: '#444',
          border: '2px solid #666',
          borderRadius: '3px',
          transform: 'translate(-50%, 50%)',
          pointerEvents: 'none',
          boxShadow: '0 4px 8px rgba(0,0,0,0.5)'
        }} />
      </div>

      <span className="annotation-text" style={{ fontSize: '0.65rem', color, textAlign: 'center' }}>
        {label}
      </span>
    </div>
  );
}

interface DepartmentMixerProps {
  department?: string;
  levels: number[];
  setLevels: (levels: number[]) => void;
}

export default function DepartmentMixer({ department, levels, setLevels }: DepartmentMixerProps) {
  const channels = department === 'lighting' 
    ? ['WASH', 'CYC', 'SPOT', 'KEYS']
    : ['VOX', 'PIT', 'SFX', 'BAND'];

  return (
    <HardwarePanel style={{ 
      display: 'flex', 
      justifyContent: 'space-around', 
      padding: '25px 15px', 
      background: 'linear-gradient(180deg, #151515, #0a0a0a)',
      borderTop: '4px solid var(--color-architect-blue)'
    }}>
      {channels.map((ch, i) => (
        <FaderTrack 
          key={ch} 
          label={ch} 
          color="var(--color-architect-blue)" 
          currentLevel={levels[i]}
          onLevelChange={(val) => {
            const newLevels = [...levels];
            newLevels[i] = val;
            setLevels(newLevels);
          }}
        />
      ))}
      
      {/* MASTER SECTION */}
      <div style={{ borderLeft: '1px solid #333', paddingLeft: '15px' }}>
        <FaderTrack 
          label="MASTER" 
          color="var(--bui-fg-success)" 
          currentLevel={levels[4]}
          onLevelChange={(val) => {
            const newLevels = [...levels];
            newLevels[4] = val;
            setLevels(newLevels);
          }}
        />
      </div>
    </HardwarePanel>
  );
}