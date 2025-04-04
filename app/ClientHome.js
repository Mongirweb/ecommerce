"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.scss";
import { categories } from "../data/categorie";
import dynamic from "next/dynamic";
import Link from "next/link";
import { FaLocationDot } from "react-icons/fa6";
import Title from "../components/home/title";
import { videos } from "../data/videos";
import { FaWhatsapp } from "react-icons/fa";

const ProductsSwiper = dynamic(() => import("../components/productsSwiper"));
const SocialVideoSwiper = dynamic(() =>
  import("../components/home/socialVideoSwiper")
);
const PromoSection = dynamic(() => import("../components/home/promoSection"));
const Category = dynamic(() => import("../components/home/category"));
const MainSwiper = dynamic(() => import("../components/home/main/swiper"));

// Global set to avoid duplicate fetches
const alreadyFetchedNew = new Set();

export default function ClientHome() {
  const [newProductsPage, setNewProductsPage] = useState(0);
  const [newProducts, setNewProducts] = useState([]);
  const [newLoaded, setNewLoaded] = useState(false);

  // Use a ref to guard against double initialization in development
  const initializedRef = useRef(false);

  // Only clear the fetched set once (even if Strict Mode causes double mount)
  useEffect(() => {
    if (!initializedRef.current) {
      alreadyFetchedNew.clear();
      initializedRef.current = true;
    }
  }, []);

  // Fetch products when newProductsPage changes
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
                ¡VISÍTANOS!
              </span>
              <br />
              Estamos a una cuadra de la
              <br />
              estación San Antonio.
              <br />
              <br />
              <p style={{ fontSize: "14px" }}>
                <FaLocationDot /> Calle 46 # 52, Medellín, Antioquia
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

        {/* Promo Section */}
        <PromoSection
          img="https://res.cloudinary.com/danfiejkv/image/upload/v1741898289/MONGIR-COMPRA-MAYORISTA-TIENDA-BEBE_ue6pxt.png"
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

        <Title title="NUESTROS VIDEOS" />
        <SocialVideoSwiper videos={videos} />
      </div>
      <div>
        <Link href="/browse">.</Link>
      </div>
    </div>
  );
}
