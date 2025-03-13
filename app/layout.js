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
