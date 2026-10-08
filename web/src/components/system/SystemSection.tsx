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
    titulo: "Tus cargas, semana a semana.",
    texto:
      "Anotás kilos y repeticiones de cada ejercicio. La planilla calcula tu RM estimado y el volumen de cada músculo, y te avisa cuándo subir la carga.",
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
    titulo: "Peso, perímetros y pliegues.",
    texto:
      "Te pesás todos los días y la planilla saca el promedio de 7 días, que muestra la tendencia sin los altibajos diarios. Una vez por mes sumamos circunferencias, pliegues y fotos.",
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
    titulo: "Hábitos con puntaje.",
    texto:
      "Cada hábito cumplido suma puntos y el día se califica sobre 100. Los días cumplidos seguidos arman una racha, y si el día fue difícil y lo sacaste igual, ganás puntos extra.",
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
            Así se ven las planillas que vas a usar, con datos de ejemplo. Hacen las mismas cuentas: probá cambiar de
            ejercicio o marcar hábitos.
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
