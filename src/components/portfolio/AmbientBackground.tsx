import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  base: number;
  layer: 0 | 1 | 2;
  diamond: boolean;
  pulse: number;
  pulseSpeed: number;
  glow: number;
};

const LAYERS = [
  { count: 0.00006, size: [0.6, 1.2], speed: 0.045, alpha: 0.22 },
  { count: 0.00005, size: [1.0, 1.9], speed: 0.085, alpha: 0.32 },
  { count: 0.00004, size: [1.6, 2.9], speed: 0.14, alpha: 0.46 },
] as const;

const RADIUS = 130;

export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let raf = 0;
    let running = true;
    let time = 0;
    const pointer = { x: -9999, y: -9999, active: false };

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    const build = () => {
      particles = [];
      const area = width * height;
      LAYERS.forEach((layer, index) => {
        const count = Math.min(120, Math.round(area * layer.count));
        for (let i = 0; i < count; i += 1) {
          const size = rand(layer.size[0], layer.size[1]);
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: rand(-layer.speed, layer.speed),
            vy: rand(-layer.speed, layer.speed * 0.35) - layer.speed * 0.25,
            size,
            base: size,
            layer: index as 0 | 1 | 2,
            diamond: index === 2 ? Math.random() < 0.75 : Math.random() < 0.2,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: rand(0.004, 0.012),
            glow: 0,
          });
        }
      });
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const drawBeams = (t: number) => {
      const beams = [
        { x: 0.72, hue: "56, 189, 248", w: 0.34, drift: 0.06, alpha: 0.1 },
        { x: 0.34, hue: "59, 130, 246", w: 0.28, drift: -0.05, alpha: 0.075 },
        { x: 0.95, hue: "129, 140, 248", w: 0.24, drift: 0.04, alpha: 0.055 },
      ];
      ctx.save();
      for (const beam of beams) {
        const offset = Math.sin(t * beam.drift) * width * 0.05;
        const cx = beam.x * width + offset;
        ctx.save();
        ctx.translate(cx, height * 0.5);
        ctx.rotate((19 * Math.PI) / 180);
        const w = beam.w * width;
        const gradient = ctx.createLinearGradient(0, -height, 0, height);
        gradient.addColorStop(0, `rgba(${beam.hue}, 0)`);
        gradient.addColorStop(0.45, `rgba(${beam.hue}, ${beam.alpha})`);
        gradient.addColorStop(1, `rgba(${beam.hue}, 0)`);
        ctx.filter = "blur(46px)";
        ctx.fillStyle = gradient;
        ctx.fillRect(-w / 2, -height, w, height * 2);
        ctx.restore();
      }
      ctx.restore();
      ctx.filter = "none";
    };

    const drawParticle = (p: Particle, intensity: number, density: number) => {
      const layerAlpha = LAYERS[p.layer].alpha;
      const pulse = 0.75 + Math.sin(p.pulse) * 0.25;
      const alpha = Math.min(1, layerAlpha * pulse * density * (1 + intensity * 1.6));
      const size = p.base * (1 + intensity * 0.6);

      if (intensity > 0.02) {
        ctx.shadowBlur = 8 + intensity * 14;
        ctx.shadowColor = `rgba(56, 189, 248, ${0.45 * intensity})`;
      } else {
        ctx.shadowBlur = 0;
      }

      // gray/blue at rest -> cyan/electric blue near the pointer
      const r = Math.round(176 + (56 - 176) * intensity);
      const g = Math.round(196 + (211 - 196) * intensity);
      const b = Math.round(222 + (248 - 222) * intensity);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;

      if (p.diamond) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-size, -size, size * 2, size * 2);
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };

    const frame = () => {
      if (!running) return;
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      const reduced = motionQuery.matches;
      // Hero keeps the fullest atmosphere; lower sections fade back.
      const scrolled = window.scrollY;
      const density = Math.max(0.42, 1 - scrolled / (height * 1.8));

      drawBeams(reduced ? 0 : time);

      for (const p of particles) {
        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;
          p.pulse += p.pulseSpeed;

          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          if (p.y > height + 20) p.y = -20;
        }

        let target = 0;
        if (!reduced && pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < RADIUS) {
            target = 1 - dist / RADIUS;
            if (dist > 0.001) {
              const push = target * target * 0.5;
              p.x += (dx / dist) * push;
              p.y += (dy / dist) * push;
            }
          }
        }
        // smooth interpolation back and forth
        p.glow += (target - p.glow) * 0.08;
        drawParticle(p, p.glow, density);
      }

      raf = requestAnimationFrame(frame);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !finePointer.matches) return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };

    resize();
    raf = requestAnimationFrame(frame);

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="ambient-bg" aria-hidden="true">
      <canvas ref={canvasRef} className="ambient-canvas" />
    </div>
  );
}
