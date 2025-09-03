"use client";
import { useEffect, useState } from "react";

export default function LastKey({ className = "" }: { className?: string }) {
  const [keyChar, setKeyChar] = useState<string>("");
  const [fading, setFading] = useState(true);       // start hidden
  const [noTrans, setNoTrans] = useState(false);    // toggled to disable fade-in

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (e.key.length !== 1) return;               // ignore non-printables
      setKeyChar(e.key);

      // 1) disable transition and snap to opacity:1 instantly
      setNoTrans(true);
      setFading(false);

      // 2) re-enable transition, then start fading to 0
      requestAnimationFrame(() => {
        setNoTrans(false);
        requestAnimationFrame(() => setFading(true));
      });
    };
    window.addEventListener("keydown", onDown, { passive: true });
    return () => window.removeEventListener("keydown", onDown);
  }, []);

  return (
        <div
          aria-live="polite"
          className={`w-8 h-16 text-[var(--foreground)] flex items-center justify-center select-none bubble-text text-6xl
            ${noTrans ? "transition-none" : "transition-opacity duration-[300ms]"}
            ${fading ? "opacity-0" : "opacity-100"} ml-auto mr-[10px] ${className}`}
        >
          {keyChar || "-"}
        </div>
  );
}
