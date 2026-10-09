"use client";

import { CaretLeft, CaretRight, Trophy } from "@phosphor-icons/react";
// Imports por submódulo: así entra al bundle solo lo que se usa de anime.js
import { animate } from "animejs/animation";
import { createDrawable } from "animejs/svg";
import { createTimeline, type Timeline } from "animejs/timeline";
import { set, stagger } from "animejs/utils";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { ejercicios, rmEstimado, type Ejercicio } from "@/content/demo";
import { LineChart } from "./charts/LineChart";
import bezel from "./ui/Bezel.module.css";
import styles from "./HeroLedger.module.css";

// Ejercicios que se pueden ver en la ficha (datos reales de la planilla)
const fichas = ["hack", "hip", "prensa", "jalon"].map((id) => ejercicios.find((e) => e.id === id)!);

const fmt = (v: number) => v.toFixed(1).replace(".", ",");

function datosDe(ej: Ejercicio) {
  const semanas = ej.semanas.map((_, i) => `S${i + 1}`);
  const rm = ej.semanas.map((w) => (w ? Math.round(rmEstimado(w.kg, w.reps) * 10) / 10 : null));
  const registradas = rm.filter((v): v is number => v != null);
  const actual = registradas.length - 1;
  const mejora = (registradas[actual] / registradas[0] - 1) * 100;
  const record = registradas[actual] === Math.max(...registradas);
  return { semanas, rm, registradas, actual, mejora, record };
}

const textoMejora = (pct: number, semanas: number) => `+${fmt(pct)}% en ${semanas} semanas`;

// Entrada inicial: la línea tarda `seg` ms entre una semana y la siguiente; cada
// punto y cada columna de la tabla aparecen cuando la línea llega a esa semana.
const ENTRADA = { inicio: 250, seg: 300 };
// Al cambiar de ejercicio, la misma coreografía va más rápido.
const CAMBIO = { inicio: 120, seg: 110 };
// Si la página tardó en volverse interactiva, la primera vez se muestra todo sin animar.
const LIMITE_MS = 2200;

// Timeline en curso de cada ficha, para cortarlo si llega un cambio antes de que termine
const enCurso = new WeakMap<HTMLElement, Timeline>();

const prefiereQuieto = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Dibuja la línea, los puntos, las columnas y los números de la ficha. */
function coreografia(fig: HTMLElement, svgEl: SVGSVGElement, ritmo: { inicio: number; seg: number }) {
  const { inicio, seg } = ritmo;
  const n = Number(fig.dataset.actual);
  const fin = inicio + seg * n;
  const desde = Number(fig.dataset.rmDesde);
  const hasta = Number(fig.dataset.rmHasta);
  const mejora = Number(fig.dataset.mejora);
  fig.dataset.anim = "js";

  const path = svgEl.querySelector<SVGPathElement>("[data-line]");
  const puntos = [...svgEl.querySelectorAll<SVGCircleElement>("[data-marker]")];
  const etiqueta = svgEl.querySelector<SVGTextElement>("[data-endlabel]");
  const columna = (c: number) => [...fig.querySelectorAll<HTMLElement>(`[data-col="${c}"]`)];
  const total = fig.querySelectorAll("[role=columnheader][data-col]").length;
  const pendientes = Array.from({ length: Math.max(0, total - n - 1) }, (_, k) => columna(n + 1 + k)).flat();
  const finales = [...fig.querySelectorAll<HTMLElement>("[data-final]")];
  const delta = fig.querySelector<HTMLElement>("[data-delta]");

  enCurso.get(fig)?.pause();
  set(puntos, { opacity: 0, scale: 0.3 });
  // El récord y la mejora son los mismos elementos de una ficha a otra: se ocultan hasta su turno
  set([...finales, ...(delta ? [delta] : [])], { opacity: 0 });
  const tl = createTimeline({ defaults: { ease: "outExpo" } });
  enCurso.set(fig, tl);

  if (path) {
    const [linea] = createDrawable(path);
    set(linea, { draw: "0 0" });
    tl.add(linea, { draw: ["0 0", "0 1"], duration: seg * n, ease: "inOutSine" }, inicio);
  }
  tl.add(puntos, { opacity: 1, scale: [0.3, 1], duration: 520, ease: "outBack" }, stagger(seg, { start: inicio }));
  for (let c = 0; c <= n; c++) {
    tl.add(columna(c), { opacity: [0, 1], y: [8, 0], duration: 560, delay: stagger(40) }, inicio + c * seg);
  }
  if (pendientes.length) tl.add(pendientes, { opacity: [0, 1], duration: 400, delay: stagger(60) }, fin);

  // El RM de la etiqueta sube mientras la línea crece
  const nodoRm = etiqueta?.firstChild;
  if (nodoRm) {
    nodoRm.nodeValue = fmt(desde);
    const valor = { v: desde };
    tl.add(
      valor,
      {
        v: hasta,
        duration: seg * n,
        ease: "inOutSine",
        onUpdate: () => {
          nodoRm.nodeValue = fmt(valor.v);
        },
      },
      inicio,
    );
  }

  // Al llegar a la última semana aparece el récord y la mejora cuenta desde cero
  if (finales.length) tl.add(finales, { opacity: [0, 1], scale: [0.85, 1], duration: 640, ease: "outBack" }, fin);
  const nodoDelta = delta?.firstChild;
  if (delta && nodoDelta) {
    const pct = { v: 0 };
    tl.add(delta, { opacity: [0, 1], duration: 400 }, fin);
    tl.add(
      pct,
      {
        v: mejora,
        duration: 1000,
        onUpdate: () => {
          nodoDelta.nodeValue = textoMejora(pct.v, n + 1);
        },
      },
      fin,
    );
  }
  tl.then(() => {
    fig.dataset.anim = "done";
  });
}

