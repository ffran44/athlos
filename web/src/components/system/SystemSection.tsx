"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { Reveal } from "../ui/Reveal";
import bezel from "../ui/Bezel.module.css";
import { HabitsDemo } from "./HabitsDemo";
import { MeasuresDemo } from "./MeasuresDemo";
import { ProgressDemo } from "./ProgressDemo";
import styles from "./SystemSection.module.css";

const tabs = [
  {
    id: "progresion",
    tab: "Progresión",
    titulo: "Cada serie cuenta.",
    texto:
      "Registrás kilos y repeticiones. La planilla calcula tu RM estimado, el volumen de cada músculo y te avisa cuándo subir la carga.",
    items: [
      "RM estimado con la fórmula de Epley",
      "Volumen semanal: series × kg × reps",
      "Señal de subir carga al llegar al tope del rango",
      "Récords por ejercicio",
      "Semáforo de series por músculo",
    ],
    Demo: ProgressDemo,
  },
  {
    id: "medidas",
    tab: "Medidas",
    titulo: "Lo que la balanza no cuenta.",
    texto:
      "Peso diario con promedio de 7 días, y cada mes circunferencias, pliegues y fotos. Ves la tendencia real y no el ruido del día.",
    items: [
      "Peso diario y promedio móvil",
      "Balance calórico y estrategia del mes",
      "8 circunferencias corporales",
      "7 pliegues para calcular el % de grasa",
      "Fotos y guía para medirte bien",
    ],
    Demo: MeasuresDemo,
  },
  {
    id: "habitos",
    tab: "Hábitos",
    titulo: "La disciplina también se entrena.",
    texto:
      "Cada hábito suma puntos y el día se puntúa sobre 100. Las rachas se protegen, la experiencia sube de nivel y los días difíciles dan bonus.",
    items: [
      "Puntuación diaria con semáforo",
      "Rachas con protecciones",
      "Niveles, logros y desafíos",
      "Recompensas que elegís vos",
      "Bonus de resiliencia en días difíciles",
    ],
    Demo: HabitsDemo,
  },
] as const;

export function SystemSection() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const t = tabs[active];

  function onKey(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (active + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <section id="sistema" className={`section ${styles.section}`}>
      <div className="wrap">
        <Reveal>
          <h2 className="sectionTitle">Tres planillas, un mismo sistema.</h2>
          <p className="lede">
            Esto es lo que vas a usar. Cambiá de ejercicio, pasá el cursor por los gráficos, marcá hábitos: son las mismas
            cuentas que hacen las planillas de Athlos, con datos de ejemplo.
          </p>
        </Reveal>

        <div className={styles.tabs} role="tablist" aria-label="Partes del sistema" onKeyDown={onKey}>
          {tabs.map((x, i) => (
            <button
              key={x.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${x.id}`}
              aria-selected={i === active}
              aria-controls={`panel-${x.id}`}
              tabIndex={i === active ? 0 : -1}
              className={styles.tab}
              onClick={() => setActive(i)}
            >
              {i === active && (
                <motion.span
                  layoutId="tab-pill"
                  className={styles.pill}
                  transition={reduce ? { duration: 0 } : { type: "spring", duration: 0.45, bounce: 0.15 }}
                />
              )}
              <span className={styles.tabLabel}>{x.tab}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={t.id}
            id={`panel-${t.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${t.id}`}
            className={styles.panel}
            initial={{ opacity: 0, filter: "blur(2px)", transform: reduce ? "none" : "translateY(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)", transform: "translateY(0px)" }}
            exit={{ opacity: 0, filter: "blur(2px)", transition: { duration: 0.14 } }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className={styles.copy}>
              <h3 className={styles.title}>{t.titulo}</h3>
              <p className={styles.text}>{t.texto}</p>
              <ul className={styles.items}>
                {t.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
            <div className={bezel.shell}>
              <div className={`${bezel.core} ${styles.demoCore}`}>
                <t.Demo />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
