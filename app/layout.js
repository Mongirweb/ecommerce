import "../styles/globals.scss";
import { ToastContainer } from "react-toastify";
import { StoreProvider } from "../store/StoreProvider";
import SessionWrapper from "./components/SessionWrapper";
import { GoogleAnalytics } from "@next/third-parties/google";
import { GoogleTagManager } from "@next/third-parties/google";
import { customMetaDataGenerator } from "./components/customMetaDataGenerator";
import { headers } from "next/headers";
import Script from "next/script";
import { ModalProvider } from "../context/ModalContext";
import Modal from "../components/modal";
import ToastProvider from "./components/ToastProvider";
import CustomDialog from "../components/dialogModal";
import DialogModal from "../components/createProductDialogModal";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import CrossTabSync from "./components/CrossTabSync";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
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

export default function RootLayout({ children }) {
  const nonce = headers().get("x-nonce");

  return (
    <html lang="es" translate="no" className={poppins.className}>
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body>
        <Script strategy="afterInteractive" nonce={nonce} />
        <ErrorBoundary>
          <SessionWrapper>
            <StoreProvider>
              <ModalProvider>
                <ToastProvider>
                  {" "}
                  {/* Wrapping with ToastProvider */}
                  {/* Google Tag Manager */}
                  <GoogleAnalytics
                    gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
                    strategy="afterInteractive"
                  />
                  <GoogleTagManager
                    gtmId={process.env.NEXT_PUBLIC_GTM_MEASUREMENT_ID}
                  />
                  <CrossTabSync />
                  {/* Main application content */}
                  {children}
                  <Modal />
                  <CustomDialog />
                  <DialogModal />
                  <Analytics />
                </ToastProvider>
              </ModalProvider>
            </StoreProvider>
          </SessionWrapper>
        </ErrorBoundary>
        <SpeedInsights />
      </body>
    </html>
  );
}
