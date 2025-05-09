"use client";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import styles from "../styles/Home.module.scss";
import { categories } from "../data/categorie";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import { addProducts, setPage } from "../store/infiniteScrollSlice";
import Link from "next/link";
import MainSwiperSkeleton from "../components/skeletons/MainSwiperSkeleton";
import { videos } from "../data/videos";
import PromoSection from "../components/home/promoSection";
import { FaWhatsapp } from "react-icons/fa";
import { MapPinned } from "lucide-react";

const InfiniteScroll = dynamic(
  () => import("../components/home/infiniteScroll"),
  {
    ssr: false,
    loading: () => <MainSwiperSkeleton />,
  }
);

const Title = dynamic(() => import("../components/home/title"), {
  ssr: false,
  loading: () => <MainSwiperSkeleton />,
});

const SocialVideoSwiper = dynamic(
  () => import("../components/home/socialVideoSwiper"),
  {
    ssr: false,
    loading: () => <MainSwiperSkeleton />,
  }
);

const Main = dynamic(() => import("../components/home/main"), {
  ssr: false,
  loading: () => <MainSwiperSkeleton />,
});

const ShipmentBannerMobile = dynamic(
  () => import("../components/home/shipmentBannerMobile"),
  {
    ssr: true,
    loading: () => <MainSwiperSkeleton />,
  }
);

const ShipmentBanner = dynamic(
  () => import("../components/home/shipmentBanner"),
  {
    ssr: true,
    loading: () => <MainSwiperSkeleton />,
  }
);

const CategoriesSwiper = dynamic(
  () => import("../components/home/categorySwiper"),
  {
    ssr: false,
    loading: () => <MainSwiperSkeleton />,
  }
);

const alreadyFetchedRecomended = new Set(); // Track fetched pages
const alreadyFetchedOffers = new Set(); // Track fetched pages
const alreadyFetchedNew = new Set(); // Track fetched pages
const alreadyFetchedUserProducts = new Set(); // Track fetched pages

//// Este componente cargará datos sólo cuando su sección esté en vista.
export default function ClientHome() {
  const dispatch = useDispatch();

  const { products, page } = useSelector((state) => state.infiniteScroll);

  const [newRecomendedProducts, setNewRecomendedProducts] = useState([]);

  const [newProducts3, setNewProducts3] = useState(products);
  const [newLoaded3, setNewLoaded3] = useState(false);

  const [recomendedProductsPage, setRecomendedProductsPage] = useState(0);

  const [autoFetchEnabled, setAutoFetchEnabled] = useState(true);

  const [hasMoreUserProducts, setHasMoreUserProducts] = useState(true);

  const [autoFetchCount, setAutoFetchCount] = useState(0);

  // Refs para cada categoría para disparar la carga al entrar en vista

  const visitedProducts = useSelector((state) => state.userVisitedProducts);

  useEffect(() => {
    alreadyFetchedRecomended.clear(); // Clear similar fetched pages
    alreadyFetchedNew.clear(); // Clear similar fetched pages
    alreadyFetchedOffers.clear(); // Clear related fetched pages
    alreadyFetchedUserProducts.clear();
  }, []);

  // Función para manejar el click en "Ver más"
  const handleClickVerMas = () => {
    setAutoFetchEnabled(true); // ✔
    setAutoFetchCount(0);
    fetchMoreUserRelatedProducts();
    // fuerza al virtualizador a añadir la fila loader
  };

  // useEffect(() => {
  //   const fetchRecomendedProducts = async () => {
  //     try {
  //       fetch(`/api/products/recomended`, {
  //         cache: "no-store",
  //       })
  //         .then((res) => res.json())
  //         .then((data) => {
  //           if (data && data.length > 0) {
  //             setNewRecomendedProducts((prev) => [...prev, ...data]);
  //             setNewLoaded3(false);
  //           } else {
  //             setHasMoreUserProducts(false);
  //             setNewLoaded3(false);
  //           }
  //         })
  //         .catch((err) => {
  //           console.error("Error fetching user related products", err);
  //         });
  //     } catch (error) {
  //       console.error("Error fetching user related products", error);
  //     }
  //   };
  //   fetchRecomendedProducts();
  // }, []);

  // Función para cargar más productos relacionados con el usuario
  const fetchMoreUserRelatedProducts = React.useCallback(() => {
    if (alreadyFetchedUserProducts.has(page)) return;

    if (!autoFetchEnabled) return;
    setNewLoaded3(true);

    alreadyFetchedUserProducts.add(page);
    fetch(`/api/products/userRelated?page=${page}`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setNewProducts3((prev) => [...prev, ...data]);
          dispatch(addProducts(data));
          dispatch(setPage(page + 1));
          setAutoFetchCount((prev) => {
            const newCount = prev + 1;
            if (newCount >= 7) {
              // Change to 50 as per your requirement
              setAutoFetchEnabled(false);
            }
            return newCount;
          });
          setNewLoaded3(false);
        } else {
          setHasMoreUserProducts(false);
          setNewLoaded3(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching user related products", err);
      });
  }, [page, autoFetchEnabled, dispatch]);

  const { ref: infiniteRef, inView: infiniteInView } = useInView({
    triggerOnce: true,
  });

  return (
    <div>
      <div className={styles.home}>
        <div className={styles.container}>
          {/* <Main newRecomendedProducts={newRecomendedProducts} /> */}
          <div className={styles.desktopOnly}>
            <ShipmentBanner />
          </div>
          <div className={styles.mobileOnly}>
            <ShipmentBannerMobile />
          </div>
          <CategoriesSwiper categories={categories} header={"Categorías"} />
        </div>
        <div className={styles.infinite} ref={infiniteRef}>
          <InfiniteScroll
            products={newProducts3}
            fetchMoreProducts={fetchMoreUserRelatedProducts}
            hasMore={hasMoreUserProducts}
            isLoading={newLoaded3}
            autoFetchEnabled={autoFetchEnabled}
            onClickVerMas={handleClickVerMas}
          />
        </div>
        <div
          className={styles.container}
          style={{
            marginBottom: "30px",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
          }}
        >
          <PromoSection
            img="https://res.cloudinary.com/danfiejkv/image/upload/q_50/v1741897408/mongir-almacen-tienda-bebe-medellin-centro_k0vwve.webp"
            text={
              <>
                <span style={{ fontSize: "22px", fontWeight: "bold" }}>
                  ¡VISÍTANOS!
                </span>
                <br />
                Estamos a una cuadra de la
                <br />
                estación San Antonio.
                <br />
                <br />
                <p
                  style={{
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <MapPinned />
                  Calle 46 # 52, Medellín, Antioquia
                </p>
              </>
            }
          />

          <Title title="NUESTROS VIDEOS" />
          <SocialVideoSwiper videos={videos} />
          <PromoSection
            img="https://res.cloudinary.com/danfiejkv/image/upload/q_50/v1741898289/MONGIR-COMPRA-MAYORISTA-TIENDA-BEBE_ue6pxt.webp"
            text={
              <>
                <span>Emprende con Mongir</span> <br />
                <span style={{ fontSize: "22px", fontWeight: "bold" }}>
                  VENTAS MAYORISTAS
                </span>
                <br />
                <span
                  style={{
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    justifyContent: "center",
                  }}
                >
                  <FaWhatsapp size={16} /> Contáctanos
                </span>
              </>
            }
          />
        </div>
      </div>
      <div>
        <Link href="/browse">.</Link>
      </div>
    </div>
  );
}
