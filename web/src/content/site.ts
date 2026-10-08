/**
 * Contenido editable de la landing.
 * Todo lo que Manu quiera cambiar (contacto, planes, bio, testimonios, preguntas)
 * vive en este archivo. Los campos marcados con TODO tienen valores de ejemplo.
 */

export const contacto = {
  // Formato internacional, sin "+", espacios ni guiones (+54 9 3571 69-6652)
  whatsapp: "5493571696652",
  instagram: "athlos_training.mc",
  mensajeInicial: "Hola Manu, vi la página de Athlos y quiero empezar a entrenar con vos.",
};

export function linkWhatsapp(mensaje: string = contacto.mensajeInicial) {
  return `https://wa.me/${contacto.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

export const linkInstagram = `https://www.instagram.com/${contacto.instagram}/`;

export type Plan = {
  id: string;
  nombre: string;
  resumen: string;
  modalidad: string;
  incluye: string[];
  destacado?: boolean;
};

export const planes: Plan[] = [
  {
    id: "full",
    nombre: "Full",
    modalidad: "Online o presencial",
    resumen:
      "El sistema Athlos completo: entrenamiento, medidas corporales y hábitos, revisados juntos cada mes.",
    incluye: [
      "Planificación por bloques de 8 semanas, de 3 a 6 días",
      "Planilla de progresión con RM estimado y señales de carga",
      "Registro de peso diario, circunferencias, pliegues y fotos",
      "Sistema de hábitos con puntuación diaria, rachas y desafíos",
      "Revisión mensual de todo el sistema y ajuste de la estrategia",
    ],
    destacado: true,
  },
  {
    id: "online",
    nombre: "Online",
    modalidad: "A distancia",
    resumen: "Tu planificación y tu planilla de progresión, con seguimiento semanal desde donde entrenes.",
    incluye: [
      "Bloques de 8 semanas adaptados a tu gimnasio",
      "Registro semanal de cargas y repeticiones",
      "Ajustes de carga y volumen por músculo",
      "Consultas por WhatsApp",
    ],
  },
  {
    id: "presencial",
    nombre: "Presencial",
    modalidad: "En sala, conmigo",
    resumen: "Entrenamos juntos. Corrijo la técnica en cada serie y registramos todo en el sistema.",
    incluye: [
      "Sesiones guiadas en el gimnasio",
      "Corrección de técnica en el momento",
      "La misma planificación y planilla de progresión",
      "Toma de medidas en persona",
    ],
  },
];

// TODO: reemplazar por la bio real de Manu.
export const bio = {
  nombre: "Manu",
  titular: "Entrenar bien es medir, ajustar y volver a medir.",
  parrafos: [
    "Soy Manu, entrenador y creador de Athlos Training. Armé este sistema porque veía a mucha gente entrenar meses sin saber si estaba progresando.",
    "Con Athlos cada alumno tiene su planificación, su registro semanal y sus medidas en un mismo lugar. Los números nos dicen cuándo subir la carga, cuándo sumar volumen y cuándo cambiar la estrategia.",
  ],
  // TODO: poner la foto en /public/manu.jpg (vertical, 4:5, mínimo 1200 px de alto)
  foto: null as string | null,
};

export type Testimonio = {
  texto: string;
  nombre: string;
  detalle: string;
  ejemplo?: boolean;
};

// TODO: reemplazar por testimonios reales y borrar `ejemplo: true`.
export const testimonios: Testimonio[] = [
  {
    texto:
      "Por primera vez sé exactamente cuánto levanté cada semana. Ver la curva del RM subir me hizo no faltar más.",
    nombre: "Nombre del alumno",
    detalle: "Plan Full, 6 meses",
    ejemplo: true,
  },
  {
    texto: "Lo de los hábitos parecía un juego, pero sostener la racha me ordenó el sueño y la comida.",
    nombre: "Nombre de la alumna",
    detalle: "Plan Online, 4 meses",
    ejemplo: true,
  },
  {
    texto: "Bajé 6 cm de cintura sin perder fuerza. Las mediciones mensuales muestran lo que la balanza no.",
    nombre: "Nombre del alumno",
    detalle: "Plan Presencial, 1 año",
    ejemplo: true,
  },
];

export const preguntas = [
  {
    p: "¿Necesito experiencia previa?",
    r: "No. El primer bloque arranca desde tu nivel actual y las cargas suben solo cuando llegás al tope del rango de repeticiones.",
  },
  {
    p: "¿Cómo funciona el plan online?",
    r: "Te paso tu planificación y tu planilla. Cada semana cargás kilos y repeticiones, yo reviso los números y ajusto lo que haga falta.",
  },
  {
    p: "¿Qué necesito para tomarme las medidas?",
    r: "Una cinta métrica y una balanza. Para los pliegues hace falta un plicómetro; si no tenés, arrancamos con circunferencias y fotos.",
  },
  {
    p: "¿Tengo que usar todas las planillas?",
    r: "No. El plan Online y el Presencial se enfocan en el entrenamiento. Medidas y hábitos vienen en el plan Full o se suman cuando quieras.",
  },
  {
    p: "¿Cuántos días por semana voy a entrenar?",
    r: "Entre 3 y 6, según tu objetivo y tu disponibilidad. El sistema está armado para bloques de hasta 6 días.",
  },
];
