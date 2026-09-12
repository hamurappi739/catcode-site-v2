import { Check, Palette } from "lucide-react";
import { useState } from "react";
import CatSprite from "../components/CatSprite";
import { Reveal, SectionHead } from "../components/Reveal";
import { A, type CatPalette } from "../lib/assets";
import { useLang } from "../lib/lang";

type Preset = { name: string; palette: CatPalette; swatch: string };

const PRESETS: Preset[] = [
  { name: "Snowball", palette: { asset: "/assets/skin-snowball.png", fur: "#fbfcff" }, swatch: "#fbfcff" },
  { name: "Ginger", palette: { asset: "/assets/skin-ginger.png", fur: "#e8a05c" }, swatch: "#e8a05c" },
  { name: "Black", palette: { asset: "/assets/skin-black.png", fur: "#1a1a1a" }, swatch: "#1a1a1a" },
  { name: "Ocean Blue", palette: { asset: "/assets/skin-ocean-blue.png", fur: "#0c4e9c" }, swatch: "#0c4e9c" },
  { name: "Amethyst", palette: { asset: "/assets/skin-amethyst.png", fur: "#623096" }, swatch: "#623096" },
  { name: "Rose Quartz", palette: { asset: "/assets/skin-rose-quartz.png", fur: "#ba6e80" }, swatch: "#ba6e80" },
];

export default function Skins() {
  const { t } = useLang();
  const [selected, setSelected] = useState(0);
  const preset = PRESETS[selected];

  return (
    <section id="skins" className="relative px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHead eyebrow={t.skinsEyebrow} title={t.skinsTitle} lead={t.skinsLead} />

        <div className="mt-12 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-900/70">
              <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-5 py-3.5">
                <Palette className="h-4 w-4 text-cyan-neon" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist-400">{t.skinsEditorTitle}</span>
              </div>

              <div className="relative flex min-h-[340px] flex-1 items-center justify-center overflow-hidden bg-grid bg-ink-950 p-8">
                <div
                  aria-hidden
                  className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 transition-colors duration-500"
                  style={{ background: `radial-gradient(circle, ${preset.swatch}, transparent 65%)` }}
                />
                <div className="relative w-64 md:w-72">
                  <CatSprite mood="idle" palette={preset.palette} follow={false} />
                  <div aria-hidden className="mx-auto mt-[-4px] h-3 w-3/4 rounded-full bg-black/55 blur-[7px]" />
                </div>
              </div>

              <div className="border-t border-white/[0.06] p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mist-500">{t.skinsPresetLabel}</span>
                  <span className="text-sm font-semibold text-frost-100">{preset.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {PRESETS.map((item, index) => (
                    <button
                      key={item.name}
                      onClick={() => setSelected(index)}
                      className={`flex min-h-10 items-center gap-2 rounded-xl border px-3 py-2 text-left text-[12px] transition-all ${
                        selected === index
                          ? "border-cyan-neon/60 bg-cyan-neon/10 text-cyan-neon"
                          : "border-white/10 bg-white/[0.03] text-mist-400 hover:border-white/20 hover:text-frost-100"
                      }`}
                    >
                      <span className="h-3.5 w-3.5 shrink-0 rounded-full ring-1 ring-white/20" style={{ background: item.swatch }} />
                      <span className="truncate">{item.name}</span>
                      {selected === index && <Check className="ml-auto h-3.5 w-3.5 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="flex h-full flex-col gap-5">
              <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-900/70">
                <div className="flex h-8 items-center gap-2 border-b border-white/[0.06] bg-white/[0.02] px-3">
                  <span className="flex gap-1.5">
                    <span className="block h-2 w-2 rounded-full bg-white/15" />
                    <span className="block h-2 w-2 rounded-full bg-white/10" />
                    <span className="block h-2 w-2 rounded-full bg-white/[0.07]" />
                  </span>
                  <span className="ml-1 font-mono text-[9.5px] uppercase tracking-[0.22em] text-mist-500/80">
                    skins.webm · {t.skinsCatalog}
                  </span>
                </div>
                <video
                  src={A.video.skins}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="block max-h-[340px] w-full bg-ink-950 object-contain"
                />
              </div>

              <div className="rounded-2xl border border-cyan-neon/20 bg-cyan-neon/[0.04] p-5">
                <p className="text-[14px] leading-relaxed text-mist-400">
                  <span className="font-semibold text-cyan-neon">note: </span>
                  {t.skinsNote}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {(t.skinsParts as unknown as string[]).map((label) => (
                  <div
                    key={label}
                    className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-3 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-mist-500"
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
