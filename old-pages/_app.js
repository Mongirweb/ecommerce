import "../styles/globals.scss";
import { Provider } from "react-redux";
import store from "../store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import * as gtag from "../lib/gtag";
import dynamic from "next/dynamic";
import Script from "next/script";
import { GoogleTagManager } from "@next/third-parties/google";

let persistor = persistStore(store);

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const { openGraphData = [], keywords, title = "" } = pageProps;
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const ClipLoader = dynamic(() => import("react-spinners/ClipLoader"), {
    ssr: false,
  });
  const ToastContainer = dynamic(
    () => import("react-toastify").then((mod) => mod.ToastContainer),
    {
      ssr: false,
    }
  );

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setLoading(true);
    };

    const handleRouteChangeComplete = () => {
      setLoading(false);
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    router.events.on("routeChangeError", handleRouteChangeComplete);

    // Set loading to false once the page initially loads
    setLoading(false);

    // Cleanup the event listeners when the component unmounts
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
      router.events.off("routeChangeError", handleRouteChangeComplete);
    };
  }, [router]);

  // Handle Google Analytics pageview tracking
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        {openGraphData.map((og, i) => (
          <meta key={i} {...og} />
        ))}
        <meta name="keywords" content={keywords} />
      </Head>
      <SessionProvider session={session}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <PayPalScriptProvider>
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false} // avoid pauses to reduce performance impact
                draggable={false}
                pauseOnHover={false}
                theme="colored"
              />
              <noscript>
                <iframe
                  src="https://www.googletagmanager.com/ns.html?id=GTM-K9S4QLKS"
                  height="0"
                  width="0"
                  style={{ display: "none", visibility: "hidden" }}
                ></iframe>
              </noscript>

              <GoogleTagManager
                gtmId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
              />
              <GoogleTagManager
                gtmId={process.env.NEXT_PUBLIC_GTM_MEASUREMENT_ID}
              />
              {loading ? (
                <div className="loader-container">
                  <ClipLoader color={"#123abc"} loading={loading} size={50} />
                </div>
              ) : (
                <Component {...pageProps} />
              )}
            </PayPalScriptProvider>
          </PersistGate>
        </Provider>
      </SessionProvider>

      <style jsx>{`
        .loader-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(255, 255, 255, 0.8);
          z-index: 9999;
        }
      `}</style>
    </>
  );
}

export default MyApp;
