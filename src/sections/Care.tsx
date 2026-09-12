import { useEffect, useRef, useState, type CSSProperties } from "react";
import { BellRing, Droplets, Dumbbell, HeartHandshake, Pause, Play, RotateCcw, Timer } from "lucide-react";
import CatSprite from "../components/CatSprite";
import { LazyIn, Reveal, SectionHead } from "../components/Reveal";
import { A } from "../lib/assets";
import { useLang } from "../lib/lang";

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

function Pomodoro() {
  const { t } = useLang();
  const [phase, setPhase] = useState<"focus" | "break">("focus");
  const [left, setLeft] = useState(25 * 60);
  const [run, setRun] = useState(false);
  const total = phase === "focus" ? 25 * 60 : 5 * 60;

  useEffect(() => {
    if (!run) return;
    const iv = setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          setRun(false);
          const next = phase === "focus" ? "break" : "focus";
          setPhase(next);
          return next === "focus" ? 25 * 60 : 5 * 60;
        }
        return l - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [run, phase]);

  const progress = 1 - left / total;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-ink-900/70 p-6">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-neon/15 text-cyan-neon ring-1 ring-cyan-neon/30">
          <Timer className="h-4 w-4" />
        </span>
        <h3 className="font-display text-[17px] font-semibold text-frost-100">{t.carePomodoroT}</h3>
      </div>
      <p className="mt-3 text-[14px] leading-relaxed text-mist-500">{t.carePomodoroD}</p>

      <div className="mt-6 flex items-center gap-6">
        <div
          className="relative grid h-32 w-32 shrink-0 place-items-center rounded-full"
          style={
            {
              background: `conic-gradient(#2ee6ff ${progress * 360}deg, rgba(255,255,255,0.07) 0deg)`,
            } as CSSProperties
          }
        >
          <div className="grid h-[104px] w-[104px] place-items-center rounded-full bg-ink-900">
            <div className="text-center">
              <div className="font-mono text-2xl font-semibold tabular-nums text-frost-100">{fmt(left)}</div>
              <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.24em] text-cyan-neon">
                {phase === "focus" ? t.carePomodoroFocus : t.carePomodoroBreak}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setRun((r) => !r)}
            className="flex items-center gap-2 rounded-full bg-cyan-neon px-5 py-2.5 text-[13px] font-semibold text-ink-950 transition-all hover:bg-frost-100 active:scale-95"
          >
            {run ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {run ? t.carePause : t.careStart}
          </button>
          <button
            onClick={() => {
              setRun(false);
              setLeft(phase === "focus" ? 25 * 60 : 5 * 60);
            }}
            className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-[13px] text-mist-400 transition-colors hover:text-frost-100 active:scale-95"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {t.careReset}
          </button>
          <div className="mt-1 flex gap-1.5">
            {(["focus", "break"] as const).map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPhase(p);
                  setRun(false);
                  setLeft(p === "focus" ? 25 * 60 : 5 * 60);
                }}
                className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                  phase === p ? "bg-cyan-neon/15 text-cyan-neon ring-1 ring-cyan-neon/40" : "text-mist-500 ring-1 ring-white/10 hover:text-frost-100"
                }`}
              >
                {p === "focus" ? "25:00" : "5:00"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function WaterCard() {
  const { t, lang } = useLang();
  const [interval, setIntervalMin] = useState(45);
  const [on, setOn] = useState(true);
  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-ink-900/70 p-6">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-neon/15 text-cyan-neon ring-1 ring-cyan-neon/30">
          <Droplets className="h-4 w-4" />
        </span>
        <h3 className="font-display text-[17px] font-semibold text-frost-100">{t.careWaterT}</h3>
        <button
          onClick={() => setOn((v) => !v)}
          aria-label="toggle"
          className={`ml-auto relative h-5 w-9 rounded-full transition-colors ${on ? "bg-cyan-neon" : "bg-white/15"}`}
        >
          <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-ink-950 transition-all ${on ? "left-[18px]" : "left-0.5 bg-mist-400"}`} />
        </button>
      </div>
      <p className="mt-3 text-[14px] leading-relaxed text-mist-500">{t.careWaterD}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {[30, 45, 60].map((m) => (
          <button
            key={m}
            onClick={() => setIntervalMin(m)}
            className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] transition-all ${
              interval === m && on
                ? "bg-cyan-neon/15 text-cyan-neon ring-1 ring-cyan-neon/40"
                : "text-mist-500 ring-1 ring-white/10 hover:text-frost-100"
            } ${!on ? "opacity-40" : ""}`}
          >
            {m} {lang === "ru" ? "мин" : "min"}
          </button>
        ))}
        <span className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-[11px] ring-1 transition-opacity ${on ? "text-mist-400 ring-white/10" : "opacity-40 text-mist-500 ring-white/10"}`}>
          <Dumbbell className="h-3.5 w-3.5" /> stretch
        </span>
      </div>

      {/* предпросмотр тоста */}
      <div className={`mt-auto pt-6 transition-opacity ${on ? "opacity-100" : "opacity-30"}`}>
        <div className="flex items-center gap-2.5 rounded-xl border border-cyan-neon/25 bg-ink-950/80 px-3.5 py-2.5 shadow-[0_16px_32px_-12px_rgba(0,0,0,0.8)]">
          <Droplets className="h-4 w-4 shrink-0 text-cyan-neon" />
          <span className="text-[12.5px] text-frost-100">{t.demoToastWater}</span>
          <span className={`ml-auto h-1.5 w-1.5 rounded-full bg-cyan-neon ${on ? "glow-pulse" : ""}`} />
        </div>
      </div>
    </div>
  );
}

