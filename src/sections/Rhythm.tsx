import type { ReactNode } from "react";
import { AppWindow } from "lucide-react";
import { Reveal, SectionHead } from "../components/Reveal";
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
        <MediaFrame caption={`hunt.webm · ${t.rhythmVideoNote}`}>
          <AppVideo src={A.video.hunt} />
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
        <MediaFrame caption={`scroll.webm · ${t.rhythmVideoNote}`}>
          <AppVideo src={A.video.scroll} />
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
