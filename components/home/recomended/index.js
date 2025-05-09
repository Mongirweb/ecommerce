"use client";
import styles from "./styles.module.scss";
import React, { useRef, useState } from "react";
// Import Swiper React components
import { SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Pagination, Navigation } from "swiper/modules";

import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";
import { ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";

const RecomendedCard = dynamic(() => import("./card"), {
  ssr: false,
  loading: () => (
    <div className={styles.product}>
      <div className={styles.product__container}>
        <Skeleton height={170} width="100%" borderRadius={8} />
        <Skeleton width="80%" style={{ marginTop: 8 }} />
        <Skeleton width="60%" />
      </div>
    </div>
  ),
});

const Swiper = dynamic(() => import("swiper/react").then((m) => m.Swiper), {
  ssr: false,
});

export default function Recomended({ products, setRecomendedProductsPage }) {
  const isLoading = !products || products.length === 0;

  const handleFetchRecomendedProducts = () => {
    setRecomendedProductsPage((prev) => prev + 1);
  };

  return (
    <div className={styles.offers}>
      <div className={styles.offers__text}>
        <div></div>
        <span> Recomendados</span>
        <div></div>
      </div>

      {isLoading ? (
        // **Render Skeleton Loader**
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
                height={170}
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
        // **Render Products**
        <Swiper
          slidesPerView={2.2}
          spaceBetween={0}
          navigation={true}
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
          {products.map((product, i) => (
            <SwiperSlide key={i}>
              <RecomendedCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
