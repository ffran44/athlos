import type { ReactNode } from "react";
import styles from "./Button.module.css";

type Props = {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  variant?: "primary" | "ghost";
  size?: "md" | "sm";
  external?: boolean;
  className?: string;
};

export function Button({ href, children, icon, variant = "primary", size = "md", external, className }: Props) {
  return (
    <a
      href={href}
      className={[styles.btn, styles[variant], styles[size], className].filter(Boolean).join(" ")}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span className={styles.label}>{children}</span>
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
    </a>
  );
}
