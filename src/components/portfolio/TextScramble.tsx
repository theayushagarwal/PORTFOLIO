import { useState, useEffect } from "react";

export function TextScramble({
  text,
  delay = 0,
  trigger = true,
}: {
  text: string;
  delay?: number;
  trigger?: boolean;
}) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    if (!trigger) return;
    let isMounted = true;
    const chars = "!<>-_\\/[]{}—=+*^?#_abcdefghijklmnopqrstuvwxyz";
    let frame = 0;
    const queue: { from: string; to: string; start: number; end: number; char?: string }[] = [];

    // Initialize queue with target chars and randomized start/end frames
    for (let i = 0; i < text.length; i++) {
      const from = chars[Math.floor(Math.random() * chars.length)];
      const to = text[i];
      const start = Math.floor(Math.random() * 25);
      const end = start + Math.floor(Math.random() * 25) + 8;
      queue.push({ from, to, start, end });
    }

    let timer: number;
    const update = () => {
      let output = "";
      let complete = 0;
      for (let i = 0; i < queue.length; i++) {
        const item = queue[i];
        if (frame >= item.end) {
          complete++;
          output += item.to;
        } else if (frame >= item.start) {
          if (!item.char || Math.random() < 0.28) {
            item.char = chars[Math.floor(Math.random() * chars.length)];
          }
          output += item.char;
        } else {
          output += item.from;
        }
      }

      if (isMounted) {
        setDisplayText(output);
      }

      if (complete === queue.length) {
        return;
      }

      frame++;
      timer = requestAnimationFrame(update);
    };

    const timeout = setTimeout(() => {
      update();
    }, delay * 1000);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      cancelAnimationFrame(timer);
    };
  }, [text, delay, trigger]);

  return <span>{displayText}</span>;
}
