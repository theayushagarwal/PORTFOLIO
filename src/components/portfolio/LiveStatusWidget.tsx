import { useEffect, useState } from "react";
import { Clock, MapPin } from "lucide-react";

export function LiveStatusWidget() {
  const [timeString, setTimeString] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Formatted in IST / India Standard Time
      const formatted = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(now);
      setTimeString(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex flex-wrap items-center gap-2.5 rounded-full border border-slate-800/80 bg-slate-950/60 px-3.5 py-1.5 text-xs text-slate-300 backdrop-blur-md transition-colors hover:border-slate-700/80">
      {/* Open for roles indicator */}
      <span className="flex items-center gap-1.5 font-medium text-emerald-400">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
        </span>
        AVAILABLE FOR ROLES
      </span>

      <span className="text-slate-700">•</span>

      {/* Clock */}
      <span className="flex items-center gap-1 font-mono text-slate-300">
        <Clock className="h-3 w-3 text-cyan-400" />
        {timeString || "07:12:00 PM"} IST
      </span>

      <span className="hidden sm:inline text-slate-700">•</span>

      {/* Location */}
      <span className="hidden sm:flex items-center gap-1 text-slate-400">
        <MapPin className="h-3 w-3 text-purple-400" />
        Vellore, IN (UTC+5:30)
      </span>
    </div>
  );
}
