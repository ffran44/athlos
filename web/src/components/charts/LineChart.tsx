"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import styles from "./LineChart.module.css";

export type Serie = {
  id: string;
  label: string;
  values: (number | null)[];
  kind?: "line" | "dots";
  tone?: "ink" | "silver";
};

type Props = {
  labels: string[];
  series: Serie[];
  height?: number;
  format?: (v: number) => string;
  domain?: [number, number];
  ariaLabel: string;
  /** Etiqueta directa sobre el último punto de la primera serie */
  endLabel?: boolean;
  /** Cambia para volver a dibujar la línea (ej: al cambiar de ejercicio) */
  drawKey?: string;
  /** Marcadores sobre la línea principal */
  markers?: "all" | "last";
  /** Mostrar una etiqueta del eje X cada N puntos (el tooltip siempre muestra todas) */
  labelEvery?: number;
};

const PAD = { top: 18, right: 18, bottom: 28, left: 44 };

function niceTicks(min: number, max: number, count = 4) {
  const span = max - min || 1;
  const raw = span / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
  const start = Math.ceil(min / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= max + 1e-9; v += step) ticks.push(Math.round(v * 1000) / 1000);
  return ticks;
}

export function LineChart({
  labels,
  series,
  height = 220,
  format = (v) => v.toFixed(1),
  domain,
  ariaLabel,
  endLabel,
  drawKey,
  markers = "all",
  labelEvery = 1,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const clipId = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const geo = useMemo(() => {
    const all = series.flatMap((s) => s.values.filter((v): v is number => v != null));
    const lo = domain?.[0] ?? Math.min(...all);
    const hi = domain?.[1] ?? Math.max(...all);
    const padY = (hi - lo) * 0.12 || 1;
    const y0 = domain ? lo : lo - padY;
    const y1 = domain ? hi : hi + padY;
    const innerW = Math.max(0, width - PAD.left - PAD.right);
    const innerH = height - PAD.top - PAD.bottom;
    const step = labels.length > 1 ? innerW / (labels.length - 1) : 0;
    const x = (i: number) => PAD.left + i * step;
    const y = (v: number) => PAD.top + innerH - ((v - y0) / (y1 - y0)) * innerH;
    return { x, y, step, innerH, ticks: niceTicks(y0, y1), y0, y1 };
  }, [series, domain, width, height, labels.length]);

  function pathFor(values: (number | null)[]) {
    let d = "";
    let pen = false;
    values.forEach((v, i) => {
      if (v == null) {
        pen = false;
        return;
      }
      d += `${pen ? "L" : "M"}${geo.x(i).toFixed(1)},${geo.y(v).toFixed(1)}`;
      pen = true;
    });
    return d;
  }

  function onMove(e: React.PointerEvent<SVGRectElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    // El área empieza medio paso antes del primer punto.
    const i = Math.floor(px / (geo.step || 1));
    setHover(Math.max(0, Math.min(labels.length - 1, i)));
  }

  const primary = series[0];
  const lastIdx = primary.values.reduce<number>((acc, v, i) => (v != null ? i : acc), -1);
  const hoverHasData = hover != null && series.some((s) => s.values[hover] != null);

  return (
    <div ref={ref} className={styles.root} style={{ height }}>
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label={ariaLabel} className={styles.svg}>
          <defs>
            <clipPath id={clipId}>
              <rect x={0} y={0} width={width} height={height} />
            </clipPath>
          </defs>

          {/* Grilla recesiva */}
          {geo.ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={width - PAD.right} y1={geo.y(t)} y2={geo.y(t)} className={styles.grid} />
              <text x={PAD.left - 10} y={geo.y(t)} className={styles.tick} textAnchor="end" dominantBaseline="middle">
                {format(t)}
              </text>
            </g>
          ))}
          {labels.map((l, i) =>
            i % labelEvery !== 0 && i !== labels.length - 1 ? null : (
            <text key={l + i} x={geo.x(i)} y={height - 8} className={styles.tick} textAnchor="middle">
              {l}
            </text>
            ),
          )}

          {hover != null && hoverHasData && (
            <line x1={geo.x(hover)} x2={geo.x(hover)} y1={PAD.top} y2={height - PAD.bottom} className={styles.crosshair} />
          )}

          <g clipPath={`url(#${clipId})`}>
            {series.map((s) =>
              s.kind === "dots" ? (
                <g key={s.id}>
                  {s.values.map((v, i) =>
                    v == null ? null : (
                      <circle
                        key={i}
                        cx={geo.x(i)}
                        cy={geo.y(v)}
                        r={hover === i ? 4.5 : 3.2}
                        className={s.tone === "ink" ? styles.dotInk : styles.dotSilver}
                      />
                    ),
                  )}
                </g>
              ) : (
                // pathLength=1 permite dibujar la línea con stroke-dashoffset en CSS.
                // La key cambia con drawKey para volver a dibujarla (ej: al cambiar de ejercicio).
                <path
                  key={`${s.id}-${drawKey ?? ""}`}
                  d={pathFor(s.values)}
                  pathLength={1}
                  className={`${s.tone === "silver" ? styles.lineSilver : styles.lineInk} ${styles.draw}`}
                />
              ),
            )}
            {/* Marcadores de la línea principal */}
            {primary.kind !== "dots" &&
              primary.values.map((v, i) =>
                v == null || (markers === "last" && i !== lastIdx && i !== hover) ? null : (
                  <circle
                    key={`m${i}-${drawKey ?? ""}`}
                    cx={geo.x(i)}
                    cy={geo.y(v)}
                    r={hover === i || i === lastIdx ? 5 : 3.5}
                    className={styles.marker}
                  />
                ),
              )}
          </g>

          {endLabel && lastIdx >= 0 && primary.values[lastIdx] != null && hover == null && (
            <text
              x={geo.x(lastIdx)}
              y={geo.y(primary.values[lastIdx] as number) - 14}
              textAnchor="middle"
              className={styles.endLabel}
            >
              {format(primary.values[lastIdx] as number)}
            </text>
          )}

          {/* Área de hover más grande que las marcas */}
          <rect
            x={PAD.left - geo.step / 2}
            y={0}
            width={Math.max(0, width - PAD.left - PAD.right + geo.step)}
            height={height}
            fill="transparent"
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
          />
        </svg>
      )}

      {hover != null && hoverHasData && (
        <div
          className={styles.tooltip}
          style={{
            left: Math.min(Math.max(geo.x(hover), 70), width - 70),
            top: 4,
          }}
          role="status"
        >
          <div className={styles.ttTitle}>{labels[hover]}</div>
          {series.map((s) =>
            s.values[hover] == null ? null : (
              <div key={s.id} className={styles.ttRow}>
                <span className={s.tone === "silver" ? styles.keySilver : styles.keyInk} />
                <span>{s.label}</span>
                <span className="mono">{format(s.values[hover] as number)}</span>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}
