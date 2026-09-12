import { useState } from "react";
import { Check, Eye, EyeOff, Move, SlidersHorizontal, WifiOff, X } from "lucide-react";
import { Reveal, SectionHead } from "../components/Reveal";
import { A } from "../lib/assets";
import { useLang } from "../lib/lang";

function MechanicsToggles() {
  const { t } = useLang();
  const [flags, setFlags] = useState([true, true, false, false]);
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-ink-900/70 p-6">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-neon/15 text-cyan-neon ring-1 ring-cyan-neon/30">
          <SlidersHorizontal className="h-4 w-4" />
        </span>
        <h3 className="font-display text-[16px] font-semibold text-frost-100">{t.privacyControlT}</h3>
      </div>
      <p className="mt-3 text-[13.5px] leading-relaxed text-mist-500">{t.privacyControlD}</p>
      <div className="mt-5 space-y-2">
        {(t.privacyMech as unknown as string[]).map((label, i) => (
          <button
            key={label}
            onClick={() => setFlags((f) => f.map((v, j) => (j === i ? !v : v)))}
            className="flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 transition-colors hover:border-white/[0.12]"
          >
            <span className="font-mono text-[12px] text-mist-400">{label}</span>
            <span className={`relative h-5 w-9 rounded-full transition-colors ${flags[i] ? "bg-cyan-neon" : "bg-white/15"}`}>
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full transition-all ${
                  flags[i] ? "left-[18px] bg-ink-950" : "left-0.5 bg-mist-400"
                }`}
              />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function SizeControl() {
  const { t } = useLang();
  const [size, setSize] = useState(100);
  const [edge, setEdge] = useState(1); // 0 left 1 center 2 right
  const [pos] = useState([8, 50, 92]);
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-ink-900/70 p-6">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-neon/15 text-cyan-neon ring-1 ring-cyan-neon/30">
          <Move className="h-4 w-4" />
        </span>
        <h3 className="font-display text-[16px] font-semibold text-frost-100">{t.privacyQuietT}</h3>
      </div>
      <p className="mt-3 text-[13.5px] leading-relaxed text-mist-500">{t.privacyQuietD}</p>

      {/* мини-стол */}
      <div className="relative mt-5 h-32 overflow-hidden rounded-xl border border-white/[0.07] bg-grid bg-ink-950">
        <img
          src={A.cat.idle}
          alt=""
          draggable={false}
          className="absolute bottom-1.5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ left: `${pos[edge]}%`, transform: `translateX(-50%)`, width: `${size * 0.56}px` }}
        />
        {[0, 1, 2].map((e) => (
          <button
            key={e}
            onClick={() => setEdge(e)}
            aria-label={`edge ${e}`}
            className={`absolute top-2 h-4 w-4 rounded-full border transition-colors ${
              edge === e ? "border-cyan-neon bg-cyan-neon/25" : "border-white/20 bg-white/[0.04] hover:border-white/40"
            }`}
            style={{ left: `${pos[e]}%`, transform: "translateX(-50%)" }}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-mist-500">{t.privacyQuietDemoSize}</span>
        <input
          type="range"
          min={60}
          max={170}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/15 accent-cyan-neon"
        />
        <span className="w-10 text-right font-mono text-[11px] tabular-nums text-cyan-neon">{size}%</span>
      </div>
    </div>
  );
}

function OfflineCard() {
  const { t } = useLang();
  return (
    <div className="flex flex-col rounded-2xl border border-white/[0.08] bg-ink-900/70 p-6">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-neon/15 text-cyan-neon ring-1 ring-cyan-neon/30">
          <WifiOff className="h-4 w-4" />
        </span>
        <h3 className="font-display text-[16px] font-semibold text-frost-100">{t.privacyOfflineT}</h3>
      </div>
      <p className="mt-3 text-[13.5px] leading-relaxed text-mist-500">{t.privacyOfflineD}</p>
      <div className="mt-auto space-y-0 pt-6">
        {["activation · online", "catcode · offline"].map((s, i) => (
          <div key={s} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full ring-1 ${
                  i === 0 ? "bg-cyan-neon/15 ring-cyan-neon/40" : "bg-white/[0.05] ring-white/15"
                }`}
              >
                <Check className={`h-3 w-3 ${i === 0 ? "text-cyan-neon" : "text-mist-400"}`} />
              </span>
              {i === 0 && <span className="my-1 h-6 w-px bg-white/10" />}
            </div>
            <div className="pb-2 font-mono text-[11px] leading-5 text-mist-400">
              {s}
              {i === 1 && <span className="ml-2 rounded-full bg-cyan-neon/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-cyan-neon ring-1 ring-cyan-neon/30">ok</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Privacy() {
  const { t } = useLang();
  return (
    <section id="privacy" className="relative mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
      <div aria-hidden className="absolute left-0 top-0 h-px w-full bg-white/[0.05]" />
      <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div>
          <SectionHead eyebrow={t.privacyEyebrow} title={t.privacyTitle} lead={t.privacyText} />
          <Reveal delay={250}>
            <div className="mt-10 space-y-4">
              <div className="rounded-2xl border border-white/[0.08] bg-ink-900/60 p-5">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-neon">
                  <Eye className="h-3.5 w-3.5" />
                  {t.privacySeesT}
                </div>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {(t.privacySees as unknown as string[]).map((s) => (
                    <li key={s} className="flex items-center gap-2 text-[13px] text-mist-400">
                      <Check className="h-3.5 w-3.5 shrink-0 text-cyan-neon" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-ink-900/60 p-5">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-mist-400">
                  <EyeOff className="h-3.5 w-3.5" />
                  {t.privacyNotT}
                </div>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {(t.privacyNot as unknown as string[]).map((s) => (
                    <li key={s} className="flex items-center gap-2 text-[13px] text-mist-500">
                      <X className="h-3.5 w-3.5 shrink-0 text-mist-500/70" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="grid content-start gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <Reveal delay={120}>
            <MechanicsToggles />
          </Reveal>
          <Reveal delay={200}>
            <SizeControl />
          </Reveal>
          <Reveal delay={280} className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
            <OfflineCard />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
