import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  label?: string;
  isSquare?: boolean;
}

interface Pulse {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
  color: string;
}

interface Wave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

const TECH_GLYPHS = ["VURLO", "VELTRIX", "VCENTRE", "18+", "400ms", "AI", "v2.0", "SYS_OK", "99.9%"];

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let dpr = 1;

    const updateSize = () => {
      const parent = canvas.parentElement;
      const w = parent ? parent.getBoundingClientRect().width : window.innerWidth;
      const h = parent ? parent.getBoundingClientRect().height : window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = (w || window.innerWidth) * dpr;
      canvas.height = (h || Math.max(window.innerHeight, 600)) * dpr;
      canvas.style.width = `${w || window.innerWidth}px`;
      canvas.style.height = `${h || Math.max(window.innerHeight, 600)}px`;

      ctx.scale(dpr, dpr);
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(canvas);

    const handleVisibilityChange = () => {
      if (document.hidden) isVisible = false;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    let cssWidth = canvas.width / dpr;
    let cssHeight = canvas.height / dpr;

    const mouse = { x: cssWidth / 2, y: cssHeight / 2, targetX: cssWidth / 2, targetY: cssHeight / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    const waves: Wave[] = [];

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      waves.push({
        x: clickX,
        y: clickY,
        radius: 5,
        maxRadius: Math.min(cssWidth, cssHeight) * 0.48,
        alpha: 0.95,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    // Cyan & Violet Dual-Tone Palette
    const COLORS = [
      "rgba(0, 240, 255, ",   // Laser Cyan
      "rgba(168, 85, 247, ",  // Deep Violet
      "rgba(56, 189, 248, ",   // Electric Cyan-Blue
      "rgba(192, 132, 252, ",  // Neon Violet Flare
      "rgba(255, 255, 255, ",  // Starlight White
    ];

    const isMobile = (cssWidth || window.innerWidth) < 768;
    const nodeCount = isMobile ? 28 : 68;
    const nodes: Node[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const hasLabel = i < TECH_GLYPHS.length;
      nodes.push({
        x: Math.random() * (cssWidth || 1200),
        y: Math.random() * (cssHeight || 800),
        z: Math.random() * 2 + 0.8,
        vx: (Math.random() - 0.5) * (isMobile ? 0.4 : 0.65),
        vy: (Math.random() - 0.5) * (isMobile ? 0.4 : 0.65),
        radius: Math.random() * 3.2 + 1.8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: Math.random() * 0.5 + 0.45,
        label: hasLabel ? TECH_GLYPHS[i] : undefined,
        isSquare: i % 4 === 0,
      });
    }

    const pulses: Pulse[] = [];

    const spawnPulse = () => {
      if (nodes.length < 2) return;
      const fromIndex = Math.floor(Math.random() * nodes.length);
      let toIndex = -1;
      let minDistance = isMobile ? 130 : 170;

      for (let j = 0; j < nodes.length; j++) {
        if (j === fromIndex) continue;
        const dx = nodes[fromIndex].x - nodes[j].x;
        const dy = nodes[fromIndex].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDistance && Math.random() > 0.25) {
          minDistance = dist;
          toIndex = j;
        }
      }

      if (toIndex !== -1) {
        pulses.push({
          fromIndex,
          toIndex,
          progress: 0,
          speed: 0.022 + Math.random() * 0.025,
          color: Math.random() > 0.5 ? "rgba(0, 240, 255, " : "rgba(192, 132, 252, ",
        });
      }
    };

    let time = 0;

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      if (!isVisible) return;

      time += 0.03;
      cssWidth = canvas.width / dpr;
      cssHeight = canvas.height / dpr;

      if (Math.random() < 0.11 && pulses.length < (isMobile ? 6 : 14)) {
        spawnPulse();
      }

      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, cssWidth, cssHeight);

      // --- DUAL-TONE CYAN & VIOLET AMBIENT NEBULA ORBS ---
      // Left Cyan Spotlight
      const orb1X = cssWidth * 0.22 + Math.sin(time * 0.4) * 40;
      const orb1Y = cssHeight * 0.35 + Math.cos(time * 0.4) * 30;
      const grad1 = ctx.createRadialGradient(orb1X, orb1Y, 0, orb1X, orb1Y, 380);
      grad1.addColorStop(0, "rgba(0, 240, 255, 0.20)");
      grad1.addColorStop(0.6, "rgba(56, 189, 248, 0.08)");
      grad1.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      // Right Violet Spotlight
      const orb2X = cssWidth * 0.78 + Math.cos(time * 0.35) * 40;
      const orb2Y = cssHeight * 0.45 + Math.sin(time * 0.35) * 30;
      const grad2 = ctx.createRadialGradient(orb2X, orb2Y, 0, orb2X, orb2Y, 400);
      grad2.addColorStop(0, "rgba(168, 85, 247, 0.22)");
      grad2.addColorStop(0.6, "rgba(192, 132, 252, 0.09)");
      grad2.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      // Mouse Intersecting Dual Spotlight (Soft & Subtle)
      const spotlightGrad = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        220
      );
      spotlightGrad.addColorStop(0, "rgba(168, 85, 247, 0.12)");
      spotlightGrad.addColorStop(0.5, "rgba(0, 240, 255, 0.05)");
      spotlightGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = spotlightGrad;
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      // --- CLICK SHOCKWAVE RIPPLES ---
      for (let i = waves.length - 1; i >= 0; i--) {
        const wave = waves[i];
        wave.radius += 5;
        wave.alpha *= 0.95;

        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 240, 255, ${wave.alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius * 0.8, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(192, 132, 252, ${wave.alpha * 0.7})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        for (let j = 0; j < nodes.length; j++) {
          const n = nodes[j];
          const dx = n.x - wave.x;
          const dy = n.y - wave.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (Math.abs(dist - wave.radius) < 32) {
            n.x += (dx / (dist || 1)) * 3.5;
            n.y += (dy / (dist || 1)) * 3.5;
          }
        }

        if (wave.alpha < 0.02 || wave.radius > wave.maxRadius) {
          waves.splice(i, 1);
        }
      }

      // --- GEOMETRIC CONSTELLATION LINES ---
      const maxDist = isMobile ? 115 : 150;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.35;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(192, 132, 252, ${lineAlpha})`;
            ctx.lineWidth = 1.1;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // --- SIGNAL PULSES ---
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        pulse.progress += pulse.speed;

        const from = nodes[pulse.fromIndex];
        const to = nodes[pulse.toIndex];

        if (from && to) {
          const px = from.x + (to.x - from.x) * pulse.progress;
          const py = from.y + (to.y - from.y) * pulse.progress;

          ctx.beginPath();
          const pulseGrad = ctx.createRadialGradient(px, py, 0, px, py, 7);
          pulseGrad.addColorStop(0, "rgba(255, 255, 255, 1)");
          pulseGrad.addColorStop(0.5, `${pulse.color}0.95)`);
          pulseGrad.addColorStop(1, `${pulse.color}0)`);
          ctx.fillStyle = pulseGrad;
          ctx.arc(px, py, 7, 0, Math.PI * 2);
          ctx.fill();
        }

        if (pulse.progress >= 1) {
          pulses.splice(i, 1);
        }
      }

      // --- CYAN & VIOLET NODES & GLYPHS ---
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        const mdx = mouse.x - n.x;
        const mdy = mouse.y - n.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 180) {
          const force = (180 - mdist) / 180;
          n.x -= (mdx / mdist) * force * 1.3 * n.z;
          n.y -= (mdy / mdist) * force * 1.3 * n.z;
        }

        n.x += n.vx * n.z;
        n.y += n.vy * n.z;

        if (n.x < 0) n.x = cssWidth;
        if (n.x > cssWidth) n.x = 0;
        if (n.y < 0) n.y = cssHeight;
        if (n.y > cssHeight) n.y = 0;

        const currentRadius = n.radius + Math.sin(time * 3 + i) * 1.0;

        if (n.isSquare) {
          ctx.fillStyle = `${n.color}${n.alpha})`;
          ctx.fillRect(n.x - currentRadius, n.y - currentRadius, currentRadius * 2, currentRadius * 2);
        } else {
          ctx.beginPath();
          const pGrad = ctx.createRadialGradient(
            n.x,
            n.y,
            0,
            n.x,
            n.y,
            currentRadius * 4
          );
          pGrad.addColorStop(0, `${n.color}${n.alpha})`);
          pGrad.addColorStop(0.4, `${n.color}${n.alpha * 0.5})`);
          pGrad.addColorStop(1, `${n.color}0)`);

          ctx.fillStyle = pGrad;
          ctx.arc(n.x, n.y, currentRadius * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        if (n.label) {
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillStyle = `rgba(0, 240, 255, ${n.alpha * 0.9})`;
          ctx.fillText(n.label, n.x + 8, n.y + 3);
        }
      }
    };

    render();

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-100"
      aria-hidden
    />
  );
}
