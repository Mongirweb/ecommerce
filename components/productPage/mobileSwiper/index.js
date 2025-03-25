"use client";
import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import styles from "./styles.module.scss";

// import required modules
import { Pagination } from "swiper/modules";
import Image from "next/image";

export default function MobileSwiper({ images }) {
  return (
    <div className={styles.swiper_product}>
      <Swiper
        pagination={{
          dynamicBullets: true,
        }}
        modules={[Pagination]}
        className="product_swiper"
      >
        {images?.map((image, i) => (
          <SwiperSlide key={i}>
            <Image src={image.url} alt="Mongir Logo" priority fill={true} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
