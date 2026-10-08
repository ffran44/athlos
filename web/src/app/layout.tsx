import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, Noto_Serif } from "next/font/google";
import "./globals.css";

// Display: serif clásica, acompaña el wordmark del logo.
const notoSerif = Noto_Serif({
  variable: "--font-display",
  subsets: ["latin"],
});

// Texto: grotesca deportiva con eje de ancho.
const archivo = Archivo({
  variable: "--font-body",
  subsets: ["latin"],
  axes: ["wdth"],
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
    "Coaching online y presencial con Manu. Planificación por bloques, medidas corporales y hábitos, registrados y revisados cada semana.",
  openGraph: {
    title: "Athlos Training",
    description: "Entrenamiento con método: planificación, medidas corporales y hábitos en un mismo sistema.",
    locale: "es_AR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#EDF0F3",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-AR" className={`${notoSerif.variable} ${archivo.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
