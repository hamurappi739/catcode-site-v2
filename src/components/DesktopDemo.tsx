import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import {
  BellRing,
  Dumbbell,
  Droplets,
  FileCode2,
  Hand,
  ListMusic,
  MousePointer2,
  Pause,
  Play,
  RotateCcw,
  StickyNote,
  Timer,
  Volume2,
  VolumeX,
} from "lucide-react";
import CatSprite, { type CatMood } from "./CatSprite";
import { LazyIn, Reveal, SectionHead } from "./Reveal";
import { A } from "../lib/assets";
import { useLang } from "../lib/lang";

type Mode = "idle" | "sleep" | "wake" | "purr" | "hunt" | "huntReturn" | "drink" | "dance" | "steal";
type Pose = "base" | "pressL" | "pressR" | "scroll" | "jump";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const CODE_LINES: { c: string; t: string }[] = [
  { c: "text-cyan-neon", t: "import { Cat } from '@catcode/desktop';" },
  { c: "text-mist-500", t: "// кот живёт поверх ваших окон" },
  { c: "text-frost-100", t: "const cat = new Cat({ name: 'CatCode' });" },
  { c: "text-frost-100", t: "cat.follow(cursor).liveOn(desktop);" },
  { c: "text-mist-500", t: "cat.on('idle:15s', () => cat.sleep());" },
  { c: "text-cyan-neon", t: "cat.remind(['water', 'stretch']);" },
];

