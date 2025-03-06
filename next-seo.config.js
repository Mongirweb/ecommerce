const seoConfig = {
  // The default title for your site.
  title: "Somos el Hueco Medellin - El Marketplace del Hueco de Medellín",
  // A template for the title, allowing you to add a suffix or prefix.
  titleTemplate: "%s | Somos el Hueco Medellin",
  // The default title for pages that don't specify their own title.
  defaultTitle: "Somos el Hueco",
  // The default description for your site.
  description:
    "Encuentra las mejores ofertas en moda, electrónicos, hogar y más en Somos el Hueco. Descubre increíbles descuentos en productos de alta calidad, todo en un solo lugar.",
  // Open Graph settings for better social media integration.
  openGraph: {
    // The type of content (e.g., website, article).
    type: "website",
    // The locale of your content.
    locale: "en_US",
    // The canonical URL of your site.
    url: "<https://www.somoselhueco.com/>",
    // The name of your site.
    site_name: "Somos el Hueco Medellínn",
    // The default title for Open Graph.
    title:
      "Somos el Hueco Medellin - El Marketplace de Saldos más Grande de Colombia",
    // The default description for Open Graph.
    description:
      "Encuentra las mejores ofertas en moda, electrónicos, hogar y más en Somos el Hueco Medellín. Descubre increíbles descuentos en productos de alta calidad, todo en un solo lugar.",
    // Images that will be used when your content is shared.
    images: [
      {
        url: "https://res.cloudinary.com/danfiejkv/image/upload/v1737325171/somos-el-hueco-medellin-logo-cuadrado_kfecc1.png",
        width: 1200,
        height: 630,
        alt: "Somos el Hueco Logo",
      },
    ],
  },
  // Twitter settings for Twitter cards.
  twitter: {
    // The card type, which determines how your content is displayed.
    cardType: "summary_large_image",
    // The Twitter handle of your site.
    site: "@somoselhueco",
    // The Twitter handle of the content creator.
    creator: "Somos el Hueco Medellín",
    // The default title for Twitter cards.
    title: "Somos el Hueco Medellín",
    // The default description for Twitter cards.
    description:
      "Encuentra las mejores ofertas en moda, electrónicos, hogar y más en Somos el Hueco Medellín. Descubre increíbles descuentos en productos de alta calidad, todo en un solo lugar.",
    // The image that will be used in Twitter cards.
    image:
      "https://res.cloudinary.com/danfiejkv/image/upload/v1737325171/somos-el-hueco-medellin-logo-cuadrado_kfecc1.png",
  },
};
export default seoConfig;
