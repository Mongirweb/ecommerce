"use client";
import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.scss";
import { categories } from "../data/categorie";
import MainSwiper from "../components/home/main/swiper";
import dynamic from "next/dynamic";
import Category from "../components/home/category";
import Link from "next/link";
import PromoSection from "../components/home/promoSection";
import { FaLocationDot } from "react-icons/fa6";
import Title from "../components/home/title";
import electric from "../public/images/promo/electrodomesticos-saldos-saldomania.webp";
import SocialVideoSwiper from "../components/home/socialVideoSwiper";
import { videos } from "../data/videos";

const ProductsSwiper = dynamic(() => import("../components/productsSwiper"));

// Keep a set to avoid fetching the same page multiple times (optional)
const alreadyFetchedNew = new Set();

export default function ClientHome() {
  const [newProductsPage, setNewProductsPage] = useState(0);
  const [newProducts, setNewProducts] = useState([]);
  const [newLoaded, setNewLoaded] = useState(false);

  // Clear our fetched set on mount so we always start fresh
  useEffect(() => {
    alreadyFetchedNew.clear();
  }, []);

  // Fetch runs automatically on newProductsPage changes
  useEffect(() => {
    if (alreadyFetchedNew.has(newProductsPage)) return;

    alreadyFetchedNew.add(newProductsPage);
    fetch(`/api/products/new?page=${newProductsPage}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setNewProducts((prev) => [...prev, ...data]);
        }
        setNewLoaded(true);
      })
      .catch((err) => console.error("Error fetching new products:", err));
  }, [newProductsPage]);

  return (
    <div className={styles.home}>
      <MainSwiper />
      <div className={styles.container}>
        {/* Sección de categorías principales */}
        <div className={styles.home__category}>
          {categories.map((category, i) => (
            <div key={i}>
              <Category
                header={category.name}
                categories={categories}
                background="#fff"
              />
            </div>
          ))}
        </div>

        <PromoSection
          img="https://res.cloudinary.com/danfiejkv/image/upload/v1741897408/mongir-almacen-tienda-bebe-medellin-centro_k0vwve.jpg"
          text={
            <>
              <span style={{ fontSize: "22px", fontWeight: "bold" }}>
                ¡VISITANOS!
              </span>
              <br />
              Estamos a una cuadra de la
              <br />
              estación San Antonio.
              <br />
              <br />
              <p style={{ fontSize: "14px" }}>
                <FaLocationDot /> Calle 46 # 52, Medellin, Antioquia
              </p>
            </>
          }
        />

        {/* Title */}
        <Title title="LO MÁS VENDIDO" />

        {/* Sección Productos nuevos y destacados */}
        <ProductsSwiper
          header=""
          products={newProducts}
          newProducts
          setNewProductsPage={setNewProductsPage}
        />
        {/* Title */}

        <PromoSection
          img="https://res.cloudinary.com/danfiejkv/image/upload/v1741898289/MONGIR-COMPRA-MAYORISTA-TIENDA-BEBE_ue6pxt.png"
          text={
            <>
              <span>Emprende con Mongir</span> <br />
              <span>VENTAS MAYORISTAS</span>
              <br />
              Contactanos - 300-123-1324
            </>
          }
        />
        <Title title="NUESTROS VIDEOS" />
        <SocialVideoSwiper videos={videos} />
      </div>
      <div>
        <Link href="/browse">.</Link>
      </div>
    </div>
  );
}
