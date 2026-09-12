import { useState } from "react";
import { Paintbrush, RotateCcw } from "lucide-react";
import CatSprite from "../components/CatSprite";
import { LazyIn, Reveal, SectionHead } from "../components/Reveal";
import { A, type CatPalette } from "../lib/assets";
import { useLang } from "../lib/lang";

type Draft = {
  fur: string;
  outline: string;
  eye: string;
  eyeL: string;
  eyeR: string;
  eyeBg: string;
  pupil: number;
  odd: boolean;
};

const DEFAULTS: Draft = {
  fur: "#1a1a1a",
  outline: "#ffffff",
  eye: "#1a1a1a",
  eyeL: "#7ee0ff",
  eyeR: "#ffd166",
  eyeBg: "#ffffff",
  pupil: 100,
  odd: false,
};

type Preset = { name: string; palette: CatPalette; swatch: string };

const PRESETS: Preset[] = [
  { name: "Snowball", palette: { asset: "/assets/skin-snowball.png", fur: "#fbfcff", outline: "#d7e3f5", eye: "#5bc3e1", eyeBg: "#ffffff" }, swatch: "#fbfcff" },
  { name: "Ginger", palette: { asset: "/assets/skin-ginger.png", fur: "#e8a05c", outline: "#7a4326", eye: "#48dfe1", eyeBg: "#27130a" }, swatch: "#e8a05c" },
  { name: "Black", palette: { asset: "/assets/skin-black.png", fur: "#1a1a1a", outline: "#343434", eye: "#f5bf2d", eyeBg: "#0b0f14" }, swatch: "#1a1a1a" },
  { name: "Ocean Blue", palette: { asset: "/assets/skin-ocean-blue.png", fur: "#0c4e9c", outline: "#06366e", eye: "#f0c56a", eyeBg: "#071a38" }, swatch: "#0c4e9c" },
  { name: "Amethyst", palette: { asset: "/assets/skin-amethyst.png", fur: "#623096", outline: "#361a53", eye: "#40d2d2", eyeBg: "#171022" }, swatch: "#623096" },
  { name: "Rose Quartz", palette: { asset: "/assets/skin-rose-quartz.png", fur: "#ba6e80", outline: "#663c46", eye: "#6e3caa", eyeBg: "#24131b" }, swatch: "#ba6e80" },
];

type Mode = number | "custom"; // индекс пресета или кастом

function ColorWell({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-2.5 transition-colors hover:border-white/[0.14]">
      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-mist-400">{label}</span>
      <span className="flex items-center gap-2.5">
        <span className="font-mono text-[10.5px] text-mist-500/80">{value.toUpperCase()}</span>
        <span className="relative h-6 w-9 overflow-hidden rounded-md ring-1 ring-white/15" style={{ background: value }}>
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </span>
      </span>
    </label>
  );
}

