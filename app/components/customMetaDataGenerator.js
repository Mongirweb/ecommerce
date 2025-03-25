/**
 * Generates SEO-friendly metadata for your marketplace.
 *
 * @param {Object} params - Parameters for metadata generation.
 * @param {string} params.title - Page-specific title.
 * @param {string} [params.description] - A brief description of the page.
 * @param {string} [params.canonicalUrl] - The canonical URL of the page.
 * @param {string} [params.ogType] - The Open Graph type (default "website").
 * @param {string[]} [params.keywords] - An array of keywords.
 * @param {string} [params.ogImage] - URL for the Open Graph image.
 * @param {string} [params.twitterCard] - Twitter card type (default "summary_large_image").
 * @param {string} [params.robots] - Meta robots directive (e.g., "index, follow").
 * @param {string} [params.locale] - Locale setting for Open Graph (e.g., "es_CO").
 *
 * @returns {Object} SEO metadata configuration.
 */
export function customMetaDataGenerator({
  title,
  description = "Mongir - Compra en linea todo para tu bebé.",
  canonicalUrl = "https://www.mongir.com",
  ogType = "website",
  keywords = [
    "mongir",
    "mongir medellin",
    "comprar en linea",
    "comprar en el hueco",
    "el hueco",
    "colombia",
    "saldos",
    "saldos Ropa",
    "Tienda de moda saldos en línea colombia",
    "Mongir.com",
    "Compras en línea colombia",
    "saldos saldo Ropa de mujer",
    "saldos saldo Hogar y jardín",
    "saldos saldo Joyas y accesorios",
    "saldo saldos Belleza y salud",
    "saldos saldo Electrónica",
    "saldos saldo Ropa para hombres",
    "saldos saldo Moda para niños",
    "saldos saldo Zapatos y bolsos",
    "saldos saldo Suministros para mascotas",
    "saldos saldo Productos para bebés",
    "saldos saldo Deportes y actividades al aire libre",
    "saldos saldo Ropa interior y ropa de dormir",
    "saldos saldo Productos de oficina",
    "saldos saldo Industrial",
    "Automotriz y saldos saldo motocicleta, saldo, saldos",
  ],
  ogImage = "https://res.cloudinary.com/danfiejkv/image/upload/v1737325171/mongir-logo-cuadrado_kfecc1.png",
  twitterCard = "summary_large_image",
  robots = "index, follow",
  locale = "es_CO",
}) {
  // Create the full page title by combining the site title and page title.
  const siteTitle = "Mongir";
  const fullTitle = `${siteTitle} | ${title}`;

  // Structured data to help search engines understand your site
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteTitle,
    url: canonicalUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${canonicalUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    robots,
    openGraph: {
      title: fullTitle,
      description,
      type: ogType,
      url: canonicalUrl,
      locale,
      images: [
        {
          url: ogImage,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: twitterCard,
      title: fullTitle,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    // Include structured data markup for additional SEO benefits.
    structuredData: JSON.stringify(structuredData),
  };
}
