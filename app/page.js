import Footer from "../components/footer";
import Header from "../components/header";
import PromoSection from "../components/home/promoSection";
import Product from "../models/Product";
import db from "../utils/db";
import ClientHome from "./ClientHome";
import electric from "../public/images/promo/electrodomesticos-saldos-saldomania.webp";
import styles from "../styles/Home.module.scss";

export const generateMetadata = async () => {
  const title = "Mongir | Todo para bebés";
  const description =
    "Encuentra los mejores productos y accesorios para bebés y niños. Ropa, juguetes, accesorios para el hogar y más, con la calidad que tu familia merece.";
  const url = "https://www.mongir.com";

  // Structured Data for Schema.org
  const structuredData = {
    "@context": "http://schema.org",
    "@type": "WebSite",
    name: "Mongir",
    url: "https://www.mongir.com",
    description:
      "Encuentra los mejores productos y accesorios para bebés y niños. Ropa, juguetes, accesorios para el hogar y más, con la calidad que tu familia merece.",
  };

  // Breadcrumb Schema
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "https://www.mongir.com",
      },
    ],
  };

  return {
    title,
    description,
    keywords:
      "Mongir, bebés, bebé, niños, niños, ropa, ropa, juguetes, juguetes, accesorios, accesorios, hogar, hogar, calidad, calidad, familia, familia, compra, compra, tienda, tienda, online, online, virtual, virtual, centro, centro, comercial, comercial, compras, compras, línea, línea, compra, compra, al por mayor, al por mayor, mayoristas, mayoristas, tiendas, tiendas, productos, productos, mapa, mapa, como, como, comprar, comprar, descuentos, descuentos, ofertas, ofertas, promociones, promociones",
    openGraph: {
      title,
      description,
      url,
      siteName: "Mongir",
      images: [
        {
          url: "https://res.cloudinary.com/danfiejkv/image/upload/v1742231694/MONGIR-LOGO_jkpbgw.png",
          width: 200,
          height: 200,
          alt: "Mongir-logo-cuadrado",
        },
      ],
      locale: "es_CO",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: "@Mongir",
      creator: "@Mongir",
      title,
      description,
      images: [
        "https://res.cloudinary.com/danfiejkv/image/upload/v1742231694/MONGIR-LOGO_jkpbgw.png",
      ],
    },
    alternates: {
      canonical: url,
      languages: {
        "es-CO": url,
      },
    },
    other: {
      "application/ld+json": JSON.stringify([structuredData, breadcrumbData]),
    },
  };
};

export default async function HomePage() {
  await db.connectDb();
  const limit = 15; // Adjust the limit if needed
  const page = 0;
  const skip = page * limit;

  const recommendedData = JSON.parse(
    JSON.stringify(
      await Product.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
    )
  );

  await db.disconnectDb();

  return (
    <div>
      <Header />
      <ClientHome recommendedData={recommendedData} />
      <Footer />
    </div>
  );
}
