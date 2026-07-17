# Project Memory & Decisions

This is a living document of architectural decisions, visual preferences, and past debugging lessons for Ayush Agarwal's portfolio website.

## 🎨 Visual & Layout Decisions
- **Hero Typography Focus**: The hero section on the homepage must remain centered, typography-focused, and highly minimalist. Do not clutter it with standard personal or stock photos.
- **Option C (Interactive Canvas/Mesh)**: The preferred hero enhancement is a subtle, interactive background canvas layer (e.g. glowing mesh/aurora gradient reacting to cursor coordinates) sitting behind the text, layered with the existing paper grain noise overlay.
- **Glassmorphism Spec**: Use `bg-card/90` and `backdrop-blur-xl` combined with thin, low-opacity borders (`border-white/15`) for high-fidelity panels.

## 🔊 Audio Behavior Decisions
- **Automatic Loader (No Permission Prompts)**: The case study loading screen must NEVER freeze or show interactive permission modals (e.g., "Tap anywhere to boot"). It must auto-resolve from 0% to 100% in 1.8 seconds.
- **Web Audio API Sweep Sequence**: The oscillator nodes initialization in `startBootSequence()` runs immediately on mount. If the browser blocks Web Audio API autoplay, it must fail silently without stopping the visual progression.

## 🖼️ Image & Asset Guidelines
- **Strict WebP Format**: All newly added project screenshots must be converted and compressed to `.webp` format at **85% quality** to keep page load times fast (under 100KB).
- **Native Lazy Loading**: All project gallery screenshot cards must use `loading="lazy"` to preserve high Core Web Vitals performance.

## 🐛 Resolved Debugging Lessons
- **Suspended Audio Contexts**: Scheduling Web Audio oscillator sweeps immediately after a raw context `resume()` call on Chromium engines can drop nodes. The `resumeAudio()` promise must be awaited fully before playing the boot swell.
- **TanStack Start Hydration Warnings**: Prevent client-only globals (`window`, `document`) from executing during SSR compilation. Always guard them with `typeof window !== "undefined"` checks or run them exclusively inside React `useEffect` loops.
