import "../styles/globals.scss";
import { StoreProvider } from "../store/StoreProvider";
import SessionWrapper from "./components/SessionWrapper";
import { headers } from "next/headers";
import Script from "next/script";
import { ModalProvider } from "../context/ModalContext";
import ToastProvider from "./components/ToastProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Poppins } from "next/font/google";
import dynamic from "next/dynamic";
import { CartProvider } from "../context/CartContext";
import CartModal from "../components/home/cart";
import { GoogleTagManager } from "@next/third-parties/google";
import { GoogleAnalytics } from "@next/third-parties/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"], // Google‑font helpers expect an array
  display: "swap", // optional but recommended for CLS
});

const CrossTabSync = dynamic(() => import("./components/CrossTabSync"), {
  ssr: false,
});

const Whatsapp = dynamic(() => import("../components/Whatsapp"), {
  ssr: false,
});

const Modal = dynamic(() => import("../components/modal"), { ssr: false });

const DialogModal = dynamic(
  () => import("../components/createProductDialogModal"),
  { ssr: false }
);

const CustomDialog = dynamic(() => import("../components/dialogModal"), {
  ssr: false,
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
        "https://res.cloudinary.com/danfiejkv/image/upload/v1742231694/MONGIR-LOGO_jkpbgw.webp",
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
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {/* Initialize dataLayer early */}
        <GoogleTagManager gtmId="GTM-MQTLMPJC" />
        <GoogleAnalytics gaId="G-WE1CRE8BML" />
      </head>
      <body>
        <Script strategy="afterInteractive" nonce={nonce} />
        <ErrorBoundary>
          <SessionWrapper>
            <StoreProvider>
              <CartProvider>
                <ModalProvider>
                  <ToastProvider>
                    {" "}
                    {/* Wrapping with ToastProvider */}
                    {/* Google Tag Manager */}
                    <CrossTabSync />
                    {/* Main application content */}
                    {children}
                    <CartModal />
                    <Whatsapp />
                    <Modal />
                    <CustomDialog />
                    <DialogModal />
                    <Analytics mode="production" strategy="afterInteractive" />
                  </ToastProvider>
                </ModalProvider>
              </CartProvider>
            </StoreProvider>
          </SessionWrapper>
        </ErrorBoundary>
        <SpeedInsights mode="production" strategy="afterInteractive" />
      </body>
    </html>
  );
}
