"use client";

import { ArrowFatLineUp, Equals } from "@phosphor-icons/react";
import { useState } from "react";
import { ejercicios, musculos, rmEstimado, senal } from "@/content/demo";
import { LineChart } from "../charts/LineChart";
import { CountUp } from "../ui/CountUp";
import { StatusTag } from "./StatusTag";
import styles from "./Demos.module.css";

const fmt = (v: number) => v.toFixed(1).replace(".", ",");
const fmtKg = (v: number) => `${fmt(v)} kg`;
const fmtPct = (v: number) => `+${fmt(v)}%`;
const ESCALA = 20; // series por semana, eje del semáforo

export function ProgressDemo() {
  const [id, setId] = useState(ejercicios[0].id);
  const ej = ejercicios.find((e) => e.id === id)!;
  const rm = ej.semanas.map((w) => (w ? Math.round(rmEstimado(w.kg, w.reps) * 10) / 10 : null));
  const reg = rm.filter((v): v is number => v != null);
  const mejor = Math.max(...reg);
  const delta = (reg[reg.length - 1] / reg[reg.length - 2] - 1) * 100;
  const sig = senal(ej);

  return (
    <div className={styles.demo}>
      <div className={styles.chips} role="radiogroup" aria-label="Elegí un ejercicio">
        {ejercicios.map((e) => (
          <button
            key={e.id}
            type="button"
            role="radio"
            aria-checked={e.id === id}
            className={styles.chip}
            onClick={() => setId(e.id)}
          >
            {e.nombre}
          </button>
        ))}
      </div>

      <div className={styles.stats}>
        <div>
          <span className={styles.statLabel}>Mejor RM</span>
          <CountUp value={mejor} format={fmtKg} className={`mono ${styles.statValue}`} />
        </div>
        <div>
          <span className={styles.statLabel}>Última semana</span>
          <CountUp value={delta} format={fmtPct} className={`mono ${styles.statValue}`} />
        </div>
        <div>
          <span className={styles.statLabel}>Señal</span>
          <span className={styles.signal} data-sig={sig}>
            {sig === "subir" ? <ArrowFatLineUp size={16} weight="fill" aria-hidden /> : <Equals size={16} aria-hidden />}
            {sig === "subir" ? "Subir carga" : "Mantener"}
          </span>
        </div>
      </div>

      <p className={styles.chartTitle}>
        RM estimado por semana, {ej.musculo.toLowerCase()}, tope de {ej.topeRango} reps
      </p>
      <LineChart
        labels={rm.map((_, i) => `S${i + 1}`)}
        series={[{ id: "rm", label: "RM estimado", values: rm }]}
        height={200}
        format={fmt}
        endLabel
        drawKey={id}
        ariaLabel={`RM estimado de ${ej.nombre}: de ${fmt(reg[0])} a ${fmt(reg[reg.length - 1])} kilos.`}
      />

      <div className={styles.divider} />

      <p className={styles.chartTitle}>Series por semana y rango objetivo de cada músculo</p>
      <ul className={styles.muscles}>
        {musculos.map((m) => {
          const estado = m.series < m.min ? "bajo" : m.series > m.max ? "alto" : "bien";
          return (
            <li key={m.nombre} className={styles.muscle}>
              <span className={styles.muscleName}>{m.nombre}</span>
              <span className={styles.range} aria-hidden="true">
                <span
                  className={styles.band}
                  style={{ left: `${(m.min / ESCALA) * 100}%`, width: `${((m.max - m.min) / ESCALA) * 100}%` }}
                />
                <span className={styles.pin} data-estado={estado} style={{ left: `${(m.series / ESCALA) * 100}%` }} />
              </span>
              <span className={`mono ${styles.muscleVal}`}>
                {m.series}
                <span className={styles.muscleRange}>
                  {" "}
                  / {m.min}-{m.max}
                </span>
              </span>
              <StatusTag estado={estado}>{estado === "bien" ? "En rango" : estado === "bajo" ? "Debajo" : "Encima"}</StatusTag>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
