"use client";
import React from "react";
import styles from "./styles.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { BiCool } from "react-icons/bi";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import SwiperProductCard from "./Card";
import { useMediaQuery } from "react-responsive";
import { HiArrowRightCircle } from "react-icons/hi2";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";

export default function ProductsSwiper({
  header,
  products,
  bg,
  cool,
  setRelatedPage,
  relatedLoading,
  newProducts,
  setNewProductsPage,
  setRelatedUserProductsPage,
}) {
  const isLoading = !products || products.length === 0 || relatedLoading;

  const query449px = useMediaQuery({
    query: "(max-width:449px)",
  });

  const appearBullet = query449px; // This function will be called every time the user reaches the last slide.
  // Typically, you'd want to increment the page:
  const handleReachEnd = () => {
    if (newProducts) {
      setNewProductsPage?.((prev) => prev + 1);
    } else if (cool) {
      setRelatedUserProductsPage?.((prev) => prev + 1);
    } else {
      setRelatedPage?.((prev) => prev + 1);
    }
  };

  return (
    <div className={styles.wrapper}>
      {header && (
        <div className={styles.header}>
          {header} {cool ? <BiCool /> : null}
        </div>
      )}
      {isLoading ? (
        <Swiper
          slidesPerView={2.2}
          spaceBetween={0}
          navigation={false}
          modules={[Navigation, Pagination]}
          className="offers_swiper"
          freeMode={true}
          direction="horizontal"
          mousewheel={true}
          breakpoints={{
            450: { slidesPerView: 2.2 },
            630: { slidesPerView: 3.2 },
            920: { slidesPerView: 4.2 },
            1232: { slidesPerView: 5.2 },
            1520: { slidesPerView: 6.2 },
          }}
        >
          {[...Array(6)].map((_, i) => (
            <SwiperSlide key={i}>
              <Skeleton
                height={200}
                width="100%"
                borderRadius={8}
                style={{ margin: "10px" }}
              />
              <Skeleton width="80%" style={{ marginTop: "10px" }} />
              <Skeleton width="60%" />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <Swiper
          slidesPerView={2.2}
          spaceBetween={10}
          navigation={true}
          modules={[Navigation, Pagination]}
          pagination={
            appearBullet
              ? {
                  clickable: true,
                }
              : false
          }
          className="products__swiper"
          onReachEnd={handleReachEnd}
          breakpoints={{
            450: {
              slidesPerView: 2.2,
            },
            630: {
              slidesPerView: 3.2,
            },
            920: {
              slidesPerView: 4.2,
            },
            1232: {
              slidesPerView: 5.2,
            },
            1520: {
              slidesPerView: 6.2,
            },
          }}
        >
          {products?.map((product, index) => (
            <SwiperSlide key={index}>
              <SwiperProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <div className={styles.see_all}>{/* <button>Ver todo</button> */}</div>
    </div>
  );
}
