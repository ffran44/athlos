import { Barbell, Check, Fire, Ruler, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { linkWhatsapp, planes } from "@/content/site";
import { Button } from "./ui/Button";
import { Reveal } from "./ui/Reveal";
import styles from "./Plans.module.css";

const sistemas = [
  { Icon: Barbell, nombre: "Progresión", detalle: "Cargas, RM y volumen" },
  { Icon: Ruler, nombre: "Medidas", detalle: "Peso, perímetros y pliegues" },
  { Icon: Fire, nombre: "Hábitos", detalle: "Puntos, rachas y logros" },
];

export function Plans() {
  return (
    <section id="planes" className="section">
      <div className="wrap">
        <Reveal>
          <h2 className="sectionTitle">Elegí cómo entrenar.</h2>
          <p className="lede">
            Los tres planes usan el mismo método. Cambia cuánto del sistema sumamos y si entrenamos juntos o a distancia.
          </p>
        </Reveal>

        <div className={styles.grid}>
          {planes.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08} as="article" className={`${styles.plan} ${p.destacado ? styles.featured : ""}`}>
              <header className={styles.head}>
                <p className={styles.mode}>{p.modalidad}</p>
                <h3 className={styles.name}>{p.nombre}</h3>
                {p.destacado && <span className={styles.tag}>El sistema completo</span>}
              </header>
              <p className={styles.summary}>{p.resumen}</p>
              <ul className={styles.list}>
                {p.incluye.map((item) => (
                  <li key={item}>
                    <Check size={16} weight="bold" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              {p.destacado && (
                <ul className={styles.systems} aria-label="Sistemas incluidos">
                  {sistemas.map(({ Icon, nombre, detalle }) => (
                    <li key={nombre}>
                      <Icon size={22} weight="light" aria-hidden="true" />
                      <span className={styles.sysName}>{nombre}</span>
                      <span className={styles.sysDetail}>{detalle}</span>
                    </li>
                  ))}
                </ul>
              )}
              <footer className={styles.foot}>
                <span className={styles.price}>Precio a consultar</span>
                <Button
                  href={linkWhatsapp(`Hola Manu, quiero info del plan ${p.nombre} de Athlos.`)}
                  external
                  size="sm"
                  variant={p.destacado ? "primary" : "ghost"}
                  className={p.destacado ? styles.invert : undefined}
                  icon={<WhatsappLogo size={17} />}
                >
                  Consultar este plan
                </Button>
              </footer>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
