"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import styles from "./Reveal.module.css";

/**
 * Entrada al scrollear: sube 16px y aparece. La animación es CSS pura; acá solo
 * se detecta cuándo entra en pantalla. Expone data-inview para que animaciones
 * CSS internas (como las del timeline) arranquen recién al verse.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
}) {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      // @ts-expect-error: el ref sirve para cualquiera de los tags permitidos
      ref={ref}
      className={[styles.reveal, className].filter(Boolean).join(" ")}
      data-inview={seen}
      style={{ "--reveal-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
