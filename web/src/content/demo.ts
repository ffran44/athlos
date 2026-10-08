/**
 * Datos de ejemplo para las demos de la landing.
 * Salen de las planillas del sistema Athlos (Sistema_Athlos_6dias.xlsx y la planilla
 * de hábitos de prueba), anonimizados. Las medidas corporales son de ejemplo porque
 * la planilla original estaba vacía.
 */

/** Fórmula de Epley, la misma que usa la planilla. */
export const rmEstimado = (kg: number, reps: number) => kg * (1 + reps / 30);

export type Semana = { kg: number; reps: number } | null;

export type Ejercicio = {
  id: string;
  nombre: string;
  dia: string;
  musculo: string;
  series: number;
  topeRango: number;
  semanas: Semana[]; // S1..S8, null = todavía no registrada
};

const s = (kg: number, reps: number) => ({ kg, reps });

export const ejercicios: Ejercicio[] = [
  {
    id: "hack",
    nombre: "Hack Squat",
    dia: "Día 1",
    musculo: "Cuádriceps",
    series: 4,
    topeRango: 10,
    semanas: [s(80, 10), s(80, 11), s(85, 9), s(85, 10), s(90, 8), s(90, 9), null, null],
  },
  {
    id: "hip",
    nombre: "Hip Thrust",
    dia: "Día 1",
    musculo: "Glúteos",
    series: 4,
    topeRango: 10,
    semanas: [s(90, 10), s(90, 11), s(95, 9), s(95, 10), s(100, 8), s(100, 9), null, null],
  },
  {
    id: "jalon",
    nombre: "Jalón al pecho",
    dia: "Día 2",
    musculo: "Espalda",
    series: 3,
    topeRango: 15,
    semanas: [s(50, 10), s(50, 11), s(55, 9), s(55, 10), s(60, 8), s(60, 9), null, null],
  },
  {
    id: "prensa",
    nombre: "Prensa 45°",
    dia: "Día 3",
    musculo: "Cuádriceps",
    series: 4,
    topeRango: 12,
    semanas: [s(140, 10), s(140, 11), s(150, 9), s(150, 10), s(160, 8), s(160, 9), null, null],
  },
  {
    id: "dead-bug",
    nombre: "Dead Bug",
    dia: "Día 1",
    musculo: "Core",
    series: 3,
    topeRango: 10,
    semanas: [s(10, 10), s(10, 11), s(10, 12), s(12, 10), s(12, 11), s(12, 12), null, null],
  },
];

/** Igual que la planilla: si la serie de la última semana llegó al tope del rango, toca subir. */
export function senal(ej: Ejercicio): "subir" | "mantener" {
  const ultima = [...ej.semanas].reverse().find(Boolean);
  return ultima && ultima.reps >= ej.topeRango ? "subir" : "mantener";
}

/** Series semanales por músculo (semana 6) y el rango objetivo. */
export const musculos = [
  { nombre: "Glúteos", series: 16, min: 12, max: 18 },
  { nombre: "Hombro", series: 18, min: 12, max: 16 },
  { nombre: "Cuádriceps", series: 11, min: 10, max: 16 },
  { nombre: "Glúteo medio", series: 10, min: 6, max: 10 },
  { nombre: "Espalda", series: 9, min: 10, max: 16 },
  { nombre: "Core", series: 9, min: 6, max: 10 },
  { nombre: "Isquios", series: 7, min: 8, max: 12 },
  { nombre: "Pectoral", series: 6, min: 6, max: 10 },
];

/* ---------- Medidas corporales (ejemplo) ---------- */

// Ruido determinístico para que el ejemplo sea siempre igual.
const ruido = [0.3, -0.2, 0.5, -0.4, 0.1, 0.4, -0.3, 0.2, -0.5, 0.3, 0, -0.2, 0.4, -0.1, 0.2, -0.4, 0.3, 0.1, -0.3, 0.4, -0.2, 0, 0.3, -0.4, 0.2, -0.1, 0.3, -0.3];

export const pesoDiario = ruido.map((r, i) => Math.round((79.6 - i * 0.075 + r) * 10) / 10);

export const pesoMedia7 = pesoDiario.map((_, i) => {
  if (i < 6) return null;
  const v = pesoDiario.slice(i - 6, i + 1);
  return Math.round((v.reduce((a, b) => a + b, 0) / 7) * 100) / 100;
});

export const circunferencias = [
  { parte: "Cintura", actual: 84.5, anterior: 86.6 },
  { parte: "Cadera", actual: 98.0, anterior: 99.0 },
  { parte: "Brazo", actual: 35.4, anterior: 35.0 },
  { parte: "Muslo", actual: 57.2, anterior: 57.8 },
];

export const composicion = {
  grasa: 16.8,
  grasaAnterior: 18.1,
  estrategia: "Definición leve",
  balance: -320,
};

/* ---------- Hábitos (de la planilla de prueba) ---------- */

export type Habito = {
  id: string;
  nombre: string;
  objetivo: string;
  puntos: number;
  obligatorio?: boolean;
};

export const habitos: Habito[] = [
  { id: "h1", nombre: "Entrenar", objetivo: "1 sesión", puntos: 15 },
  { id: "h2", nombre: "Caminar", objetivo: "8.000 pasos", puntos: 10 },
  { id: "h5", nombre: "Dormir 7 a 8 horas", objetivo: "7,5 h", puntos: 10, obligatorio: true },
  { id: "h3", nombre: "Leer", objetivo: "20 min", puntos: 10 },
  { id: "h6", nombre: "Estudiar", objetivo: "30 min", puntos: 10 },
  { id: "h4", nombre: "Tomar agua", objetivo: "2,5 litros", puntos: 5 },
];

export const estadoHabitos = {
  racha: 38,
  protecciones: 3,
  nivel: 6,
  xp: 2325,
  xpSiguiente: 2750,
  xpNivelActual: 1900,
  // Puntuación de los últimos 14 días (0 a 100)
  ultimos14: [100, 90, 100, 85, 100, 75, 100, 100, 95, 100, 65, 100, 100, 90],
};

export const umbrales = { cumplido: 80, regular: 60 };
