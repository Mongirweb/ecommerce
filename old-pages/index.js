import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";
import styles from "../styles/Home.module.scss";
import Product from "../models/Product";
import db from "../utils/db";
import { categories } from "../data/categorie";
import Header from "../components/header";
import Main from "../components/home/main";
import shoes from "../public/images/promo/calzado-tenis-deportivos-saldos-saldomania.webp";
import electric from "../public/images/promo/electrodomesticos-saldos-saldomania.webp";
import MainSwiper from "../components/home/main/swiper";
import CategoriesSwiper from "../components/home/categorySwiper";
import Category from "../components/home/category";
import Flashdeals from "../components/home/flashDeals";
import ProductsSwiper from "../components/productsSwiper";
import PromoSection from "../components/home/promoSection";
import Footer from "../components/footer";
import Modal from "../components/modal";
import Link from "next/link";
import axios from "axios";

export async function getStaticProps() {
  try {
    const title =
      "SaldoManía | Saldos Colombia - Ofertas en Moda, Electrónicos y Más ";
    const openGraphData = [
      {
        property: "og:title",
        content: "SaldoManía - El Marketplace de Saldos más Grande de Colombia",
        key: "default-ogtitle",
      },
      {
        property: "og:image:width",
        content: "600",
        key: "ogimagewidth",
      },
      {
        property: "og:image:height",
        content: "400",
        key: "ogimageheight",
      },
      {
        property: "og:description",
        content:
          "Encuentra las mejores saldos ofertas en moda de colombia, electrónicos, hogar y más en SaldoMania colombia. Descubre increíbles descuentos saldos en productos de alta calidad colombia, todo en un solo lugar.",
        key: "default-ogdesc",
      },
      {
        property: "og:image",
        content:
          "https://res.cloudinary.com/danfiejkv/image/upload/q_57/v1725294185/saldomania-logo-3_dm3cua.avif",
        key: "default-ogimage",
      },
      {
        property: "og:url",
        content: "https://www.saldomania.com",
        key: "default-ogurl",
      },
      {
        property: "og:type",
        content: "website",
        key: "default-ogtype",
      },
    ];
    const keywords =
      "Saldomania, colombia, saldos, colombia, saldos Ropa, colombia, Tienda de moda saldos en línea colombia, saldomania.com, Compras en línea colombia, saldos saldos Ropa de mujer, saldos saldos Hogar y jardín, saldos saldo Joyas y accesorios, saldo saldos Belleza y salud, saldos saldo Electrónica, saldos saldo Ropa para hombres, saldos saldo Moda para niños, saldos saldo Zapatos y bolsos, saldos saldo Suministros para mascotas, saldos saldo Productos para bebés, saldos saldo Deportes y actividades al aire libre, saldos saldo Ropa interior y ropa de dormir, saldos saldo Productos de oficina, saldos saldo Industrial, Automotriz y saldos saldo motocicleta, saldo, saldos";

    return {
      props: {
        openGraphData: JSON.parse(JSON.stringify(openGraphData)),
        keywords,
        title,
      },
    };
  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
  }
}

export default function Home({}) {
  const [fashionProducts, setFashionProducts] = useState([]);
  const [electricProducts, setElectricProducts] = useState([]);
  const [homeProducts, setHomeProducts] = useState([]);
  const [offersProducts, setOffersProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);

  const [openCategory, setOpenCategory] = useState(false);

  const { ref: flashdealsRef, inView: flashdealsInView } = useInView({
    triggerOnce: true,
  });
  const { ref: productsSwiperRef1, inView: productsSwiperInView1 } = useInView({
    triggerOnce: true,
  });
  const { ref: productsSwiperRef2, inView: productsSwiperInView2 } = useInView({
    triggerOnce: true,
  });
  const { ref: promoSectionRef1, inView: promoSectionInView1 } = useInView({
    triggerOnce: true,
  });
  const { ref: promoSectionRef2, inView: promoSectionInView2 } = useInView({
    triggerOnce: true,
  });

  useEffect(() => {
    // Fetch product data from your API or directly from your database
    async function fetchProducts() {
      try {
        const [fashionRes, electricRes, homeRes, offersRes, newRes] =
          await Promise.all([
            axios.get("/api/products/fashion"), // Replace with actual API endpoints
            axios.get("/api/products/electronics"),
            axios.get("/api/products/home"),
            axios.get("/api/products/offers"),
            axios.get("/api/products/new"),
          ]);

        setFashionProducts(fashionRes.data);
        setElectricProducts(electricRes.data);
        setHomeProducts(homeRes.data);
        setOffersProducts(offersRes.data);
        setNewProducts(newRes.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    if (openCategory) {
      document.body.style.overflow = "hidden"; // Prevent scrolling
    } else {
      document.body.style.overflow = "auto"; // Allow scrolling
    }

    return () => {
      document.body.style.overflow = "auto"; // Reset on component unmount
    };
  }, [openCategory]);

  return (
    <div>
      <Header />
      <div className={styles.home}>
        <MainSwiper />
        <div className={styles.container}>
          <Main newProducts={newProducts} />
          <CategoriesSwiper categories={categories} header={"Categorias"} />

          <div className={styles.home__category}>
            {categories
              ?.filter((category) =>
                ["Moda", "Electrónicos", "Hogar, Mobiliario y Jardín"].includes(
                  category.name
                )
              )
              .map((category, i) => (
                <div
                  key={i}
                  ref={category.name === "Moda" ? flashdealsRef : null}
                >
                  {(category.name === "Moda" && flashdealsInView) ||
                  (category.name !== "Moda" && flashdealsInView) ? (
                    <Category
                      key={i}
                      header={category.name}
                      products={
                        category.name === "Moda"
                          ? fashionProducts
                          : category.name === "Hogar, Mobiliario y Jardín"
                          ? homeProducts
                          : electricProducts
                      }
                      categories={categories}
                      background="#fff"
                    />
                  ) : null}
                </div>
              ))}
          </div>
          <div ref={flashdealsRef}>
            {flashdealsInView && <Flashdeals products={offersProducts} />}
          </div>
          <div ref={productsSwiperRef1}>
            {productsSwiperInView1 && (
              <ProductsSwiper
                products={newProducts}
                header={"Productos nuevos y destacados"}
              />
            )}
          </div>
          <div ref={promoSectionRef1}>
            {promoSectionInView1 && (
              <PromoSection
                img={shoes}
                text={
                  <>
                    <span>DEPORTIVOS</span> <br />{" "}
                    <span>EN SALDO EXCLUSIVO</span>
                    <br />
                    COMPRAR AQUI!
                  </>
                }
              />
            )}
          </div>
          <div ref={productsSwiperRef2}>
            {productsSwiperInView2 && (
              <ProductsSwiper
                products={newProducts}
                header={"Creemos que te puede gustar"}
                cool
              />
            )}
          </div>
          <div ref={promoSectionRef2}>
            {promoSectionInView2 && (
              <PromoSection
                img={electric}
                text={
                  <>
                    <span>ELECTRODOMESTICOS</span> <br />{" "}
                    <span>CON LOS MEJORES DESCUENTOS</span>
                    <br />
                    COMPRAR AQUI!
                  </>
                }
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
      <Modal
        isOpen={openCategory}
        onClose={() => {
          setOpenCategory(false);
        }}
        title={"Categorias"}
        customClass="pauseModal"
      >
        <div className={styles.modal}>
          <ul className={styles.subMenu}>
            {categories?.map((cat, j) => (
              <li key={j}>
                <Link href={cat.link} prefetch={true}>
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </div>
  );
}