const NOTES = [
  "купить Filter Coffee в зёрнах",
  "созвон в 15:00 — подготовить демо",
  "идея: кот реагирует на билд",
  "прочитать спеку по WebAudio",
  "не забыть про ретро в четверг",
  "полить фикус",
  "черновик статьи про состояния кота",
  "checklist релиза 0.2.0",
  "исследовать: pixel-art шейдеры",
  "вода! разминка! перерыв!",
];

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export default function DesktopDemo() {
  const { t } = useLang();
  const sceneRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const fakeCursorRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<Mode>("idle");
  const [pose, setPose] = useState<Pose>("base");
  const [catX, setCatX] = useState(0.5);
  const [facing, setFacing] = useState<"l" | "r">("r");
  const [walking, setWalking] = useState(false);
  const [walkMs, setWalkMs] = useState(1200);
  const [huntOn, setHuntOn] = useState(false);
  const [music, setMusic] = useState(false);
  const [toast, setToast] = useState<{ id: number; kind: "water" | "stretch" | "focus" } | null>(null);
  const [keys, setKeys] = useState<{ id: number; ch: string }[]>([]);
  const [stealing, setStealing] = useState(false);
  const [caught, setCaught] = useState(false);
  const [clock, setClock] = useState("");

  const [pomo, setPomo] = useState<{ left: number; run: boolean; phase: "focus" | "break" }>({
    left: 25 * 60,
    run: false,
    phase: "focus",
  });

  const modeRef = useRef<Mode>(mode);
  const catXRef = useRef(catX);
  const poseRef = useRef(pose);
  const musicRef = useRef(music);
  const huntOnRef = useRef(huntOn);
  const stealingRef = useRef(stealing);
  const lastAct = useRef(Date.now());
  const timeouts = useRef<number[]>([]);
  const keyId = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pointer = useRef({ x: 0.5, y: 0.5, px: 0, py: 0 });
  const shakeBuf = useRef<number[]>([]);

  modeRef.current = mode;
  catXRef.current = catX;
  poseRef.current = pose;
  musicRef.current = music;
  huntOnRef.current = huntOn;
  stealingRef.current = stealing;

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timeouts.current.push(id);
  }, []);

  const go = useCallback((m: Mode) => setMode(m), []);

  /* ---------- активность / сон ---------- */
  const poke = useCallback(() => {
    lastAct.current = Date.now();
    if (modeRef.current === "sleep") {
      go("wake");
      later(() => {
        if (modeRef.current === "wake") go("idle");
      }, 800);
    }
  }, [go, later]);

  useEffect(() => {
    const iv = window.setInterval(() => {
      if (Date.now() - lastAct.current > 15000 && modeRef.current === "idle" && !musicRef.current) {
        go("sleep");
      }
    }, 1000);
    return () => window.clearInterval(iv);
  }, [go]);

  /* ---------- часы ---------- */
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`);
    };
    tick();
    const iv = window.setInterval(tick, 5000);
    return () => window.clearInterval(iv);
  }, []);

  /* ---------- прогулки ---------- */
  useEffect(() => {
    const iv = window.setInterval(() => {
      if (modeRef.current !== "idle" || poseRef.current !== "base") return;
      if (Date.now() - lastAct.current < 4000) return;
      const cur = catXRef.current;
      const dir = Math.random() > 0.5 ? 1 : -1;
      const dist = 0.14 + Math.random() * 0.2;
      const target = clamp(cur + dir * dist, 0.09, 0.88);
      if (Math.abs(target - cur) < 0.05) return;
      setFacing(target > cur ? "r" : "l");
      setWalkMs(900 + dist * 4200);
      setWalking(true);
      setCatX(target);
      later(() => setWalking(false), 1100 + dist * 4200);
    }, 5600);
    return () => window.clearInterval(iv);
  }, [later]);

  /* ---------- очистка таймаутов ---------- */
  useEffect(
    () => () => {
      timeouts.current.forEach(clearTimeout);
    },
    []
  );

  /* ---------- печать ---------- */
  const typeTimer = useRef<number | null>(null);
  const pressAlt = useRef(false);
  const recentKeydown = useRef(0);
  const onType = useCallback(
    (ch: string) => {
      poke();
      if (modeRef.current !== "idle" && modeRef.current !== "purr") return;
      pressAlt.current = !pressAlt.current;
      setPose(pressAlt.current ? "pressL" : "pressR");
      if (ch) {
        const id = ++keyId.current;
        setKeys((k) => [...k.slice(-3), { id, ch }]);
        later(() => setKeys((k) => k.filter((x) => x.id !== id)), 900);
      }
      if (typeTimer.current) window.clearTimeout(typeTimer.current);
      typeTimer.current = window.setTimeout(() => {
        if (poseRef.current === "pressL" || poseRef.current === "pressR") setPose("base");
      }, 850);
    },
    [poke, later]
  );

  /* ---------- прокрутка ---------- */
  const scrollTimer = useRef<number | null>(null);
  const onScrollNotes = useCallback(() => {
    poke();
    if (modeRef.current !== "idle") return;
    setPose("scroll");
    if (scrollTimer.current) window.clearTimeout(scrollTimer.current);
    scrollTimer.current = window.setTimeout(() => {
      if (poseRef.current === "scroll") setPose("base");
    }, 520);
  }, [poke]);

  /* ---------- охота: встряхивание курсора ---------- */
  const shakeDetector = useCallback(
    (x: number, rect: DOMRect) => {
      const buf = shakeBuf.current;
      buf.push(x);
      while (buf.length > 26) buf.shift();
      if (!huntOnRef.current || modeRef.current !== "idle" || stealingRef.current) return;
      if (buf.length < 8) return;
      let flips = 0;
      let prev = Math.sign(buf[1] - buf[0]);
      let amp = 0;
      for (let i = 2; i < buf.length; i++) {
        const d = buf[i] - buf[i - 1];
        amp += Math.abs(d);
        const s = Math.sign(d);
        if (s !== 0 && prev !== 0 && s !== prev) flips++;
        if (s !== 0) prev = s;
      }
      const catPx = rect.left + rect.width * catXRef.current;
      const near = Math.abs(pointer.current.px - catPx) < Math.max(220, rect.width * 0.24);
      if (flips >= 5 && amp > rect.width * 0.3 && near) {
        shakeBuf.current = [];
        setFacing(pointer.current.x > catXRef.current ? "r" : "l");
        go("hunt");
        later(() => {
          if (modeRef.current === "hunt") go("huntReturn");
        }, 1600);
        later(() => {
          if (modeRef.current === "huntReturn") go(musicRef.current ? "dance" : "idle");
        }, 2200);
      }
    },
    [go, later]
  );

  /* ---------- указатель ---------- */
  const onScenePointer = useCallback(
    (e: React.PointerEvent) => {
      const rect = sceneRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left) / rect.width;
      pointer.current = { x, y: (e.clientY - rect.top) / rect.height, px: e.clientX, py: e.clientY };
      shakeDetector(x, rect);
      poke();
    },
    [shakeDetector, poke]
  );

  /* ---------- погладить ---------- */
  const pet = useCallback(() => {
    if (modeRef.current === "steal" || modeRef.current === "dance") return;
    poke();
    if (modeRef.current === "purr") return;
    go("purr");
    if (!audioRef.current) {
      audioRef.current = new Audio(A.purrAudio);
      audioRef.current.volume = 0.65;
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
    later(() => {
      audioRef.current?.pause();
      if (modeRef.current === "purr") go(musicRef.current ? "dance" : "idle");
    }, 3000);
  }, [go, later, poke]);

  /* ---------- тосты ---------- */
  const fireToast = useCallback(
    (kind: "water" | "stretch" | "focus") => {
      setToast({ id: Date.now(), kind });
      later(() => setToast(null), 4300);
    },
    [later]
  );

  const drink = useCallback(() => {
    poke();
    fireToast("water");
    if (modeRef.current === "idle") {
      go("drink");
      later(() => {
        if (modeRef.current === "drink") go(musicRef.current ? "dance" : "idle");
      }, 4200);
    }
  }, [fireToast, go, later, poke]);

  /* ---------- музыка / танец ---------- */
  const toggleMusic = useCallback(() => {
    poke();
    setMusic((m) => {
      const next = !m;
      if (next) {
        if (modeRef.current === "idle") go("dance");
      } else if (modeRef.current === "dance") {
        go("idle");
      }
      return next;
    });
  }, [go, poke]);

  /* ---------- pomodoro ---------- */
  useEffect(() => {
    if (!pomo.run) return;
    const iv = window.setInterval(() => {
      setPomo((p) => {
        if (p.left <= 1) {
          fireToast("focus");
          return { left: 5 * 60, run: false, phase: "break" };
        }
        return { ...p, left: p.left - 1 };
      });
    }, 1000);
    return () => window.clearInterval(iv);
  }, [pomo.run, fireToast]);

  /* ---------- кража курсора ---------- */
  const steal = useCallback(() => {
    if (stealingRef.current || modeRef.current === "sleep") return;
    poke();
    setStealing(true);
    setCaught(false);
    go("steal");
    setPose("jump");
    const startX = catXRef.current;
    const target = clamp(pointer.current.x, 0.12, 0.86);
    setFacing(target > startX ? "r" : "l");
    setWalkMs(700);
    setWalking(true);
    setCatX(target);
    later(() => {
      setCaught(true);
      setWalking(false);
      setFacing("r");
      setWalkMs(1300);
      setWalking(true);
      setCatX(0.84);
    }, 800);
    later(() => {
      setCaught(false);
      setWalking(true);
      setWalkMs(900);
      setFacing("l");
      setCatX(0.5);
    }, 2400);
    later(() => {
      setWalking(false);
      setStealing(false);
      setPose("base");
      go(musicRef.current ? "dance" : "idle");
    }, 3600);
  }, [go, later, poke]);

  /* фейковый курсор следует за указателем / за котом */
  useEffect(() => {
    if (!stealing) {
      const el = fakeCursorRef.current;
      if (el) el.style.opacity = "0";
      return;
    }
    let raf = 0;
    const pos = { x: pointer.current.x, y: pointer.current.y };
    const step = () => {
      const el = fakeCursorRef.current;
      const scene = sceneRef.current;
      if (el && scene) {
        if (!caught) {
          pos.x += (pointer.current.x - pos.x) * 0.5;
          pos.y += (pointer.current.y - pos.y) * 0.5;
        } else {
          pos.x += (catXRef.current + 0.045 - pos.x) * 0.4;
          pos.y += (0.82 - pos.y) * 0.4;
        }
        el.style.opacity = "1";
        el.style.transform = `translate(${pos.x * scene.clientWidth}px, ${pos.y * scene.clientHeight}px)`;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [stealing, caught]);

  const mood: CatMood =
    mode === "sleep" ? "sleep"
    : mode === "wake" ? "wake"
    : mode === "purr" ? "purr"
    : mode === "hunt" ? "hunt"
    : mode === "huntReturn" ? "huntReturn"
    : mode === "drink" ? "drink"
    : "idle";

  const showArt = pose === "base" && mode !== "dance" && mode !== "steal";
  const showPress = pose === "pressL" || pose === "pressR";
  const showScroll = pose === "scroll";
  const showJump = pose === "jump" || mode === "dance" || mode === "steal";

  return (
    <section id="demo" className="relative mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
      <SectionHead eyebrow={t.demoEyebrow} title={t.demoTitle} lead={t.demoLead} />

      <Reveal delay={150} className="mt-10">
        {/* ===== монитор ===== */}
        <div className="rounded-[26px] border border-white/10 bg-ink-900/70 p-2 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)] md:p-3">
          <div
            ref={sceneRef}
            onPointerMove={onScenePointer}
            onPointerDown={onScenePointer}
            className={`noise relative h-[600px] select-none overflow-hidden rounded-[20px] border border-white/[0.06] bg-ink-950 md:h-[620px] ${
              stealing ? "cursor-none" : ""
            }`}
          >
            {/* обои */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(90% 70% at 70% 10%, rgba(46,230,255,0.08) 0%, transparent 55%), radial-gradient(60% 60% at 15% 90%, rgba(46,230,255,0.05) 0%, transparent 60%)",
              }}
            />
            <div aria-hidden className="absolute inset-0 bg-grid opacity-70" />

            {/* меню-бар */}
            <div className="absolute inset-x-0 top-0 z-20 flex h-9 items-center gap-3 border-b border-white/[0.06] bg-ink-900/80 px-4 backdrop-blur">
              <img src={A.logo} alt="" className="h-4 w-4 rounded" />
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-mist-500">{t.demoDesktopLabel}</span>
              <div className="ml-auto flex items-center gap-3">
                {toast?.kind === "focus" && (
                  <span className="font-mono text-[10px] text-cyan-neon">{t.demoToastFocusDone}</span>
                )}
                <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">
                  <Timer className="h-3 w-3 text-cyan-neon" />
                  <span className="font-mono text-[10.5px] tabular-nums text-frost-100">{fmt(pomo.left)}</span>
                  <span className="hidden font-mono text-[9px] uppercase tracking-wider text-mist-500 sm:inline">
                    {pomo.phase === "focus" ? t.carePomodoroFocus : t.carePomodoroBreak}
                  </span>
                </div>
                {music ? <Volume2 className="h-3 w-3 text-cyan-neon" /> : <VolumeX className="h-3 w-3 text-mist-500" />}
                <span className="font-mono text-[10.5px] tabular-nums text-mist-400">{clock}</span>
              </div>
            </div>

            {/* ===== окно редактора ===== */}
            <div className="absolute left-[3%] top-[9%] z-20 flex h-[48%] w-[57%] flex-col overflow-hidden rounded-xl border border-white/[0.09] bg-ink-900/95 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.75)] backdrop-blur md:w-[55%]">
              <div className="flex h-8 items-center gap-2 border-b border-white/[0.06] bg-white/[0.03] px-3">
                <span className="flex gap-1.5">
                  <span className="block h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="block h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="block h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </span>
                <FileCode2 className="ml-1 h-3.5 w-3.5 text-mist-500" />
                <span className="font-mono text-[10.5px] text-mist-400">{t.demoEditorTitle}</span>
              </div>
              <div className="thin-scroll flex-1 overflow-y-auto p-3 font-mono text-[10px] leading-[1.75] md:text-[11px]">
                {CODE_LINES.map((l, i) => (
                  <div key={i} className="flex whitespace-nowrap">
                    <span className="w-7 shrink-0 select-none pr-3 text-right text-mist-500/40">{i + 1}</span>
                    <span className={l.c}>{l.t}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-cyan-neon/25 bg-cyan-neon/[0.03] p-3">
                <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-cyan-neon/80">
                  {t.demoEditorHint}
                </div>
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onKeyDown={(e) => {
                    recentKeydown.current = Date.now();
                    const k = e.key;
                    const ch = k.length === 1 ? k : k === "Enter" ? "↵" : k === "Backspace" ? "⌫" : "";
                    if (ch) onType(ch);
                  }}
                  onInput={() => {
                    // мобильные клавиатуры не всегда шлют keydown — страхуемся через input
                    if (Date.now() - recentKeydown.current > 90) onType("·");
                  }}
                  className="min-h-[2.4rem] w-full cursor-text rounded-md border border-white/10 bg-ink-950/80 p-2 font-mono text-[11px] text-cyan-neon caret-cyan-neon outline-none transition-colors focus:border-cyan-neon/50"
                />
              </div>
            </div>

            {/* ===== окно заметок ===== */}
            <div className="absolute right-[3%] top-[9%] z-20 flex h-[26%] w-[31%] flex-col overflow-hidden rounded-xl border border-white/[0.09] bg-ink-900/95 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.75)] backdrop-blur">
              <div className="flex h-8 items-center gap-2 border-b border-white/[0.06] bg-white/[0.03] px-3">
                <StickyNote className="h-3.5 w-3.5 text-mist-500" />
                <span className="font-mono text-[10.5px] text-mist-400">{t.demoNotesTitle}</span>
                <span className="ml-auto hidden font-mono text-[9px] text-mist-500/70 lg:inline">{t.demoNotesHint}</span>
              </div>
              <div
                onWheel={onScrollNotes}
                onScroll={onScrollNotes}
                className="thin-scroll flex-1 space-y-1.5 overflow-y-auto p-2.5"
              >
                {NOTES.map((n, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-md border border-white/[0.05] bg-white/[0.025] px-2 py-1.5 font-mono text-[9.5px] text-mist-400"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full border border-cyan-neon/50" />
                    <span className="truncate">{n}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ===== плеер ===== */}
            <div className="absolute right-[3%] top-[38%] z-20 h-[19%] w-[31%] overflow-hidden rounded-xl border border-white/[0.09] bg-ink-900/95 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.75)] backdrop-blur">
              <div className="flex h-8 items-center gap-2 border-b border-white/[0.06] bg-white/[0.03] px-3">
                <ListMusic className="h-3.5 w-3.5 text-mist-500" />
                <span className="font-mono text-[10.5px] text-mist-400">{t.demoPlayerTitle}</span>
              </div>
              <div className="flex items-center gap-3 p-3">
                <button
                  onClick={toggleMusic}
                  aria-label="play"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-neon text-ink-950 transition-transform hover:scale-105 active:scale-95"
                >
                  {music ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-mono text-[10.5px] text-frost-100">{t.demoTrack}</div>
                  <div className="mt-1.5 flex h-4 items-end gap-[3px]">
                    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                      <span
                        key={i}
                        className={`w-[3px] rounded-sm bg-cyan-neon/80 ${music ? "eq-bar" : "scale-y-[0.2]"} origin-bottom`}
                        style={{ height: `${8 + ((i * 7) % 9)}px`, "--eq-delay": `${i * 0.11}s` } as CSSProperties}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ===== тосты ===== */}
            <div className="pointer-events-none absolute left-4 top-12 z-30 space-y-2">
              {toast && toast.kind !== "focus" && (
                <div
                  key={toast.id}
                  className="toast-live flex items-center gap-2.5 rounded-xl border border-cyan-neon/30 bg-ink-900/95 px-3.5 py-2.5 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.8)] backdrop-blur"
                >
                  {toast.kind === "water" ? (
                    <Droplets className="h-4 w-4 text-cyan-neon" />
                  ) : (
                    <Dumbbell className="h-4 w-4 text-cyan-neon" />
                  )}
                  <span className="text-[12px] font-medium text-frost-100">
                    {toast.kind === "water" ? t.demoToastWater : t.demoToastStretch}
                  </span>
                </div>
              )}
            </div>

            {/* ===== клавишные чипы ===== */}
            <div className="pointer-events-none absolute bottom-[24%] left-1/2 z-30 flex -translate-x-1/2 gap-1.5">
              {keys.map((k) => (
                <span
                  key={k.id}
                  className="key-pop flex h-6 min-w-6 items-center justify-center rounded-md border border-cyan-neon/40 bg-ink-900/95 px-1.5 font-mono text-[11px] text-cyan-neon shadow-[0_8px_20px_-6px_rgba(46,230,255,0.4)]"
                >
                  {k.ch === " " ? "␣" : k.ch}
                </span>
              ))}
            </div>

            {/* ===== фейковый курсор ===== */}
            <div
              ref={fakeCursorRef}
              className="pointer-events-none absolute left-0 top-0 z-40 opacity-0 transition-opacity duration-200"
            >
              <MousePointer2
                className={`h-5 w-5 -translate-x-0.5 -translate-y-0.5 drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)] transition-all ${
                  caught ? "text-cyan-neon scale-125" : "text-frost-100"
                }`}
                fill={caught ? "rgba(46,230,255,0.35)" : "rgba(7,9,12,0.85)"}
              />
              {caught && (
                <span className="absolute left-3 top-4 whitespace-nowrap rounded-md bg-cyan-neon/10 px-2 py-0.5 font-mono text-[9px] text-cyan-neon ring-1 ring-cyan-neon/30">
                  {t.demoStolenHint}
                </span>
              )}
            </div>

            {/* ===== ZZZ / пузырь мурчания ===== */}
            <div
              className="pointer-events-none absolute z-30"
              style={{
                left: `${catX * 100}%`,
                bottom: "23%",
                transform: "translateX(-10%)",
                transitionProperty: "left",
                transitionDuration: `${walkMs}ms`,
                transitionTimingFunction: "cubic-bezier(0.45,0.05,0.35,1)",
              }}
            >
              {mode === "sleep" && (
                <>
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="zzz absolute font-mono font-semibold text-cyan-neon"
                      style={
                        {
                          "--zzz-delay": `${i * 0.85}s`,
                          fontSize: `${13 + i * 4}px`,
                          left: `${i * 9}px`,
                          bottom: `${i * 7}px`,
                        } as CSSProperties
                      }
                    >
                      Z
                    </span>
                  ))}
                </>
              )}
              {mode === "purr" && (
                <span className="toast-live absolute -top-2 whitespace-nowrap rounded-full border border-cyan-neon/30 bg-ink-900/95 px-3 py-1 font-mono text-[10.5px] text-cyan-neon">
                  {t.demoPurr}
                </span>
              )}
            </div>

            {/* ===== таскбар ===== */}
            <div className="absolute inset-x-0 bottom-0 z-20 flex h-11 items-center gap-2 border-t border-white/[0.06] bg-ink-900/85 px-4 backdrop-blur">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-neon/15 ring-1 ring-cyan-neon/30">
                <img src={A.logo} alt="" className="h-4 w-4 rounded-sm" />
              </span>
              <span className="h-6 w-6 rounded-md border border-white/10 bg-white/[0.04]" />
              <span className="h-6 w-6 rounded-md border border-white/10 bg-white/[0.04]" />
              <span className="ml-auto font-mono text-[9.5px] uppercase tracking-[0.2em] text-mist-500/70">
                catcode os · demo
              </span>
            </div>

            {/* ===== КОТ — всегда поверх окон ===== */}
            <div
              className="absolute bottom-[2.6rem] z-[22] w-[104px] md:w-[128px]"
              style={{
                left: `${catX * 100}%`,
                transform: `translateX(-50%)`,
                transitionProperty: "left",
                transitionDuration: `${walkMs}ms`,
                transitionTimingFunction: "cubic-bezier(0.45,0.05,0.35,1)",
              }}
            >
              <div
                className={walking ? "cat-walking" : ""}
                style={{ transform: facing === "l" ? "scaleX(-1)" : undefined }}
              >
                <button
                  onClick={pet}
                  aria-label={t.demoBtnPet}
                  className="relative block w-full cursor-pointer outline-none"
                >
                  {/* настоящий кот */}
                  <div
                    className="transition-opacity duration-200"
                    style={{ opacity: showArt ? 1 : 0 }}
                  >
                    <LazyIn minHeight={126}>
                      <CatSprite mood={mood} follow={false} />
                    </LazyIn>
                  </div>
                  {/* позы поверх — выровнены по «полу» как и кот */}
                  <img
                    src={pose === "pressR" ? A.cat.pressRight : A.cat.pressLeft}
                    alt=""
                    draggable={false}
                    className={`absolute inset-x-0 bottom-0 w-full transition-opacity duration-75 ${
                      showPress ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <img
                    src={A.cat.scroll}
                    alt=""
                    draggable={false}
                    className={`absolute inset-x-0 bottom-0 w-full transition-opacity duration-100 ${
                      showScroll ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <img
                    src={A.cat.jumpIng}
                    alt=""
                    draggable={false}
                    className={`absolute inset-x-0 bottom-0 w-full transition-opacity duration-150 ${
                      showJump ? "opacity-100" : "opacity-0"
                    } ${mode === "dance" ? "cat-dancing" : ""}`}
                  />
                </button>
              </div>
              <div aria-hidden className="mx-auto mt-[-4px] h-2.5 w-3/4 rounded-full bg-black/55 blur-[6px]" />
            </div>
          </div>
        </div>
      </Reveal>

      {/* ===== панель управления ===== */}
      <Reveal delay={250} className="mt-6">
        <div className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-white/[0.07] bg-ink-900/60 p-3 backdrop-blur">
          <ControlButton icon={<Hand className="h-3.5 w-3.5" />} onClick={pet}>
            {t.demoBtnPet}
          </ControlButton>
          <ControlButton icon={<Droplets className="h-3.5 w-3.5" />} onClick={drink}>
            {t.demoBtnWater}
          </ControlButton>
          <ControlButton icon={<BellRing className="h-3.5 w-3.5" />} onClick={() => { poke(); fireToast("stretch"); }}>
            {t.demoBtnStretch}
          </ControlButton>
          <ControlButton
            icon={<MousePointer2 className="h-3.5 w-3.5" />}
            onClick={steal}
            disabled={stealing}
          >
            {stealing ? t.demoBtnStealBusy : t.demoBtnSteal}
          </ControlButton>
          <ControlButton
            icon={<Timer className="h-3.5 w-3.5" />}
            onClick={() => setPomo((p) => ({ ...p, run: !p.run }))}
            active={pomo.run}
          >
            {pomo.run ? t.carePause : t.careStart} · {fmt(pomo.left)}
          </ControlButton>

          <span className="mx-1 hidden h-6 w-px bg-white/10 sm:block" />

          <button
            onClick={() => setHuntOn((v) => !v)}
            className={`flex items-center gap-2.5 rounded-full border px-4 py-2 text-[12.5px] font-medium transition-all ${
              huntOn
                ? "border-cyan-neon/50 bg-cyan-neon/10 text-cyan-neon"
                : "border-white/10 bg-white/[0.03] text-mist-400 hover:text-frost-100"
            }`}
          >
            <span
              className={`relative h-4 w-7 rounded-full transition-colors ${huntOn ? "bg-cyan-neon" : "bg-white/15"}`}
            >
              <span
                className={`absolute top-0.5 h-3 w-3 rounded-full bg-ink-950 transition-all ${
                  huntOn ? "left-3.5" : "left-0.5 bg-mist-400"
                }`}
              />
            </span>
            {t.demoHuntLabel}
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 px-1 font-mono text-[10.5px] leading-relaxed text-mist-500/90">
          <span>· {t.demoHuntNote}</span>
          <span>· {t.demoHuntHint}</span>
          <span>· {t.demoSleepNote}</span>
          <span className="inline-flex items-center gap-1">
            <RotateCcw className="h-3 w-3" /> {t.playTryHint}
          </span>
        </div>
      </Reveal>
    </section>
  );
}

function ControlButton({
  icon,
  children,
  onClick,
  disabled,
  active,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[12.5px] font-medium transition-all active:scale-95 ${
        active
          ? "border-cyan-neon/50 bg-cyan-neon/10 text-cyan-neon"
          : "border-white/10 bg-white/[0.03] text-mist-400 hover:border-cyan-neon/40 hover:text-frost-100"
      } ${disabled ? "cursor-wait opacity-60" : ""}`}
    >
      {icon}
      {children}
    </button>
  );
}
