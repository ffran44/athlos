import type { Testimonio } from "@/content/site";
import styles from "./Testimonials.module.css";

const iniciales = (nombre: string) =>
  nombre
    .split(" ")
    .filter((p) => p.length > 2)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");

export function TestimonialCard({ t }: { t: Testimonio }) {
  return (
    <figure className={styles.card}>
      <span className={styles.mark} aria-hidden="true">
        “
      </span>
      {t.ejemplo && <span className={styles.example}>Texto de ejemplo</span>}
      <blockquote className={styles.quote}>{t.texto}</blockquote>
      <figcaption className={styles.who}>
        <span className={styles.avatar} aria-hidden="true">
          {iniciales(t.nombre)}
        </span>
        <span>
          <span className={styles.name}>{t.nombre}</span>
          <span className={styles.detail}>{t.detalle}</span>
        </span>
      </figcaption>
    </figure>
  );
}
