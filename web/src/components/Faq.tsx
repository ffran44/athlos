import { Plus } from "@phosphor-icons/react/dist/ssr";
import { preguntas } from "@/content/site";
import { Reveal } from "./ui/Reveal";
import styles from "./Faq.module.css";

export function Faq() {
  return (
    <section id="preguntas" className="section">
      <div className={`wrap ${styles.grid}`}>
        <Reveal>
          <h2 className="sectionTitle">Preguntas frecuentes.</h2>
        </Reveal>
        <Reveal delay={0.08} className={styles.list}>
          {preguntas.map((q) => (
            <details key={q.p} className={styles.item}>
              <summary>
                {q.p}
                <Plus size={18} aria-hidden="true" className={styles.icon} />
              </summary>
              <p>{q.r}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
