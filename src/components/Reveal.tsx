import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "span";
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-visible");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

/** Монтирует тяжёлый контент (инлайн-SVG кота) только при приближении к вьюпорту. */
export function LazyIn({ children, minHeight = 160 }: { children: ReactNode; minHeight?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setOn(true);
          io.disconnect();
        }
      },
      { rootMargin: "480px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} style={on ? undefined : { minHeight }}>
      {on ? children : null}
    </div>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
}) {
  const centered = align === "center";
  return (
    <div className={`relative ${centered ? "text-center mx-auto" : ""} max-w-3xl`}>
      <Reveal>
        <div
          className={`flex items-center gap-3 font-mono text-[11px] tracking-[0.32em] uppercase text-cyan-neon ${
            centered ? "justify-center" : ""
          }`}
        >
          <span className="inline-block h-px w-8 bg-cyan-neon/60" />
          {eyebrow}
        </div>
      </Reveal>
      <Reveal delay={90}>
        <h2 className="mt-5 font-display text-[clamp(1.5rem,3.6vw,2.9rem)] font-semibold leading-[1.12] text-frost-100">
          {title}
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={180}>
          <p className="mt-4 text-[15px] leading-relaxed text-mist-500 md:text-base">{lead}</p>
        </Reveal>
      )}
    </div>
  );
}
