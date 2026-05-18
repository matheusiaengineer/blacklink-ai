"use client";

import { useEffect, useState } from "react";

export function TypeWriter({
  phrases,
  speed = 55,
  pause = 2200
}: {
  phrases: string[];
  speed?: number;
  pause?: number;
}) {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [display, setDisplay] = useState("");

  useEffect(() => {
    const current = phrases[phraseIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx <= current.length) {
      setDisplay(current.slice(0, charIdx));
      timeout = setTimeout(() => setCharIdx((c) => c + 1), speed);
    } else if (!deleting && charIdx > current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx >= 0) {
      setDisplay(current.slice(0, charIdx));
      timeout = setTimeout(() => setCharIdx((c) => c - 1), speed / 2);
    } else {
      setDeleting(false);
      setPhraseIdx((i) => (i + 1) % phrases.length);
      timeout = setTimeout(() => setCharIdx(1), speed);
    }

    return () => clearTimeout(timeout);
  }, [charIdx, deleting, phraseIdx, phrases, speed, pause]);

  return (
    <span>
      {display}
      <span className="animate-pulse-soft">|</span>
    </span>
  );
}
