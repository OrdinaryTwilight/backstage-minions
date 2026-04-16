export default function DepartmentMixer({ department, active, progress }) {
  // Generate 4 fader channels for the visual interface
  const channels = [1, 2, 3, 4];

  return (
    <div className="mixer-board">
      {channels.map((ch, i) => {
        // Lighting visually crossfades based on show progress
        // Sound visually bounces randomly if the show is active to simulate EQ levels
        const isSound = department === "sound";
        const inlineStyle = isSound
          ? { animationDelay: `${i * 0.2}s` } // Offset the bouncing so they don't move together
          : { bottom: `${Math.min((progress + i * 10) % 100, 90)}%` }; // Lighting smoothly slides

        return (
          <div key={`ch-${ch}`} className="fader-channel">
            <div className="fader-track">
              <div
                className={`fader-knob ${active && isSound ? "audio-active" : ""}`}
                style={inlineStyle}
              />
            </div>

            <div
              style={{
                fontSize: "0.6rem",
                color: "#666",
                fontWeight: "bold",
                marginTop: "0.5rem",
              }}
            >
              {isSound ? `CH ${ch}` : `SUB ${ch}`}
            </div>

            {/* Lighting boards usually have bump/flash buttons under faders */}
            {!isSound && <button className="bump-button" />}
          </div>
        );
      })}
    </div>
  );
}