export function HeroLedger() {
  const [idx, setIdx] = useState(0);
  const figRef = useRef<HTMLElement>(null);
  const flipRef = useRef<HTMLDivElement>(null);
  const girando = useRef(false);
  const direccion = useRef(1);
  const anterior = useRef(idx);

  const ej = fichas[idx];
  const { semanas, rm, registradas, actual, mejora, record } = datosDe(ej);

  // Primera vez que se dibuja el gráfico
  const alMontar = useCallback((svgEl: SVGSVGElement) => {
    const fig = figRef.current;
    if (!fig) return;
    if (prefiereQuieto() || performance.now() > LIMITE_MS) {
      fig.dataset.anim = "done";
      return;
    }
    coreografia(fig, svgEl, ENTRADA);
  }, []);

  // Cambio de ejercicio: la ficha termina de girar mostrando el nuevo y se redibuja
  useLayoutEffect(() => {
    if (anterior.current === idx) return;
    anterior.current = idx;
    const fig = figRef.current;
    const flip = flipRef.current;
    const svgEl = fig?.querySelector<SVGSVGElement>("svg[role=img]");
    if (!fig || !flip || !svgEl) return;
    if (prefiereQuieto()) {
      fig.dataset.anim = "done";
      girando.current = false;
      return;
    }
    set(flip, { rotateY: -90 * direccion.current });
    animate(flip, {
      rotateY: 0,
      scale: [0.96, 1],
      duration: 650,
      ease: "outBack(1.1)",
      onComplete: () => {
        girando.current = false;
      },
    });
    coreografia(fig, svgEl, CAMBIO);
  }, [idx]);

  const irA = (destino: number, dir: number) => {
    const siguiente = (destino + fichas.length) % fichas.length;
    if (girando.current || siguiente === idx) return;
    if (prefiereQuieto() || !flipRef.current) {
      setIdx(siguiente);
      return;
    }
    girando.current = true;
    direccion.current = dir;
    // Primera mitad del giro: la ficha queda de canto y ahí se cambian los datos
    animate(flipRef.current, {
      rotateY: 90 * dir,
      scale: 0.96,
      duration: 260,
      ease: "inQuad",
      onComplete: () => setIdx(siguiente),
    });
  };

  return (
    <div className={styles.stage}>
      <div ref={flipRef} className={styles.flipper}>
        <figure
          ref={figRef}
          className={`${bezel.shell} ${styles.fig}`}
          data-anim="pending"
          data-actual={actual}
          data-rm-desde={registradas[0]}
          data-rm-hasta={registradas[actual]}
          data-mejora={mejora}
        >
          <div className={`${bezel.core} ${styles.card}`}>
            <header className={styles.head}>
              <div>
                <p className={styles.kicker}>
                  {ej.dia} · {ej.musculo}
                </p>
                <h2 className={styles.name} aria-live="polite">
                  {ej.nombre}
                </h2>
              </div>
              {record && (
                <span className={styles.badge} data-final="" data-reveal="">
                  <Trophy size={16} weight="fill" aria-hidden="true" />
                  Récord en S{actual + 1}
                </span>
              )}
            </header>

            <LineChart
              labels={semanas}
              series={[{ id: "rm", label: "RM estimado", values: rm }]}
              height={196}
              format={fmt}
              endLabel
              draw="none"
              drawKey={ej.id}
              onMount={alMontar}
              ariaLabel={`RM estimado de ${ej.nombre} por semana: de ${fmt(registradas[0])} a ${fmt(registradas[actual])} kilos en ${actual + 1} semanas.`}
            />

            <div className={styles.ledger} role="table" aria-label={`Registro semanal de cargas de ${ej.nombre}`}>
              <div role="row" className={styles.row}>
                <span role="rowheader" className={styles.rh}>
                  Semana
                </span>
                {semanas.map((s, i) => (
                  <span role="columnheader" key={s} data-col={i} data-reveal="" className={`mono ${i === actual ? styles.now : ""}`}>
                    {s}
                  </span>
                ))}
              </div>
              <div role="row" className={styles.row}>
                <span role="rowheader" className={styles.rh}>
                  Kg × reps
                </span>
                {ej.semanas.map((w, i) => (
                  <span
                    role="cell"
                    key={`${ej.id}-${i}`}
                    data-col={i}
                    data-reveal=""
                    className={`mono ${i === actual ? styles.now : ""} ${!w ? styles.empty : ""}`}
                  >
                    {w ? `${w.kg}×${w.reps}` : "-"}
                  </span>
                ))}
              </div>
              <div role="row" className={styles.row}>
                <span role="rowheader" className={styles.rh}>
                  RM est.
                </span>
                {rm.map((v, i) => (
                  <span
                    role="cell"
                    key={`${ej.id}-${i}`}
                    data-col={i}
                    data-reveal=""
                    className={`mono ${styles.rm} ${i === actual ? styles.now : ""} ${v == null ? styles.empty : ""}`}
                  >
                    {v == null ? "-" : Math.round(v)}
                  </span>
                ))}
              </div>
            </div>

            <footer className={styles.foot}>
              <p className={styles.formula}>RM = kg × (1 + reps ÷ 30)</p>
              <p className={`mono ${styles.delta}`} data-delta="" data-reveal="">
                {textoMejora(mejora, actual + 1)}
              </p>
            </footer>
          </div>
          <figcaption className="srOnly">Ejemplo real de la planilla de progresión de Athlos.</figcaption>
        </figure>
      </div>

      <div className={styles.switcher} role="group" aria-label="Cambiar de ejercicio">
        <button type="button" className={styles.arrow} onClick={() => irA(idx - 1, -1)} aria-label="Ejercicio anterior">
          <CaretLeft size={16} weight="bold" />
        </button>
        <div className={styles.dots}>
          {fichas.map((f, i) => (
            <button
              key={f.id}
              type="button"
              className={styles.dot}
              aria-label={f.nombre}
              aria-current={i === idx}
              onClick={() => irA(i, i > idx ? 1 : -1)}
            />
          ))}
        </div>
        <button type="button" className={styles.arrow} onClick={() => irA(idx + 1, 1)} aria-label="Ejercicio siguiente">
          <CaretRight size={16} weight="bold" />
        </button>
      </div>
    </div>
  );
}
