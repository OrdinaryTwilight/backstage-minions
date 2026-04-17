import { useState } from "react";
import { useGame } from "../../context/GameContext";
import { SCORING } from "../../data/constants";
import { AUDIO_TYPES, PLOT_GRID_COLS, PLOT_GRID_ROWS } from "../../data/gameData";
import Button from "../ui/Button";
import HardwarePanel from "../ui/HardwarePanel";
import SectionHeader from "../ui/SectionHeader";

/**
 * SoundDesignStage: A technical interface for audio engineers to map venue acoustics.
 */
export default function SoundDesignStage({ onComplete }) {
  const { dispatch } = useGame();
  const [selectedType, setSelectedType] = useState(AUDIO_TYPES[0].id);
  const [grid, setGrid] = useState(() => Array(PLOT_GRID_ROWS * PLOT_GRID_COLS).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const placedCount = grid.filter(Boolean).length;
  const isFail = submitted && placedCount < 3;

  function placeNode(i) {
    if (submitted) return;
    setGrid((g) => {
      const copy = [...g];
      copy[i] = copy[i]?.typeId === selectedType ? null : { typeId: selectedType };
      return copy;
    });
  }

  function submit() {
    const score = Math.min(placedCount * SCORING.PLANNING_PER_FIXTURE, SCORING.PLANNING_MAX);
    dispatch({ type: "ADD_SCORE", delta: score });
    setSubmitted(true);
  }

  return (
    <div className="page-container animate-blueprint">
      <SectionHeader 
        title="Acoustic Mapping" 
        subtitle="Map signal routing and simulate sound pressure levels in the auditorium." 
      />

      <div className="desktop-two-column">
        {/* LEFT PANEL: Patch Grid */}
        <div className="desktop-col-main">
          <HardwarePanel style={{ borderLeft: "4px solid var(--bui-fg-info)" }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: `repeat(${PLOT_GRID_COLS}, 1fr)`, 
              gap: "10px" 
            }}>
              {grid.map((cell, i) => {
                const at = cell ? AUDIO_TYPES.find((t) => t.id === cell.typeId) : null;
                return (
                  <button 
                    key={i} 
                    onClick={() => placeNode(i)} 
                    className="plot-cell" 
                    style={{
                      background: at ? `${at.color}22` : "rgba(0,0,0,0.1)",
                      borderColor: at ? at.color : "var(--glass-border)",
                      aspectRatio: "1.1"
                    }}
                  >
                    {at ? at.icon : ""}
                  </button>
                );
              })}
            </div>

            {/* Hardware Palette */}
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '8px' }}>
              {AUDIO_TYPES.map(t => (
                <Button 
                  key={t.id} 
                  onClick={() => setSelectedType(t.id)} 
                  style={{
                    flex: 1, 
                    borderColor: selectedType === t.id ? t.color : ""
                  }}
                >
                  {t.icon} {t.label}
                </Button>
              ))}
            </div>
          </HardwarePanel>
        </div>

        {/* RIGHT PANEL: Live Acoustic Heatmap */}
        <div className="desktop-col-side">
          <HardwarePanel style={{ 
            height: "100%", 
            background: "#080808", 
            position: 'relative' 
          }}>
            <div className="annotation-text" style={{ fontSize: '0.7rem', opacity: 0.5 }}>
              [SIGNAL_HEATMAP_RENDER]
            </div>
            
            <div style={{ position: 'relative', height: '320px', marginTop: '1rem' }}>
              {/* Stage Reference Lines */}
              <div style={{ 
                position: 'absolute', 
                bottom: '15px', 
                left: '10%', 
                right: '10%', 
                height: '1px', 
                background: 'var(--color-architect-blue)', 
                opacity: 0.2 
              }} />
              
              {/* Pulsing Sound Waves */}
              {grid.map((cell, i) => {
                if (!cell) return null;
                const type = AUDIO_TYPES.find(t => t.id === cell.typeId);
                const col = i % PLOT_GRID_COLS;
                const row = Math.floor(i / PLOT_GRID_COLS);
                
                return (
                  <div 
                    key={i} 
                    className="animate-pulse-go" 
                    style={{
                      position: 'absolute',
                      left: `${(col / (PLOT_GRID_COLS - 1)) * 90 + 5}%`,
                      top: `${(row / (PLOT_GRID_ROWS - 1)) * 80 + 10}%`,
                      width: '80px', 
                      height: '80px',
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${type.color}44 0%, transparent 75%)`,
                      transform: 'translate(-50%, -50%)',
                      border: `1px dashed ${type.color}22`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <span style={{ fontSize: '1.2rem', opacity: 0.8 }}>{type.icon}</span>
                  </div>
                );
              })}
            </div>
            {placedCount < 3 && (
              <p className="annotation-text" style={{ 
                textAlign: 'center', 
                fontSize: '0.7rem', 
                color: 'var(--bui-fg-danger)', 
                marginTop: '1rem' 
              }}>
                [ ALERT: PHASE CANCELLATION DETECTED ]
              </p>
            )}
          </HardwarePanel>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        {!submitted ? (
          <Button variant="success" onClick={submit} style={{ width: '100%' }}>
            Initialize Audio Patch
          </Button>
        ) : (
          <HardwarePanel className="animate-pop">
            <h3 className="annotation-text" style={{ 
              color: isFail ? 'var(--bui-fg-danger)' : 'var(--bui-fg-success)' 
            }}>
              {isFail ? "⚠️ SIGNAL FAILURE" : "✅ SONIC LINK ESTABLISHED"}
            </h3>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <Button onClick={() => setSubmitted(false)}>Re-Patch Gear</Button>
              {!isFail && <Button variant="accent" onClick={onComplete}>Start Rehearsal</Button>}
            </div>
          </HardwarePanel>
        )}
      </div>
    </div>
  );
}