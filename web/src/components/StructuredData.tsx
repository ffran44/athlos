import { contacto, linkInstagram, planes, preguntas } from "@/content/site";
import { siteUrl } from "@/lib/site-url";

/**
 * Datos estructurados (schema.org) para que Google entienda quién es Manu,
 * qué ofrece Athlos y cuáles son las preguntas frecuentes.
 * No incluye dirección: falta definir dónde se entrena en el plan presencial.
 */
export function StructuredData() {
  const org = `${siteUrl}/#organizacion`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": org,
        name: "Athlos Training",
        url: siteUrl,
        logo: `${siteUrl}/brand/athlos-lockup.png`,
        sameAs: [linkInstagram],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: `+${contacto.whatsapp}`,
          contactType: "customer service",
          availableLanguage: "es",
        },
        founder: { "@id": `${siteUrl}/#manu` },
        makesOffer: planes.map((p) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: `Plan ${p.nombre}`, description: p.resumen },
        })),
      },
      {
        "@type": "Person",
        "@id": `${siteUrl}/#manu`,
        name: "Manu",
        jobTitle: "Entrenador",
        worksFor: { "@id": org },
      },
      {
        "@type": "FAQPage",
        mainEntity: preguntas.map((q) => ({
          "@type": "Question",
          name: q.p,
          acceptedAnswer: { "@type": "Answer", text: q.r },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // JSON generado desde nuestro propio contenido; se escapa "<" por seguridad.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
