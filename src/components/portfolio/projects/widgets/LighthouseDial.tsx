import { useEffect, useState } from "react";
import { animate } from "motion/react";

/** Animated circular SVG gauges for performance scores with count-up sync and completion glow */
export function LighthouseDial({ score, label }: { score: number; label: string }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [justFinished, setJustFinished] = useState(false);

  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;
  const strokeColor = score >= 90 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";

  useEffect(() => {
    const controls = animate(0, score, {
      duration: 1.1,
      delay: 0.35,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setAnimatedScore(Math.round(v)),
      onComplete: () => {
        setJustFinished(true);
        setTimeout(() => setJustFinished(false), 550);
      },
    });
    return () => controls.stop();
  }, [score]);

  return (
    <div
      style={{ "--dial-glow": `${strokeColor}66` } as React.CSSProperties}
      className={`flex flex-col items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-4 shadow-md transition-all duration-500 hover:border-white/20 ${
        justFinished ? "shadow-[0_0_26px_var(--dial-glow)]" : ""
      }`}
    >
      <div className="relative h-20 w-20">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            className="stroke-white/5"
            strokeWidth="5.5"
            fill="transparent"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            style={{
              stroke: strokeColor,
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
            }}
            strokeWidth="5.5"
            fill="transparent"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-display text-lg font-bold tabular-nums text-foreground">
          {animatedScore}
        </div>
      </div>
      <span className="font-mono text-[9px] uppercase tracking-widest text-subtle">{label}</span>
    </div>
  );
}
