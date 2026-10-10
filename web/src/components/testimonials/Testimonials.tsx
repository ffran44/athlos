"use client";

import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { testimonios } from "@/content/site";
import { Reveal } from "../ui/Reveal";
import { TestimonialCard } from "./TestimonialCard";
import styles from "./Testimonials.module.css";

/*
 * Swiper se carga solo en el navegador, en un archivo aparte, y recién cuando la
 * sección está por entrar en pantalla: no suma a la carga inicial y no se crea
 * durante el prerender. Hasta entonces se ven las mismas tarjetas en una fila
 * estática con el mismo layout.
 */
function FilaEstatica() {
  return (
    <div className={`columna ${styles.swiper} ${styles.static}`}>
      {testimonios.map((t, i) => (
        <div key={i} className={`columna-borde ${styles.slide}`}>
          <TestimonialCard t={t} />
        </div>
      ))}
    </div>
  );
}

const Carousel = dynamic(() => import("./Carousel"), { ssr: false, loading: FilaEstatica });

export function Testimonials() {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [progreso, setProgreso] = useState(0);
  const [bordes, setBordes] = useState({ inicio: true, fin: false });
  const seccionRef = useRef<HTMLElement>(null);
  const [cargar, setCargar] = useState(false);

  useEffect(() => {
    const el = seccionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCargar(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const actualizar = useCallback((s: SwiperType) => {
    setProgreso(Math.min(1, Math.max(0, s.progress)));
    setBordes({ inicio: s.isBeginning, fin: s.isEnd });
  }, []);

  if (testimonios.length === 0) return null;

  return (
    <section ref={seccionRef} className={`section ${styles.section}`} aria-labelledby="testimonios-titulo">
      <div className="wrap">
        <Reveal className={styles.head}>
          <h2 id="testimonios-titulo" className="sectionTitle">
            Lo que dicen los alumnos.
          </h2>
          <div className={styles.nav}>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => swiper?.slidePrev()}
              disabled={!swiper || bordes.inicio}
              aria-label="Testimonio anterior"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => swiper?.slideNext()}
              disabled={!swiper || bordes.fin}
              aria-label="Testimonio siguiente"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          {cargar ? <Carousel onReady={setSwiper} onMove={actualizar} /> : <FilaEstatica />}
          <div className={styles.track} aria-hidden="true">
            <span className={styles.thumb} style={{ "--p": progreso } as React.CSSProperties} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
