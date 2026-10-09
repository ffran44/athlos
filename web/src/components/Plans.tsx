"use client";

import { ArrowRight, Barbell, Check, Fire, Plus, Ruler, WhatsappLogo } from "@phosphor-icons/react";
import { animate } from "animejs/animation";
import { stagger } from "animejs/utils";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { linkWhatsapp, planes } from "@/content/site";
import { Button } from "./ui/Button";
import { Reveal } from "./ui/Reveal";
import styles from "./Plans.module.css";

const sistemas = [
  { Icon: Barbell, nombre: "Progresión", detalle: "Cargas, RM y volumen" },
  { Icon: Ruler, nombre: "Medidas", detalle: "Peso, perímetros y pliegues" },
  { Icon: Fire, nombre: "Hábitos", detalle: "Puntos, rachas y logros" },
];

const inicial = Math.max(0, planes.findIndex((p) => p.destacado));

/**
 * Planes en acordeón. El elegido se expande (en escritorio se ensancha, en
 * celular se despliega) y muestra todo lo que incluye; los demás se achican.
 * El tamaño se anima con CSS; los ítems entran escalonados con anime.js.
 */
export function Plans() {
  const [activo, setActivo] = useState(inicial);
  const gridRef = useRef<HTMLDivElement>(null);
  const anterior = useRef(activo);

  useEffect(() => {
    // Solo se anima cuando cambia el plan elegido (no en la primera carga).
    if (anterior.current === activo) return;
    anterior.current = activo;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const card = gridRef.current?.querySelector<HTMLElement>(`[data-plan="${activo}"]`);

    // En celular, al cerrarse el plan de arriba el contenido sube: se acompaña
    // con un scroll suave para que el plan abierto quede a la vista.
    let scroll: number | undefined;
    if (card && window.matchMedia("(max-width: 860px)").matches) {
      scroll = window.setTimeout(() => {
        card.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
      }, 620);
    }

    const items = card?.querySelectorAll<HTMLElement>("[data-item]");
    if (reduce || !items?.length) return () => window.clearTimeout(scroll);
    const anim = animate(items, {
      opacity: [0, 1],
      y: [12, 0],
      duration: 560,
      ease: "outExpo",
      delay: stagger(45, { start: 220 }),
    });
    return () => {
      window.clearTimeout(scroll);
      anim.revert();
    };
  }, [activo]);

  const columnas = planes.map((_, i) => (i === activo ? "2.3fr" : "1fr")).join(" ");

  return (
    <section id="planes" className="section">
      <div className="wrap">
        <Reveal>
          <h2 className="sectionTitle">Elegí cómo entrenar.</h2>
          <p className="lede">
            Los tres planes usan el mismo método. Cambia cuánto del sistema sumamos y si entrenamos juntos o a distancia.
            Tocá cada uno para ver qué incluye.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div ref={gridRef} className={styles.grid} style={{ "--cols": columnas } as CSSProperties}>
            {planes.map((p, i) => {
              const abierto = i === activo;
              const panelId = `plan-${p.id}`;
              return (
                <article key={p.id} className={styles.plan} data-open={abierto} data-plan={i}>
                  <p className={styles.mode}>{p.modalidad}</p>
                  <h3 className={styles.heading}>
                    <button
                      type="button"
                      className={styles.toggle}
                      aria-expanded={abierto}
                      aria-controls={panelId}
                      onClick={() => setActivo(i)}
                    >
                      <span className={styles.nameRow}>
                        <span className={styles.name}>{p.nombre}</span>
                        {p.destacado && <span className={styles.tag}>El sistema completo</span>}
                      </span>
                      <span className={styles.plus} aria-hidden="true">
                        <Plus size={18} />
                      </span>
                    </button>
                  </h3>

                  <p className={styles.summary}>{p.resumen}</p>

                  <span className={styles.peek} aria-hidden="true">
                    Ver qué incluye <ArrowRight size={14} />
                  </span>

                  <div id={panelId} className={styles.details} inert={!abierto}>
                    <div className={styles.detailsInner}>
                      <ul className={styles.list}>
                        {p.incluye.map((item) => (
                          <li key={item} data-item="">
                            <Check size={16} weight="bold" aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      {p.destacado && (
                        <ul className={styles.systems} aria-label="Sistemas incluidos">
                          {sistemas.map(({ Icon, nombre, detalle }) => (
                            <li key={nombre} data-item="">
                              <Icon size={22} weight="light" aria-hidden="true" />
                              <span className={styles.sysName}>{nombre}</span>
                              <span className={styles.sysDetail}>{detalle}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <footer className={styles.foot} data-item="">
                        <span className={styles.price}>Precio a consultar</span>
                        <Button
                          href={linkWhatsapp(`Hola Manu, quiero info del plan ${p.nombre} de Athlos.`)}
                          external
                          size="sm"
                          className={styles.invert}
                          icon={<WhatsappLogo size={17} />}
                        >
                          Consultar este plan
                        </Button>
                      </footer>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
