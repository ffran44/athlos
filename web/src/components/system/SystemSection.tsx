"use client";

import { animate, type JSAnimation } from "animejs/animation";
import { set, stagger } from "animejs/utils";
import { useLayoutEffect, useRef, useState } from "react";
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
  // `active` mueve la píldora al instante; `mostrado` es la demo que se ve, y
  // cambia recién cuando terminó de salir la anterior.
  const [active, setActive] = useState(0);
  const [mostrado, setMostrado] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const transicion = useRef<{ dir: number; alto: number } | null>(null);
  const enCurso = useRef<JSAnimation[]>([]);
  const espera = useRef<number | undefined>(undefined);
  // Posición de la píldora que marca la pestaña activa (se mueve con una transición CSS)
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);
  const t = tabs[mostrado];

  useLayoutEffect(() => {
    const list = listRef.current;
    const update = () => {
      const el = tabRefs.current[active];
      if (el) setPill({ x: el.offsetLeft, w: el.offsetWidth });
    };
    update();
    if (!list) return;
    const ro = new ResizeObserver(update);
    ro.observe(list);
    return () => ro.disconnect();
  }, [active]);

  const cortar = () => {
    enCurso.current.forEach((a) => a.pause());
    enCurso.current = [];
  };

  // Partes de la demo y del texto que entran escalonadas
  const partes = () => [...(demoRef.current?.firstElementChild?.children ?? [])] as HTMLElement[];
  const textos = () => [...(copyRef.current?.children ?? [])] as HTMLElement[];

  function cambiar(i: number) {
    if (i === active) return;
    const dir = i > active ? 1 : -1;
    setActive(i);
    const shell = shellRef.current;
    if (!shell || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.clearTimeout(espera.current);
      setMostrado(i);
      return;
    }
    cortar();
    window.clearTimeout(espera.current);
    transicion.current = { dir, alto: shell.offsetHeight };
    // Sale la demo actual hacia el lado contrario a la pestaña elegida
    enCurso.current.push(
      animate(partes(), {
        opacity: 0,
        x: -28 * dir,
        filter: "blur(4px)",
        duration: 200,
        ease: "inQuad",
        delay: stagger(18),
      }),
      animate(textos(), { opacity: 0, y: -6, duration: 180, ease: "inQuad" }),
    );
    espera.current = window.setTimeout(() => setMostrado(i), 230);
  }

  // Entra la demo nueva: el marco cambia de alto y las partes llegan escalonadas
  useLayoutEffect(() => {
    const tr = transicion.current;
    const shell = shellRef.current;
    if (!tr || !shell) return;
    transicion.current = null;
    cortar();

    shell.style.height = "";
    const alto = shell.offsetHeight;
    shell.dataset.cambiando = "";
    set(shell, { height: tr.alto });
    set(partes(), { opacity: 0, x: 36 * tr.dir, filter: "blur(4px)" });
    set(textos(), { opacity: 0, y: 10 });

    enCurso.current.push(
      animate(shell, {
        height: alto,
        duration: 620,
        ease: "outExpo",
        onComplete: () => {
          shell.style.height = "";
          delete shell.dataset.cambiando;
        },
      }),
      animate(partes(), {
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
        duration: 620,
        ease: "outExpo",
        delay: stagger(55, { start: 60 }),
      }),
      animate(textos(), {
        opacity: 1,
        y: 0,
        duration: 560,
        ease: "outExpo",
        delay: stagger(60, { start: 40 }),
      }),
    );
  }, [mostrado]);

  function onKey(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (active + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    cambiar(next);
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

        <div
          ref={listRef}
          className={styles.tabs}
          role="tablist"
          aria-label="Partes del sistema"
          onKeyDown={onKey}
          data-ready={pill != null}
        >
          <span
            className={styles.pill}
            aria-hidden="true"
            style={pill ? { transform: `translateX(${pill.x}px)`, width: pill.w } : undefined}
          />
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
              aria-controls="panel-sistema"
              tabIndex={i === active ? 0 : -1}
              className={styles.tab}
              onClick={() => cambiar(i)}
            >
              <span className={styles.tabLabel}>{x.tab}</span>
            </button>
          ))}
        </div>

        <div id="panel-sistema" role="tabpanel" aria-labelledby={`tab-${t.id}`} className={styles.panel}>
          <div ref={copyRef} key={`copy-${t.id}`} className={styles.copy}>
            <h3 className={styles.title}>{t.titulo}</h3>
            <p className={styles.text}>{t.texto}</p>
            <ul className={styles.items}>
              {t.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
          <div ref={shellRef} className={`${bezel.shell} ${styles.shell}`}>
            <div className={`${bezel.core} ${styles.demoCore}`}>
              {/* La key remonta la demo al cambiar de pestaña */}
              <div ref={demoRef} key={`demo-${t.id}`} className={styles.demoSlot}>
                <t.Demo />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
