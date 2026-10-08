import type { Metadata, Viewport } from "next";
import { GFS_Neohellenic, IBM_Plex_Mono, Noto_Serif } from "next/font/google";
import "./globals.css";

// Display: serif clásica, acompaña el wordmark del logo.
const notoSerif = Noto_Serif({
  variable: "--font-display",
  subsets: ["latin"],
});

// Texto: sans de raíz griega, en sintonía con el nombre Athlos.
const neohellenic = GFS_Neohellenic({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

// Números: el ADN de planilla del sistema.
const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Athlos Training | Entrenamiento con método",
  description:
    "Coaching online y presencial con Manu. Planes de 8 semanas con registro de cargas, medidas corporales y hábitos, revisados cada semana.",
  openGraph: {
    title: "Athlos Training",
    description: "Coaching online y presencial con Manu: entrenamiento, medidas corporales y hábitos en un mismo sistema.",
    locale: "es_AR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#EDF0F3",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-AR" className={`${notoSerif.variable} ${neohellenic.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
