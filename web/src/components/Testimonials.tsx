import { testimonios } from "@/content/site";
import { Reveal } from "./ui/Reveal";
import styles from "./Testimonials.module.css";

export function Testimonials() {
  if (testimonios.length === 0) return null;
  return (
    <section className={`section ${styles.section}`} aria-labelledby="testimonios-titulo">
      <div className="wrap">
        <Reveal>
          <h2 id="testimonios-titulo" className="sectionTitle">
            Lo que dicen los alumnos.
          </h2>
        </Reveal>
      </div>
      <div className={styles.rail}>
        {testimonios.map((t, i) => (
          <Reveal key={i} delay={i * 0.08} as="article" className={styles.card}>
            {t.ejemplo && <span className={styles.example}>Texto de ejemplo</span>}
            <blockquote className={styles.quote}>“{t.texto}”</blockquote>
            <footer className={styles.who}>
              <span className={styles.name}>{t.nombre}</span>
              <span className={styles.detail}>{t.detalle}</span>
            </footer>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
