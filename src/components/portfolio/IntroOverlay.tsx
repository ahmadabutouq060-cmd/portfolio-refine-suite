import { useEffect, useState } from "react";

const INTRO_DURATION = 1100; // name animation + brief hold
const FADE_DURATION = 300; // overlay fade-out

export function IntroOverlay() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const intro = reduced ? 450 : INTRO_DURATION;
    const fade = reduced ? 200 : FADE_DURATION;
    const t1 = window.setTimeout(() => setLeaving(true), intro);
    const t2 = window.setTimeout(() => setVisible(false), intro + fade);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`intro-overlay${leaving ? " is-leaving" : ""}`}
      aria-hidden="true"
    >
      <div className="intro-glow" />
      <h2 className="intro-name">
        <span className="intro-line intro-first">AHMAD</span>
        <span className="intro-line intro-last">ABU TOUQ</span>
      </h2>
    </div>
  );
}
