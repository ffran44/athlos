"use client";

import { Check, Fire, Snowflake } from "@phosphor-icons/react";
import { useState } from "react";
import { estadoHabitos, habitos, umbrales } from "@/content/demo";
import { CountUp } from "../ui/CountUp";
import { StatusTag, type Estado } from "./StatusTag";
import styles from "./Demos.module.css";

const dificultades = [
  { id: "normal", label: "Normal", bonus: 0 },
  { id: "dificil", label: "Difícil", bonus: 5 },
  { id: "muy", label: "Muy difícil", bonus: 10 },
] as const;

const entero = (v: number) => String(Math.round(v));
const enDias = (v: number) => `${Math.round(v)} días`;
const masXp = (v: number) => `+${Math.round(v)}`;

function estadoDe(score: number, obligatoriosOk: boolean): { estado: Estado; texto: string } {
  if (!obligatoriosOk) return { estado: "mal", texto: "Falta un obligatorio" };
  if (score >= umbrales.cumplido) return { estado: "bien", texto: "Día cumplido" };
  if (score >= umbrales.regular) return { estado: "regular", texto: "Día regular" };
  return { estado: "mal", texto: "Día incumplido" };
}

export function HabitsDemo() {
  const [hechos, setHechos] = useState<Set<string>>(new Set(["h1", "h2", "h5", "h3"]));
  const [dif, setDif] = useState<(typeof dificultades)[number]["id"]>("normal");

  const posibles = habitos.reduce((a, h) => a + h.puntos, 0);
  const obtenidos = habitos.filter((h) => hechos.has(h.id)).reduce((a, h) => a + h.puntos, 0);
  const score = Math.round((obtenidos / posibles) * 100);
  const obligatoriosOk = habitos.filter((h) => h.obligatorio).every((h) => hechos.has(h.id));
  const { estado, texto } = estadoDe(score, obligatoriosOk);
  // Bonus de resiliencia: solo si el día fue difícil y llegaste al 70% de cumplimiento
  const bonus = score >= 70 ? dificultades.find((d) => d.id === dif)!.bonus : 0;
  const xpHoy = obtenidos + bonus;
  const racha = estadoHabitos.racha + (estado === "bien" ? 1 : 0);

  const xp = estadoHabitos.xp + xpHoy;
  const progreso = (xp - estadoHabitos.xpNivelActual) / (estadoHabitos.xpSiguiente - estadoHabitos.xpNivelActual);
  const segmentos = 24;

  function toggle(id: string) {
    setHechos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const dias = [...estadoHabitos.ultimos14.slice(1), score];

  return (
    <div className={styles.demo}>
      <div className={styles.habitsGrid}>
        <fieldset className={styles.checklist}>
          <legend className={styles.chartTitle}>Hoy, tocá para marcar</legend>
          {habitos.map((h) => {
            const on = hechos.has(h.id);
            return (
              <label key={h.id} className={styles.habit} data-on={on}>
                <input type="checkbox" checked={on} onChange={() => toggle(h.id)} className="srOnly" />
                <span className={styles.box} aria-hidden="true">
                  <Check size={14} weight="bold" />
                </span>
                <span className={styles.habitName}>
                  {h.nombre}
                  {h.obligatorio && <em className={styles.req}>obligatorio</em>}
                </span>
                <span className={`mono ${styles.habitGoal}`}>{h.objetivo}</span>
                <span className={`mono ${styles.habitPts}`}>+{h.puntos}</span>
              </label>
            );
          })}

          <div className={styles.difficulty}>
            <span className={styles.chartTitle}>¿Cómo fue el día?</span>
            <div className={styles.segmented} role="radiogroup" aria-label="Dificultad del día">
              {dificultades.map((d) => (
                <button key={d.id} type="button" role="radio" aria-checked={dif === d.id} onClick={() => setDif(d.id)}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </fieldset>

        <div className={styles.scoreCol}>
          <div className={styles.score} aria-live="polite">
            <CountUp value={score} format={entero} className={`mono ${styles.scoreNum}`} />
            <span className={styles.scoreOf}>/100</span>
          </div>
          <StatusTag estado={estado}>{texto}</StatusTag>

          <dl className={styles.kv}>
            <div>
              <dt>
                <Fire size={16} weight="fill" aria-hidden /> Racha
              </dt>
              <dd className="mono">
                <CountUp value={racha} format={enDias} />
              </dd>
            </div>
            <div>
              <dt>
                <Snowflake size={16} aria-hidden /> Protecciones
              </dt>
              <dd className="mono">{estadoHabitos.protecciones}</dd>
            </div>
            <div>
              <dt>XP de hoy</dt>
              <dd className="mono">
                <CountUp value={xpHoy} format={masXp} />
                {bonus > 0 && <span className={styles.bonus}> (+{bonus} resiliencia)</span>}
              </dd>
            </div>
          </dl>

          <div className={styles.level}>
            <div className={styles.levelHead}>
              <span>Nivel {estadoHabitos.nivel}</span>
              <span className="mono">
                <CountUp value={xp} format={entero} /> / {estadoHabitos.xpSiguiente} XP
              </span>
            </div>
            <div className={styles.segments} aria-hidden="true">
              {Array.from({ length: segmentos }, (_, i) => (
                <span key={i} data-on={i < Math.round(progreso * segmentos)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.divider} />

      <p className={styles.chartTitle}>Últimos 14 días</p>
      <ol className={styles.days} aria-label="Puntuación de los últimos 14 días">
        {dias.map((d, i) => {
          const e = estadoDe(d, true).estado;
          return (
            <li key={i} data-estado={e} title={`${i === dias.length - 1 ? "Hoy" : `Hace ${dias.length - 1 - i} días`}: ${d}/100`}>
              <span>{d}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
