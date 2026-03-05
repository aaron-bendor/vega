"use client";

import { useEffect, useRef, useState } from "react";

const PHRASES = [
  "the everyday investor",
  "curious first-timers",
  "anyone who wants to diversify their portfolio",
  "anyone who doesn't want to think about it",
];

const TYPING_SPEED_MS = 70;
const DELETING_SPEED_MS = 45;
const PAUSE_AFTER_TYPE_MS = 1100;
const PAUSE_AFTER_DELETE_MS = 250;

export function TypingEffect({
  className = "",
  caretClassName = "",
}: {
  className?: string;
  caretClassName?: string;
}) {
  const [text, setText] = useState("");
  const phraseIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const isDeletingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function tick() {
      const phraseIndex = phraseIndexRef.current;
      const current = PHRASES[phraseIndex];
      const isDeleting = isDeletingRef.current;
      let charIndex = charIndexRef.current;

      if (!isDeleting) {
        charIndex += 1;
        setText(current.slice(0, charIndex));
        charIndexRef.current = charIndex;

        if (charIndex === current.length) {
          isDeletingRef.current = true;
          timeoutRef.current = setTimeout(tick, PAUSE_AFTER_TYPE_MS);
          return;
        }
        timeoutRef.current = setTimeout(tick, TYPING_SPEED_MS);
        return;
      }

      charIndex -= 1;
      setText(current.slice(0, charIndex));
      charIndexRef.current = charIndex;

      if (charIndex === 0) {
        isDeletingRef.current = false;
        phraseIndexRef.current = (phraseIndex + 1) % PHRASES.length;
        timeoutRef.current = setTimeout(tick, PAUSE_AFTER_DELETE_MS);
        return;
      }
      timeoutRef.current = setTimeout(tick, DELETING_SPEED_MS);
    }

    tick();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <span
      className={`typing-effect ${className}`}
      aria-live="polite"
      aria-atomic="true"
    >
      {text}
      <span
        className={`typing-caret ml-0.5 ${caretClassName}`}
        aria-hidden
      >
        |
      </span>
    </span>
  );
}
