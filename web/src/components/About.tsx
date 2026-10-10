import Image from "next/image";
import { bio } from "@/content/site";
import { Reveal } from "./ui/Reveal";
import styles from "./About.module.css";

export function About() {
  return (
    <section id="manu" className="section">
      <div className={`wrap ${styles.grid}`}>
        <div className={`columna ${styles.photoWrap}`}>
          <Reveal className={styles.photo}>
            {bio.foto ? (
              <Image
                src={bio.foto}
                alt={`${bio.nombre}, entrenador de Athlos Training`}
                fill
                sizes="(max-width: 860px) 100vw, 40vw"
              />
            ) : (
              // TODO: reemplazar por la foto real (ver `bio.foto` en src/content/site.ts)
              <div className={styles.placeholder}>
                <Image src="/brand/athlos-mark.png" alt="" width={120} height={168} />
                <span>Foto de Manu</span>
              </div>
            )}
          </Reveal>
        </div>

        <Reveal delay={0.1} className={styles.copy}>
          <h2 className="sectionTitle">{bio.titular}</h2>
          {bio.parrafos.map((p) => (
            <p key={p} className={styles.p}>
              {p}
            </p>
          ))}
          <p className={styles.sign}>{bio.nombre}</p>
        </Reveal>
      </div>
    </section>
  );
}
