import Image from "next/image";
import { ArrowUpRight, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { contacto, linkInstagram, linkWhatsapp } from "@/content/site";
import { Button } from "./ui/Button";
import { Reveal } from "./ui/Reveal";
import styles from "./Closing.module.css";

export function Closing() {
  return (
    <>
      <section className={`section ${styles.closing}`}>
        <Reveal className={`wrap ${styles.inner}`}>
          <Image src="/brand/athlos-mark.png" alt="" width={64} height={90} className={styles.mark} />
          <h2 className={styles.title}>Tu próximo bloque empieza con un mensaje.</h2>
          <p className={styles.sub}>Contame tu objetivo y cuántos días podés entrenar. Te respondo yo.</p>
          <div className={styles.actions}>
            <Button href={linkWhatsapp()} external icon={<WhatsappLogo size={20} />}>
              Escribime por WhatsApp
            </Button>
            <Button href={linkInstagram} external variant="ghost" icon={<ArrowUpRight size={18} />}>
              Instagram
            </Button>
          </div>
        </Reveal>
      </section>

      <footer className={styles.footer}>
        <div className={`wrap ${styles.footInner}`}>
          <Image src="/brand/athlos-lockup.png" alt="Athlos Training" width={92} height={117} className={styles.lockup} />
          <nav aria-label="Contacto" className={styles.footLinks}>
            <a href={linkWhatsapp()} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            <a href={linkInstagram} target="_blank" rel="noopener noreferrer">
              @{contacto.instagram}
            </a>
          </nav>
          <p className={styles.legal}>© 2026 Athlos Training</p>
        </div>
      </footer>
    </>
  );
}
