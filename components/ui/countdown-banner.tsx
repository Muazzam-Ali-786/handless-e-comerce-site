"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "maison-sale-end";
const WINDOW_MS = 48 * 60 * 60 * 1000; // rolling 48-hour window

function nextDeadline(): number {
  if (typeof window === "undefined") return Date.now() + WINDOW_MS;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? parseInt(stored, 10) : NaN;
    // Reset whenever it is missing or already expired so it never shows 00:00:00.
    if (!parsed || Number.isNaN(parsed) || parsed <= Date.now()) {
      const fresh = Date.now() + WINDOW_MS;
      window.localStorage.setItem(STORAGE_KEY, String(fresh));
      return fresh;
    }
    return parsed;
  } catch {
    return Date.now() + WINDOW_MS;
  }
}

function format(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export function CountdownBanner() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    let deadline = nextDeadline();
    const tick = () => {
      let diff = deadline - Date.now();
      if (diff <= 0) {
        deadline = nextDeadline();
        diff = deadline - Date.now();
      }
      setRemaining(diff);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-[#1c1917] text-white py-1.5 text-center">
      <p className="text-[11px] tracking-[0.25em] font-semibold uppercase">
        Winter Sale ends in{" "}
        <span className="tabular-nums text-[#d6d3d1]">
          {remaining === null ? "48:00:00" : format(remaining)}
        </span>
      </p>
    </div>
  );
}
