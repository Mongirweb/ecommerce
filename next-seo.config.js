const seoConfig = {
  // The default title for your site.
  title: "Mongir | Todo para bebés",
  // A template for the title, allowing you to add a suffix or prefix.
  titleTemplate: "%s | Mongir",
  // The default title for pages that don't specify their own title.
  defaultTitle: "Mongir",
  // The default description for your site.
  description:
    "Encuentra los mejores productos y accesorios para bebés y niños. Ropa, juguetes, accesorios para el hogar y más, con la calidad que tu familia merece.",
  // Open Graph settings for better social media integration.
  openGraph: {
    // The type of content (e.g., website, article).
    type: "website",
    // The locale of your content.
    locale: "en_US",
    // The canonical URL of your site.
    url: "https://www.mongir.com",
    // The name of your site.
    site_name: "Mongir",
    // The default title for Open Graph.
    title: "Mongir | Todo para bebés",
    // The default description for Open Graph.
    description:
      "Encuentra los mejores productos y accesorios para bebés y niños. Ropa, juguetes, accesorios para el hogar y más, con la calidad que tu familia merece.",
    // Images that will be used when your content is shared.
    images: [
      {
        url: "https://res.cloudinary.com/danfiejkv/image/upload/v1742231694/MONGIR-LOGO_jkpbgw.png",
        width: 1200,
        height: 630,
        alt: "Mongir Logo",
      },
    ],
  },
  // Twitter settings for Twitter cards.
  twitter: {
    // The card type, which determines how your content is displayed.
    cardType: "summary_large_image",
    // The Twitter handle of your site.
    site: "@Mongir",
    // The Twitter handle of the content creator.
    creator: "Mongir",
    // The default title for Twitter cards.
    title: "Mongir | Todo para bebés",
    // The default description for Twitter cards.
    description:
      "Encuentra los mejores productos y accesorios para bebés y niños. Ropa, juguetes, accesorios para el hogar y más, con la calidad que tu familia merece.",
    // The image that will be used in Twitter cards.
    image:
      "https://res.cloudinary.com/danfiejkv/image/upload/v1742231694/MONGIR-LOGO_jkpbgw.png",
  },
};
export default seoConfig;
