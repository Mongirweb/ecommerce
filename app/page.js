// app/page.js or app/home/page.js (depending on your folder structure)
import Product from "../models/Product";
import db from "../utils/db";
import dynamic from "next/dynamic";
import electric from "../public/images/promo/electrodomesticos-saldos-saldomania.webp";
import styles from "../styles/Home.module.scss";
import MainSwiperSkeleton from "../components/skeletons/MainSwiperSkeleton";
import { categories } from "../data/categorie";
import { Suspense } from "react";
import { getCategorySlices } from "../utils/getCategorySlices";

const Header = dynamic(() => import("../components/header"), {
  ssr: true,
  loading: () => <MainSwiperSkeleton />,
});

const HeroLazy = dynamic(() => import("../app/components/hero/HeroLazy"), {
  ssr: true,
  loading: () => <MainSwiperSkeleton />,
});

const Footer = dynamic(() => import("../components/footer"), {
  ssr: true,
  loading: () => <MainSwiperSkeleton />,
});

// Lazy-load ClientHome because it contains dynamic and client-only code
const ClientHome = dynamic(() => import("./ClientHome"), {
  ssr: true,
  loading: () => <MainSwiperSkeleton />,
});

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
      "Mongir, bebés, bebé, accesorios bebe, moda bebe, niños, niños, ropa, ropa, juguetes, juguetes, accesorios, accesorios, hogar, hogar, calidad, calidad, familia, familia, compra, compra, tienda, tienda, online, online, virtual, virtual, centro, centro, comercial, comercial, compras, compras, línea, línea, compra, compra, al por mayor, al por mayor, mayoristas, mayoristas, tiendas, tiendas, productos, productos, mapa, mapa, como, como, comprar, comprar, descuentos, descuentos, ofertas, ofertas, promociones, promociones",
    openGraph: {
      title,
      description,
      url,
      siteName: "Mongir",
      images: [
        {
          url: "https://res.cloudinary.com/danfiejkv/image/upload/q_50/v1742231694/MONGIR-LOGO_jkpbgw.webp",
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

export const revalidate = 3600;

export default async function HomePage() {
  return (
    <div>
      <Header />
      <HeroLazy />
      {/* Render static MainSwiper immediately.
          If MainSwiper includes images, consider using the "priority" prop
          on <Image> components inside it to preload key visuals. */}
      {/* Lazy-loaded dynamic content */}
      <Suspense fallback={null}>
        <ClientHome />
      </Suspense>

      {/* <div className={styles.container}>
        <PromoSection
          img={electric}
          text={
            <>
              <span></span> <br />
              <span>TE VENDEMOS AL POR MAYOR</span>
              <br />
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  justifyContent: "center",
                }}
              >
                {" "}
                <FaWhatsapp />
                CONTACTANOS!
              </span>
            </>
          }
        />
      </div> */}
      <Footer />
    </div>
  );
}
