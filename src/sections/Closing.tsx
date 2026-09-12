import { useState } from "react";
import { Apple, ChevronDown, Infinity as InfinityIcon, MonitorSmartphone, Send, ShieldCheck, Terminal, WifiOff } from "lucide-react";
import { Reveal, SectionHead } from "../components/Reveal";
import { A, TELEGRAM_URL } from "../lib/assets";
import { useLang } from "../lib/lang";

function WindowsGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="8" height="7" rx="0.5" />
      <rect x="13" y="4" width="8" height="7" rx="0.5" />
      <rect x="3" y="13" width="8" height="7" rx="0.5" />
      <rect x="13" y="13" width="8" height="7" rx="0.5" />
    </svg>
  );
}

export function Platforms() {
  const { t } = useLang();
  const items = [
    { icon: <WindowsGlyph className="h-6 w-6" />, name: "Windows", ver: t.platformWin },
    { icon: <Apple className="h-6 w-6" />, name: "macOS", ver: t.platformMac },
    { icon: <Terminal className="h-6 w-6" />, name: "Linux", ver: t.platformLinux },
  ];
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-24">
      <div aria-hidden className="absolute left-0 top-0 h-px w-full bg-white/[0.05]" />
      <SectionHead eyebrow={t.platformsEyebrow} title={t.platformsTitle} align="center" />
      <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
        {items.map((it, i) => (
          <Reveal key={it.name} delay={i * 100}>
            <div className="group flex flex-col items-center gap-3 rounded-2xl border border-white/[0.08] bg-ink-900/70 px-6 py-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-cyan-neon/30 hover:shadow-[0_24px_60px_-24px_rgba(46,230,255,0.25)]">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.05] text-mist-400 ring-1 ring-white/10 transition-colors group-hover:bg-cyan-neon/15 group-hover:text-cyan-neon group-hover:ring-cyan-neon/30">
                {it.icon}
              </span>
              <span className="font-display text-[15px] font-semibold text-frost-100">{it.name}</span>
              <span className="font-mono text-[11px] text-mist-500">{it.ver}</span>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={250}>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 font-mono text-[11px] uppercase tracking-[0.18em] text-mist-500">
          <span className="flex items-center gap-2">
            <MonitorSmartphone className="h-3.5 w-3.5 text-cyan-neon" /> always on top
          </span>
          <span className="flex items-center gap-2">
            <InfinityIcon className="h-3.5 w-3.5 text-cyan-neon" /> {t.heroBadge1}
          </span>
          <span className="flex items-center gap-2">
            <WifiOff className="h-3.5 w-3.5 text-cyan-neon" /> {t.heroBadge2}
          </span>
        </div>
      </Reveal>
    </section>
  );
}

export function FinalCta() {
  const { t } = useLang();
  return (
    <section className="relative px-4 py-16 md:px-8 md:py-24">
      <Reveal className="mx-auto max-w-5xl">
        <div className="noise relative overflow-hidden rounded-[28px] border border-cyan-neon/20 bg-ink-900/80 px-6 py-14 text-center shadow-[0_60px_140px_-40px_rgba(46,230,255,0.18)] md:px-14 md:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[-30%] h-[420px] w-[720px] max-w-[120%] -translate-x-1/2 opacity-[0.13]"
            style={{ background: "radial-gradient(closest-side, #2ee6ff, transparent)" }}
          />
          <div aria-hidden className="absolute inset-0 bg-grid opacity-60" />

          <div className="relative">
            <div className="flex justify-center">
              <img
                src={A.cat.idle}
                alt=""
                draggable={false}
                className="w-24 drop-shadow-[0_16px_28px_rgba(0,0,0,0.6)] md:w-28"
              />
            </div>
            <div className="mt-6 font-mono text-[10.5px] uppercase tracking-[0.3em] text-cyan-neon">{t.ctaEyebrow}</div>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-[clamp(1.7rem,4vw,3rem)] font-bold leading-[1.1] text-frost-100">
              {t.ctaTitle}
            </h2>
            <div className="mt-7 flex items-end justify-center gap-3">
              <span className="font-display text-5xl font-bold leading-none text-frost-100 md:text-6xl">{t.ctaPrice}</span>
              <span className="pb-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-mist-500">{t.ctaPer}</span>
            </div>
            <div className="mt-9 flex flex-col items-center gap-4">
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 rounded-full bg-cyan-neon px-9 py-4 text-[16px] font-semibold text-ink-950 transition-all duration-300 hover:bg-frost-100 hover:shadow-[0_0_60px_rgba(46,230,255,0.45)]"
              >
                <Send className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                {t.ctaButton}
              </a>
              <span className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-mist-500">
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-neon/70" />
                {t.ctaNote} · t.me/catcodeapp
              </span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function Faq() {
  const { t } = useLang();
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="relative mx-auto max-w-4xl px-4 py-20 md:px-8 md:py-28">
      <div aria-hidden className="absolute left-0 top-0 h-px w-full bg-white/[0.05]" />
      <SectionHead eyebrow={t.faqEyebrow} title={t.faqTitle} />
      <div className="mt-10 space-y-3">
        {(t.faq as unknown as { q: string; a: string }[]).map((item, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={item.q} delay={i * 60}>
              <div
                className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
                  isOpen ? "border-cyan-neon/30 bg-ink-900/80" : "border-white/[0.08] bg-ink-900/50 hover:border-white/[0.16]"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center gap-4 px-5 py-4.5 text-left md:px-6"
                >
                  <span className="font-mono text-[11px] text-cyan-neon/70">0{i + 1}</span>
                  <span className="flex-1 text-[15px] font-medium text-frost-100 md:text-[16px]">{item.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-mist-500 transition-transform duration-300 ${isOpen ? "rotate-180 text-cyan-neon" : ""}`}
                  />
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 pl-[52px] text-[14px] leading-relaxed text-mist-500 md:px-6 md:pl-[60px]">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="relative border-t border-white/[0.06] px-4 py-10 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 md:flex-row">
        <div className="flex items-center gap-3">
          <img src={A.logo} alt="CatCode" className="h-8 w-8 rounded-lg" />
          <div>
            <div className="font-display text-[14px] font-semibold text-frost-100">CatCode</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-mist-500">{t.footerTagline}</div>
          </div>
        </div>
        <div className="flex items-center gap-6 font-mono text-[11px] text-mist-500">
          <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 transition-colors hover:text-cyan-neon">
            <Send className="h-3.5 w-3.5" />
            t.me/catcodeapp
          </a>
          <span className="hidden text-mist-500/60 sm:inline">{t.footerAlt}</span>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-mist-500/60">
          {t.footerRights} · 2026
        </div>
      </div>
    </footer>
  );
}
