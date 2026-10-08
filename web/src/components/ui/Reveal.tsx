"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState, type ReactNode } from "react";

/**
 * Entrada al scrollear: sube 16px y aparece. Bajo reduced-motion solo hace fade.
 * Expone data-inview para que animaciones CSS internas arranquen recién al verse.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
}) {
  const reduce = useReducedMotion();
  const [seen, setSeen] = useState(false);
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      data-inview={seen}
      initial={{ opacity: 0, transform: reduce ? "none" : "translateY(16px)" }}
      whileInView={{ opacity: 1, transform: "translateY(0px)" }}
      onViewportEnter={() => setSeen(true)}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduce ? 0.2 : 0.7, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </Tag>
  );
}
