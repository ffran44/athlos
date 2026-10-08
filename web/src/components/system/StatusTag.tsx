import { ArrowDown, ArrowUp, CheckCircle, WarningCircle, XCircle } from "@phosphor-icons/react";
import styles from "./Demos.module.css";

export type Estado = "bien" | "bajo" | "alto" | "regular" | "mal";

const map = {
  bien: { Icon: CheckCircle, cls: styles.good },
  bajo: { Icon: ArrowDown, cls: styles.warn },
  regular: { Icon: WarningCircle, cls: styles.warn },
  alto: { Icon: ArrowUp, cls: styles.bad },
  mal: { Icon: XCircle, cls: styles.bad },
} as const;

/** Estado con ícono + texto: el color nunca es la única señal. */
export function StatusTag({ estado, children }: { estado: Estado; children: React.ReactNode }) {
  const { Icon, cls } = map[estado];
  return (
    <span className={`${styles.status} ${cls}`}>
      <Icon size={15} weight="bold" aria-hidden="true" />
      <span className={styles.statusText}>{children}</span>
    </span>
  );
}
