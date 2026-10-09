/**
 * URL pública del sitio. Orden de prioridad:
 * 1. NEXT_PUBLIC_SITE_URL (cuando haya dominio propio, se define en Vercel).
 * 2. El dominio de producción que Vercel expone automáticamente.
 * 3. Local.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:4321");
