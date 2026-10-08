"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { linkWhatsapp } from "@/content/site";
import { Button } from "./ui/Button";
import styles from "./Nav.module.css";

const links = [
  { href: "#metodo", label: "Método" },
  { href: "#sistema", label: "Sistema" },
  { href: "#planes", label: "Planes" },
  { href: "#manu", label: "Sobre Manu" },
  { href: "#preguntas", label: "Preguntas" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={styles.header} data-open={open}>
      <div className={`wrap ${styles.bar}`}>
        <a href="#top" className={styles.brand} aria-label="Athlos Training, inicio">
          <Image src="/brand/athlos-mark.png" alt="" width={26} height={36} priority />
          <span className={styles.word}>
            Athlos<span>Training</span>
          </span>
        </a>

        <nav aria-label="Secciones" className={styles.links}>
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className={styles.cta}>
          <Button href={linkWhatsapp()} external size="sm" icon={<WhatsappLogo size={18} weight="regular" />}>
            Escribime por WhatsApp
          </Button>
        </div>

        <button
          type="button"
          className={styles.burger}
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
      </div>

      <div id="menu-movil" className={styles.sheet} hidden={!open}>
        <nav aria-label="Secciones" className={styles.sheetLinks}>
          {links.map((l, i) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ "--i": i } as React.CSSProperties}>
              {l.label}
            </a>
          ))}
        </nav>
        <Button href={linkWhatsapp()} external icon={<WhatsappLogo size={20} />}>
          Escribime por WhatsApp
        </Button>
      </div>
    </header>
  );
}
