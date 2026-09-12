import { useEffect, useRef, useState } from "react";
import { Apple, ChevronDown, Droplets, Infinity as InfinityIcon, Send, Terminal, WifiOff } from "lucide-react";
import CatSprite from "./CatSprite";
import { Reveal } from "./Reveal";
import { useLang } from "../lib/lang";
import { TELEGRAM_URL } from "../lib/assets";

function WindowsGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="4" width="8" height="7" rx="0.5" />
      <rect x="13" y="4" width="8" height="7" rx="0.5" />
      <rect x="3" y="13" width="8" height="7" rx="0.5" />
      <rect x="13" y="13" width="8" height="7" rx="0.5" />
    </svg>
  );
}

function FocusChip({ label, suffix }: { label: string; suffix: string }) {
  const [sec, setSec] = useState(24 * 60 + 58);
  useEffect(() => {
    const id = setInterval(() => setSec((s) => (s <= 0 ? 25 * 60 : s - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");
  return (
    <div className="pointer-events-none flex items-center gap-3 rounded-2xl border border-white/10 bg-ink-900/90 px-4 py-2.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.8)] backdrop-blur float-soft">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-neon opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-neon" />
      </span>
      <div className="font-mono leading-none">
        <div className="text-[10px] uppercase tracking-[0.22em] text-mist-500">{label}</div>
        <div className="mt-1 text-[15px] font-semibold text-frost-100 tabular-nums">
          {mm}:{ss}
          <span className="ml-2 text-[10px] font-normal text-mist-500">{suffix}</span>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const { t } = useLang();
  const stageRef = useRef<HTMLDivElement>(null);
  const [par, setPar] = useState({ x: 0, y: 0 });
  const [typed, setTyped] = useState(0);
  const [typingRun, setTypingRun] = useState(0);

  const titleParts = [t.heroTitleA, t.heroTitleB, t.heroTitleC];
  const titleLength = titleParts.reduce((sum, part) => sum + part.length, 0);

  useEffect(() => {
    setTyped(0);
    const id = window.setInterval(() => {
      setTyped((value) => {
        if (value >= titleLength) {
          window.clearInterval(id);
          return value;
        }
        return value + 1;
      });
    }, 46);
    return () => window.clearInterval(id);
  }, [titleLength, typingRun, t.heroTitleA, t.heroTitleB, t.heroTitleC]);

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;

    let initialized = false;
    let wasVisible = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.45;
        if (!initialized) {
          initialized = true;
        } else if (visible && !wasVisible) {
          setTypingRun((run) => run + 1);
        }
        wasVisible = visible;
      },
      { threshold: [0, 0.45] }
    );
    observer.observe(hero);

    const onHashChange = () => {
      if (window.location.hash === "#top") setTypingRun((run) => run + 1);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  const revealPart = (part: string, offset: number) => part.slice(0, Math.max(0, Math.min(part.length, typed - offset)));

  useEffect(() => {
    const fn = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      setPar({ x: nx, y: ny });
    };
    window.addEventListener("pointermove", fn, { passive: true });
    return () => window.removeEventListener("pointermove", fn);
  }, []);

  return (
    <section id="top" className="noise relative min-h-svh overflow-hidden bg-grid">
      {/* свечение за котом */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[12%] top-[8%] h-[62vmin] w-[62vmin] rounded-full opacity-[0.16]"
        style={{ background: "radial-gradient(circle, #2ee6ff 0%, transparent 62%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[20%] bottom-[-22%] h-[55vmin] w-[55vmin] rounded-full opacity-[0.07]"
        style={{ background: "radial-gradient(circle, #2ee6ff 0%, transparent 60%)" }}
      />
      {/* рамка-направляющая */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-16 h-px bg-white/[0.05]" />

      <div className="relative mx-auto grid min-h-svh max-w-7xl grid-cols-1 items-center gap-10 px-5 pb-24 pt-28 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-4 lg:pb-16 lg:pt-16">
        {/* ---- текст ---- */}
        <div className="relative z-10">
          <Reveal>
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] py-1.5 pl-2 pr-4 font-mono text-[10.5px] uppercase tracking-[0.24em] text-mist-400">
              <span className="rounded-full bg-cyan-neon/15 px-2 py-0.5 text-cyan-neon">v0.2</span>
              {t.heroEyebrow}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="mt-7 font-display text-[clamp(2rem,5.4vw,4.3rem)] font-bold leading-[1.06] tracking-tight">
              {revealPart(t.heroTitleA, 0)}
              <br />
              <span className="text-cyan-neon [text-shadow:0_0_36px_rgba(46,230,255,0.4)]">{revealPart(t.heroTitleB, t.heroTitleA.length)}</span>
              <br />
              {revealPart(t.heroTitleC, t.heroTitleA.length + t.heroTitleB.length)}
              <span className="caret-blink ml-1 inline-block h-[0.8em] w-[0.09em] translate-y-[0.08em] bg-cyan-neon" />
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-mist-400 md:text-[17px]">{t.heroLead}</p>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2.5 rounded-full bg-cyan-neon px-7 py-3.5 text-[15px] font-semibold text-ink-950 transition-all duration-300 hover:bg-frost-100 hover:shadow-[0_0_44px_rgba(46,230,255,0.4)]"
              >
                <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                {t.heroPrimary}
              </a>
              <a
                href="#demo"
                className="group flex items-center gap-2 rounded-full border border-white/12 px-7 py-3.5 text-[15px] font-medium text-frost-100 transition-all duration-300 hover:border-cyan-neon/50 hover:text-cyan-neon"
              >
                {t.heroSecondary}
                <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
              </a>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-[0.16em] text-mist-500">
              <span className="flex items-center gap-2">
                <InfinityIcon className="h-3.5 w-3.5 text-cyan-neon" /> {t.heroBadge1}
              </span>
              <span className="flex items-center gap-2">
                <WifiOff className="h-3.5 w-3.5 text-cyan-neon" /> {t.heroBadge2}
              </span>
            </div>
          </Reveal>

          <Reveal delay={480}>
            <div className="mt-6 flex items-center gap-5 border-t border-white/[0.06] pt-5 font-mono text-[11px] text-mist-500">
              <span className="flex items-center gap-2">
                <WindowsGlyph className="h-4 w-4 text-mist-400" /> 10/11
              </span>
              <span className="flex items-center gap-2">
                <Apple className="h-4 w-4 text-mist-400" /> 12+
              </span>
              <span className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-mist-400" /> Linux
              </span>
            </div>
          </Reveal>
        </div>

        {/* ---- сцена с котом ---- */}
        <Reveal delay={220} className="relative">
          <div
            ref={stageRef}
            className="relative mx-auto h-[380px] w-full max-w-[520px] md:h-[470px]"
            style={{
              transform: `translate3d(${par.x * -8}px, ${par.y * -6}px, 0)`,
              transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {/* орбита-кольцо */}
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 h-[108%] w-[108%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.09]"
              style={{ animation: "spin-slow 60s linear infinite" }}
            >
              <span className="absolute left-[12%] top-[6%] h-1.5 w-1.5 rounded-full bg-cyan-neon/70" />
              <span className="absolute bottom-[10%] right-[8%] h-1 w-1 rounded-full bg-white/30" />
            </div>

            {/* кот на «кромке стола» */}
            <div className="absolute inset-x-6 bottom-6 h-28 rounded-[22px] border border-white/[0.08] bg-gradient-to-b from-ink-800/90 to-ink-900/70 shadow-[0_-1px_0_rgba(255,255,255,0.05),0_40px_80px_-32px_rgba(0,0,0,0.9)] backdrop-blur-sm md:inset-x-10">
              <div className="absolute inset-x-5 top-2.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/10" />
                <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-mist-500/70 ml-1">catcode://desktop</span>
              </div>
            </div>

            <div
              className="absolute bottom-[21%] left-1/2 w-60 -translate-x-1/2 md:w-72"
              style={{
                transform: `translateX(-50%) translate3d(${par.x * 10}px, ${par.y * 6}px, 0)`,
                transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              <CatSprite mood="idle" follow className="drop-shadow-[0_18px_30px_rgba(0,0,0,0.55)]" />
              <div aria-hidden className="mx-auto h-3 w-3/4 -translate-y-1 rounded-full bg-black/50 blur-md" />
            </div>

            {/* чипы */}
            <div className="absolute left-0 top-6 md:-left-4 md:top-10">
              <FocusChip label={t.heroChipPomodoro} suffix={t.heroChipBreak} />
            </div>
            <div className="absolute right-0 top-24 md:-right-2 float-soft" style={{ animationDelay: "1.4s" }}>
              <div className="pointer-events-none flex items-center gap-2 rounded-2xl border border-cyan-neon/25 bg-ink-900/90 px-4 py-2.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.8)] backdrop-blur">
                <Droplets className="h-4 w-4 text-cyan-neon" />
                <span className="text-[12.5px] font-medium text-frost-100">{t.heroChipWater}</span>
              </div>
            </div>

            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.24em] text-mist-500/80">
              {t.heroHint}
            </div>
          </div>
        </Reveal>
      </div>

      {/* scroll cue */}
      <a
        href="#demo"
        aria-label="scroll"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-mist-500 transition-colors hover:text-cyan-neon lg:flex"
      >
        scroll
        <span className="block h-8 w-px overflow-hidden bg-white/10">
          <span className="scroll-dot block h-3 w-px bg-cyan-neon" />
        </span>
      </a>
    </section>
  );
}
