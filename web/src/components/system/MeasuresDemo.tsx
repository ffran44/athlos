"use client";

import { ArrowDownRight, ArrowUpRight } from "@phosphor-icons/react";
import { circunferencias, composicion, pesoDiario, pesoMedia7 } from "@/content/demo";
import { LineChart } from "../charts/LineChart";
import styles from "./Demos.module.css";

const fmt = (v: number, d = 1) => v.toFixed(d).replace(".", ",");

// 28 días de ejemplo, del 9/9 al 6/10
const inicio = new Date(2026, 8, 9);
const fechas = pesoDiario.map((_, i) => {
  const d = new Date(inicio);
  d.setDate(d.getDate() + i);
  return `${d.getDate()}/${d.getMonth() + 1}`;
});

const ultimaMedia = pesoMedia7[pesoMedia7.length - 1] as number;
const primeraMedia = pesoMedia7.find((v) => v != null) as number;
const cambio = ultimaMedia - primeraMedia;

export function MeasuresDemo() {
  return (
    <div className={styles.demo}>
      <div className={styles.stats}>
        <div>
          <span className={styles.statLabel}>Promedio 7 días</span>
          <span className={`mono ${styles.statValue}`}>{fmt(ultimaMedia)} kg</span>
        </div>
        <div>
          <span className={styles.statLabel}>Cambio de tendencia</span>
          <span className={`mono ${styles.statValue}`}>{fmt(cambio)} kg</span>
        </div>
        <div>
          <span className={styles.statLabel}>Grasa corporal</span>
          <span className={`mono ${styles.statValue}`}>{fmt(composicion.grasa)}%</span>
        </div>
      </div>

      <div className={styles.legend}>
        <span>
          <i className={styles.legLine} aria-hidden /> Promedio de 7 días
        </span>
        <span>
          <i className={styles.legDot} aria-hidden /> Peso diario
        </span>
      </div>
      <LineChart
        labels={fechas}
        series={[
          { id: "media", label: "Promedio 7 días", values: pesoMedia7 },
          { id: "diario", label: "Peso diario", values: pesoDiario, kind: "dots", tone: "silver" },
        ]}
        height={210}
        format={(v) => fmt(v)}
        markers="last"
        labelEvery={7}
        endLabel
        ariaLabel={`Peso diario de 28 días y su promedio de 7 días, que baja de ${fmt(primeraMedia)} a ${fmt(ultimaMedia)} kilos.`}
      />

      <div className={styles.divider} />

      <div className={styles.split}>
        <div>
          <p className={styles.chartTitle}>Circunferencias, última medición</p>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Parte</th>
                <th scope="col">Actual</th>
                <th scope="col">Cambio</th>
              </tr>
            </thead>
            <tbody>
              {circunferencias.map((c) => {
                const d = c.actual - c.anterior;
                return (
                  <tr key={c.parte}>
                    <th scope="row">{c.parte}</th>
                    <td className="mono">{fmt(c.actual)} cm</td>
                    <td className="mono">
                      <span className={styles.change}>
                        {d < 0 ? <ArrowDownRight size={14} aria-hidden /> : <ArrowUpRight size={14} aria-hidden />}
                        {d > 0 ? "+" : ""}
                        {fmt(d)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className={styles.strategy}>
          <p className={styles.chartTitle}>Estrategia del mes</p>
          <p className={styles.strategyName}>{composicion.estrategia}</p>
          <p className={styles.strategyNote}>
            Balance estimado de <span className="mono">{composicion.balance}</span> kcal por día. Grasa por pliegues:{" "}
            <span className="mono">
              {fmt(composicion.grasaAnterior)}% a {fmt(composicion.grasa)}%
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
