"use client";

import { animate, type JSAnimation } from "animejs/animation";
import { useLayoutEffect, useRef } from "react";

/**
 * Número que, al cambiar, cuenta del valor anterior al nuevo (anime.js).
 * En el primer render muestra el valor final directo: no hay salto ni parpadeo.
 * Anima el nodo de texto que maneja React, así React lo sigue reconociendo.
 */
export function CountUp({
  value,
  format,
  className,
  duration = 650,
}: {
  value: number;
  format: (v: number) => string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const mostrado = useRef(value);
  const anim = useRef<JSAnimation | null>(null);

  useLayoutEffect(() => {
    const nodo = ref.current?.firstChild;
    const desde = mostrado.current;
    if (!nodo || desde === value) return;
    anim.current?.pause();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      mostrado.current = value;
      return;
    }
    // React ya escribió el valor final; arrancamos desde el que se veía.
    nodo.nodeValue = format(desde);
    const estado = { v: desde };
    anim.current = animate(estado, {
      v: value,
      duration,
      ease: "outExpo",
      onUpdate: () => {
        mostrado.current = estado.v;
        nodo.nodeValue = format(estado.v);
      },
      onComplete: () => {
        mostrado.current = value;
        nodo.nodeValue = format(value);
      },
    });
    return () => {
      anim.current?.pause();
    };
  }, [value, format, duration]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
