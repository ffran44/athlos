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
          <p className={styles.eyebrow}>Coaching online y presencial con Manu</p>
          <h1 className={styles.title}>Progreso que se mide.</h1>
          <p className={styles.sub}>
            Entrenás con un plan de 8 semanas y anotás tus cargas, medidas y hábitos. Yo reviso los números cada semana.
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
