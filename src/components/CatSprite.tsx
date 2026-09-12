import { useEffect, useMemo, useRef } from "react";
import { A, type CatPalette } from "../lib/assets";

export type CatMood = "idle" | "sleep" | "wake" | "purr" | "hunt" | "huntReturn" | "drink";

const MOOD_ASSET: Record<CatMood, string> = {
  idle: A.cat.idle,
  sleep: A.cat.sleep,
  wake: A.cat.idle,
  purr: A.cat.idle,
  hunt: A.cat.hunt,
  huntReturn: A.cat.idle,
  drink: A.cat.idle,
};

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function useReducedMotion() {
  const reduced = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      reduced.current = mq.matches;
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return reduced.current;
}

type Props = {
  mood?: CatMood;
  palette?: CatPalette;
  follow?: boolean;
  flip?: boolean;
  className?: string;
};

/** Показывает актуальный v6 PNG из приложения, без старых CDN/SVG-ассетов. */
export default function CatSprite({ mood = "idle", palette, follow = true, flip = false, className }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const src = palette?.asset ?? MOOD_ASSET[mood];
  const tracking = useMemo(() => ({ raf: 0 }), []);

  useEffect(() => {
    if (!follow || reduced) return;
    const host = hostRef.current;
    if (!host) return;

    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(tracking.raf);
      tracking.raf = requestAnimationFrame(() => {
        const rect = host.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const dx = clamp((event.clientX - (rect.left + rect.width / 2)) / (rect.width * 2.8), -1, 1);
        const dy = clamp((event.clientY - (rect.top + rect.height / 2)) / (rect.height * 2.4), -1, 1);
        host.style.setProperty("--cat-gaze-x", `${dx * 1.2}px`);
        host.style.setProperty("--cat-gaze-y", `${dy * 0.8}px`);
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(tracking.raf);
    };
  }, [follow, reduced, tracking]);

  return (
    <div
      ref={hostRef}
      className={`relative ${className ?? ""}`}
      role="img"
      aria-label="Кот CatCode"
      style={{
        transform: `${flip ? "scaleX(-1) " : ""}translate3d(var(--cat-gaze-x, 0px), var(--cat-gaze-y, 0px), 0)`,
        transition: "transform 180ms ease-out",
      }}
    >
      <img src={src} alt="Кот CatCode" draggable={false} className="block h-auto w-full" />
      {follow && !palette && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span className="cat-gaze-eye cat-gaze-eye-left">
            <span className="cat-gaze-pupil" />
          </span>
          <span className="cat-gaze-eye cat-gaze-eye-right">
            <span className="cat-gaze-pupil" />
          </span>
        </div>
      )}
    </div>
  );
}
