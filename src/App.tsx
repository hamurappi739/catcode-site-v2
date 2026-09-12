import { useEffect, useState } from "react";
import { LangProvider } from "./lib/lang";
import Header from "./components/Header";
import Hero from "./components/Hero";
import DesktopDemo from "./components/DesktopDemo";
import Rhythm from "./sections/Rhythm";
import Play from "./sections/Play";
import Care from "./sections/Care";
import Skins from "./sections/Skins";
import Privacy from "./sections/Privacy";
import { Platforms, FinalCta, Faq, Footer } from "./sections/Closing";

function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const fn = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? h.scrollTop / max : 0);
    };
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-cyan-neon shadow-[0_0_12px_rgba(46,230,255,0.55)]"
      style={{ transform: `scaleX(${p})` }}
    />
  );
}

export default function App() {
  return (
    <LangProvider>
      <ScrollProgress />
      <Header />
      <main className="relative">
        <Hero />
        <DesktopDemo />
        <Rhythm />
        <Play />
        <Care />
        <Skins />
        <Privacy />
        <Platforms />
        <FinalCta />
        <Faq />
      </main>
      <Footer />
    </LangProvider>
  );
}
