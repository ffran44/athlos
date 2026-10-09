# Athlos Training · Landing

Landing de Manu (Athlos Training) hecha con Next.js 16.

## Desarrollo

```bash
npm install
npm run dev -- -p 4321
```

## Qué editar

Todo el contenido está en `src/content/site.ts`:

- `contacto.whatsapp`: número en formato internacional, sin `+` ni espacios.
- `contacto.instagram`: usuario de Instagram.
- `planes`, `bio`, `testimonios` (borrar `ejemplo: true` al poner los reales) y `preguntas`.
- Foto de Manu: guardarla en `public/manu.jpg` (vertical 4:5) y poner `foto: "/manu.jpg"` en `bio`.

Los datos de las demos (progresión, medidas y hábitos) están en `src/content/demo.ts`.

La imagen que aparece al compartir el link es un archivo fijo: `src/app/opengraph-image.png` (1200×630). Si cambia el título del hero, hay que reemplazarla.

## Publicar

Se puede subir tal cual a Vercel (importar el repo y elegir la carpeta `web`) o generar el sitio con `npm run build`.

Cuando haya dominio propio, definir en Vercel la variable `NEXT_PUBLIC_SITE_URL` (por ejemplo `https://athlostraining.com.ar`). Sin ella se usa el dominio de Vercel.
