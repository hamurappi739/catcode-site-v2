import { useEffect, useState } from "react";
import { A, TELEGRAM_URL } from "../lib/assets";
import { useLang, type Lang } from "../lib/lang";
import { Send } from "lucide-react";

const SECTIONS = [
  ["demo", "demo"],
  ["rhythm", "rhythm"],
  ["play", "play"],
  ["focus", "focus"],
  ["skins", "skins"],
  ["faq", "faq"],
] as const;

function FlagButton({ lang, current, onPick }: { lang: Lang; current: Lang; onPick: (l: Lang) => void }) {
  const active = lang === current;
  return (
    <button
      onClick={() => onPick(lang)}
      aria-label={lang === "ru" ? "Русский" : "English"}
      className={`relative h-7 w-10 overflow-hidden rounded-md ring-1 transition-all duration-300 ${
        active ? "ring-cyan-neon opacity-100 scale-100" : "ring-white/10 opacity-40 hover:opacity-80 scale-95"
      }`}
    >
      <img src={lang === "ru" ? A.flagRu : A.flagUs} alt="" className="h-full w-full object-cover" />
    </button>
  );
}

export default function Header() {
  const { t, lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-ink-950/85 backdrop-blur-xl border-b border-white/[0.06]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:px-8">
        <a href="#top" className="flex items-center gap-2.5 shrink-0">
          <img src={A.logo} alt="CatCode" className="h-8 w-8 rounded-lg" />
          <span className="font-display text-[15px] font-semibold tracking-wide text-frost-100">
            CatCode
          </span>
        </a>

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {SECTIONS.map(([id, key]) => (
            <a
              key={id}
              href={`#${id}`}
              className="rounded-full px-3 py-1.5 font-mono text-[11.5px] tracking-wider text-mist-500 transition-colors hover:text-frost-100 hover:bg-white/[0.05]"
            >
              {t.nav[key]}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] p-1">
            <FlagButton lang="ru" current={lang} onPick={setLang} />
            <FlagButton lang="en" current={lang} onPick={setLang} />
          </div>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="group hidden sm:flex items-center gap-2 rounded-full bg-cyan-neon px-4 py-2 text-[13px] font-semibold text-ink-950 transition-all hover:bg-frost-100 hover:shadow-[0_0_24px_rgba(46,230,255,0.35)]"
          >
            <Send className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            {t.headerCta}
          </a>
        </div>
      </div>
    </header>
  );
}
