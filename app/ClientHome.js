"use client";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import styles from "../styles/Home.module.scss";
import { categories } from "../data/categorie";
import Main from "../components/home/main";
import MainSwiper from "../components/home/main/swiper";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import {
  addProducts,
  resetScrollData,
  setPage,
} from "../store/infiniteScrollSlice";
import Link from "next/link";

const CategoriesSwiper = dynamic(() =>
  import("../components/home/categorySwiper")
);

const InfiniteScroll = dynamic(() =>
  import("../components/home/infiniteScroll")
);

const alreadyFetchedRecomended = new Set(); // Track fetched pages
const alreadyFetchedOffers = new Set(); // Track fetched pages
const alreadyFetchedNew = new Set(); // Track fetched pages
const alreadyFetchedUserProducts = new Set(); // Track fetched pages

//// Este componente cargará datos sólo cuando su sección esté en vista.
export default function ClientHome({ recommendedData }) {
  const dispatch = useDispatch();

  const { products, page } = useSelector((state) => state.infiniteScroll);

  const [newRecomendedProducts, setNewRecomendedProducts] =
    useState(recommendedData);

  const [newProducts3, setNewProducts3] = useState(products);
  const [newLoaded3, setNewLoaded3] = useState(false);

  const [recomendedProductsPage, setRecomendedProductsPage] = useState(0);

  const [autoFetchEnabled, setAutoFetchEnabled] = useState(true);

  const [hasMoreUserProducts, setHasMoreUserProducts] = useState(true);

  const [autoFetchCount, setAutoFetchCount] = useState(0);

  // Refs para cada categoría para disparar la carga al entrar en vista

  const { ref: newRef, inView: newInView } = useInView();

  const visitedProducts = useSelector((state) => state.userVisitedProducts);

  useEffect(() => {
    alreadyFetchedRecomended.clear(); // Clear similar fetched pages
    alreadyFetchedNew.clear(); // Clear similar fetched pages
    alreadyFetchedOffers.clear(); // Clear related fetched pages
    alreadyFetchedUserProducts.clear();
  }, []);

  // Función para manejar el click en "Ver más"
  const handleClickVerMas = () => {
    setAutoFetchEnabled(true);
    setAutoFetchCount(0);
  };

  // Función para cargar más productos relacionados con el usuario
  const fetchMoreUserRelatedProducts = () => {
    if (alreadyFetchedUserProducts.has(page)) return;

    if (!autoFetchEnabled) return;
    setNewLoaded3(true);

    alreadyFetchedUserProducts.add(page);
    fetch(`/api/products/userRelated?page=${page}`, {
      cache: "no-store",
      next: { revalidate: 5 },
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
  };

  return (
    <div>
      <div className={styles.home}>
        <MainSwiper />
        <div className={styles.container}>
          {/* Sección newProducts (con ref para carga diferida) */}
          <div ref={newRef}>
            <Main
              newRecomendedProducts={newRecomendedProducts}
              setRecomendedProductsPage={setRecomendedProductsPage}
            />
          </div>

          <CategoriesSwiper categories={categories} header={"Categorias"} />

          {/* Promo Section - Electrodomésticos */}
        </div>
        <div className={styles.infinite}>
          <InfiniteScroll
            products={newProducts3}
            fetchMoreProducts={fetchMoreUserRelatedProducts}
            hasMore={hasMoreUserProducts}
            isLoading={newLoaded3}
            autoFetchEnabled={autoFetchEnabled}
            onClickVerMas={handleClickVerMas}
          />
        </div>
      </div>
      <div>
        <Link href="/browse">.</Link>
      </div>
    </div>
  );
}