function EmotionsCard() {
  const { t } = useLang();
  const [purring, setPurring] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => () => audioRef.current?.pause(), []);

  const toggle = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(A.purrAudio);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.6;
    }
    if (purring) {
      audioRef.current.pause();
      setPurring(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPurring(true);
    }
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-ink-900/70 p-6">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-neon/15 text-cyan-neon ring-1 ring-cyan-neon/30">
          <HeartHandshake className="h-4 w-4" />
        </span>
        <h3 className="font-display text-[17px] font-semibold text-frost-100">{t.careEmotionT}</h3>
      </div>
      <p className="mt-3 text-[14px] leading-relaxed text-mist-500">{t.careEmotionD}</p>

      <div className="mt-4 flex items-end gap-5">
        <div className="w-24 shrink-0 md:w-28">
          <LazyIn minHeight={110}>
            <CatSprite mood={purring ? "purr" : "idle"} follow={false} />
          </LazyIn>
        </div>
        <div className="pb-1">
          <button
            onClick={toggle}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold transition-all active:scale-95 ${
              purring
                ? "bg-cyan-neon/15 text-cyan-neon ring-1 ring-cyan-neon/50"
                : "bg-cyan-neon text-ink-950 hover:bg-frost-100"
            }`}
          >
            <span className="flex h-3 items-end gap-[2px]">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`w-[2.5px] rounded-sm ${purring ? "eq-bar bg-cyan-neon" : "bg-current opacity-60"}`}
                  style={{ height: `${6 + i * 3}px`, "--eq-delay": `${i * 0.15}s` } as CSSProperties}
                />
              ))}
            </span>
            {purring ? t.careEmotionPlaying : t.careEmotionBtn}
          </button>
          <p className="mt-2.5 font-mono text-[9.5px] uppercase tracking-[0.2em] text-mist-500/80">
            purring.m4a · {t.careEmotionAudioNote}
          </p>
        </div>
      </div>
    </div>
  );
}

function RemindersCard() {
  const { t } = useLang();
  const items = [
    { label: "18:00 — позвонить по проекту", kind: t.careRemindOnce },
    { label: "каждый час — встать и размяться", kind: t.careRemindRepeat },
    { label: "завтра 10:00 — ретро", kind: t.careRemindOnce },
  ];
  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-ink-900/70 p-6">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-neon/15 text-cyan-neon ring-1 ring-cyan-neon/30">
          <BellRing className="h-4 w-4" />
        </span>
        <h3 className="font-display text-[17px] font-semibold text-frost-100">{t.careRemindT}</h3>
      </div>
      <p className="mt-3 text-[14px] leading-relaxed text-mist-500">{t.careRemindD}</p>
      <ul className="mt-5 space-y-2">
        {items.map((it) => (
          <li
            key={it.label}
            className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3.5 py-2.5"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-neon shadow-[0_0_8px_rgba(46,230,255,0.7)]" />
            <span className="truncate text-[12.5px] text-mist-400">{it.label}</span>
            <span className="ml-auto shrink-0 rounded-full bg-white/[0.05] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-mist-500">
              {it.kind}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Care() {
  const { t } = useLang();
  return (
    <section id="focus" className="relative mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
      <div aria-hidden className="absolute left-0 top-0 h-px w-full bg-white/[0.05]" />
      <SectionHead eyebrow={t.careEyebrow} title={t.careTitle} />
      <div className="mt-12 grid gap-5 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <Pomodoro />
        </Reveal>
        <Reveal delay={100} className="lg:col-span-7">
          <WaterCard />
        </Reveal>
        <Reveal delay={60} className="lg:col-span-7">
          <RemindersCard />
        </Reveal>
        <Reveal delay={140} className="lg:col-span-5">
          <EmotionsCard />
        </Reveal>
      </div>
    </section>
  );
}
