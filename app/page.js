import Footer from "../components/footer";
import Header from "../components/header";
import PromoSection from "../components/home/promoSection";
import Product from "../models/Product";
import db from "../utils/db";
import ClientHome from "./ClientHome";
import electric from "../public/images/promo/electrodomesticos-saldos-saldomania.webp";
import styles from "../styles/Home.module.scss";

export const generateMetadata = async () => {
  const title =
    "Somos el Hueco | Compra a Precio del Hueco de Medellín con Envío Gratis";
  const description =
    "Encuentra los Mejores Productos del Hueco de Medellin sin Salir de Casa  | Compra en línea";
  const url = "https://www.somoselhueco.com";

  // Structured Data for Schema.org
  const structuredData = {
    "@context": "http://schema.org",
    "@type": "WebSite",
    name: "Somos el Hueco Medellín",
    url: "https://www.somoselhueco.com",
    description:
      "Encuentra los Mejores Productos del Hueco de Medellin sin Salir de Casa  | Compra en línea",
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
        item: "https://www.somoselhueco.com",
      },
    ],
  };

  return {
    title,
    description,
    keywords:
      "Somos el Hueco Medellín, El Hueco de Medellín, somoselhueco, somos el hueco, el hueco medellín, el hueco Colombia, comprar en el hueco somos el hueco, somoselhueco,  el hueco virtual, centro comercial el hueco, compras en línea el hueco, compra online el hueco, tienda en línea el hueco, compra al por mayor en el hueco, mayoristas en el hueco,tiendas en el hueco medellín,productos en el hueco medellín,mapa el hueco medellin, como comprar en el hueco,descuentos en el hueco, ofertas el hueco, promociones el hueco",
    openGraph: {
      title,
      description,
      url,
      siteName: "Somos el Hueco Medellín",
      images: [
        {
          url: "https://res.cloudinary.com/danfiejkv/image/upload/v1737325171/somos-el-hueco-medellin-logo-cuadrado_kfecc1.png",
          width: 200,
          height: 200,
          alt: "Somos-el-hueco-medellin-compra-virtual-producto-online-en-linea-somoselhueco",
        },
      ],
      locale: "es_CO",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: "@somoselhueco",
      creator: "@somoselhueco",
      title,
      description,
      images: [
        "https://res.cloudinary.com/danfiejkv/image/upload/v1737325171/somos-el-hueco-medellin-logo-cuadrado_kfecc1.png",
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
      <div style={{ display: "none" }}>
        <h1>
          Somos el Hueco | Compra a Precio del Hueco de Medellín con Envío
          Gratis
        </h1>
        <h2>
          Encuentra los Mejores Productos del Hueco de Medellin sin Salir de
          Casa | Compra en línea
        </h2>
        <h3>
          Antojate de todo lo que quieras del Hueco, que en Somoselhueco te lo
          llevas a casa
        </h3>
        <p>
          En somoselhueco.com, traemos el auténtico precio del Hueco de Medellín
          directamente a tu puerta. Explora miles de productos ofrecidos por las
          mejores empresas del Hueco. Somos el Hueco
        </p>
      </div>
      <Footer />
    </div>
  );
}
