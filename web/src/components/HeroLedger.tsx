"use client";

import { Trophy } from "@phosphor-icons/react";
import { ejercicios, rmEstimado } from "@/content/demo";
import { LineChart } from "./charts/LineChart";
import bezel from "./ui/Bezel.module.css";
import styles from "./HeroLedger.module.css";

const ej = ejercicios[0]; // Hack Squat, datos reales de la planilla
const semanas = ej.semanas.map((_, i) => `S${i + 1}`);
const rm = ej.semanas.map((w) => (w ? Math.round(rmEstimado(w.kg, w.reps) * 10) / 10 : null));
const registradas = rm.filter((v): v is number => v != null);
const actual = registradas.length - 1;
const mejora = ((registradas[actual] / registradas[0] - 1) * 100).toFixed(1).replace(".", ",");

const fmt = (v: number) => v.toFixed(1).replace(".", ",");

export function HeroLedger() {
  return (
    <figure className={`${bezel.shell} ${styles.fig}`}>
      <div className={`${bezel.core} ${styles.card}`}>
        <header className={styles.head}>
          <div>
            <p className={styles.kicker}>Bloque de 8 semanas, {ej.dia.toLowerCase()}</p>
            <h2 className={styles.name}>{ej.nombre}</h2>
          </div>
          <span className={styles.badge}>
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
          ariaLabel={`RM estimado de ${ej.nombre} por semana: de ${fmt(registradas[0])} a ${fmt(registradas[actual])} kilos en ${actual + 1} semanas.`}
        />

        <div className={styles.ledger} role="table" aria-label="Registro semanal de cargas">
          <div role="row" className={styles.row}>
            <span role="rowheader" className={styles.rh}>
              Semana
            </span>
            {semanas.map((s, i) => (
              <span role="columnheader" key={s} className={i === actual ? styles.now : undefined} style={{ "--c": i } as React.CSSProperties}>
                {s}
              </span>
            ))}
          </div>
          <div role="row" className={styles.row}>
            <span role="rowheader" className={styles.rh}>
              Kg × reps
            </span>
            {ej.semanas.map((w, i) => (
              <span role="cell" key={i} className={`mono ${i === actual ? styles.now : ""} ${!w ? styles.empty : ""}`} style={{ "--c": i } as React.CSSProperties}>
                {w ? `${w.kg}×${w.reps}` : "-"}
              </span>
            ))}
          </div>
          <div role="row" className={styles.row}>
            <span role="rowheader" className={styles.rh}>
              RM est.
            </span>
            {rm.map((v, i) => (
              <span role="cell" key={i} className={`mono ${styles.rm} ${i === actual ? styles.now : ""} ${v == null ? styles.empty : ""}`} style={{ "--c": i } as React.CSSProperties}>
                {v == null ? "-" : Math.round(v)}
              </span>
            ))}
          </div>
        </div>

        <footer className={styles.foot}>
          <p className={styles.formula}>
            RM = kg × (1 + reps ÷ 30)
          </p>
          <p className={`mono ${styles.delta}`}>+{mejora}% en {actual + 1} semanas</p>
        </footer>
      </div>
      <figcaption className="srOnly">Ejemplo real de la planilla de progresión de Athlos.</figcaption>
    </figure>
  );
}
