import { useEffect, useRef, useState, type ReactNode } from "react";
import { AppWindow } from "lucide-react";
import CatSprite from "../components/CatSprite";
import { LazyIn, Reveal, SectionHead } from "../components/Reveal";
import { A } from "../lib/assets";
import { useLang } from "../lib/lang";

function MediaFrame({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-900/80 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.85)]">
      <div className="flex h-8 items-center gap-2 border-b border-white/[0.06] bg-white/[0.02] px-3">
        <span className="flex gap-1.5">
          <span className="block h-2 w-2 rounded-full bg-white/15" />
          <span className="block h-2 w-2 rounded-full bg-white/10" />
          <span className="block h-2 w-2 rounded-full bg-white/[0.07]" />
        </span>
        {caption && (
          <span className="ml-1 font-mono text-[9.5px] uppercase tracking-[0.22em] text-mist-500/80">{caption}</span>
        )}
        <AppWindow className="ml-auto h-3 w-3 text-mist-500/50" />
      </div>
      <div className="relative">{children}</div>
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.04] transition duration-500 group-hover:ring-cyan-neon/20" />
    </div>
  );
}

function AppVideo({ src }: { src: string }) {
  return (
    <video
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      className="m-auto block max-h-[300px] w-full bg-ink-950 object-contain"
    />
  );
}

/** Живой кот, который следит за курсором прямо здесь, в блоке. */
function GazeLive() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      setPos({
        x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)),
        y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)),
      });
    };
    const over = () => setActive(true);
    const out = () => setActive(false);
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerenter", over);
    el.addEventListener("pointerleave", out);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerenter", over);
      el.removeEventListener("pointerleave", out);
    };
  }, []);

  return (
    <div ref={ref} className="relative flex h-[300px] cursor-crosshair items-end justify-center overflow-hidden bg-grid bg-ink-950">
      {/* перекрестье */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{ opacity: active ? 1 : 0 }}
      >
        <div className="absolute inset-y-0 w-px bg-cyan-neon/25" style={{ left: `${pos.x * 100}%` }} />
        <div className="absolute inset-x-0 h-px bg-cyan-neon/25" style={{ top: `${pos.y * 100}%` }} />
        <div
          className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-neon shadow-[0_0_14px_rgba(46,230,255,0.5)]"
          style={{ left: `${pos.x * 100}%`, top: `${pos.y * 100}%` }}
        />
      </div>
      <div className="w-40 pb-8 md:w-44">
        <LazyIn minHeight={170}>
          <CatSprite mood="idle" follow />
        </LazyIn>
      </div>
      <div aria-hidden className="absolute bottom-[2.2rem] h-2 w-40 rounded-full bg-black/50 blur-md" />
      <div className="absolute left-3 top-3 font-mono text-[9px] uppercase tracking-[0.24em] text-mist-500/70">
        live · gaze tracking
      </div>
    </div>
  );
}

export default function Rhythm() {
  const { t } = useLang();

  const items = [
    {
      n: "01",
      title: t.rhythm1t,
      desc: t.rhythm1d,
      tags: t.rhythm1tags,
      media: (
        <MediaFrame caption={`typing.webm · ${t.rhythmVideoNote}`}>
          <AppVideo src={A.video.typing} />
        </MediaFrame>
      ),
    },
    {
      n: "02",
      title: t.rhythm2t,
      desc: t.rhythm2d,
      tags: t.rhythm2tags,
      media: (
        <MediaFrame caption="live demo">
          <GazeLive />
        </MediaFrame>
      ),
    },
    {
      n: "03",
      title: t.rhythm3t,
      desc: t.rhythm3d,
      tags: t.rhythm3tags,
      media: (
        <MediaFrame caption={`sleep.webm · ${t.rhythmVideoNote}`}>
          <AppVideo src={A.video.sleep} />
        </MediaFrame>
      ),
    },
    {
      n: "04",
      title: t.rhythm4t,
      desc: t.rhythm4d,
      tags: t.rhythm4tags,
      media: (
        <MediaFrame caption="scroll reaction">
          <div className="flex h-[300px] items-end justify-center overflow-hidden bg-grid bg-ink-950 pb-8">
            <img
              src={A.cat.scroll}
              alt="Реакция кота на прокрутку"
              className="w-40 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 md:w-44"
              draggable={false}
            />
          </div>
        </MediaFrame>
      ),
    },
  ];

  return (
    <section id="rhythm" className="relative mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
      <div aria-hidden className="absolute left-0 top-0 h-px w-full bg-white/[0.05]" />
      <SectionHead eyebrow={t.rhythmEyebrow} title={t.rhythmTitle} lead={t.rhythmLead} />

      <div className="mt-14 space-y-16 md:space-y-24">
        {items.map((it, i) => (
          <div
            key={it.n}
            className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${i % 2 ? "" : ""}`}
          >
            <Reveal className={i % 2 ? "md:order-2" : ""}>{it.media}</Reveal>
            <div className={i % 2 ? "md:order-1 md:text-right" : ""}>
              <Reveal delay={80}>
                <div
                  className={`font-display text-[64px] font-bold leading-none text-outline md:text-[88px] ${
                    i % 2 ? "md:ml-auto" : ""
                  }`}
                >
                  {it.n}
                </div>
              </Reveal>
              <Reveal delay={150}>
                <h3 className="mt-4 font-display text-xl font-semibold leading-snug text-frost-100 md:text-2xl">
                  {it.title}
                </h3>
              </Reveal>
              <Reveal delay={220}>
                <p className={`mt-3 max-w-md text-[15px] leading-relaxed text-mist-500 ${i % 2 ? "md:ml-auto" : ""}`}>
                  {it.desc}
                </p>
              </Reveal>
              <Reveal delay={280}>
                <div className={`mt-5 flex flex-wrap gap-2 ${i % 2 ? "md:justify-end" : ""}`}>
                  {it.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-mist-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