export default function Skins() {
  const { t } = useLang();
  const [mode, setMode] = useState<Mode>(0);
  const [draft, setDraft] = useState<Draft>(DEFAULTS);

  const pickPreset = (i: number) => {
    setMode(i);
    const p = PRESETS[i].palette;
    const eye = p.eye ?? DEFAULTS.eye;
    setDraft({
      fur: p.fur ?? DEFAULTS.fur,
      outline: p.outline ?? DEFAULTS.outline,
      eye,
      eyeL: p.eyeL ?? eye,
      eyeR: p.eyeR ?? "#ffd166",
      eyeBg: p.eyeBg ?? DEFAULTS.eyeBg,
      pupil: p.pupil ?? 100,
      odd: false,
    });
  };

  const edit = (patch: Partial<Draft>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setMode("custom");
  };

  const palette: CatPalette =
    mode === "custom"
      ? {
          fur: draft.fur,
          outline: draft.outline,
          eyeBg: draft.eyeBg,
          pupil: draft.pupil,
          ...(draft.odd ? { eyeL: draft.eyeL, eyeR: draft.eyeR } : { eye: draft.eye }),
        }
      : {
          ...PRESETS[mode as number].palette,
          ...(draft.pupil !== 100 ? { pupil: draft.pupil } : {}),
        };

  const glowColor = mode === "custom" ? draft.fur : PRESETS[mode as number].swatch;

  return (
    <section id="skins" className="relative px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHead eyebrow={t.skinsEyebrow} title={t.skinsTitle} lead={t.skinsLead} />

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {/* ===== редактор ===== */}
          <Reveal>
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-900/70">
              <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-5 py-3.5">
                <Paintbrush className="h-4 w-4 text-cyan-neon" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist-400">{t.skinsEditorTitle}</span>
              </div>

              <div className="grid flex-1 sm:grid-cols-[0.9fr_1.1fr]">
                {/* сцена с котом */}
                <div className="relative flex items-end justify-center overflow-hidden bg-grid bg-ink-950 p-6 pb-0">
                  <div
                    aria-hidden
                    className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 transition-colors duration-500"
                    style={{ background: `radial-gradient(circle, ${glowColor}, transparent 65%)` }}
                  />
                  <div className="relative w-44 pb-5 md:w-48">
                    <LazyIn minHeight={190}>
                      <CatSprite mood="idle" palette={palette} follow={false} />
                    </LazyIn>
                  </div>
                  <div aria-hidden className="absolute bottom-4 mx-auto h-2.5 w-40 rounded-full bg-black/55 blur-[7px]" />
                </div>

                {/* контролы */}
                <div className="flex flex-col gap-2 border-t border-white/[0.06] p-4 sm:border-l sm:border-t-0">
                  <div className="grid gap-2">
                    <ColorWell label={t.skinsFur} value={draft.fur} onChange={(v) => edit({ fur: v })} />
                    <ColorWell label={t.skinsOutline} value={draft.outline} onChange={(v) => edit({ outline: v })} />
                    {draft.odd ? (
                      <>
                        <ColorWell label={`${t.skinsEyes} · ${t.skinsEyeL}`} value={draft.eyeL} onChange={(v) => edit({ eyeL: v })} />
                        <ColorWell label={`${t.skinsEyes} · ${t.skinsEyeR}`} value={draft.eyeR} onChange={(v) => edit({ eyeR: v })} />
                      </>
                    ) : (
                      <ColorWell label={t.skinsEyes} value={draft.eye} onChange={(v) => edit({ eye: v })} />
                    )}
                  </div>

                  <div className="mt-1 flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-2.5">
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-mist-400">{t.skinsOdd}</span>
                    <button
                      onClick={() => edit({ odd: !draft.odd })}
                      aria-label="odd eyes"
                      className={`relative h-5 w-9 rounded-full transition-colors ${draft.odd ? "bg-cyan-neon" : "bg-white/15"}`}
                    >
                      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-ink-950 transition-all ${draft.odd ? "left-[18px]" : "left-0.5 bg-mist-400"}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-2.5">
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-mist-400">{t.skinsPupil}</span>
                    <span className="flex items-center gap-2.5">
                      <span className="w-9 text-right font-mono text-[10.5px] tabular-nums text-mist-500/80">{draft.pupil}%</span>
                      <input
                        type="range"
                        min={50}
                        max={170}
                        value={draft.pupil}
                        onChange={(e) => setDraft((d) => ({ ...d, pupil: Number(e.target.value) }))}
                        className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-white/15 accent-cyan-neon"
                      />
                    </span>
                  </div>
                </div>
              </div>

              {/* пресеты */}
              <div className="border-t border-white/[0.06] p-4">
                <div className="mb-2.5 font-mono text-[9.5px] uppercase tracking-[0.24em] text-mist-500/80">{t.skinsPresetLabel}</div>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p, i) => (
                    <button
                      key={p.name}
                      onClick={() => pickPreset(i)}
                      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] transition-all ${
                        mode === i
                          ? "border-cyan-neon/60 bg-cyan-neon/10 text-cyan-neon"
                          : "border-white/10 bg-white/[0.03] text-mist-400 hover:text-frost-100"
                      }`}
                    >
                      <span className="h-3 w-3 rounded-full ring-1 ring-white/20" style={{ background: p.swatch }} />
                      {p.name}
                    </button>
                  ))}
                  {mode === "custom" && (
                    <span className="flex items-center gap-2 rounded-full border border-cyan-neon/60 bg-cyan-neon/10 px-3 py-1.5 text-[12px] text-cyan-neon">
                      <span className="h-3 w-3 rounded-full ring-1 ring-white/20" style={{ background: draft.fur }} />
                      custom
                    </span>
                  )}
                  <button
                    onClick={() => pickPreset(0)}
                    className="ml-auto flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[12px] text-mist-500 transition-colors hover:text-frost-100"
                  >
                    <RotateCcw className="h-3 w-3" />
                    {t.skinsReset}
                  </button>
                </div>
              </div>
            </div>
          </Reveal>

          {/* ===== каталог из приложения ===== */}
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
