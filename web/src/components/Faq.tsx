"use client";

import { Plus } from "@phosphor-icons/react";
import { animate } from "animejs/animation";
import { set, stagger } from "animejs/utils";
import { useRef } from "react";
import { preguntas } from "@/content/site";
import { Reveal } from "./ui/Reveal";
import styles from "./Faq.module.css";

const prefiereQuieto = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Preguntas frecuentes con <details> nativo (funciona sin JS). Con JS, anime.js
 * anima el alto al abrir y cerrar, la respuesta entra palabra por palabra y
 * queda abierta una sola pregunta a la vez.
 */
export function Faq() {
  const items = useRef<(HTMLDetailsElement | null)[]>([]);
  const ocupado = useRef(new WeakSet<HTMLDetailsElement>());

  function cerrar(el: HTMLDetailsElement) {
    const summary = el.querySelector("summary");
    if (!summary || ocupado.current.has(el)) return;
    ocupado.current.add(el);
    el.dataset.cerrando = "";
    const palabras = el.querySelectorAll<HTMLElement>("[data-palabra]");
    animate(palabras, { opacity: 0, duration: 160, ease: "outQuad" });
    const filete = el.querySelector<HTMLElement>("[data-filete]");
    if (filete) animate(filete, { scaleY: 0, duration: 260, ease: "inQuad" });
    el.style.height = `${el.offsetHeight}px`;
    animate(el, {
      height: summary.offsetHeight,
      duration: 380,
      ease: "inOutQuart",
      onComplete: () => {
        el.open = false;
        el.style.height = "";
        delete el.dataset.cerrando;
        ocupado.current.delete(el);
      },
    });
  }

  function abrir(el: HTMLDetailsElement) {
    const summary = el.querySelector("summary");
    if (!summary || ocupado.current.has(el)) return;
    ocupado.current.add(el);
    const desde = el.offsetHeight;
    const palabras = el.querySelectorAll<HTMLElement>("[data-palabra]");
    const filete = el.querySelector<HTMLElement>("[data-filete]");
    // Estado inicial antes de mostrar el contenido, para que no se vea un cuadro de más
    set(palabras, { opacity: 0, y: 6, filter: "blur(3px)" });
    if (filete) set(filete, { scaleY: 0 });
    el.open = true;
    const hasta = el.scrollHeight;
    el.style.height = `${desde}px`;
    animate(el, {
      height: [desde, hasta],
      duration: 520,
      ease: "outExpo",
      onComplete: () => {
        el.style.height = "";
        ocupado.current.delete(el);
      },
    });
    // El filete crece y la respuesta aparece palabra por palabra
    if (filete) animate(filete, { scaleY: 1, duration: 700, ease: "outExpo", delay: 60 });
    animate(palabras, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 520,
      ease: "outQuart",
      delay: stagger(14, { start: 90 }),
    });
  }

  function alTocar(e: React.MouseEvent, i: number) {
    if (prefiereQuieto()) return; // comportamiento nativo, sin animación
    e.preventDefault();
    const el = items.current[i];
    if (!el) return;
    if (el.open) {
      cerrar(el);
      return;
    }
    // Una sola abierta a la vez
    items.current.forEach((otro) => otro && otro !== el && otro.open && cerrar(otro));
    abrir(el);
  }

  return (
    <section id="preguntas" className="section">
      <div className={`wrap ${styles.grid}`}>
        <Reveal>
          <h2 className="sectionTitle">Preguntas frecuentes.</h2>
        </Reveal>
        <Reveal delay={0.08} className={styles.list}>
          {preguntas.map((q, i) => (
            <details
              key={q.p}
              ref={(el) => {
                items.current[i] = el;
              }}
              className={styles.item}
            >
              <summary onClick={(e) => alTocar(e, i)}>
                {q.p}
                <span className={styles.icon} aria-hidden="true">
                  <Plus size={18} />
                </span>
              </summary>
              <p className={styles.answer}>
                <span className={styles.filete} data-filete="" aria-hidden="true" />
                {q.r.split(" ").map((palabra, k) => (
                  <span key={k}>
                    {k > 0 && " "}
                    <span data-palabra="" className={styles.word}>
                      {palabra}
                    </span>
                  </span>
                ))}
              </p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
