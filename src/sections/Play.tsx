import { useRef, useState, type ReactNode } from "react";
import { Footprints, MousePointer2, Music4, Target } from "lucide-react";
import { Reveal, SectionHead } from "../components/Reveal";
import { A } from "../lib/assets";
import { useLang } from "../lib/lang";

function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState("perspective(900px) rotateX(0deg) rotateY(0deg)");

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        setT(`perspective(900px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg)`);
      }}
      onPointerLeave={() => setT("perspective(900px) rotateX(0deg) rotateY(0deg)")}
      className={`transition-transform duration-300 ease-out will-change-transform ${className}`}
      style={{ transform: t, transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}

function Card({
  icon,
  title,
  desc,
  tags,
  media,
  accent,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
  tags?: string[];
  media: ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`relative flex h-full flex-col overflow-hidden rounded-2xl border bg-ink-900/70 backdrop-blur transition-colors duration-300 ${
        accent ? "border-cyan-neon/25" : "border-white/[0.08] hover:border-white/[0.16]"
      }`}
    >
      <div className="relative overflow-hidden border-b border-white/[0.06] bg-ink-950">{media}</div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2.5">
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-lg ring-1 ${
              accent ? "bg-cyan-neon/15 text-cyan-neon ring-cyan-neon/30" : "bg-white/[0.05] text-mist-400 ring-white/10"
            }`}
          >
            {icon}
          </span>
          <h3 className="font-display text-[17px] font-semibold text-frost-100">{title}</h3>
        </div>
        <p className="mt-3 text-[14px] leading-relaxed text-mist-500">{desc}</p>
        {tags && (
          <div className="mt-auto flex flex-wrap gap-2 pt-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-cyan-neon/25 bg-cyan-neon/[0.06] px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.16em] text-cyan-neon/90"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Play() {
  const { t } = useLang();

  const vid = (src: string) => (
    <video src={src} autoPlay loop muted playsInline preload="metadata" className="m-auto block h-[210px] w-full bg-ink-950 object-contain transition-transform duration-700 group-hover:scale-105" />
  );

  return (
    <section id="play" className="relative px-4 py-20 md:px-8 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] max-w-full -translate-x-1/2 rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(closest-side, #2ee6ff, transparent)" }}
      />
      <div className="relative mx-auto max-w-7xl">
        <SectionHead eyebrow={t.playEyebrow} title={t.playTitle} lead={t.playLead} />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal delay={0}>
            <TiltCard className="group h-full">
              <Card
                icon={<Footprints className="h-4 w-4" />}
                title={t.play1t}
                desc={t.play1d}
                media={vid(A.video.walk)}
              />
            </TiltCard>
          </Reveal>

          <Reveal delay={90}>
            <TiltCard className="group h-full">
              <Card
                icon={<Target className="h-4 w-4" />}
                title={t.play2t}
                desc={t.play2d}
                tags={t.play2tags as unknown as string[]}
                accent
                media={vid(A.video.hunt)}
              />
            </TiltCard>
          </Reveal>

          <Reveal delay={180}>
            <TiltCard className="group h-full">
              <Card
                icon={<MousePointer2 className="h-4 w-4" />}
                title={t.play3t}
                desc={t.play3d}
                media={
                  <div className="relative flex h-[210px] items-center justify-center overflow-hidden bg-grid bg-ink-950">
                    <MousePointer2 className="absolute left-[24%] top-[30%] h-5 w-5 text-frost-100/80 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:left-[62%] group-hover:top-[58%]" fill="rgba(7,9,12,0.9)" />
                    <img
                      src={A.cat.jumpIng}
                      alt="Кот крадёт курсор"
                      draggable={false}
                      className="w-32 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-10 group-hover:translate-y-4"
                    />
                  </div>
                }
              />
            </TiltCard>
          </Reveal>

          <Reveal delay={270}>
            <TiltCard className="group h-full">
              <Card
                icon={<Music4 className="h-4 w-4" />}
                title={t.play4t}
                desc={t.play4d}
                media={vid(A.video.dance)}
              />
            </TiltCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
