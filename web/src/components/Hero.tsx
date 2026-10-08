import { ArrowUpRight, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { linkInstagram, linkWhatsapp } from "@/content/site";
import { Button } from "./ui/Button";
import { HeroLedger } from "./HeroLedger";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section id="top" className={styles.hero}>
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Coaching online y presencial</p>
          <h1 className={styles.title}>Progreso que se mide.</h1>
          <p className={styles.sub}>
            Entrená con Manu: planificación por bloques, medidas corporales y hábitos, registrados y revisados cada semana.
          </p>
          <div className={styles.actions}>
            <Button href={linkWhatsapp()} external icon={<WhatsappLogo size={20} />}>
              Escribime por WhatsApp
            </Button>
            <Button href={linkInstagram} external variant="ghost" icon={<ArrowUpRight size={18} />}>
              Instagram
            </Button>
          </div>
        </div>

        <div className={styles.visual}>
          <HeroLedger />
        </div>
      </div>
    </section>
  );
}
