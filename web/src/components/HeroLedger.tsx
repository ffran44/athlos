"use client";

import { Trophy } from "@phosphor-icons/react";
// Imports por submódulo: así entra al bundle solo lo que se usa de anime.js
import { createDrawable } from "animejs/svg";
import { createTimeline } from "animejs/timeline";
import { set, stagger } from "animejs/utils";
import { useCallback, useRef } from "react";
import { ejercicios, rmEstimado } from "@/content/demo";
import { LineChart } from "./charts/LineChart";
import bezel from "./ui/Bezel.module.css";
import styles from "./HeroLedger.module.css";

const ej = ejercicios[0]; // Hack Squat, datos reales de la planilla
const semanas = ej.semanas.map((_, i) => `S${i + 1}`);
const rm = ej.semanas.map((w) => (w ? Math.round(rmEstimado(w.kg, w.reps) * 10) / 10 : null));
const registradas = rm.filter((v): v is number => v != null);
const actual = registradas.length - 1;
const mejoraNum = (registradas[actual] / registradas[0] - 1) * 100;

const fmt = (v: number) => v.toFixed(1).replace(".", ",");
const textoMejora = (pct: number) => `+${fmt(pct)}% en ${actual + 1} semanas`;

// Coreografía: la línea tarda SEG ms entre una semana y la siguiente. Cada punto
// y cada columna de la tabla aparecen cuando la línea llega a esa semana.
const INICIO = 250;
const SEG = 300;
const FIN_LINEA = INICIO + SEG * actual;
// Si la página tardó en volverse interactiva, se muestra todo sin animar.
const LIMITE_MS = 2200;

export function HeroLedger() {
  const figRef = useRef<HTMLElement>(null);

  const coreografia = useCallback((svgEl: SVGSVGElement) => {
    const fig = figRef.current;
    if (!fig) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || performance.now() > LIMITE_MS) {
      fig.dataset.anim = "done";
      return;
    }
    fig.dataset.anim = "js";

    const path = svgEl.querySelector<SVGPathElement>("[data-line]");
    const puntos = [...svgEl.querySelectorAll<SVGCircleElement>("[data-marker]")];
    const etiqueta = svgEl.querySelector<SVGTextElement>("[data-endlabel]");
    const columna = (c: number) => [...fig.querySelectorAll<HTMLElement>(`[data-col="${c}"]`)];
    const pendientes = semanas.slice(actual + 1).flatMap((_, k) => columna(actual + 1 + k));
    const finales = [...fig.querySelectorAll<HTMLElement>("[data-final]")];
    const delta = fig.querySelector<HTMLElement>("[data-delta]");

    set(puntos, { opacity: 0, scale: 0.3 });
    const tl = createTimeline({ defaults: { ease: "outExpo" } });

    if (path) {
      const [linea] = createDrawable(path);
      set(linea, { draw: "0 0" });
      tl.add(linea, { draw: ["0 0", "0 1"], duration: SEG * actual, ease: "inOutSine" }, INICIO);
    }
    tl.add(puntos, { opacity: 1, scale: [0.3, 1], duration: 520, ease: "outBack" }, stagger(SEG, { start: INICIO }));
    for (let c = 0; c <= actual; c++) {
      tl.add(columna(c), { opacity: [0, 1], y: [8, 0], duration: 560, delay: stagger(40) }, INICIO + c * SEG);
    }
    tl.add(pendientes, { opacity: [0, 1], duration: 400, delay: stagger(60) }, FIN_LINEA);

    // El RM de la etiqueta sube mientras la línea crece
    const nodoRm = etiqueta?.firstChild;
    if (nodoRm) {
      nodoRm.nodeValue = fmt(registradas[0]);
      const valor = { v: registradas[0] };
      tl.add(
        valor,
        {
          v: registradas[actual],
          duration: SEG * actual,
          ease: "inOutSine",
          onUpdate: () => {
            nodoRm.nodeValue = fmt(valor.v);
          },
        },
        INICIO,
      );
    }

    // Al llegar a la última semana aparece el récord y la mejora cuenta desde cero
    tl.add(finales, { opacity: [0, 1], scale: [0.85, 1], duration: 640, ease: "outBack" }, FIN_LINEA);
    const nodoDelta = delta?.firstChild;
    if (delta && nodoDelta) {
      const pct = { v: 0 };
      tl.add(delta, { opacity: [0, 1], duration: 400 }, FIN_LINEA);
      tl.add(
        pct,
        {
          v: mejoraNum,
          duration: 1000,
          onUpdate: () => {
            nodoDelta.nodeValue = textoMejora(pct.v);
          },
        },
        FIN_LINEA,
      );
    }
    tl.then(() => {
      fig.dataset.anim = "done";
    });
  }, []);

  return (
    <figure ref={figRef} className={`${bezel.shell} ${styles.fig}`} data-anim="pending">
      <div className={`${bezel.core} ${styles.card}`}>
        <header className={styles.head}>
          <div>
            <p className={styles.kicker}>Bloque de 8 semanas, {ej.dia.toLowerCase()}</p>
            <h2 className={styles.name}>{ej.nombre}</h2>
          </div>
          <span className={styles.badge} data-final="" data-reveal="">
            <Trophy size={16} weight="fill" aria-hidden="true" />
            Récord en S{actual + 1}
          </span>
        </header>

        <LineChart
          labels={semanas}
          series={[{ id: "rm", label: "RM estimado", values: rm }]}
          height={196}
          format={fmt}
          endLabel
          draw="none"
          onMount={coreografia}
          ariaLabel={`RM estimado de ${ej.nombre} por semana: de ${fmt(registradas[0])} a ${fmt(registradas[actual])} kilos en ${actual + 1} semanas.`}
        />

        <div className={styles.ledger} role="table" aria-label="Registro semanal de cargas">
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
                key={i}
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
                key={i}
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
            {textoMejora(mejoraNum)}
          </p>
        </footer>
      </div>
      <figcaption className="srOnly">Ejemplo real de la planilla de progresión de Athlos.</figcaption>
    </figure>
  );
}
