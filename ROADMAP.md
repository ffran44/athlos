# Roadmap Athlos Training

Estado al 9/10/2026. La landing está **publicada en https://athlos-training.vercel.app** (Vercel publica solo cada push a `main` de `ffran44/athlos`). Tiene el WhatsApp y el Instagram reales, Noto Serif en los títulos y GFS Neohellenic en el texto. Lo que falta para lanzarla es el contenido de Manu (sección 1).
Marcá cada ítem con `[x]` a medida que se resuelva.

**Responsable:** 🧑‍🏫 Manu · 💻 vos (desarrollo)

---

## 1. Contenido que falta (bloquea el lanzamiento)

Todo se carga en `web/src/content/site.ts`.

- [ ] 🧑‍🏫 **Bio de Manu**: titular y 2 párrafos cortos. Sumar formación o certificaciones si las tiene (hoy no se menciona ninguna).
- [ ] 🧑‍🏫 **Foto de Manu**: vertical 4:5, mínimo 1200 px de alto. Va en `web/public/manu.jpg` y después se pone `foto: "/manu.jpg"` en `bio`.
- [ ] 🧑‍🏫 **Testimonios reales**: al menos 3, de hasta 3 líneas, con nombre, plan y tiempo entrenando. **Pedir permiso a cada alumno** para publicarlo.
- [ ] 💻 Cargar los testimonios y borrar `ejemplo: true` para que desaparezca la etiqueta "Texto de ejemplo".
- [ ] 🧑‍🏫 **Validar los planes**: nombres, qué incluye cada uno y si se muestran precios o se deja "Precio a consultar".
- [ ] 🧑‍🏫 **Plan presencial**: definir en qué gimnasio o ciudad entrena, para mostrarlo en la página.
- [ ] 🧑‍🏫 **Revisar las preguntas frecuentes** y sus respuestas (días por semana, plicómetro, etc.).
- [ ] 🧑‍🏫 **Leer todos los textos de la página** y marcar lo que no suene a Manu. Están escritos en primera persona, como si hablara él, y ya se les sacaron las frases que sonaban a IA.
- [ ] 🧑‍🏫 **Demo de medidas**: los números son inventados porque la planilla estaba vacía. Decidir si quedan como ejemplo o se reemplazan por datos reales anonimizados.

## 2. Publicación

- [x] 💻 **Commit del proyecto `web/`**.
- [x] 💻 **No subir los Excel al repo**: el de 6 días tiene datos de una alumna real. Quedan ignorados por el `.gitignore`.
- [x] 💻 **Subir a GitHub** (`ffran44/athlos`, rama `main`).
- [ ] 🧑‍🏫💻 **Pasar el repo a privado.** Quedó a mitad de camino: GitHub pide verificar la identidad con un código por mail. Hay una pestaña abierta en Chrome en ese paso.
- [x] 💻 **Deploy en Vercel**: proyecto `athlos-training`, carpeta raíz `web`, publicado en https://athlos-training.vercel.app.
- [ ] 💻 **Activar el 2FA en la cuenta de Vercel.** Se salteó el aviso al hacer el deploy.
- [ ] 🧑‍🏫💻 **Dominio propio**: ver disponibilidad (por ejemplo, `.com.ar` en NIC Argentina) y conectarlo en Vercel. Después definir `NEXT_PUBLIC_SITE_URL` en Vercel con ese dominio (lo usan el sitemap, el canonical y la imagen para compartir).
- [x] 💻 **Imagen para compartir** (Open Graph): `web/src/app/opengraph-image.png`, con el logo, el título y la curva del Hack Squat.
- [x] 💻 **`sitemap.xml` y `robots.txt`** para Google.
- [x] 💻 **Datos estructurados** (Organization, Person y FAQPage). Falta sumar la dirección cuando se defina dónde es el presencial.
- [ ] 💻 **Analytics** (Vercel Analytics o GA4) con eventos en los clics de WhatsApp e Instagram, para saber cuántas consultas trae la página.
- [ ] 💻 **Probar en celulares reales** (iPhone con Safari, Android con Chrome): que WhatsApp abra la app con el mensaje ya escrito.
- [x] 💻 **Correr Lighthouse sobre la versión publicada** (9/10/2026). Rendimiento / accesibilidad / buenas prácticas / SEO: escritorio 100 / 100 / 100 / 100 y celular 88 / 100 / 100 / 100 (LCP 3,1 s, sin saltos de layout).
- [ ] 💻 **Subir el rendimiento en celular a 90 o más**: el LCP de 3,1 s viene sobre todo del JavaScript de las animaciones (librería Motion). Opción: pasar las entradas al scroll a CSS puro.
- [ ] 🧑‍🏫 **Poner el link en la bio de Instagram** (`athlos_training.mc`): https://athlos-training.vercel.app. Conviene esperar a tener la bio, la foto y los testimonios reales.
- [ ] 🧑‍🏫 **Google Business Profile**, si el presencial tiene un lugar fijo.

## 3. Arreglos en las planillas (encontrados al analizarlas)

- [ ] 🧑‍🏫💻 **`SISTEMA_DE_MEDIDAS_CORPORALES-1.xlsx`**: el Dashboard muestra `#REF!` en todas las circunferencias y pliegues. Hay referencias rotas a la hoja de Mediciones.
- [ ] 🧑‍🏫 **`Sistema_Athlos_6dias.xlsx`**: los MÍN y MÁX de series por músculo están vacíos, así que el semáforo de músculos no funciona hasta completarlos.
- [ ] 🧑‍🏫 **`Sistema_Athlos_6dias.xlsx`**: los días 4, 5 y 6 no tienen nombre de sesión y hay un "Ejercicio de prueba" cargado.
- [ ] 🧑‍🏫 **Planilla de hábitos** ("Prueba, no utilizar con alumnos"): terminar las pruebas y generar la versión final para alumnos.
- [ ] 🧑‍🏫 **Plantillas limpias**: armar una copia vacía de cada planilla para cada alumno nuevo. La Guía dice "hacé una copia del archivo".

## 4. Mejoras después del lanzamiento

- [ ] **Resultados / antes y después**, con fotos y autorización de los alumnos.
- [ ] **Formulario corto de evaluación** (objetivo, días disponibles, experiencia) que arme solo el mensaje de WhatsApp.
- [ ] **Precios**, si Manu decide mostrarlos.
- [ ] **Videos de técnica** o publicaciones de Instagram dentro de la página.
- [ ] **Guía de medición pública**: ya existe en la planilla y en Canva, puede servir como contenido para atraer gente.
- [ ] **Recurso descargable gratis** (por ejemplo, un bloque de muestra) a cambio del contacto.

## 5. A largo plazo

- [ ] **App web para alumnos**: login, carga semanal desde el celular y los mismos gráficos de la landing, reemplazando los Excel. La lógica ya está en `web/src/content/demo.ts` (RM de Epley, señal de subir carga, semáforo, puntuación de hábitos).
