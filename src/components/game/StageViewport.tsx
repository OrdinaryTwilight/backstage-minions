interface StageViewportProps {
  lights: any[];
  cues: any[];
  currentCueIndex: number;
}

export default function StageViewport({ lights = [], cues = [], currentCueIndex }: StageViewportProps) {
  const currentCue = cues[currentCueIndex];

  return (
    <div className="stage-viewport tech-glow" style={{ marginBottom: '2rem' }}>
      <div className="booth-frame" style={{ position: 'relative', height: '200px', background: '#050505', border: '2px solid #333', overflow: 'hidden' }}>
        <div className="stage-floor" style={{ position: 'absolute', bottom: 0, width: '100%', height: '20px', background: '#111' }} />
        
        {lights.map((l, i) => (
          <div key={i} className={`beam beam-${l.typeId}`} style={{ 
            position: 'absolute', left: `${(i % 5) * 20 + 10}%`, top: 0, width: '15%', height: '100%',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', opacity: 0.3 
          }} />
        ))}
        
        <div className="viewport-overlay" style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', display: 'flex', justifyContent: 'space-between' }}>
          <span className="annotation-text" style={{ fontSize: '0.6rem' }}>[ LIVE_FEED_CAM_01 ]</span>
          {currentCue && <span className="annotation-text" style={{ fontSize: '0.6rem', color: 'var(--bui-fg-warning)' }}>ACTIVE_CUE: {currentCue.id}</span>}
        </div>
      </div>
    </div>
  );
}